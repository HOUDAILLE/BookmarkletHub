# BookmarkletHub

BookmarkletHub est une application Next.js conçue pour gérer et partager des bookmarklets. Elle intègre des fonctionnalités d'interaction avec GitHub pour faciliter la contribution et la gestion des bookmarklets.

## Fonctionnalités Clés

*   **Gestion des Bookmarklets :** Permet de stocker, organiser et accéder facilement à une collection de bookmarklets.
*   **Intégration GitHub :** Facilite la création de forks, de branches, la soumission de commits et l'ouverture de Pull Requests directement depuis l'application pour contribuer à des dépôts de bookmarklets.

## Changements Récents

Les interactions avec l'API GitHub ont été refactorisées pour utiliser directement les API REST et GraphQL de GitHub via `fetch`, remplaçant ainsi l'utilisation de commandes shell (`gh cli`). Cela améliore la sécurité, la portabilité et la robustesse de l'application.

## Démarrage Rapide

Pour lancer l'application en mode développement :

1.  **Cloner le dépôt :**
    ```bash
    git clone [URL_DU_DEPOT]
    cd BookmarkletHub/app
    ```
2.  **Installer les dépendances :**
    ```bash
    npm install
    # ou yarn install
    # ou pnpm install
    # ou bun install
    ```
3.  **Configuration des variables d'environnement :**
    Créez un fichier `.env.local` à la racine du dossier `app` et ajoutez votre token GitHub :
    ```
    GITHUB_TOKEN=votre_token_github
    ```
    Assurez-vous que ce token a les permissions nécessaires (repo, user).
4.  **Lancer le serveur de développement :**
    ```bash
    npm run dev
    # ou yarn dev
    # ou pnpm dev
    # ou bun dev
    ```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur pour voir le résultat.

## En savoir plus

Pour plus d'informations sur Next.js, consultez la [documentation Next.js](https://nextjs.org/docs).