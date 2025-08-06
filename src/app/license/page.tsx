// src/app/license/page.tsx

"use client";

import { useState, useEffect } from 'react';

export default function LicensePage() {
  const [licenseContent, setLicenseContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const MAIN_REPO_OWNER = 'HOUDAILLE'; // Your GitHub username
  const MAIN_REPO_NAME = 'BookmarkletHub';
  const LICENSE_FILE_PATH = 'LICENSE.md'; // Assuming the license file is named LICENSE.md in the root

  useEffect(() => {
    async function fetchLicense() {
      try {
        const response = await fetch('/api/github', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'getFileContent',
            owner: MAIN_REPO_OWNER,
            repo: MAIN_REPO_NAME,
            path: LICENSE_FILE_PATH,
            ref: 'master', // Assuming 'master' as the main branch
          }),
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch license content');
        }
        setLicenseContent(data.content);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchLicense();
  }, []);

  if (loading) {
    return <main className="flex min-h-screen flex-col items-center justify-center p-24"><p>Chargement de la licence...</p></main>;
  }

  if (error) {
    return <main className="flex min-h-screen flex-col items-center justify-center p-24"><p className="text-red-500">Erreur: {error}</p></main>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-24">
      <h1 className="text-4xl font-bold mb-8">Licence de BookmarkletHub (MIT)</h1>
      <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-md overflow-auto" style={{ maxHeight: '70vh' }}>
        <pre className="whitespace-pre-wrap font-mono text-sm">{licenseContent}</pre>
      </div>
    </main>
  );
}
