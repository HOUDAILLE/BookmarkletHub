"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold text-center">Bienvenue sur BookmarkletHub</h1>
        <p className="text-center">La plateforme pour héberger et partager vos bookmarklets.</p>
      </div>

      <div className="mt-8">
        {session ? (
          <div className="text-center">
            <p>Connecté en tant que {session.user?.name}</p>
            <button
              onClick={() => signOut()}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Déconnexion
            </button>
          </div>
        ) : (
          <div className="text-center">
            <p>Non connecté</p>
            <button
              onClick={() => signIn("github")}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Connexion avec GitHub
            </button>
          </div>
        )}
      </div>
    </main>
  );
}