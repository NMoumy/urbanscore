# Configuration et Variables d'Environnement

## 📋 Table des matières

1. [Variables d'environnement](#variables-denvironnement)
2. [Configuration par environnement](#configuration-par-environnement)
3. [MongoDB Setup](#mongodb-setup)
4. [CORS Configuration](#cors-configuration)
5. [Fichier .env](#fichier-env)

---

## Variables d'environnement

### Les variables principales

```env
# MongoDB
MONGO_URI=mongodb://localhost:27017
DATABASE_NAME=urban_score

# FastAPI
ENVIRONMENT=development        # ou 'production'
DEBUG=True                      # ou 'False' en production

# Server
HOST=0.0.0.0
PORT=8000
```

---

## Configuration par environnement

### 🔧 Development (Local)

**Fichier** : `backend/app/config.py`

```python
if ENVIRONMENT == "production":
    ALLOWED_ORIGINS = [
        "https://urbanscore.vercel.app"
    ]
else:  # Development
    ALLOWED_ORIGINS = [
        "http://localhost:3000",
        "http://localhost:8000",
        "http://127.0.0.1:3000"
    ]
```

**Pourquoi ?** Le frontend Next.js développé localement tournera sur `localhost:3000`, donc il faut l'autoriser dans CORS.

### 🚀 Production

**Variables à mettre** :

```env
ENVIRONMENT=production
DEBUG=False
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/urban_score
```

**CORS sera** :

```python
ALLOWED_ORIGINS = [
    "https://urbanscore.vercel.app"  # URL du frontend déployé
]
```

---

## MongoDB Setup

### Installation locale (Windows)

#### Avec Docker (recommandé)

```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

#### Ou installation native

1. Télécharger MongoDB Community Edition
2. Installer et démarrer le service
3. Vérifier la connexion :

```bash
mongosh "mongodb://localhost:27017"
```

### Connexion MongoDB Atlas (Cloud)

Pour MongoDB Cloud (herbergement gratuit/payant) :

1. Créer un cluster sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Copier la URI de connexion
3. Remplacer les placeholders :

```
mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/DATABASE_NAME
```

4. Définir dans `.env` :

```env
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/urban_score
```

### Vérifier la connexion

```python
# Dans Python REPL
from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017")
db = client["urban_score"]
collections = db.list_collection_names()
print(collections)  # Doit lister les collections
```

---

## CORS Configuration

### Qu'est-ce que CORS ?

**Cross-Origin Resource Sharing** : Permet au frontend (domain A) d'accéder à l'API (domain B).

### Configuration dans FastAPI

**Fichier** : `backend/app/main.py`

```python
from fastapi.middleware.cors import CORSMiddleware
from app.config import ALLOWED_ORIGINS

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,      # Origines autorisées
    allow_credentials=True,              # Accepter les cookies
    allow_methods=["*"],                 # Tous les verbes HTTP
    allow_headers=["*"],                 # Tous les headers
)
```

### ⚠️ Attention en production

Ne JAMAIS faire :

```python
allow_origins=["*"]  # 🚫 Dangereux !
```

Toujours spécifier les origines exactes :

```python
allow_origins=[
    "https://urbanscore.vercel.app",
    "https://www.urbanscore.ca"
]
```

---

## Fichier .env

### Emplacement

```
backend/
  .env  ← À créer ici
  app/
  requirements.txt
```

### Contenu type (Development)

```env
# MongoDB
MONGO_URI=mongodb://localhost:27017
DATABASE_NAME=urban_score

# Application
ENVIRONMENT=development
DEBUG=True
```

### Contenu type (Production / Heroku)

```env
# Ces variables sont définies sur Heroku via Dashboard
# Config > Reveal Config Vars

MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/urban_score
DATABASE_NAME=urban_score
ENVIRONMENT=production
DEBUG=False
```

### ⚠️ Sécurité

- **Jamais** commit `.env` dans Git
- Ajouter `.env` au `.gitignore` ✅
- Les secrets (passwords) doivent être en variables d'environnement

---

## Chargement des variables

### Comment FastAPI charge les variables

**Fichier** : `backend/app/config.py`

```python
from pydantic_settings import BaseSettings
import os

class Settings(BaseSettings):
    mongo_uri: str = "mongodb://localhost:27017"  # Valeur par défaut
    database_name: str = "urban_score"
    environment: str = "development"
    debug: bool = True

    class Config:
        env_file = ".env"              # Charger depuis .env
        env_file_encoding = "utf-8"

settings = Settings()
```

**Ordre de chargement** (de plus haute à plus basse priorité) :

1. Variables d'environnement système
2. Fichier `.env`
3. Valeurs par défaut dans `Settings`

---

## Vérifier la configuration

### Script de test

```bash
# Créer un fichier test_config.py à la racine du projet

from app.config import settings

print(f"Environnement: {settings.environment}")
print(f"MongoDB: {settings.mongo_uri}")
print(f"Debug: {settings.debug}")
```

Exécuter :

```bash
cd backend
python test_config.py
```

---

## Configuration avancée

### Variables personnalisées supplémentaires

```python
# Dans config.py, ajouter :
class Settings(BaseSettings):
    # ... existantes ...

    # Nouvelles
    max_results_limit: int = 100       # Max résultats par requête
    cache_ttl: int = 3600              # Cache en secondes
    api_key: str = ""                  # API key si besoin

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
```

### Accéder depuis les routes

```python
from app.config import settings

@router.get("/")
async def get_rankings():
    if settings.environment == "production":
        # Comportement en production
        pass
    else:
        # Comportement en dev
        pass
```

---

## Déploiement (Heroku Example)

### Étapes

1. **Créer l'app Heroku**

```bash
heroku create urbanscore-api
```

2. **Ajouter les config vars**

```bash
heroku config:set MONGO_URI="mongodb+srv://..."
heroku config:set DATABASE_NAME="urban_score"
heroku config:set ENVIRONMENT="production"
heroku config:set DEBUG="False"
```

3. **Deploy**

```bash
git push heroku main
```

4. **Vérifier les logs**

```bash
heroku logs --tail
```

---

## 🆘 Dépannage courant

### "CORS error" au frontend

✅ Vérifier que l'URL du frontend est dans `ALLOWED_ORIGINS`

### "MongoDB connection refused"

✅ Vérifier que MongoDB tourne (`docker ps` ou vérifier le service)
✅ Vérifier la `MONGO_URI`

### "Pydantic settings not loading from .env"

✅ Vérifier que le fichier `.env` est dans le même dossier que `config.py`
✅ Vérifier l'encoding (UTF-8)

### Port 8000 déjà utilisé

```bash
# Tuer le process
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :8000
kill -9 <PID>
```

---

**Dernière mise à jour** : 8 janvier 2026
