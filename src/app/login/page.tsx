"use client";

import { signIn } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/"); // Redirect to home page if already logged in
    }
  }, [session, status, router]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Se connecter à BookmarkletHub</h1>
      <button
        onClick={() => signIn("github")}
        className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
      >
        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.41 2.865 8.15 6.839 9.488.5.092.682-.217.682-.483 0-.237-.007-.868-.011-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.529 2.341 1.089 2.91.833.091-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.953 0-1.096.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0110 4.844c.85.004 1.701.114 2.516.331 1.909-1.295 2.747-1.025 2.747-1.025.546 1.379.202 2.398.099 2.65.64.7 1.028 1.592 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C17.146 18.16 20 14.41 20 10.017 20 4.484 15.522 0 10 0z" clipRule="evenodd" />
        </svg>
        Se connecter avec GitHub
      </button>
    </main>
  );
}
