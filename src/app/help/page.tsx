// src/app/help/page.tsx

"use client";

export default function HelpPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-24">
      <h1 className="text-4xl font-bold mb-8">Aide et Utilisation</h1>

      <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4">Fonctionnement de BookmarkletHub</h2>
        <p className="mb-4">
          BookmarkletHub est une plateforme qui vous permet d'héberger, de partager et de découvrir des bookmarklets JavaScript. 
          Contrairement aux bookmarklets traditionnels qui sont limités en taille par les navigateurs, BookmarkletHub stocke le code complet sur un serveur distant. 
          Votre bookmarklet dans le navigateur ne contient qu'un court fragment de code qui récupère et exécute le script complet depuis notre service.
        </p>
        <p className="mb-4">
          Cela offre plusieurs avantages :
          <ul className="list-disc list-inside ml-4">
            <li>**Pas de limite de taille** : Hébergez des scripts JavaScript complexes sans vous soucier des contraintes de longueur d'URL.</li>
            <li>**Facilité de mise à jour** : Mettez à jour votre bookmarklet sur BookmarkletHub, et tous les utilisateurs bénéficieront automatiquement de la nouvelle version sans avoir à modifier leur favori.</li>
            <li>**Meilleure lisibilité et maintenance** : Travaillez avec du code JavaScript formaté et commenté, sans avoir besoin de minification agressive.</li>
            <li>**Partage simplifié** : Partagez vos bookmarklets avec la communauté et découvrez ceux créés par d'autres.</li>
          </ul>
        </p>
      </div>

      <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4">Comment Déposer un Nouveau Code</h2>
        <p className="mb-4">
          Pour soumettre un nouveau bookmarklet sur BookmarkletHub, suivez ces étapes :
          <ol className="list-decimal list-inside ml-4">
            <li>**Connectez-vous avec votre compte GitHub** : L'authentification se fait exclusivement via GitHub pour une intégration fluide.</li>
            <li>**Accédez à la page de soumission** : Une fois connecté, vous trouverez un lien pour "Déposer un Nouveau Bookmarklet".</li>
            <li>**Saisissez le titre et le code** : Entrez un titre descriptif pour votre bookmarklet et collez votre code JavaScript complet dans l'éditeur.</li>
            <li>**Soumettez le bookmarklet** : En cliquant sur le bouton de soumission, notre système va :
              <ul className="list-disc list-inside ml-8">
                <li>Vérifier si vous avez déjà forké le dépôt principal de BookmarkletHub. Si ce n'est pas le cas, il vous sera demandé de le faire.</li>
                <li>Créer une nouvelle branche dans votre fork GitHub.</li>
                <li>Ajouter votre code JavaScript à cette nouvelle branche.</li>
                <li>Créer une Pull Request (demande de tirage) depuis votre fork vers le dépôt principal de BookmarkletHub.</li>
              </ul>
            </li>
            <li>**Validation et Intégration** : Votre Pull Request sera examinée par les administrateurs de BookmarkletHub. Une fois approuvée et fusionnée, votre bookmarklet sera disponible publiquement sur la plateforme.</li>
          </ol>
        </p>
      </div>

      <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Comment Utiliser un Bookmarklet</h2>
        <p className="mb-4">
          Une fois votre bookmarklet (ou celui d'un autre utilisateur) disponible sur BookmarkletHub, vous pouvez l'utiliser facilement :
          <ol className="list-decimal list-inside ml-4">
            <li>**Copiez le code du bookmarklet généré** : Sur la page de visualisation du bookmarklet, un bloc de code spécial sera affiché. Il s'agit d'un court fragment JavaScript qui se connecte à BookmarkletHub pour récupérer et exécuter le script complet. Cliquez sur le bouton "Copier" pour le mettre dans votre presse-papiers.</li>
            <li>**Créez un nouveau favori dans votre navigateur** :
              <ul className="list-disc list-inside ml-8">
                <li>Dans la plupart des navigateurs, vous pouvez faire un clic droit sur la barre de favoris et sélectionner "Ajouter une page" ou "Ajouter un favori".</li>
                <li>Donnez un nom significatif à votre favori (par exemple, "Mon Super Bookmarklet").</li>
                <li>Dans le champ "URL" (ou "Adresse"), collez le code que vous avez copié à l'étape précédente.</li>
              </ul>
            </li>
            <li>**Utilisez le bookmarklet** : Cliquez simplement sur le favori que vous venez de créer dans votre barre de favoris lorsque vous êtes sur une page web où vous souhaitez exécuter le script.</li>
          </ol>
        </p>
      </div>
    </main>
  );
}
