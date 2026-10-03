# tech-support-ai-app

Application d'assistance technologique alimentée par l'IA pour aider les utilisateurs à résoudre les problèmes technologiques.

## Objectif

Créer un assistant technique local capable d'aider les utilisateurs à diagnostiquer et à résoudre des problèmes liés à :
- matériel informatique
- logiciels et système d'exploitation
- réseau et connexion internet
- sécurité informatique
- performances et maintenance
- debug de code et résolution de problèmes techniques

## Stack technique

- Backend : Python + FastAPI
- Frontend : React + Vite
- IA locale : Ollama
- Base de connaissances : fichiers JSON structurés
- RAG : recherche locale sur la base de connaissances
- Déploiement : Docker Compose

## Architecture proposée

```text
tech-support-ai-app/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── models/
│   │   ├── services/
│   │   ├── __init__.py
│   │   └── main.py
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
├── kb/
│   ├── faq.json
│   ├── network.json
│   ├── software.json
│   └── hardware.json
├── docker-compose.yml
├── .gitignore
├── README.md
└── LICENSE
```

## Démarrage rapide

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Ollama

```bash
ollama pull llama3.1
```

## Fonctionnalités de la MVP

- assistant technique en français
- chat avec contexte technique
- moteur de recherche local (RAG)
- base de connaissances dans des fichiers JSON
- interface web simple
- réponses structurées : cause probable, vérification, solution

## Prochaines améliorations

- diagnostic système avancé
- intégration d'un moteur IA plus avancé
- historique des conversations
- support réseau, sécurité et dev
- auth utilisateur
- base vectorielle plus robuste

## Licence

MIT
