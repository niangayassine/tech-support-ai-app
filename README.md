# tech-support-ai-app

Application d'assistance technologique alimentée par l'IA pour aider les utilisateurs à résoudre les problèmes technologiques dans le monde entier.

## Vue d'ensemble

`tech-support-ai-app` est un assistant technique intelligent conçu pour aider les utilisateurs à diagnostiquer et à résoudre des problèmes liés à :

- matériel informatique
- logiciels et système d'exploitation
- réseaux et connexion internet
- performances du système
- sécurité informatique
- débogage applicatif
- support technique général

L'application est pensée pour fonctionner localement, sans dépendre d'un accès internet permanent, avec une base de connaissances locale et un moteur d'IA compatible avec Ollama.

## Architecture

```text
tech-support-ai-app/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   └── chat.py
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   └── chat.py
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── kb_service.py
│   │   │   ├── rag_service.py
│   │   │   └── llm_service.py
│   │   └── utils/
│   │       └── __init__.py
│   ├── .env.example
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── Dockerfile
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       └── styles.css
├── kb/
│   ├── faq.json
│   ├── hardware.json
│   ├── network.json
│   ├── software.json
│   └── security.json
├── .dockerignore
├── .gitignore
├── docker-compose.yml
├── README.md
└── LICENSE
```

## Stack technique

- Backend : Python + FastAPI
- Frontend : React + Vite
- IA locale : Ollama
- Base de connaissances : JSON local
- Recherche : moteur RAG simple basé sur les mots-clés de la base de connaissance
- Déploiement : Docker Compose

## Démarrage rapide

### 1. Installer Ollama

Téléchargez Ollama puis lancez un modèle local :

```bash
ollama pull llama3.1
```

### 2. Lancer le backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Lancer le frontend

```bash
cd frontend
npm install
npm run dev -- --host 0.0.0.0
```

### 4. Ouvrir l'application

- Frontend : http://localhost:5173
- Backend : http://localhost:8000/docs

### 5. Option Docker

```bash
docker compose up --build
```

## Fonctionnalités principales

- chat avec assistant technique en français
- réponse structurée avec cause probable, vérification et solution
- moteur de connaissances local (FAQ / dépannage)
- support de problèmes techniques variés
- interface simple et accessible
- possibilité d'ajout de nouveaux cas de dépannage dans `kb/`

## Base de connaissances

Les fichiers suivants servent de base documentaire pour le moteur RAG :

- `kb/faq.json`
- `kb/hardware.json`
- `kb/network.json`
- `kb/software.json`
- `kb/security.json`

Chaque fichier contient des objets techniques structurés avec :
- titre
- problème
- solution
- mots-clés
- étapes de vérification

## Exemples de demandes supportées

- Mon ordinateur est lent
- Je n’ai plus de connexion internet
- Une application ne répond plus
- Mon PC chauffe trop
- Une erreur système s’affiche
- Je veux diagnostiquer un problème réseau
- J’ai un souci de sécurité ou de virus
- J’ai une panne logicielle ou un crash

## Prochaines améliorations

- diagnostic système détaillé (CPU, RAM, disque, réseau)
- intelligence renforcée avec meilleure gestion de contexte
- historique des conversations
- traitement de logs utilisateur
- support avancé pour sécurité, infra, cloud, et développement
- stockage vectoriel plus performant
- authentification utilisateur

## Licence

MIT
