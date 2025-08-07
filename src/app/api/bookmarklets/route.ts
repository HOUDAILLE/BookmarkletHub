import { NextResponse } from 'next/server';

const GITHUB_REPO_OWNER = process.env.MAIN_REPO_OWNER || 'HOUDAILLE'; // Default to your username
const GITHUB_REPO_NAME = process.env.MAIN_REPO_NAME || 'BookmarkletHub'; // Default to your repo name
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

export async function GET() {
  if (!GITHUB_TOKEN) {
    return NextResponse.json({ message: 'GitHub token not configured.' }, { status: 500 });
  }

  try {
    // 1. Get the tree SHA for the main branch
    const branchResponse = await fetch(`https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/branches/main`, {
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (!branchResponse.ok) {
      const errorText = await branchResponse.text();
      throw new Error(`Failed to get branch info: ${branchResponse.status} ${branchResponse.statusText} - ${errorText}`);
    }
    const branchData = await branchResponse.json();
    const treeSha = branchData.commit.commit.tree.sha;

    // 2. Get the tree content to find the bookmarklets directory
    const treeResponse = await fetch(`https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/git/trees/${treeSha}?recursive=1`, {
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (!treeResponse.ok) {
      const errorText = await treeResponse.text();
      throw new Error(`Failed to get tree content: ${treeResponse.status} ${treeResponse.statusText} - ${errorText}`);
    }
    const treeData = await treeResponse.json();

    const bookmarkletFiles = treeData.tree.filter((file: any) =>
      file.path.startsWith('bookmarklets/') && file.path.endsWith('.json') && file.type === 'blob'
    );

    const bookmarklets = await Promise.all(bookmarkletFiles.map(async (file: any) => {
      const fileContentResponse = await fetch(file.url, {
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3.raw', // Get raw content
        },
      });

      if (!fileContentResponse.ok) {
        const errorText = await fileContentResponse.text();
        console.error(`Failed to get file content for ${file.path}: ${fileContentResponse.status} ${fileContentResponse.statusText} - ${errorText}`);
        return null; // Skip this file if content cannot be fetched
      }

      const content = await fileContentResponse.json(); // Assuming content is JSON
      const id = file.path.split('/').pop()?.replace('.json', '') || '';
      return { id, ...content };
    }));

    return NextResponse.json(bookmarklets.filter(Boolean)); // Filter out nulls

  } catch (error: any) {
    console.error('Error fetching bookmarklets:', error);
    return NextResponse.json({ message: 'Failed to fetch bookmarklets', error: error.message }, { status: 500 });
  }
}
