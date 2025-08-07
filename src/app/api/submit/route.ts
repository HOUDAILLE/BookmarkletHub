import { NextResponse } from 'next/server';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const MAIN_REPO_OWNER = process.env.MAIN_REPO_OWNER || 'HOUDAILLE';
const MAIN_REPO_NAME = process.env.MAIN_REPO_NAME || 'BookmarkletHub';

async function githubApiRequest(url: string, method: string, body?: any) {
  const headers: HeadersInit = {
    'Authorization': `token ${GITHUB_TOKEN}`,
    'Accept': 'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
  };

  const options: RequestInit = {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  };

  const response = await fetch(url, options);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`GitHub API error: ${response.status} ${response.statusText} - ${errorText}`);
  }

  return response.json();
}

async function githubGraphqlRequest(query: string, variables?: any) {
  const headers: HeadersInit = {
    'Authorization': `bearer ${GITHUB_TOKEN}`,
    'Content-Type': 'application/json',
  };

  const options: RequestInit = {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables }),
  };

  const response = await fetch('https://api.github.com/graphql', options);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`GitHub GraphQL API error: ${response.status} ${response.statusText} - ${errorText}`);
  }

  return response.json();
}

export async function POST(request: Request) {
  const body = await request.json();
  const { action, ...data } = body;

  if (!GITHUB_TOKEN) {
    return NextResponse.json({ message: 'GitHub token not configured.' }, { status: 500 });
  }

  try {
    switch (action) {
      case 'createFork': {
        const { owner, repo } = data;
        const forkData = await githubApiRequest(`https://api.github.com/repos/${owner}/${repo}/forks`, 'POST', {});
        return NextResponse.json({ message: 'Fork created successfully', data: forkData });
      }
      case 'getLatestCommitSha': {
        const { owner, repo, branch } = data;
        const response = await githubApiRequest(`https://api.github.com/repos/${owner}/${repo}/git/ref/heads/${branch}`, 'GET');
        return NextResponse.json({ message: 'Latest commit SHA retrieved successfully', sha: response.object.sha });
      }
      case 'createBranch': {
        const { forkOwner, forkRepo, newBranchName, baseCommitSha } = data;
        const branchData = await githubApiRequest(`https://api.github.com/repos/${forkOwner}/${forkRepo}/git/refs`, 'POST', {
          ref: `refs/heads/${newBranchName}`,
          sha: baseCommitSha,
        });
        return NextResponse.json({ message: 'Branch created successfully', data: branchData });
      }
      case 'commitChanges': {
        const { forkOwner, forkRepo, branchName, commitMessage, fileAdditions, fileDeletions } = data;

        const getBranchIdQuery = `
          query {
            repository(owner: "${forkOwner}", name: "${forkRepo}") {
              ref(qualifiedName: "refs/heads/${branchName}") {
                id
              }
            }
          }
        `;
        const branchIdData = await githubGraphqlRequest(getBranchIdQuery);
        const branchId = branchIdData.data.repository.ref.id;

        if (!branchId) {
          throw new Error(`Could not find branch ID for ${branchName}`);
        }

        const additions = fileAdditions.map((file: any) => ({
          path: file.path,
          contents: Buffer.from(file.contents).toString('base64'),
        }));

        const deletions = fileDeletions.map((file: any) => ({
          path: file.path,
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
              id: branchId,
            },
            message: {
              headline: commitMessage,
              body: "",
            },
            fileChanges: {
              additions: additions.length > 0 ? additions : undefined,
              deletions: deletions.length > 0 ? deletions : undefined,
            },
          },
        };

        const commitData = await githubGraphqlRequest(mutation, variables);
        return NextResponse.json({ message: 'Changes committed successfully', data: commitData });
      }
      case 'createPullRequest': {
        const { baseOwner, baseRepo, title, head, base, body: prBody } = data;
        const prData = await githubApiRequest(`https://api.github.com/repos/${baseOwner}/${baseRepo}/pulls`, 'POST', {
          title,
          head,
          base,
          body: prBody,
        });
        return NextResponse.json({ message: 'Pull Request created successfully', data: prData });
      }
      default:
        return NextResponse.json({ message: 'Unknown action' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('API route error:', error);
    return NextResponse.json({ message: 'API operation failed', error: error.message }, { status: 500 });
  }
}
