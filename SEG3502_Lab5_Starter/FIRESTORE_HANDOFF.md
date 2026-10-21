# Laboratoire 5 — sauvegarde des employés

Angular 18.2.7 avec AngularFire 18.0.1. La configuration dans
`src/environments/environment.ts` est utilisée en développement et en production,
sans remplacement dans `angular.json`. `getFirestore()` cible la base `(default)`
du projet `seg3502-labo5`. Aucune authentification ajoutée.

## Vérification manuelle

1. Exécuter `npm start` dans ce dossier et ouvrir l'adresse affichée.
2. Remplir les six champs avec des données fictives et cliquer sur Submit.
3. Vérifier dans Firebase Console, base `(default)`, collection `employees`,
   qu'un document contient name, dateOfBirth (timestamp), city, salary (nombre),
   gender et email. Le formulaire ne se vide qu'après confirmation de l'écriture.
4. Cliquer rapidement deux fois sur Submit : une seule écriture doit partir.
5. Tester un échec de permission dans une base de test : une erreur doit apparaître,
   les données doivent rester saisies et une nouvelle tentative doit être possible.
   Le code ne change pas les règles Firestore ; elles doivent autoriser l'écriture
   prévue par le laboratoire.
6. Hors ligne, Firestore peut garder l'écriture en attente : le formulaire reste
   bloqué jusqu'à confirmation ou rejet. Rétablir la connexion pour terminer.

## Transmission à la partenaire

`addEmployee(employee): Promise<string>` écrit les six champs et retourne l'ID.
La date est un Timestamp Firestore : utiliser `toDate()` lors de la lecture pour
le modèle Employee et le DatePipe existants. Le salaire reste un nombre.
Le flux local `employees$` / `$` est conservé pour compatibilité, mais n'est plus
alimenté par les sauvegardes. La partenaire doit le remplacer ou l'alimenter depuis
Firestore. Le tableau peut donc rester vide jusqu'à son intervention.

Aucun commit ni push effectué. Ce dossier reste imbriqué dans le dépôt Address Book :
transférer son contenu vers le dépôt Classroom prévu pour la remise.
