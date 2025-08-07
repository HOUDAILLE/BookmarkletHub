# Comment utiliser BookmarkletHub

Bienvenue sur BookmarkletHub ! Ce guide vous aidera à comprendre comment fonctionne notre plateforme et comment vous pouvez l'utiliser.

## Fonctionnement

BookmarkletHub est un service qui vous permet de stocker et de gérer vos bookmarklets JavaScript. Au lieu de copier de longs codes JavaScript dans vos favoris, vous pouvez héberger le code complet ici et utiliser un petit fragment de code dans votre navigateur qui appellera notre service.

## Comment soumettre un nouveau bookmarklet

1.  **Connectez-vous avec GitHub :** Utilisez votre compte GitHub pour vous connecter à BookmarkletHub.
2.  **Accédez à la page de soumission :** Une fois connecté, naviguez vers la page "Déposer un Nouveau Bookmarklet".
3.  **Remplissez le formulaire :** Entrez le titre de votre bookmarklet et collez votre code JavaScript.
4.  **Soumettez :** Cliquez sur le bouton de soumission. Notre système créera automatiquement un fork de notre dépôt, une nouvelle branche, commettra votre code et ouvrira une Pull Request pour examen.

## Comment utiliser un bookmarklet

Après la soumission et l'approbation de votre bookmarklet, vous recevrez un ID unique. Vous pourrez alors utiliser un petit script comme celui-ci dans votre barre de favoris :

```javascript
javascript:(function(){
  var s=document.createElement('script');
  s.src='https://bookmarklethub.com/bookmarklets/YOUR_UNIQUE_ID.js';
  document.body.appendChild(s);
})();
```

Remplacez `YOUR_UNIQUE_ID` par l'ID de votre bookmarklet.
