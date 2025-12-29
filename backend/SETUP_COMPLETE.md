# ✅ Backend Urban Score - Configuration complète

## 📦 Ce qui a été fait

### 1. **Configuration du projet**

- ✅ `config.py` - Gestion centralisée de la configuration
- ✅ `.env` - Variables d'environnement (MongoDB URI, environnement, debug)
- ✅ `requirements.txt` - Dépendances Python

### 2. **Modèles de données** (`models/neighborhood.py`)

- ✅ `ScoreCategory` - Catégorie de score (transport, écoles, espaces verts, etc.)
- ✅ `Neighborhood` - Modèle principal pour un quartier
- ✅ `NeighborhoodCreate` - Schéma de création
- ✅ `NeighborhoodUpdate` - Schéma de mise à jour

### 3. **Connexion à MongoDB** (`database.py`)

- ✅ Connexion sécurisée avec gestion d'erreurs
- ✅ Vérification automatique de la connexion au démarrage
- ✅ Messages d'erreur clairs si MongoDB n'est pas accessible

### 4. **Services métier** (`services/score_calculator.py`)

- ✅ `calculate_global_score()` - Calcule le score moyen par catégorie
- ✅ `normalize_score()` - Normalise les valeurs sur une échelle 0-100

### 5. **Routes API** (`routes/neighborhood.py`)

```
GET    /api/neighborhoods              ✅ Lister tous les quartiers
GET    /api/neighborhoods/{id}         ✅ Détails d'un quartier
GET    /api/neighborhoods/borough/{name} ✅ Quartiers par arrondissement
POST   /api/neighborhoods              ✅ Créer un quartier
PUT    /api/neighborhoods/{id}         ✅ Mettre à jour
DELETE /api/neighborhoods/{id}         ✅ Supprimer
```

### 6. **Application FastAPI** (`main.py`)

- ✅ Configuration CORS correcte
- ✅ Inclusion de toutes les routes
- ✅ Endpoint health check
- ✅ Documentation Swagger/ReDoc

### 7. **Scripts utilitaires**

- ✅ `init_db.py` - Initialiser la BD avec 4 quartiers d'exemple
- ✅ `test_db.py` - Tester la connexion MongoDB
- ✅ `GUIDE.md` - Guide complet de démarrage

### 8. **Fichiers de configuration**

- ✅ `.gitignore` - Ignorer les fichiers non essentiels
- ✅ `__init__.py` - Initialisation des packages Python

## 🎯 Données d'exemple

4 quartiers de Montréal sont inclus :

1. **Le Plateau-Mont-Royal** - Score: 79.6/100
2. **Vieux-Montréal** - Score: 76/100
3. **Outremont** - Score: 82/100
4. **Griffintown** - Score: 76.4/100

Chaque quartier a des scores dans 5 catégories :

- Transport
- Écoles
- Espaces verts
- Commerces
- Sécurité

## 🚀 Démarrer immédiatement

### 1️⃣ Installer les dépendances

```bash
cd backend
pip install -r requirements.txt
```

### 2️⃣ Vérifier MongoDB

```bash
python -m app.test_db
```

### 3️⃣ Initialiser la BD

```bash
python -m app.init_db
```

### 4️⃣ Démarrer le serveur

```bash
uvicorn app.main:app --reload
```

### 5️⃣ Accéder à l'API

- **Swagger UI** : http://localhost:8000/docs
- **API** : http://localhost:8000/api/neighborhoods

## 📚 Architecture MongoDB

### Collection : `neighborhoods`

Exemple de document :

```json
{
  "_id": ObjectId("..."),
  "name": "Le Plateau-Mont-Royal",
  "borough": "Plateau-Mont-Royal",
  "population": 105000,
  "area_km2": 7.4,
  "median_income": 55000,
  "scores": [
    {
      "category": "transport",
      "score": 85,
      "description": "Excellent transport en commun"
    },
    ...
  ],
  "global_score": 79.6,
  "created_at": ISODate("2025-12-29T..."),
  "updated_at": ISODate("2025-12-29T...")
}
```

## 🔧 Stack technologique

- **Framework** : FastAPI (asynchrone)
- **ORM/Driver** : PyMongo (MongoDB)
- **Validation** : Pydantic v2
- **Serveur** : Uvicorn (ASGI)
- **Configuration** : Pydantic Settings + python-dotenv

## 📝 Points importants

### Validation des données

- Tous les modèles utilisent Pydantic pour la validation
- Les scores sont validés entre 0 et 100
- Les IDs MongoDB sont correctement convertis en string pour la sérialisation JSON

### Gestion d'erreurs

- Vérification de la connexion MongoDB au démarrage
- Messages d'erreur clairs et informatifs
- Codes HTTP corrects (404, 400, 500)

### Performance

- Indexation MongoDB recommandée sur `name`, `borough`
- Requêtes efficaces sans N+1
- Conversion ObjectId/String gérée correctement

## 🎓 Concepts clés pour commencer

### 1. FastAPI

- Décorateurs `@app.get()`, `@app.post()`, etc.
- Validation automatique avec Pydantic
- Documentation auto-générée

### 2. MongoDB

- Base de données NoSQL sans schéma
- Collections (équivalent tables)
- Documents (équivalent lignes)
- ObjectId pour les IDs uniques

### 3. Async/Await

- Les routes FastAPI utilisent `async`
- Meilleure performance avec beaucoup de requêtes

## 🚀 Prochaines étapes

1. **Ajouter les vraies données** de Montréal
2. **Implémenter les rankings** (tri par score)
3. **Ajouter des filtres** (par borough, population, etc.)
4. **Implémenter la comparaison** entre quartiers
5. **Ajouter les tests** unitaires
6. **Déployer** sur un serveur (Heroku, Railway, etc.)

## 📞 Aide

Consultez `GUIDE.md` pour les détails complets du démarrage et du dépannage.
