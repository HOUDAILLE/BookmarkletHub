// src/app/submit/page.tsx

"use client";

import { useState } from 'react';
import { useSession } from 'next-auth/react'; // Import useSession

export default function SubmitBookmarkletPage() {
  const { data: session } = useSession(); // Get session data
  const [bookmarkletCode, setBookmarkletCode] = useState('');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  const MAIN_REPO_OWNER = 'HOUDAILLE'; // Your GitHub username
  const MAIN_REPO_NAME = 'BookmarkletHub';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('Submitting...');

    if (!session || !session.user || !session.user.name) {
      setMessage('Error: You must be logged in to submit a bookmarklet.');
      return;
    }

    const userGithubUsername = session.user.name; // Assuming session.user.name is GitHub username

    try {
      // 1. Get latest commit SHA from main repository
      const getShaResponse = await fetch('/api/github', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'getLatestCommitSha',
          owner: MAIN_REPO_OWNER,
          repo: MAIN_REPO_NAME,
          branch: 'master', // Assuming 'master' as the main branch
        }),
      });
      const getShaData = await getShaResponse.json();
      if (!getShaResponse.ok) throw new Error(getShaData.error || 'Failed to get latest commit SHA');
      const baseCommitSha = getShaData.sha;
      console.log('Latest commit SHA:', baseCommitSha);

      // 2. Create a new branch in the user's fork
      const newBranchName = `bookmarklet-${Date.now()}`;
      const createBranchResponse = await fetch('/api/github', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'createBranch',
          forkOwner: userGithubUsername,
          forkRepo: MAIN_REPO_NAME, // User's fork will have the same name
          newBranchName,
          baseCommitSha,
        }),
      });
      const createBranchData = await createBranchResponse.json();
      if (!createBranchResponse.ok) throw new Error(createBranchData.error || 'Failed to create branch');
      console.log('Branch created:', createBranchData);

      // 3. Commit the new bookmarklet file to that branch
      const bookmarkletFileName = `${title.toLowerCase().replace(/\s/g, '-')}.js`;
      const commitResponse = await fetch('/api/github', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'commitChanges',
          forkOwner: userGithubUsername,
          forkRepo: MAIN_REPO_NAME,
          branchName: newBranchName,
          commitMessage: `feat: Add new bookmarklet: ${title}`,
          fileAdditions: [{
            path: `bookmarklets/${bookmarkletFileName}`,
            contents: bookmarkletCode,
          }],
        }),
      });
      const commitData = await commitResponse.json();
      if (!commitResponse.ok) throw new Error(commitData.error || 'Failed to commit changes');
      console.log('Changes committed:', commitData);

      // 4. Create a pull request from the user's fork to the main repository
      const createPrResponse = await fetch('/api/github', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'createPullRequest',
          baseOwner: MAIN_REPO_OWNER,
          baseRepo: MAIN_REPO_NAME,
          title: `Add new bookmarklet: ${title}`,
          head: `${userGithubUsername}:${newBranchName}`,
          base: 'master', // Target the 'master' branch of the main repo
          body: `This PR adds a new bookmarklet titled "${title}".\n\n${bookmarkletCode}`,
        }),
      });
      const createPrData = await createPrResponse.json();
      if (!createPrResponse.ok) throw new Error(createPrData.error || 'Failed to create Pull Request');
      console.log('Pull Request created:', createPrData);

      setMessage('Bookmarklet submitted successfully! A Pull Request has been created for review.');
      setBookmarkletCode('');
      setTitle('');

    } catch (error: any) {
      console.error('Submission error:', error);
      setMessage(`Submission failed: ${error.message}`);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold mb-8">Déposer un Nouveau Bookmarklet</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-md">
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">Titre du Bookmarklet:</label>
          <input
            type="text"
            id="title"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="code" className="block text-gray-700 text-sm font-bold mb-2">Code JavaScript:</label>
          <textarea
            id="code"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-64 font-mono"
            value={bookmarkletCode}
            onChange={(e) => setBookmarkletCode(e.target.value)}
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Soumettre le Bookmarklet
          </button>
        </div>
        {message && <p className="mt-4 text-center text-sm text-gray-600">{message}</p>}
      </form>
    </main>
  );
}

