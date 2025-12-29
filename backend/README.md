# 🏙️ Urban Score - Backend FastAPI

## 📌 Overview

Ce backend contient l'API FastAPI pour Urban Score, une application qui classe et compare les quartiers de Montréal selon leur qualité de vie.

### Stack technologique :

- **FastAPI** - Framework web asynchrone
- **MongoDB** - Base de données NoSQL
- **PyMongo** - Driver MongoDB pour Python
- **Pydantic** - Validation des données

## 🚀 Démarrage rapide

### Installation

```bash
# 1. Installer les dépendances
pip install -r requirements.txt

# 2. Tester la connexion MongoDB
python -m app.test_db

# 3. Initialiser la base de données
python -m app.init_db

# 4. Démarrer le serveur
uvicorn app.main:app --reload
```

Le serveur démarre sur `http://localhost:8000`

### Documentation

- **Guide complet** : Voir [GUIDE.md](GUIDE.md)
- **Configuration** : Voir [SETUP_COMPLETE.md](SETUP_COMPLETE.md)
- **Documentation interactive** : http://localhost:8000/docs

## 📁 Structure du projet

```
backend/
├── app/
│   ├── models/              # Modèles Pydantic
│   │   └── neighborhood.py  # Schémas (Neighborhood, ScoreCategory)
│   ├── routes/              # Endpoints FastAPI
│   │   ├── neighborhood.py  # CRUD neighborhoods
│   │   └── rankings.py      # Rankings (en développement)
│   ├── services/            # Logique métier
│   │   └── score_calculator.py  # Calcul des scores
│   ├── config.py            # Configuration (Settings)
│   ├── database.py          # Connexion MongoDB
│   ├── main.py              # Application FastAPI
│   ├── init_db.py           # Script d'initialisation
│   ├── test_db.py           # Script de test connexion
│   └── __init__.py
├── requirements.txt
├── .env
├── .gitignore
├── GUIDE.md                 # Guide détaillé
└── SETUP_COMPLETE.md        # Résumé de la configuration

```

## 📚 API Endpoints

### Neighborhoods (Quartiers)

| Méthode | Endpoint                            | Description                   |
| ------- | ----------------------------------- | ----------------------------- |
| GET     | `/api/neighborhoods`                | Lister tous les quartiers     |
| POST    | `/api/neighborhoods`                | Créer un quartier             |
| GET     | `/api/neighborhoods/{id}`           | Détails d'un quartier         |
| PUT     | `/api/neighborhoods/{id}`           | Mettre à jour un quartier     |
| DELETE  | `/api/neighborhoods/{id}`           | Supprimer un quartier         |
| GET     | `/api/neighborhoods/borough/{name}` | Quartiers d'un arrondissement |

### Rankings (À compléter)

| Méthode | Endpoint        | Description              |
| ------- | --------------- | ------------------------ |
| GET     | `/api/rankings` | Classement des quartiers |

## 🧪 Testing

```bash
# Test de connexion MongoDB
python -m app.test_db

# Initialiser avec données d'exemple
python -m app.init_db

# Utiliser Swagger UI pour tester les endpoints
# Ouvrir : http://localhost:8000/docs
```

## 🔧 Configuration

Voir le fichier `.env` :

```env
MONGO_URI=mongodb://localhost:27017
DATABASE_NAME=urban_score
ENVIRONMENT=development
DEBUG=True
```

## 📊 Modèles de données

### Neighborhood (Quartier)

```json
{
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
  "created_at": "2025-12-29T...",
  "updated_at": "2025-12-29T..."
}
```

### ScoreCategory

```json
{
  "category": "transport",
  "score": 85,
  "description": "Description du score"
}
```

## 💡 Concepts clés

### FastAPI

- Routes asynchrones pour meilleures performances
- Validation automatique avec Pydantic
- Documentation Swagger/ReDoc auto-générée

### MongoDB

- Stockage flexible des données
- Requêtes JSON-like
- Scalabilité horizontale

### Validation

- Scores entre 0-100
- Conversion ObjectId ↔ String gérée
- Messages d'erreur explicites

## 🚀 Prochaines étapes

- [ ] Implémenter les rankings (tri par score)
- [ ] Ajouter les vraies données de Montréal
- [ ] Filtres avancés
- [ ] Tests unitaires
- [ ] Déploiement production
- [ ] Caching

## 📖 Ressources

- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [MongoDB Docs](https://docs.mongodb.com/)
- [PyMongo Docs](https://pymongo.readthedocs.io/)

## 👨‍💻 Développement

Pour plus de détails sur la configuration et le dépannage, consultez :

- **GUIDE.md** - Guide complet avec exemples curl
- **SETUP_COMPLETE.md** - Résumé de ce qui a été fait

---

**Status** : ✅ Configuration complète et fonctionnelle
