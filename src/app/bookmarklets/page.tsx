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

  useEffect(() => {
    async function fetchBookmarklets() {
      try {
        // In a real application, you would fetch from your own API route
        // that then calls the GitHub API to list/read files.
        // For now, we'll simulate or directly call a simplified API if available.
        // This part needs to be implemented in /api/github to list files.

        // Placeholder for fetching bookmarklets from GitHub
        // This will involve calling a new action in /api/github to list files in a directory
        // and then another action to read the content of each file.

        // Simulate fetching data
        const simulatedData: Bookmarklet[] = [
          { name: "Example Bookmarklet 1", code: "javascript:alert('Hello from Bookmarklet 1!');" },
          { name: "Example Bookmarklet 2", code: "javascript:console.log('Hello from Bookmarklet 2!');" },
        ];
        setBookmarklets(simulatedData);
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
