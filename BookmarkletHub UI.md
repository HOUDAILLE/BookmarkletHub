Pour les fonctionnalités restantes à implémenter, voici un cahier des charges complet qui inclut l'estimation du nombre de fichiers nécessaires.

---

# **Cahier des charges pour les fonctionnalités restantes de BookmarkletHub**

Ce document détaille les spécifications pour la finalisation de l'application web BookmarkletHub, en se basant sur le cahier des charges initial et les choix d'implémentation actuels (utilisation de l'API GitHub, développement avec Next.js/React).

## **1\. Fonctionnalités à implémenter**

### **1.1. Page de Connexion (Login)**

* **Objectif** : Permettre aux utilisateurs de se connecter via leur compte GitHub pour accéder aux fonctionnalités de soumission.  
* **Spécifications** :  
  * Mettre en place le flux d'authentification GitHub OAuth.  
  * Stocker le token d'accès de l'utilisateur de manière sécurisée (probablement dans les cookies HTTP only) pour les futures requêtes API.  
  * La page d'accueil doit afficher un bouton "Se connecter avec GitHub".  
* **Fichiers estimés** : 2-3 fichiers.  
  * app/src/app/login/page.tsx (interface utilisateur de la page de connexion).  
  * app/src/app/api/auth/\[...nextauth\]/route.ts (gestion de l'API de NextAuth pour GitHub OAuth).  
  * app/src/app/components/LoginButton.tsx (composant réutilisable pour le bouton de connexion).

### **1.2. Page de Visualisation des Bookmarklets disponibles**

* **Objectif** : Afficher une liste de tous les bookmarklets disponibles, en se basant sur les fichiers du dépôt GitHub.  
* **Spécifications** :  
  * Utiliser l'API GitHub pour lister le contenu d'un répertoire (par exemple, /bookmarklets/).  
  * Pour chaque fichier de bookmarklet (par exemple, id-unique.json), récupérer son contenu pour afficher les métadonnées (ID, version, licence, etc.) et le code.  
  * Implémenter un système de pagination pour gérer un grand nombre de bookmarklets.  
  * Ajouter des fonctionnalités de recherche et de filtrage (par catégorie, par nom, par version).  
* **Fichiers estimés** : 3-4 fichiers.  
  * app/src/app/bookmarklets/page.tsx (page principale d'affichage).  
  * app/src/app/components/BookmarkletCard.tsx (composant pour afficher un seul bookmarklet).  
  * app/src/app/api/bookmarklets/route.ts (API route pour récupérer la liste des bookmarklets depuis GitHub).  
  * app/src/app/components/SearchFilter.tsx (composant pour les filtres).

### **1.3. Page de Dépôt d'un Nouveau Bookmarklet**

* **Objectif** : Permettre à un utilisateur connecté via GitHub de soumettre un nouveau bookmarklet via un workflow de Pull Request.  
* **Spécifications** :  
  * Vérifier que l'utilisateur est authentifié. Si non, le rediriger vers la page de connexion.  
  * Le formulaire doit inclure des champs pour le code du bookmarklet, la version, la catégorie, la sous-catégorie et la licence.  
  * Une fois le formulaire soumis, l'application doit :  
    * Vérifier si l'utilisateur a un "fork" du dépôt BookmarkletHub. Si ce n'est pas le cas, le créer via l'API GitHub.  
    * Récupérer le SHA du dernier commit (getLatestCommitSha).  
    * Créer une nouvelle branche sur le fork de l'utilisateur à partir de ce SHA.  
    * Créer un nouveau fichier JSON contenant le code et les métadonnées du bookmarklet dans cette nouvelle branche.  
    * Créer une Pull Request depuis la branche de l'utilisateur vers la branche main du dépôt principal.  
  * Une fois la Pull Request créée, afficher à l'utilisateur le code complet du bookmarklet (l'URL de l'ID unique) dans un bloc avec un bouton pour le copier.  
* **Fichiers estimés** : 4-5 fichiers.  
  * app/src/app/submit/page.tsx (page avec le formulaire de soumission).  
  * app/src/app/api/submit/route.ts (API route pour gérer la logique de création de fork/branche/PR).  
  * app/src/app/components/CodeEditor.tsx (composant pour l'éditeur de code).  
  * app/src/app/utils/github.ts (fonctions utilitaires pour l'interaction avec l'API GitHub, comme createFork, createBranch, createPullRequest).

### **1.4. Page de Licence**

* **Objectif** : Afficher le contenu de la licence MIT.  
* **Spécifications** :  
  * Créer une page statique qui affiche le texte complet de la licence MIT.  
  * Ce texte peut être stocké dans un fichier Markdown et rendu sur la page.  
* **Fichiers estimés** : 1-2 fichiers.  
  * app/src/app/license/page.tsx (page d'affichage).  
  * app/src/app/license.md (fichier source de la licence).

### **1.5. Page d'Aide**

* **Objectif** : Fournir une documentation claire sur le service.  
* **Spécifications** :  
  * Créer une page avec plusieurs sections : "Fonctionnement", "Comment soumettre un code", "Comment utiliser un bookmarklet".  
  * Utiliser des exemples de code et des captures d'écran pour illustrer les étapes.  
* **Fichiers estimés** : 1-2 fichiers.  
  * app/src/app/help/page.tsx (page d'aide).  
  * app/src/app/help-content.md (fichier source du contenu).

### **1.6. Page de Paiement / Donation**

* **Objectif** : Permettre aux utilisateurs de faire un don.  
* **Spécifications** :  
  * Créer une page avec des liens ou des intégrations vers des plateformes de donation (ex: PayPal, Stripe).  
* **Fichiers estimés** : 1 fichier.  
  * app/src/app/donate/page.tsx (page de donation).

## **2\. Estimation totale des fichiers à créer**

L'estimation totale pour l'implémentation de ces fonctionnalités restantes est d'environ **13 à 17 fichiers**. Cette estimation inclut les pages, les API routes, les composants réutilisables et les fichiers de contenu.