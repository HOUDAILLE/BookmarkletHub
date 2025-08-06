// src/app/api/github/route.ts

import { NextResponse } from 'next/server';
import { run_shell_command } from '../../../../utils/run_shell_command';

async function createFork(owner: string, repo: string) {
  try {
    const command = `gh api repos/${owner}/${repo}/forks --method POST`;
    const result = await run_shell_command(command, `Creating fork for ${owner}/${repo}`);
    // gh api returns JSON, so we parse stdout
    return JSON.parse(result.stdout);
  } catch (error) {
    console.error('Error creating fork:', error);
    throw error;
  }
}

async function createBranch(forkOwner: string, forkRepo: string, newBranchName: string, baseCommitSha: string) {
  try {
    const command = `gh api repos/${forkOwner}/${forkRepo}/git/refs --method POST -f ref=refs/heads/${newBranchName} -f sha=${baseCommitSha}`; 
    const result = await run_shell_command(command, `Creating branch ${newBranchName} in ${forkOwner}/${forkRepo}`);
    return JSON.parse(result.stdout);
  } catch (error) {
    console.error('Error creating branch:', error);
    throw error;
  }
}

async function commitChanges(
  forkOwner: string,
  forkRepo: string,
  branchName: string,
  commitMessage: string,
  fileAdditions: Array<{ path: string; contents: string }>,
  fileDeletions: Array<{ path: string }>
) {
  try {
    // First, get the branch ID
    const getBranchIdCommand = `gh api graphql -f query='query { repository(owner: "${forkOwner}", name: "${forkRepo}") { ref(qualifiedName: "refs/heads/${branchName}") { id } } }'`;
    const branchIdResult = await run_shell_command(getBranchIdCommand, `Getting branch ID for ${branchName}`);
    const branchIdData = JSON.parse(branchIdResult.stdout);
    const branchId = branchIdData.data.repository.ref.id;

    if (!branchId) {
      throw new Error(`Could not find branch ID for ${branchName}`);
    }

    const additions = fileAdditions.map(file => ({
      path: file.path,
      contents: Buffer.from(file.contents).toString('base64') // Contents must be base64 encoded
    }));

    const deletions = fileDeletions.map(file => ({
      path: file.path
    }));

    const mutation = `
      mutation CreateCommit($input: CreateCommitOnBranchInput!) {
        createCommitOnBranch(input: $input) {
          commit {
            url
            oid
          }
        }
      }
    `;

    const variables = {
      input: {
        branch: {
          id: branchId
        },
        message: {
          headline: commitMessage,
          body: "" // Optional: add a body if needed
        },
        fileChanges: {
          additions: additions.length > 0 ? additions : undefined,
          deletions: deletions.length > 0 ? deletions : undefined
        }
      }
    };

    // gh api graphql expects the query and variables as separate arguments
    // Need to carefully escape the JSON strings for the shell command
    const escapedMutation = mutation.replace(/\n/g, ' ').replace(/'/g, "'\'");
    const escapedVariables = JSON.stringify(variables).replace(/'/g, "'\'");

    const commitCommand = `gh api graphql -f query='${escapedMutation}' -f variables='${escapedVariables}'`;

    const commitResult = await run_shell_command(commitCommand, `Committing changes to ${branchName}`);
    return JSON.parse(commitResult.stdout);

  } catch (error) {
    console.error('Error committing changes:', error);
    throw error;
  }
}

async function createPullRequest(
  baseOwner: string,
  baseRepo: string,
  title: string,
  head: string, // e.g., "your_username:your_branch_name"
  base: string, // e.g., "main"
  body: string = ""
) {
  try {
    const command = `gh api repos/${baseOwner}/${baseRepo}/pulls --method POST -f title='${title}' -f head='${head}' -f base='${base}' -f body='${body}'`;
    const result = await run_shell_command(command, `Creating pull request from ${head} to ${baseOwner}/${baseRepo}:${base}`);
    return JSON.parse(result.stdout);
  } catch (error) {
    console.error('Error creating pull request:', error);
    throw error;
  }
}

export async function GET(request: Request) {
  return NextResponse.json({ message: 'GitHub API route is working!' });
}

export async function POST(request: Request) {
  const body = await request.json();
  // Example usage: if the request body contains owner and repo
  if (body.action === 'createFork' && body.owner && body.repo) {
    try {
      const forkData = await createFork(body.owner, body.repo);
      return NextResponse.json({ message: 'Fork created successfully', data: forkData });
    } catch (error: any) {
      return NextResponse.json({ message: 'Failed to create fork', error: error.message }, { status: 500 });
    }
  } else if (body.action === 'createBranch' && body.forkOwner && body.forkRepo && body.newBranchName && body.baseCommitSha) {
    try {
      const branchData = await createBranch(body.forkOwner, body.forkRepo, body.newBranchName, body.baseCommitSha);
      return NextResponse.json({ message: 'Branch created successfully', data: branchData });
    } catch (error: any) {
      return NextResponse.json({ message: 'Failed to create branch', error: error.message }, { status: 500 });
    }
  } else if (body.action === 'commitChanges' && body.forkOwner && body.forkRepo && body.branchName && body.commitMessage) {
    try {
      const commitData = await commitChanges(
        body.forkOwner,
        body.forkRepo,
        body.branchName,
        body.commitMessage,
        body.fileAdditions || [],
        body.fileDeletions || []
      );
      return NextResponse.json({ message: 'Changes committed successfully', data: commitData });
    } catch (error: any) {
      return NextResponse.json({ message: 'Failed to commit changes', error: error.message }, { status: 500 });
    }
  } else if (body.action === 'createPullRequest' && body.baseOwner && body.baseRepo && body.title && body.head && body.base) {
    try {
      const prData = await createPullRequest(
        body.baseOwner,
        body.baseRepo,
        body.title,
        body.head,
        body.base,
        body.body || ""
      );
      return NextResponse.json({ message: 'Pull Request created successfully', data: prData });
    } catch (error: any) {
      return NextResponse.json({ message: 'Failed to create Pull Request', error: error.message }, { status: 500 });
    }
  }
  return NextResponse.json({ message: 'Received POST request', data: body });
}
