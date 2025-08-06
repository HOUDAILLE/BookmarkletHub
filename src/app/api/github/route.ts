// src/app/api/github/route.ts

import { NextResponse } from 'next/server';
async function createFork(owner: string, repo: string) {
  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/forks`, {
      method: 'POST',
      headers: {
        'Authorization': `token ${process.env.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Length': '0', // Required for POST with no body
      },
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`GitHub API error: ${response.status} ${response.statusText} - ${errorText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error creating fork:', error);
    throw error;
  }
}

async function createBranch(forkOwner: string, forkRepo: string, newBranchName: string, baseCommitSha: string) {
  try {
    const response = await fetch(`https://api.github.com/repos/${forkOwner}/${forkRepo}/git/refs`, {
      method: 'POST',
      headers: {
        'Authorization': `token ${process.env.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ref: `refs/heads/${newBranchName}`,
        sha: baseCommitSha,
      }),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`GitHub API error: ${response.status} ${response.statusText} - ${errorText}`);
    }
    return await response.json();
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
    // First, get the branch ID using GraphQL API
    const getBranchIdQuery = `
      query {
        repository(owner: "${forkOwner}", name: "${forkRepo}") {
          ref(qualifiedName: "refs/heads/${branchName}") {
            id
          }
        }
      }
    `;

    const branchIdResponse = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `bearer ${process.env.GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: getBranchIdQuery }),
    });

    if (!branchIdResponse.ok) {
      const errorText = await branchIdResponse.text();
      throw new Error(`GitHub GraphQL API error (getBranchId): ${branchIdResponse.status} ${branchIdResponse.statusText} - ${errorText}`);
    }

    const branchIdData = await branchIdResponse.json();
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

    const commitResponse = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `bearer ${process.env.GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: mutation, variables }),
    });

    if (!commitResponse.ok) {
      const errorText = await commitResponse.text();
      throw new Error(`GitHub GraphQL API error (commitChanges): ${commitResponse.status} ${commitResponse.statusText} - ${errorText}`);
    }

    return await commitResponse.json();

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
    const response = await fetch(`https://api.github.com/repos/${baseOwner}/${baseRepo}/pulls`, {
      method: 'POST',
      headers: {
        'Authorization': `token ${process.env.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        head,
        base,
        body,
      }),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`GitHub API error: ${response.status} ${response.statusText} - ${errorText}`);
    }
    return await response.json();
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
