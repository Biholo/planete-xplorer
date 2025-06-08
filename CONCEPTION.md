# Conception PlanèteXplorer

## Partie 1 – Définition fonctionnelle et conception générale

### 1. Cahier des charges fonctionnel

#### Fonctionnalités principales de l'application PlanèteXplorer :

**Consultation et navigation :**
- Consultation de la liste des corps célestes enregistrés avec pagination
- Affichage de détails complets pour un objet sélectionné
- Navigation par catégories d'objets célestes
- Navigation par systèmes stellaires

**Gestion des objets célestes :**
- Ajout de nouveaux objets (planète, exoplanète, étoile, lune, etc.) avec leurs caractéristiques :
  - Nom, type, description
  - Caractéristiques physiques : rayon, masse, température
  - Propriétés orbitales : distance du soleil, période de rotation
  - Informations découverte : découvreur, date de découverte
  - Composition atmosphérique
- Modification d'objets existants
- Suppression d'objets existants

**Gestion des catégories et systèmes :**
- Création, modification et suppression de catégories d'objets célestes
- Gestion des systèmes stellaires
- Association des objets célestes à leurs catégories et systèmes

**Recherche et filtrage :**
- Recherche d'objets par nom
- Filtrage par type d'objet
- Filtrage par catégorie
- Filtrage par système stellaire

#### Utilisateurs et rôles :

**Utilisateur standard (ROLE_USER) :**
- Consultation de tous les objets célestes
- Accès en lecture seule aux détails des objets
- Navigation dans les catégories et systèmes

**Administrateur (ROLE_ADMIN) :**
- Toutes les permissions de l'utilisateur standard
- Création, modification et suppression d'objets célestes
- Gestion des catégories et systèmes
- Administration complète de l'application

### 2. Schéma d'architecture N-tiers

#### Couche de Présentation (Frontend - React)
**Responsabilités :**
- Interface utilisateur responsive
- Gestion des formulaires et interactions utilisateur
- Affichage des données et navigation
- Gestion de l'état de l'application (authentification, données)
- Communication avec l'API via HTTP/REST

#### Couche Logique Métier (Backend - Fastify/Node.js)
**Responsabilités :**
- Logique métier et règles de gestion
- Authentification et autorisation (JWT + rôles)
- Validation des données entrantes
- Transformation des données (DTOs)
- Gestion des erreurs et des réponses
- Middleware de sécurité

#### Couche d'Accès aux Données (Prisma ORM + MySql)
**Responsabilités :**
- Persistance des données
- Requêtes et transactions de base de données
- Relations entre entités
- Migrations de schéma
- Optimisation des requêtes

**Flux de communication :**
```
Frontend (React) 
    ↕ HTTP/REST/JSON
Backend (Fastify)
    ↕ Prisma ORM
Base de Données (MySql)
```

### 3. Modélisation des données

#### Entités principales :

**Utilisateur (User) :**
- id : Identifiant unique
- firstName : Prénom
- lastName : Nom de famille
- email : Adresse email (unique)
- password : Mot de passe (hashé)
- roles : Tableau de rôles
- phone : Numéro de téléphone
- civility : Civilité
- birthDate : Date de naissance
- createdAt, updatedAt : Horodatage

**Objet Céleste (CelestialObject) :**
- id : Identifiant unique
- name : Nom de l'objet (unique)
- type : Type d'objet céleste
- description : Description textuelle
- distanceFromSun : Distance du soleil (en UA)
- mass : Masse (en kg)
- radius : Rayon (en km)
- temperature : Température (en Kelvin)
- atmosphereComposition : Composition atmosphérique
- rotationPeriod : Période de rotation (en heures)
- discoverer : Nom du découvreur
- discoveryDate : Date de découverte
- categoryId : Référence vers la catégorie
- systemId : Référence vers le système
- createdAt, updatedAt : Horodatage

**Catégorie (Category) :**
- id : Identifiant unique
- name : Nom de la catégorie (unique)
- description : Description de la catégorie
- createdAt, updatedAt : Horodatage

**Système (System) :**
- id : Identifiant unique
- name : Nom du système (unique)
- description : Description du système
- createdAt, updatedAt : Horodatage

#### Relations entre entités :
- Un Objet Céleste appartient à une Catégorie (1:N)
- Un Objet Céleste appartient à un Système (1:N)
- Une Catégorie peut contenir plusieurs Objets Célestes (1:N)
- Un Système peut contenir plusieurs Objets Célestes (1:N)

## Partie 2 – Mise en place de la couche d'accès aux données

### 1. Définition des interfaces de persistance

#### Opérations pour CelestialObject :
- `create(data)` : Création d'un nouvel objet céleste
- `findMany(filters, pagination)` : Récupération de la liste avec filtres
- `findById(id)` : Récupération par identifiant
- `update(id, data)` : Mise à jour d'un objet existant
- `delete(id)` : Suppression d'un objet
- `findByName(name)` : Recherche par nom
- `findByCategory(categoryId)` : Recherche par catégorie
- `findBySystem(systemId)` : Recherche par système

#### Opérations pour Category :
- `create(data)` : Création d'une nouvelle catégorie
- `findMany()` : Récupération de toutes les catégories
- `findById(id)` : Récupération par identifiant
- `update(id, data)` : Mise à jour d'une catégorie
- `delete(id)` : Suppression d'une catégorie
- `findByName(name)` : Recherche par nom

#### Opérations pour System :
- `create(data)` : Création d'un nouveau système
- `findMany()` : Récupération de tous les systèmes
- `findById(id)` : Récupération par identifiant
- `update(id, data)` : Mise à jour d'un système
- `delete(id)` : Suppression d'un système

#### Opérations pour User :
- `create(data)` : Création d'un nouvel utilisateur
- `findByEmail(email)` : Recherche par email
- `findById(id)` : Récupération par identifiant
- `update(id, data)` : Mise à jour d'un utilisateur

### 2. Schéma physique de la base de données

#### Table User :
- id : UUID (clé primaire)
- firstName : VARCHAR(255)
- lastName : VARCHAR(255)
- email : VARCHAR(255) UNIQUE
- password : VARCHAR(255)
- roles : JSON (tableau de rôles)
- phone : VARCHAR(50)
- civility : VARCHAR(10)
- birthDate : DATE
- createdAt : TIMESTAMP
- updatedAt : TIMESTAMP

#### Table Category :
- id : UUID (clé primaire)
- name : VARCHAR(255) UNIQUE
- description : TEXT
- createdAt : TIMESTAMP
- updatedAt : TIMESTAMP

#### Table System :
- id : UUID (clé primaire)
- name : VARCHAR(255) UNIQUE
- description : TEXT
- createdAt : TIMESTAMP
- updatedAt : TIMESTAMP

#### Table CelestialObject :
- id : UUID (clé primaire)
- name : VARCHAR(255) UNIQUE
- type : VARCHAR(100)
- description : TEXT
- distanceFromSun : DECIMAL
- mass : DECIMAL
- radius : DECIMAL
- temperature : DECIMAL
- atmosphereComposition : TEXT
- rotationPeriod : DECIMAL
- discoverer : VARCHAR(255)
- discoveryDate : DATE
- categoryId : UUID (clé étrangère → Category.id)
- systemId : UUID (clé étrangère → System.id)
- createdAt : TIMESTAMP
- updatedAt : TIMESTAMP

### 3. Environnement technique

**Système de gestion de base de données :**
- MySql (SGBD relationnel)
- Prisma ORM pour l'abstraction et les migrations

**Configuration de connexion :**
- URI de connexion via variable d'environnement `DATABASE_URL`
- Pool de connexions géré par Prisma
- Migrations automatiques via Prisma Migrate

## Partie 3 – Mise en place de la couche logique métier

### 1. Spécification des services métier

#### CelestialObjectService :
- `getAllCelestialObjects(filters, pagination)` : Récupération avec filtres
- `getCelestialObjectById(id)` : Récupération par ID
- `createCelestialObject(data, user)` : Création (admin uniquement)
- `updateCelestialObject(id, data, user)` : Mise à jour (admin uniquement)
- `deleteCelestialObject(id, user)` : Suppression (admin uniquement)

#### CategoryService :
- `getAllCategories()` : Récupération de toutes les catégories
- `getCategoryById(id)` : Récupération par ID
- `createCategory(data, user)` : Création (admin uniquement)
- `updateCategory(id, data, user)` : Mise à jour (admin uniquement)
- `deleteCategory(id, user)` : Suppression (admin uniquement)

#### SystemService :
- `getAllSystems()` : Récupération de tous les systèmes
- `getSystemById(id)` : Récupération par ID
- `createSystem(data, user)` : Création (admin uniquement)
- `updateSystem(id, data, user)` : Mise à jour (admin uniquement)
- `deleteSystem(id, user)` : Suppression (admin uniquement)

#### AuthService :
- `login(email, password)` : Authentification utilisateur
- `register(userData)` : Inscription nouvel utilisateur
- `verifyToken(token)` : Vérification du token JWT

### 2. Règles de gestion

#### Validation des objets célestes :
- Le nom doit être unique dans toute l'application
- Le rayon doit être un nombre positif
- La masse doit être un nombre positif
- La température doit être supérieure à 0 Kelvin
- La distance du soleil doit être positive
- Les références categoryId et systemId doivent exister

#### Gestion des erreurs :
- **Validation** : Code 400 (Bad Request) avec détails des champs invalides
- **Duplication** : Code 409 (Conflict) pour nom déjà existant
- **Non trouvé** : Code 404 (Not Found) pour ressource inexistante
- **Non autorisé** : Code 401 (Unauthorized) pour authentification manquante
- **Interdit** : Code 403 (Forbidden) pour droits insuffisants
- **Erreur interne** : Code 500 (Internal Server Error) pour erreurs système

### 3. Flux de traitement

#### Ajout d'un objet céleste :
1. Réception de la requête POST avec données JSON
2. Vérification de l'authentification (token JWT)
3. Vérification des droits d'administration
4. Validation du schéma des données (Zod)
5. Vérification de l'unicité du nom
6. Vérification de l'existence des références (category, system)
7. Sauvegarde en base de données via repository
8. Transformation en DTO pour la réponse
9. Retour de la réponse avec statut 201

#### Recherche avancée :
1. Réception des paramètres de filtrage
2. Construction des critères de recherche
3. Application des filtres (nom, type, catégorie, système)
4. Exécution de la requête avec pagination
5. Transformation des résultats en DTOs
6. Retour de la liste paginée

## Partie 4 – Mise en place de la couche de présentation

### 1. Définition des points d'accès (endpoints)

#### Objets célestes :
- `GET /api/celestial-objects` : Liste des objets avec pagination et filtres
  - Paramètres : page, limit, search, categoryId, systemId
  - Réponse : 200 avec liste paginée
- `GET /api/celestial-objects/:id` : Détails d'un objet spécifique
  - Réponse : 200 avec objet ou 404 si non trouvé
- `POST /api/celestial-objects` : Création d'un nouvel objet (admin)
  - Corps : JSON avec données de l'objet
  - Réponse : 201 avec objet créé ou 400/409 en cas d'erreur
- `PATCH /api/celestial-objects/:id` : Mise à jour partielle (admin)
  - Corps : JSON avec champs à modifier
  - Réponse : 200 avec objet modifié ou 404/400
- `DELETE /api/celestial-objects/:id` : Suppression (admin)
  - Réponse : 204 en cas de succès ou 404

#### Catégories :
- `GET /api/categories` : Liste de toutes les catégories
- `GET /api/categories/:id` : Détails d'une catégorie
- `POST /api/categories` : Création (admin)
- `PATCH /api/categories/:id` : Modification (admin)
- `DELETE /api/categories/:id` : Suppression (admin)

#### Systèmes :
- `GET /api/systems` : Liste de tous les systèmes
- `GET /api/systems/:id` : Détails d'un système
- `POST /api/systems` : Création (admin)
- `PATCH /api/systems/:id` : Modification (admin)
- `DELETE /api/systems/:id` : Suppression (admin)

#### Authentification :
- `POST /api/auth/login` : Connexion utilisateur
- `POST /api/auth/register` : Inscription utilisateur

### 2. Gestion des erreurs au niveau API

#### Codes de statut HTTP utilisés :
- **200 OK** : Succès récupération/modification
- **201 Created** : Succès création
- **204 No Content** : Succès suppression
- **400 Bad Request** : Données invalides/malformées
- **401 Unauthorized** : Authentification requise
- **403 Forbidden** : Droits insuffisants
- **404 Not Found** : Ressource non trouvée
- **409 Conflict** : Conflit (nom déjà existant)
- **500 Internal Server Error** : Erreur serveur

#### Format des réponses d'erreur :
```json
{
  "message": "Description de l'erreur",
  "status": 400,
  "data": {}
}
```

### 3. Prototype d'interface utilisateur

#### Pages principales :

**Page d'accueil/Liste des objets célestes :**
- Affichage en grille des objets célestes avec image et informations de base
- Barre de recherche par nom
- Filtres par catégorie et système (menus déroulants)
- Pagination en bas de page
- Boutons d'actions pour les administrateurs (Ajouter, Modifier, Supprimer)

**Page de détail d'objet céleste :**
- Affichage complet des caractéristiques de l'objet
- Informations organisées en sections (Général, Physique, Découverte)
- Bouton retour vers la liste
- Boutons de modification/suppression pour les administrateurs

**Formulaire d'ajout/modification :**
- Champs organisés par sections
- Validation en temps réel
- Sélecteurs pour catégorie et système
- Boutons Sauvegarder/Annuler

**Pages de gestion des catégories et systèmes :**
- Listes avec actions CRUD pour les administrateurs
- Formulaires modaux pour ajout/modification

**Navigation :**
- Menu principal avec liens vers les différentes sections
- Indicateur de connexion utilisateur
- Menu administrateur conditionnel selon les droits

### 4. Actions utilisateur par écran

#### Liste des objets :
- Cliquer sur un objet pour voir les détails
- Utiliser la recherche et les filtres
- Naviguer entre les pages
- Ajouter un nouvel objet (admin)

#### Détail d'objet :
- Retourner à la liste
- Modifier l'objet (admin)
- Supprimer l'objet (admin)

#### Formulaires :
- Saisir les données
- Valider le formulaire
- Annuler et retourner à la liste

## Partie 5 – Tests, documentation et déploiement

### 1. Documentation technique

#### Guide d'installation :
1. Cloner le repository
2. Installer Node.js et npm
3. Installer les dépendances : `npm install` (backend et frontend)
4. Configurer les variables d'environnement (.env)
5. Configurer la base de données MySql
6. Exécuter les migrations Prisma
7. Lancer le serveur backend : `npm run dev`
8. Lancer le frontend : `npm run dev`

#### Organisation des fichiers :

**Backend (backend/) :**
- `src/controllers/` : Contrôleurs des routes
- `src/services/` : Logique métier
- `src/repositories/` : Accès aux données
- `src/middleware/` : Middlewares (auth, validation)
- `src/routes/` : Définition des routes
- `src/transformers/` : Transformation des données
- `src/utils/` : Utilitaires
- `prisma/` : Schéma et migrations

**Frontend (frontend/) :**
- `src/components/` : Composants React réutilisables
- `src/pages/` : Pages principales de l'application
- `src/api/` : Services d'appel API
- `src/hooks/` : Hooks personnalisés
- `src/types/` : Types TypeScript

**Partagé (shared/) :**
- `dto/` : Data Transfer Objects partagés

#### Guide d'utilisation de l'API :
Documentation automatique via Swagger accessible à `/api` en développement.

### 2. Sécurité et bonnes pratiques

#### Aspects de sécurité :
- **Validation stricte** : Tous les inputs utilisateur validés via Zod
- **Authentification JWT** : Tokens sécurisés avec expiration
- **Autorisation basée sur les rôles** : Contrôle d'accès granulaire
- **Hashage des mots de passe** : Utilisation de bcrypt
- **Protection CORS** : Configuration restrictive
- **Variables d'environnement** : Secrets non exposés dans le code

#### Bonnes pratiques respectées :
- **Séparation des responsabilités** : Architecture en couches claire
- **Nommage cohérent** : Conventions TypeScript respectées
- **Gestion des erreurs** : Middleware centralisé
- **Types stricts** : TypeScript pour la sécurité de type
- **Pattern Repository** : Abstraction de l'accès aux données
- **DTOs** : Validation et transformation des données

### 3. Plan de déploiement conceptuel

#### Étapes de déploiement :

1. **Préparation de l'environnement :**
   - Configuration des variables d'environnement de production
   - Mise en place de la base de données MySql
   - Configuration du serveur web (nginx/apache)

2. **Installation des dépendances :**
   - Installation de Node.js sur le serveur
   - Installation des packages npm pour backend et frontend

3. **Build et migrations :**
   - Build du frontend pour la production
   - Exécution des migrations Prisma
   - Génération des fichiers statiques

4. **Lancement de l'application :**
   - Démarrage du serveur backend
   - Configuration du reverse proxy
   - Mise en place du monitoring

#### Critères de succès :
- Application accessible via l'URL de production
- API répondant correctement aux requêtes de base
- Interface utilisateur fonctionnelle
- Authentification opérationnelle
- Base de données accessible et migrations appliquées

## Partie 6 – Exercice de cas d'utilisation et diagramme de classes

### 1. Diagramme de cas d'utilisation

#### Acteurs :
- **Utilisateur connecté** : Peut consulter les objets célestes
- **Administrateur** : Hérite des droits utilisateur + gestion complète
- **Système** : Validation et persistance des données

#### Cas d'utilisation pour la gestion d'objets célestes :
- **Consulter les objets célestes** (Utilisateur, Administrateur)
- **Afficher les détails d'un objet** (Utilisateur, Administrateur)
- **Ajouter un objet céleste** (Administrateur uniquement)
- **Modifier un objet céleste** (Administrateur uniquement)
- **Supprimer un objet céleste** (Administrateur uniquement)
- **Rechercher des objets** (Utilisateur, Administrateur)
- **Valider les données** (Système)
- **Gérer les catégories/systèmes** (Administrateur)

### 2. Diagramme de classes

#### Classes principales :

**CelestialObject :**
- Attributs : id, name, type, description, mass, radius, temperature, etc.
- Méthodes : validate(), toDto()

**User :**
- Attributs : id, firstName, lastName, email, roles, etc.
- Méthodes : hasRole(), isAdmin()

**Category :**
- Attributs : id, name, description
- Méthodes : validate()

**System :**
- Attributs : id, name, description
- Méthodes : validate()

**CelestialObjectService :**
- Méthodes : create(), update(), delete(), findAll(), findById()
- Utilise : CelestialObjectRepository, Validator

**CelestialObjectRepository :**
- Méthodes : save(), findById(), findAll(), delete()
- Utilise : Prisma ORM

**Validator :**
- Méthodes : validateCelestialObject(), validateUniqueName()
- Utilise : Zod schemas

**AuthService :**
- Méthodes : authenticate(), authorize()
- Utilise : JWT, User

#### Relations :
- CelestialObject **appartient à** Category (N:1)
- CelestialObject **appartient à** System (N:1)
- CelestialObjectService **utilise** CelestialObjectRepository (composition)
- CelestialObjectService **utilise** Validator (dépendance)
- User **a des** rôles (composition)
