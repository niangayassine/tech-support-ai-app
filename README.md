# tech-support-ai-app

Application d'assistance technologique alimentée par l'IA pour aider les utilisateurs à résoudre les problèmes technologiques.

## Structure du projet

```text
tech-support-ai-app/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   └── chat.py
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── kb_service.py
│   │   │   ├── rag_service.py
│   │   │   └── llm_service.py
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   └── chat.py
│   │   └── utils/
│   │       └── __init__.py
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       └── styles.css
├── kb/
│   ├── faq.json
│   ├── hardware.json
│   ├── network.json
│   └── software.json
├── docker-compose.yml
├── .gitignore
├── README.md
└── LICENSE
```

## Stack technique

- Backend : Python + FastAPI
- IA locale : Ollama
- RAG : recherche locale dans une base de connaissance JSON
- Frontend : React + Vite
- Déploiement : Docker Compose

## Démarrage rapide

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # ou .venv\Scripts\activate sous Windows
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

Assurez-vous qu'Ollama est installé et qu'un modèle est disponible, par exemple :

```bash
ollama pull llama3.1
```

## Première version

Cette première version propose :
- un assistant technique avec IA locale
- un moteur RAG basé sur des connaissances locales
- une API REST pour l'échange de messages
- une interface frontend simple

## À venir

- diagnostic système avancé
- logs et analyse réseau
- support multi-domaine
- historique des conversations
- auth utilisateur
- base vectorielle plus avancée
