# 🏙️ Urban Score Backend - Guide de démarrage

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Python 3.8+** ([Télécharger](https://www.python.org/downloads/))
- **MongoDB Community** ([Télécharger](https://www.mongodb.com/try/download/community))
- **pip** (inclus avec Python)

## 🚀 Installation

### 1. Installer les dépendances

```bash
# Naviguer dans le dossier backend
cd backend

# Installer les packages Python
pip install -r requirements.txt
```

### 2. Configurer MongoDB

#### Sur Windows :

**Option A : Utiliser MongoDB Community (Recommandé)**

1. Télécharger et installer [MongoDB Community](https://www.mongodb.com/try/download/community)
2. MongoDB démarre automatiquement en tant que service Windows
3. Par défaut, l'URI est `mongodb://localhost:27017`

**Option B : Utiliser Docker**

```bash
# Installer Docker Desktop si ce n'est pas fait
# Puis exécuter :
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 3. Vérifier la connexion

```bash
python -m app.test_db
```

Vous devriez voir ✅ Connecté à MongoDB avec succès!

### 4. Initialiser la base de données

```bash
python -m app.init_db
```

Cela insère des données d'exemple de quartiers de Montréal.

## ▶️ Démarrer le serveur

```bash
uvicorn app.main:app --reload
```

Le serveur démarre sur `http://localhost:8000`

### Points importants :

- **`--reload`** : Redémarre automatiquement le serveur lors de changements de code
- **Documentation interactive** : http://localhost:8000/docs (Swagger)
- **Documentation alternative** : http://localhost:8000/redoc

## 📚 Endpoints disponibles

### Quartiers (Neighborhoods)

```
GET    /api/neighborhoods              - Lister tous les quartiers
GET    /api/neighborhoods/{id}         - Récupérer un quartier
GET    /api/neighborhoods/borough/{name} - Quartiers d'un arrondissement
POST   /api/neighborhoods              - Créer un quartier
PUT    /api/neighborhoods/{id}         - Mettre à jour un quartier
DELETE /api/neighborhoods/{id}         - Supprimer un quartier
```

### Classements (Rankings)

```
GET    /api/rankings                   - Obtenir le classement (À compléter)
```

## 🧪 Tester l'API

### Avec l'interface Swagger (Recommandé)

1. Ouvrir http://localhost:8000/docs
2. Cliquer sur chaque endpoint pour tester

### Avec curl

```bash
# Lister tous les quartiers
curl http://localhost:8000/api/neighborhoods

# Créer un quartier
curl -X POST http://localhost:8000/api/neighborhoods \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Villeray",
    "borough": "Villeray-Saint-Michel-Parc-Extension",
    "population": 80000,
    "area_km2": 5.2,
    "scores": [
      {"category": "transport", "score": 80},
      {"category": "écoles", "score": 75}
    ]
  }'
```

## 🏗️ Structure du projet

```
backend/
├── app/
│   ├── models/              # Modèles Pydantic
│   │   └── neighborhood.py  # Schémas de données
│   ├── routes/              # Endpoints FastAPI
│   │   ├── neighborhood.py  # Routes CRUD
│   │   └── rankings.py      # Routes classements
│   ├── services/            # Logique métier
│   │   └── score_calculator.py
│   ├── config.py            # Configuration
│   ├── database.py          # Connexion MongoDB
│   ├── main.py              # Application FastAPI
│   ├── init_db.py           # Script d'initialisation
│   └── test_db.py           # Script de test
├── requirements.txt         # Dépendances Python
└── .env                     # Variables d'environnement
```

## 🔧 Commandes utiles

```bash
# Test de connexion
python -m app.test_db

# Initialiser la BD
python -m app.init_db

# Démarrer le serveur (mode développement)
uvicorn app.main:app --reload

# Démarrer le serveur (mode production)
uvicorn app.main:app --host 0.0.0.0 --port 8000

# Formater le code
pip install black
black app/

# Linter
pip install flake8
flake8 app/
```

## 📖 Documentation des modèles

### ScoreCategory

```json
{
  "category": "transport",
  "score": 85,
  "description": "Excellent transport en commun"
}
```

### Neighborhood

```json
{
  "name": "Le Plateau-Mont-Royal",
  "borough": "Plateau-Mont-Royal",
  "population": 105000,
  "area_km2": 7.4,
  "median_income": 55000,
  "scores": [...],
  "global_score": 79.6,
  "created_at": "2025-12-29T...",
  "updated_at": "2025-12-29T..."
}
```

## ⚠️ Dépannage

### "Impossible de se connecter à MongoDB"

- Vérifier que MongoDB est en cours d'exécution
- Vérifier l'URI dans `.env`
- Sur Windows, vérifier le service MongoDB dans Services

### "ModuleNotFoundError: No module named 'app'"

- S'assurer d'être dans le dossier `backend`
- Exécuter `pip install -r requirements.txt`

### "Port 8000 déjà utilisé"

```bash
# Utiliser un autre port
uvicorn app.main:app --reload --port 8001
```

## 🚀 Prochaines étapes

1. ✅ Implémenter le classement des quartiers
2. ✅ Ajouter les données réelles de Montréal
3. ✅ Implémenter les filtres avancés
4. ✅ Ajouter les tests unitaires
5. ✅ Déployer sur production

## 📞 Support

Pour toute question ou problème, consultez :

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [PyMongo Documentation](https://pymongo.readthedocs.io/)
