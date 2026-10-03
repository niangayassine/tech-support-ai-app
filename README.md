# WAZE - Assistant Technique Intelligent

**WAZE** est un assistant technique intelligent, hors ligne, conçu pour aider les utilisateurs à diagnostiquer et résoudre les problèmes technologiques avec une IA locale et une base de connaissances structurée.

## 🎯 Objectif

- Assistant technique local et hors ligne
- Diagnostic système complet
- Historique des conversations
- IA locale via Ollama
- Support technique multidiomaine
- Base de connaissances structurée

## ✨ Fonctionnalités

- ✅ Chat assistant technique en français
- ✅ Diagnostic système (CPU, RAM, disque, réseau, température)
- ✅ Historique des sessions et messages
- ✅ Moteur RAG (Retrieval Augmented Generation) local
- ✅ Détection automatique des problèmes critiques
- ✅ IA locale sans dépendance internet
- ✅ Interface web simple et moderne
- ✅ Support multidiomaine (matériel, réseau, sécurité, logiciels)

## 📦 Stack Technique

- **Backend** : Python + FastAPI
- **Frontend** : React + Vite
- **IA locale** : Ollama (Llama3.1, Mistral, Qwen)
- **Base de données** : SQLite
- **Base de connaissances** : JSON
- **Diagnostic système** : psutil
- **Déploiement** : Docker + Docker Compose

## 🚀 Démarrage Rapide

### Avec Docker Compose (Recommandé)

```bash
# Rendre les scripts exécutables
chmod +x start.sh stop.sh logs.sh

# Lancer WAZE
./start.sh

# Ouvrir dans le navigateur
# Frontend : http://localhost:5173
# Backend  : http://localhost:8000
# Ollama   : http://localhost:11434

# Voir les logs
./logs.sh

# Arrêter WAZE
./stop.sh
```

### Sans Docker (Manuel)

#### 1. Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### 2. Frontend

```bash
cd frontend
npm install
npm run dev -- --host 0.0.0.0
```

#### 3. Ollama

```bash
# Installer Ollama depuis https://ollama.ai
ollama pull llama3.1
# Ollama s'exécutera sur http://localhost:11434
```

## 📚 API Endpoints

### Chat

**POST** `/api/chat`

```json
{
  "message": "Mon PC est lent",
  "session_id": "optional-session-uuid"
}
```

Réponse :
```json
{
  "session_id": "uuid",
  "answer": "Cause probable : RAM élevée ou disque plein...\n\nÉtapes :\n1. ..."
}
```

### Diagnostic Système

**POST** `/api/diagnostic`

Retourne un diagnostic complet avec :
- Infos système
- Utilisation CPU/RAM/disque
- État du réseau
- Température
- Processus actifs
- Problèmes détectés

**GET** `/api/diagnostic/summary`

Résumé rapide du diagnostic.

### Santé

**GET** `/health`

```json
{
  "status": "ok",
  "service": "WAZE",
  "description": "Assistant Technique Intelligent"
}
```

## 🧠 Base de Connaissances

La base de connaissances est composée de fichiers JSON :

- `kb/faq.json` - Questions fréquentes
- `kb/hardware.json` - Problèmes matériels
- `kb/network.json` - Problèmes réseau
- `kb/software.json` - Problèmes logiciels
- `kb/security.json` - Sécurité et virus

Chaque entrée contient :
```json
{
  "title": "Titre du problème",
  "problem": "Description du problème",
  "solution": "Solution recommandée",
  "keywords": "mots-clés pour la recherche",
  "steps": ["étape 1", "étape 2", "..."]
}
```

## 💾 Base de Données

WAZE utilise SQLite pour stocker :
- **sessions** : sessions utilisateur
- **messages** : historique des conversations
- **diagnostics** : résultats des diagnostics

La base de données `waze.db` est créée automatiquement au démarrage.

## 🔧 Commandes Docker

```bash
# Voir le statut des conteneurs
docker-compose ps

# Voir les logs
docker-compose logs -f

# Redémarrer les conteneurs
docker-compose restart

# Reconstruire les images
docker-compose build

# Supprimer tout (attention!)
docker-compose down -v
```

## 📝 Exemples de Questions

- "Mon PC est très lent"
- "Je n'ai plus de connexion internet"
- "Une application ne répond plus"
- "Mon ordinateur chauffe"
- "J'ai un message d'erreur"
- "Comment diagnostiquer mon système?"
- "J'ai un souci de sécurité"

## 🎯 Structure du Projet

```text
WAZE/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── db/
│   │   ├── models/
│   │   ├── services/
│   │   └── main.py
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   ├── package.json
│   ├── vite.config.js
│   └── Dockerfile
├── kb/
│   ├── faq.json
│   ├── hardware.json
│   ├── network.json
│   ├── software.json
│   └── security.json
├── docker-compose.yml
├── start.sh
├── stop.sh
├── logs.sh
├── README.md
├── .env.example
└── .gitignore
```

## 🚢 Déploiement en Production

### Prérequis

- Docker et Docker Compose installés
- Port 8000 disponible (backend)
- Port 5173 disponible (frontend)
- Port 11434 disponible (Ollama)

### Déploiement

```bash
# Clone du repository
git clone https://github.com/niangayassine/tech-support-ai-app.git
cd tech-support-ai-app

# Lancement avec Docker Compose
docker-compose up -d

# Vérifier le statut
docker-compose ps
```

## 📈 Prochaines Améliorations

- [ ] Support multi-utilisateur avec authentification
- [ ] Stockage vectoriel avancé (FAISS, Chroma)
- [ ] Machine learning pour améliorer les réponses
- [ ] Support mobile (app React Native)
- [ ] Analytics et statistiques
- [ ] Support avancé pour sécurité, infra et cloud
- [ ] Intégration avec des outils externes
- [ ] Mode d'apprentissage pour enrichir la KB

## 🤝 Contribution

Les contributions sont bienvenues! N'hésitez pas à :
- Ajouter de nouveaux cas dans `kb/`
- Améliorer le moteur RAG
- Signaler des bugs
- Proposer des améliorations

## 📄 Licence

MIT

## 📞 Support

Pour toute question ou problème, ouvrez une issue sur le repository GitHub.

---

**WAZE v1.0** - Assistant Technique Intelligent pour Environnement Zéro-connexion
