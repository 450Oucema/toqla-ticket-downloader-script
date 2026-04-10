# Toqla Bulk Ticket Downloader

Automatise le téléchargement de tes tickets de caisse depuis l'application Toqla. Au lieu de cliquer sur 100+ modales, tu lances un script et c'est fait.

## Pourquoi ?
Si tu as besoin de récupérer tous tes tickets de paiement Toqla pour faire un export ou les archiver, tu dois normalement :
1. Cliquer sur chaque ligne
2. Attendre la modale
3. Cliquer sur "télécharger"
4. Fermer la modale
5. Recommencer X fois...
Ce script automatise tout ça.

## Installation
Clône le repo ou télécharge juste le fichier `toqla-download-tickets.js`.
## Utilisation
1. **Aller sur Toqla** → Section "Mes transactions" ou "Historique"
2. **Cliquer sur charger jusqu'à ce que l'année s'affiche en entier.**
3. **Ouvrir la console** : appuie sur `F12`, puis onglet "Console"
4. **Copie-colle le script** :
   - Ouvre `toqla-download-tickets.js`
   - Copie tout le contenu
   - Paste dans la console
   - Appuie sur Entrée
5. **Laisser faire** : le script va scroller, cliquer, télécharger et lancer l'alerte dans la console
### Résultat
```
[Toqla] Transactions totales trouvées : 98
[Toqla] Paiements à télécharger : 71
[Toqla] (1/100) Paiement | 09/04/26 - 13:38 | - 9,23 €
  ✓ Téléchargement lancé
[Toqla] (2/100) Paiement | 07/04/26 - 13:45 | - 5,01 €
  ✓ Téléchargement lancé
...
[Toqla] ── Terminé ──
  Succès : 71
  Erreurs : 0
  Total   : 71
```
## Détails techniques
Le script fait :
- **Identifie les paiements** : cherche les lignes `Paiement` (ignore les rechargements qui ont la classe `_credit_`)
- **Ouvre chaque modale** : clique sur la ligne pour afficher le détail
- **Déclenche le téléchargement** : clique sur le bouton `#root-modal > div > div > div > div > div > div > div._containerButton_v8e4r_34 > button`
- **Ferme et continue** : ferme la modale et passe à la suivante
Entre chaque téléchargement, il attend **2,5 secondes** pour pas spammer le serveur.
**Durée estimée** : ~6-7 minutes pour 100 tickets.

## Notes importantes
- Chrome peut te demander d'autoriser les téléchargements multiples (bannière en haut) → clique sur "Autoriser"
- Le script ne sauvegarde rien sur ton ordi en dehors du navigateur. Tous les téléchargements vont dans ton dossier "Téléchargements" comme d'habitude.
- Si un téléchargement échoue, le script continue avec les suivants et affiche un décompte des erreurs.

## En cas de bug
- Recharge la page Toqla et réessaie
- Vérifie que tu es bien sur la page avec la liste des transactions (pas sur un détail de transaction spécifique)

## Licence
MIT
