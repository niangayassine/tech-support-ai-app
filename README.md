# Tech Support AI App - Backend

Une application d'assistance technologique alimentée par l'IA pour aider les utilisateurs à résoudre les problèmes technologiques dans le monde entier.

## 🚀 Fonctionnalités

- ✅ Authentification utilisateur (Inscription/Connexion)
- ✅ Gestion des tickets de support
- ✅ Conversations avec l'IA
- ✅ Historique des messages
- ✅ Gestion des profils utilisateur
- ✅ Base de données PostgreSQL
- ✅ API REST complète

## 📋 Prérequis

- Node.js (v14+)
- PostgreSQL (v12+)
- npm ou yarn

## 🔧 Installation

### 1. Cloner le repository

```bash
git clone https://github.com/niangayassine/tech-support-ai-app.git
cd tech-support-ai-app
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer les variables d'environnement

```bash
cp .env.example .env
```

Editer `.env` avec vos configurations :

```env
PORT=3000
NODE_ENV=development

# PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=tech_support_ai
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d

# OpenAI
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-3.5-turbo
```

### 4. Créer la base de données

```bash
# Connexion à PostgreSQL
psql -U postgres

# Créer la base de données
CREATE DATABASE tech_support_ai;
```

### 5. Exécuter les migrations

```bash
npm run migrate
```

### 6. Démarrer le serveur

```bash
# Mode développement
npm run dev

# Mode production
npm start
```

Le serveur démarre sur `http://localhost:3000`

## 📚 Documentation API

### Authentification

#### Inscription
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### Connexion
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

#### Vérifier Token
```http
GET /api/auth/verify
Authorization: Bearer <token>
```

### Tickets

#### Créer un ticket
```http
POST /api/tickets
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Problème de connexion",
  "description": "Je ne peux pas me connecter à mon compte",
  "category": "authentication",
  "priority": "high"
}
```

#### Récupérer tous les tickets
```http
GET /api/tickets?status=open&limit=20&offset=0
Authorization: Bearer <token>
```

#### Récupérer un ticket spécifique
```http
GET /api/tickets/:id
Authorization: Bearer <token>
```

#### Mettre à jour un ticket
```http
PUT /api/tickets/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Nouveau titre",
  "status": "in_progress",
  "priority": "medium"
}
```

#### Fermer un ticket
```http
POST /api/tickets/:id/close
Authorization: Bearer <token>
```

### Conversations et Messages

#### Créer une conversation
```http
POST /api/chat/conversations
Authorization: Bearer <token>
Content-Type: application/json

{
  "ticketId": 1,
  "title": "Support Conversation"
}
```

#### Envoyer un message
```http
POST /api/chat/conversations/:conversationId/messages
Authorization: Bearer <token>
Content-Type: application/json

{
  "message": "Comment puis-je résoudre ce problème?"
}
```

#### Récupérer les messages
```http
GET /api/chat/conversations/:conversationId/messages?limit=50&offset=0
Authorization: Bearer <token>
```

#### Récupérer toutes les conversations
```http
GET /api/chat/conversations?limit=20&offset=0
Authorization: Bearer <token>
```

### Profil Utilisateur

#### Récupérer le profil
```http
GET /api/users/profile
Authorization: Bearer <token>
```

#### Mettre à jour le profil
```http
PUT /api/users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Doe",
  "avatarUrl": "https://example.com/avatar.jpg"
}
```

#### Changer le mot de passe
```http
POST /api/users/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "OldPass123",
  "newPassword": "NewPass123"
}
```

## 📂 Structure du Projet

```
tech-support-ai-app/
├── src/
│   ├── config/
│   │   ├── db.js           # Configuration PostgreSQL
│   │   └── migrations.js    # Migrations de base de données
│   ├── routes/
│   │   ├── auth.js         # Routes d'authentification
│   │   ├── tickets.js      # Routes des tickets
│   │   ├── chat.js         # Routes des conversations
│   │   └── users.js        # Routes des profils utilisateur
│   ├── services/
│   │   └── aiService.js    # Service d'intégration IA
│   ├── utils/
│   │   ├── jwt.js          # Utilitaires JWT
│   │   └── validators.js   # Validateurs
│   └── server.js           # Point d'entrée principal
├── .env.example            # Template des variables d'environnement
├── .gitignore              # Fichiers ignorés par Git
├── package.json            # Dépendances du projet
└── README.md               # Ce fichier
```

## 🔐 Sécurité

- Mot de passe haché avec bcrypt
- Authentification JWT
- Validation des entrées
- Protection contre les injections SQL (requêtes paramétrées)
- CORS configuré

## 🧪 Tests

```bash
npm test
```

## 📝 Licence

MIT

## 👨‍💻 Auteur

Niangayassine

## 🤝 Contribution

Les contributions sont bienvenues ! Veuillez créer une pull request pour contribuer.

## 📞 Support

Pour toute question ou problème, veuillez créer une issue sur GitHub.

---

**Prochaines étapes :**
- Ajouter l'authentification OAuth
- Développer le frontend React
- Déployer sur AWS/Heroku
- Ajouter des tests unitaires
- Intégrer Stripe pour la monétisation
