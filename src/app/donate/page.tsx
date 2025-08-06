// src/app/donate/page.tsx

"use client";

export default function DonatePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-24">
      <h1 className="text-4xl font-bold mb-8">Soutenir BookmarkletHub</h1>

      <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-md mb-8 text-center">
        <h2 className="text-2xl font-semibold mb-4">Faites un Don</h2>
        <p className="mb-4">
          BookmarkletHub est un projet open-source et gratuit. Votre soutien nous aide à maintenir et à améliorer la plateforme.
          Chaque contribution, petite ou grande, est grandement appréciée !
        </p>
        
        <div className="mt-8">
          <p className="text-lg font-medium mb-4">Options de Donation (Exemples d'intégration):</p>
          <div className="flex flex-col items-center space-y-4">
            <a 
              href="#"
              onClick={(e) => { e.preventDefault(); alert('Intégration PayPal à venir'); }}
              className="w-full md:w-1/2 lg:w-1/3 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
            >
              Faire un don via PayPal
            </a>
            <a 
              href="#"
              onClick={(e) => { e.preventDefault(); alert('Intégration Stripe à venir'); }}
              className="w-full md:w-1/2 lg:w-1/3 px-6 py-3 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 transition duration-300"
            >
              Faire un don via Stripe
            </a>
            <a 
              href="#"
              onClick={(e) => { e.preventDefault(); alert('Intégration Patreon à venir'); }}
              className="w-full md:w-1/2 lg:w-1/3 px-6 py-3 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition duration-300"
            >
              Soutenir sur Patreon
            </a>
          </div>
        </div>

        <p className="mt-8 text-sm text-gray-500">
          Note: Les liens ci-dessus sont des exemples. Dans une version finale, ils seraient intégrés avec les services de paiement réels.
        </p>
      </div>
    </main>
  );
}
