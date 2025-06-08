# PlanèteXplorer - Application de gestion d'objets célestes

Une application web complète pour la gestion et la consultation d'objets célestes (planètes, étoiles, lunes, etc.) avec système d'authentification et d'autorisation.

## 📋 Conception et Documentation

- **Conception détaillée** : Consultez le fichier `CONCEPTION.md` qui contient toutes les réponses aux questions du TP (architecture, modélisation, endpoints, etc.)
- **Screenshots** : Le dossier `PNG/` contient des captures d'écran de l'application en fonctionnement
- **Documentation API** : Accessible sur `http://localhost:8000/api` une fois l'application lancée

## 🚀 Installation et Démarrage

### Prérequis

- Docker et Docker Compose
- Node.js (version 18+)
- PNPM (`npm install -g pnpm`)

### Installation

1. **Cloner le repository**
```bash
git clone <repository-url>
cd planeteXplorer
```

2. **Installer les dépendances**
```bash
pnpm install
```

3. **Configurer les variables d'environnement**
   
   Créer un fichier `.env` dans le dossier `backend/` avec :
```env
DATABASE_URL="mysql://root:password@localhost:3306/planete_explorer"
JWT_SECRET="your-secret-key"
NODE_ENV="development"
```

   Créer un fichier `.env` dans le dossier `frontend/` si nécessaire.

4. **Générer le schéma Prisma**
```bash
cd backend
pnpm run prisma:generate
```

5. **Lancer les services Docker**
```bash
docker compose -f docker-compose.yaml up -d
```

   Cela lance :
   - MySQL : `localhost:3306`
   - PHPMyAdmin : `http://localhost:8080`
   - Loki : `http://localhost:3100`
   - Grafana : `http://localhost:3001`

6. **Configurer la base de données**
```bash
cd backend
pnpm run prisma:migrate
pnpm run prisma:seed
```

7. **Lancer l'application**

   **Backend** (dans un terminal) :
```bash
cd backend
pnpm run dev
```
   L'API sera accessible sur `http://localhost:8000`

   **Frontend** (dans un autre terminal) :
```bash
cd frontend
pnpm run dev
```
   L'interface sera accessible sur `http://localhost:5173`

## 🔐 Comptes de Test

Une fois les fixtures chargées, vous pouvez vous connecter avec :

### Administrateur
- **Email** : `admin@app.com`
- **Mot de passe** : `adminPassword`
- **Permissions** : Consultation + Création/Modification/Suppression de tous les objets

### Utilisateur Standard
- **Email** : `contact@app.com`
- **Mot de passe** : `adminPassword`
- **Permissions** : Consultation uniquement

## 🏗️ Structure du Projet

```
planeteXplorer/
├── backend/           # Serveur Fastify (API REST)
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── transformers/
│   └── prisma/        # Schéma et migrations
├── frontend/          # Application React
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── api/
│       └── hooks/
├── shared/            # Types et DTOs partagés
├── PNG/               # Screenshots de l'application
└── CONCEPTION.md      # Documentation détaillée du projet
```

## 🌟 Fonctionnalités

- **Gestion d'objets célestes** : Création, modification, suppression, consultation
- **Catégories et systèmes** : Organisation des objets par catégorie et système stellaire
- **Authentification JWT** : Système de connexion sécurisé
- **Autorisation par rôles** : Différenciation utilisateur/administrateur
- **Interface responsive** : Design moderne avec React
- **API REST complète** : Documentation Swagger incluse
- **Base de données relationnelle** : MySQL avec Prisma ORM

## 🔗 URLs Importantes

- **Application** : `http://localhost:5173`
- **API Backend** : `http://localhost:8000`
- **Documentation API** : `http://localhost:8000/api`
- **PHPMyAdmin** : `http://localhost:8080`

## 🛠️ Commandes Utiles

```bash
# Générer et migrer la base de données
cd backend && pnpm run prisma:all

# Redémarrer complètement la base de données
cd backend && pnpm run prisma:reset

# Voir les logs Docker
docker compose -f docker-compose.yaml logs -f

# Arrêter les services Docker
docker compose -f docker-compose.yaml down
```

## 📖 Documentation

Pour une compréhension complète du projet, consultez :
- `CONCEPTION.md` : Architecture, modélisation, endpoints, flux de données
- `PNG/` : Screenshots de l'interface utilisateur
- Documentation API Swagger : `http://localhost:8000/api`