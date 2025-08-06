Voici le cahier des charges pour le projet **BookmarkletHub**, destiné à être utilisé par Gemini CLI.

---

# **Cahier des Charges : Projet BookmarkletHub**

## **1. Origine et Objectifs du Projet**

Le projet **BookmarkletHub** vise à résoudre des limitations inhérentes à l'utilisation des bookmarklets (ou "marque-pages scriptés"). Actuellement, la longueur du code JavaScript pouvant être inséré directement dans l'URL d'un favori est strictement limitée par les navigateurs. Cette contrainte empêche l'utilisation de scripts complexes et rend difficile la maintenance et la lisibilité du code (nécessité de minification agressive, suppression des retours à la ligne, encodage des caractères spéciaux, etc.).

Pour pallier ces problèmes, il est apparu nécessaire de proposer un service en ligne permettant de **stocker le code source complet des bookmarklets sur un serveur distant**. L'utilisateur n'aura alors qu'un court fragment de code dans son favori, ce fragment étant responsable de récupérer et d'exécuter le script complet hébergé sur BookmarkletHub. Cela permettra une meilleure gestion, une plus grande flexibilité et une meilleure lisibilité du code des bookmarklets.

## **2. Fonctionnalités de l'Application Web BookmarkletHub**

L'application web BookmarkletHub sera structurée autour de plusieurs pages principales, chacune offrant des fonctionnalités spécifiques, avec une approche centrée sur GitHub pour la gestion des données et de l'authentification.

### **2.1. Page de Connexion**

Cette page permettra aux utilisateurs de se connecter **exclusivement via leur compte GitHub**.

*   **Connexion via GitHub OAuth** : Intégration de la connexion via GitHub OAuth.

### **2.2. Page de Visualisation des Bookmarklets Disponibles**

Cette page affichera une liste des bookmarklets hébergés, avec des détails pertinents. Les données des bookmarklets seront récupérées directement depuis le dépôt GitHub principal.

*   **Affichage Détaillé** : Pour chaque bookmarklet, seront affichés :
    *   L'identifiant unique court (basé sur le chemin du fichier dans le dépôt).
    *   Un aperçu de son code (tronqué si trop long, avec option d'affichage complet).
    *   Sa catégorie et sous-catégorie (définies dans les métadonnées du fichier).
    *   Sa version (définie dans les métadonnées du fichier).
*   **Fonctionnalités de Recherche et de Filtrage** : Permettant de naviguer facilement parmi les bookmarklets.

### **2.3. Page de Dépôt d'un Nouveau Bookmarklet**

Cette page permettra aux utilisateurs authentifiés via GitHub de soumettre de nouveaux bookmarklets. Le processus de soumission sera entièrement basé sur le workflow GitHub.

*   **Zone de Saisie du Code** : Un éditeur de texte permettant de coller ou de saisir le code JavaScript du bookmarklet à héberger.
*   **Gestion du Versioning** : L'utilisateur pourra spécifier une version pour son bookmarklet.
*   **Gestion de la Licence** : L'utilisateur pourra spécifier la licence de son bookmarklet.
*   **Bouton de Validation** : Pour soumettre le bookmarklet.
*   **Workflow GitHub pour la Soumission** :
    1.  L'application vérifiera si l'utilisateur a déjà forké le dépôt principal `BookmarkletHub`. Si non, elle proposera de le faire.
    2.  L'application créera une nouvelle branche sur le fork de l'utilisateur.
    3.  Le code du bookmarklet et ses métadonnées seront ajoutés sous forme de fichier(s) dans cette branche.
    4.  L'application ouvrira une **Pull Request** depuis le fork de l'utilisateur vers le dépôt principal `BookmarkletHub`.
*   **Codeblock de Résultat** : Après validation et création de la Pull Request, affichage d'un bloc de code contenant le bookmarklet complet à copier (incluant l'adresse de connexion à BookmarkletHub et l'identifiant unique généré pour le bookmarklet). Un bouton "Copier" sera présent.

### **2.4. Page de Licence de BookmarkletHub**

Cette page affichera les termes de la licence sous laquelle le service BookmarkletHub est lui-même fourni.

*   **Licence MIT** : Le contenu de la licence MIT sera affiché intégralement sur cette page.

### **2.5. Page d'Aide**

Cette page fournira des informations et des instructions détaillées sur l'utilisation du service.

*   **Fonctionnement de BookmarkletHub** : Explication claire du concept et des avantages.
*   **Comment Déposer un Nouveau Code** : Guide pas à pas pour la soumission de bookmarklets via le workflow GitHub (fork, branche, PR).
*   **Comment Utiliser un Bookmarklet** : Instructions pour copier et utiliser le bookmarklet généré dans la barre de favoris du navigateur.

### **2.6. Page de Paiement / Donation**

Cette page permettra aux utilisateurs de soutenir financièrement le projet.

*   **Options de Donation** : Mise en place de moyens de paiement sécurisés pour les dons (ex: PayPal, Stripe, ou autres plateformes de donation).

## **3. Instructions pour Gemini CLI**

Ce cahier des charges sera déposé dans un répertoire nommé BookmarkletHub sur la machine locale. Gemini CLI est chargé des opérations suivantes :

1.  **Connexion à GitHub** : Utiliser l'API GitHub directement pour toutes les interactions (authentification, création de forks, branches, etc.).
2.  **Création du Dépôt** : Créer un nouveau dépôt public sur GitHub nommé BookmarkletHub.
3.  **Liaison du Répertoire Local** : Lier le répertoire local BookmarkletHub (où ce cahier des charges est stocké) au dépôt distant nouvellement créé sur GitHub. Initialiser le dépôt Git local et configurer le "remote" pour pointer vers le dépôt GitHub.
4.  **Développement de l'Application** : Développer l'intégralité de l'application web en suivant les fonctionnalités décrites ci-dessus, en utilisant l'API GitHub pour toutes les opérations de données (lecture des bookmarklets, création de forks, branches, et Pull Requests).

## **4. Historique des Opérations et Tentatives**

Ce journal retrace les actions entreprises par Gemini CLI, les succès, les échecs et les raisons associées.

*   **2025-08-06 14:25** : Tentative de vérification de l'authentification GitHub (`gh auth status`) depuis le sous-répertoire `app/`.
    *   **Résultat** : Échec. Erreur "Directory 'app' is not a registered workspace directory."
    *   **Raison** : Commande exécutée depuis le mauvais répertoire.
*   **2025-08-06 14:26** : Tentative de vérification de l'authentification GitHub (`gh auth status`) depuis la racine du projet.
    *   **Résultat** : Échec. Exit Code 1, non authentifié.
    *   **Raison** : Aucune session GitHub active.
*   **2025-08-06 14:27** : Tentative d'authentification GitHub (`gh auth login -h github.com -w -p https`) avec ouverture automatique du navigateur (`-w`).
    *   **Résultat** : Échec. "context deadline exceeded".
    *   **Raison** : Le navigateur ne s'est pas ouvert ou l'utilisateur n'a pas pu interagir à temps.
*   **2025-08-06 14:28** : Nouvelle tentative d'authentification GitHub (`gh auth login -h github.com -w -p https`) avec ouverture automatique du navigateur (`-w`).
    *   **Résultat** : Échec. "context deadline exceeded".
    *   **Raison** : Le problème persiste.
*   **2025-08-06 14:30** : Tentative d'authentification GitHub (`gh auth login -h github.com -p https`) sans ouverture automatique du navigateur (nécessite une action manuelle de l'utilisateur).
    *   **Résultat** : Échec. "context deadline exceeded".
    *   **Raison** : L'utilisateur n'a pas pu interagir à temps.
*   **2025-08-06 14:32** : Nouvelle tentative d'authentification GitHub (`gh auth login -h github.com -p https`) sans ouverture automatique du navigateur.
    *   **Résultat** : Échec. "context deadline exceeded".
    *   **Raison** : Le problème persiste.
*   **2025-08-06 14:35** : Dernière tentative d'authentification GitHub (`gh auth login -h github.com -w -p https`) avec ouverture automatique du navigateur (`-w`), suite à la demande de l'utilisateur.
    *   **Résultat** : Annulée par l'utilisateur.
    *   **Raison** : L'utilisateur a interrompu l'opération.
*   **2025-08-06 14:40** : Début de la correction de l'approche. Journalisation des tentatives d'authentification.
    *   **Résultat** : Succès. `journal.log` mis à jour.
*   **2025-08-06 14:40** : Création du répertoire d'archivage `D:\Programmation\BookmarkletHub\archive`.
    *   **Résultat** : Succès. Répertoire créé.
*   **2025-08-06 14:40** : Tentative de sauvegarde de l'ancien cahier des charges (`BookmarkletHub.md`) avec `cp`.
    *   **Résultat** : Échec. Commande `cp` non reconnue sur Windows.
    *   **Raison** : Utilisation d'une commande Linux/macOS sur un système Windows.
*   **2025-08-06 14:40** : Sauvegarde de l'ancien cahier des charges (`BookmarkletHub.md`) avec `copy` (correction pour Windows).
    *   **Résultat** : Succès. Fichier `BookmarkletHub_20250806_1440.md` archivé.
*   **2025-08-06 [DATE_ACTUELLE]** : Refactoring de l'intégration GitHub.
    *   **Description** : Remplacement de l'utilisation de `run_shell_command` et des commandes `gh cli` par des appels directs à l'API REST et GraphQL de GitHub via `fetch` dans `app/src/app/api/github/route.ts`.
    *   **Résultat** : Succès. Amélioration de la sécurité, de la portabilité et de la robustesse. Suppression du fichier `utils/run_shell_command.ts` et du dossier `utils`.

## **5. Auteur du Projet**

Valéry Pierre Constantin HOUDAILLE

GitHub : https://github.com/houdaille

Téléphone : +33 662 933 648

---