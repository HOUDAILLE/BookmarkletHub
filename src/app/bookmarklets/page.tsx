// src/app/bookmarklets/page.tsx

"use client";

import { useState, useEffect } from 'react';

interface Bookmarklet {
  name: string;
  code: string;
}

export default function BookmarkletsPage() {
  const [bookmarklets, setBookmarklets] = useState<Bookmarklet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const MAIN_REPO_OWNER = 'HOUDAILLE'; // Your GitHub username
  const MAIN_REPO_NAME = 'BookmarkletHub';
  const BOOKMARKLETS_PATH = 'bookmarklets'; // Directory where bookmarklets are stored

  useEffect(() => {
    async function fetchBookmarklets() {
      try {
        // 1. Get list of files in the bookmarklets directory
        const dirContentsResponse = await fetch('/api/github', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'getDirectoryContents',
            owner: MAIN_REPO_OWNER,
            repo: MAIN_REPO_NAME,
            path: BOOKMARKLETS_PATH,
            ref: 'master', // Assuming 'master' as the main branch
          }),
        });
        const dirContentsData = await dirContentsResponse.json();
        if (!dirContentsResponse.ok) throw new Error(dirContentsData.error || 'Failed to get directory contents');

        const files = dirContentsData.contents.filter((item: any) => item.type === 'file');

        // 2. Fetch content for each bookmarklet file
        const fetchedBookmarklets: Bookmarklet[] = [];
        for (const file of files) {
          const fileContentResponse = await fetch('/api/github', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'getFileContent',
              owner: MAIN_REPO_OWNER,
              repo: MAIN_REPO_NAME,
              path: file.path,
              ref: 'master',
            }),
          });
          const fileContentData = await fileContentResponse.json();
          if (!fileContentResponse.ok) throw new Error(fileContentData.error || `Failed to get content for ${file.name}`);

          fetchedBookmarklets.push({
            name: file.name.replace(/\.js$/, ''), // Remove .js extension for display
            code: fileContentData.content,
          });
        }

        setBookmarklets(fetchedBookmarklets);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchBookmarklets();
  }, []);

  if (loading) {
    return <main className="flex min-h-screen flex-col items-center justify-center p-24"><p>Chargement des bookmarklets...</p></main>;
  }

  if (error) {
    return <main className="flex min-h-screen flex-col items-center justify-center p-24"><p className="text-red-500">Erreur: {error}</p></main>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-24">
      <h1 className="text-4xl font-bold mb-8">Bookmarklets Disponibles</h1>
      <div className="w-full max-w-4xl">
        {bookmarklets.length === 0 ? (
          <p className="text-center text-gray-600">Aucun bookmarklet disponible pour le moment.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarklets.map((bookmarklet) => (
              <div key={bookmarklet.name} className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-2">{bookmarklet.name}</h2>
                <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">{bookmarklet.code}</pre>
                {/* Add copy button later */}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
