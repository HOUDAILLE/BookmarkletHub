import React from 'react';

export default function DonatePage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-4xl font-bold mb-8">Soutenir BookmarkletHub</h1>
      <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-md text-center">
        <p className="text-lg mb-4">
          Si vous appréciez BookmarkletHub et souhaitez soutenir son développement, vous pouvez faire un don.
        </p>
        <p className="text-md mb-6">
          Votre contribution nous aidera à maintenir le service et à ajouter de nouvelles fonctionnalités.
        </p>
        <div className="flex flex-col items-center space-y-4">
          <a
            href="https://www.paypal.com/donate/?hosted_button_id=YOUR_PAYPAL_BUTTON_ID"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-xl shadow-lg transition duration-300 ease-in-out"
          >
            Faire un don via PayPal
          </a>
          {/* Add other donation options here */}
          <p className="text-sm text-gray-500 mt-4">
            (Remplacez YOUR_PAYPAL_BUTTON_ID par votre véritable ID de bouton PayPal)
          </p>
        </div>
      </div>
    </main>
  );
}