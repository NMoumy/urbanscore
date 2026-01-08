# Guide Complet - UrbanScore API Backend

## 📋 Table des matières

1. [Architecture générale](#architecture-générale)
2. [Structure des fichiers](#structure-des-fichiers)
3. [Comment les fichiers marchent ensemble](#comment-les-fichiers-marchent-ensemble)
4. [Les endpoints API](#les-endpoints-api)
5. [Système de scoring](#système-de-scoring)
6. [Flux de données](#flux-de-données)
7. [Ajout de nouvelles fonctionnalités](#ajout-de-nouvelles-fonctionnalités)

---

## Architecture générale

Le backend UrbanScore est construit avec **FastAPI**, un framework web moderne et performant pour Python. L'architecture suit le pattern **MVC** (Model-View-Controller) avec une couche de services pour la logique métier.

```
┌─────────────────────────────────────────────┐
│          CLIENT (Frontend Next.js)          │
└────────────────────┬────────────────────────┘
                     │ HTTP/JSON
                     ▼
┌─────────────────────────────────────────────┐
│         FastAPI Application (main.py)       │
└────────────────────┬────────────────────────┘
                     │
        ┌────────────┼────────────┐
        ▼            ▼            ▼
   ┌────────┐  ┌──────────┐ ┌──────────┐
   │ Routes │  │ Services │ │ Database │
   │        │  │          │ │(MongoDB) │
   └────────┘  └──────────┘ └──────────┘
        │            │            │
        └────────────┼────────────┘
                     ▼
            ┌─────────────────┐
            │     Models      │
            │ (Pydantic)      │
            └─────────────────┘
```

---

## Structure des fichiers

```
backend/
├── app/
│   ├── __init__.py                 # Package principal
│   ├── main.py                     # Application FastAPI (entrée)
│   ├── config.py                   # Configuration (BD, CORS)
│   ├── database.py                 # Connexion MongoDB
│   │
│   ├── models/
│   │   ├── __init__.py
│   │   └── borough.py              # Modèles Pydantic (validations)
│   │
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── borough.py              # Endpoints CRUD arrondissements
│   │   └── rankings.py             # Endpoints classement/tri
│   │
│   └── services/
│       ├── __init__.py
│       └── score_calculator.py     # Logique de calcul des scores
│
├── requirements.txt                # Dépendances Python
└── Procfile                        # Configuration Heroku
```

### Rôle de chaque dossier

| Dossier       | Rôle                                           | Exemples                            |
| ------------- | ---------------------------------------------- | ----------------------------------- |
| `models/`     | Définit la structure des données avec Pydantic | `Borough`, `Statistics`, `Scores`   |
| `routes/`     | Endpoints HTTP qui reçoivent les requêtes      | GET `/rankings/`, POST `/boroughs/` |
| `services/`   | Logique métier réutilisable                    | Calcul des scores                   |
| Racine `app/` | Configuration et initialisation                | MongoDB, CORS                       |

---

## Comment les fichiers marchent ensemble

### 1️⃣ Flux d'une requête GET /rankings/

```
1. Client fait : GET /rankings/?profile=famille&sort_by=global_score
   │
2. FastAPI route (rankings.py) reçoit et valide les paramètres
   │
3. Récupère les données de MongoDB via database.py
   │
4. Pour chaque arrondissement, appelle calculate_scores_by_profile()
   ├─→ score_calculator.py calcule tous les scores
   └─→ Applique les pondérations du profil "famille"
   │
5. Trie les résultats par global_score
   │
6. Retourne en JSON validé par le modèle Borough
   │
7. Client reçoit les données structurées
```

### 2️⃣ Imbrication des modèles (borough.py)

```python
class Borough(BaseModel):
    name: str                    # Nom de l'arrondissement
    statistics: Statistics       # ✅ Imbriquée
    attractions: Attractions     # ✅ Imbriquée
    scores: Scores              # ✅ Imbriquée
    created_at: datetime
    updated_at: datetime

class Statistics(BaseModel):
    population: Optional[int]
    median_property_value: Optional[float]
    # ...

class Attractions(BaseModel):
    metro_stations: Optional[int]
    parks: Optional[int]
    # ...

class Scores(BaseModel):
    global_score: float
    transport: float
    leisure: float
    # ...
```

**Avantage** : Une seule requête retourne toutes les données imbriquées et structurées.

### 3️⃣ Architecture en couches

```
┌─────────────────────────────────────────┐
│   Route Handler (rankings.py)           │  ← Reçoit requête HTTP
│   - Valide paramètres                   │
│   - Appelle la logique métier           │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│   Service Layer (score_calculator.py)   │  ← Logique réutilisable
│   - calculate_scores_by_profile()       │
│   - calculate_transport_score()         │
│   - calculate_all_scores()              │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│   Data Access (database.py)             │  ← Requêtes MongoDB
│   - boroughs_collection.find()          │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│   Models (borough.py)                   │  ← Validation & structure
│   - Pydantic validation                 │
│   - JSON serialization                  │
└─────────────────────────────────────────┘
```

**Bénéfices** :

- 🔄 **Réutilisabilité** : Services utilisables par plusieurs routes
- 🧪 **Testabilité** : Chaque couche peut être testée indépendamment
- 🛡️ **Validation** : Pydantic valide automatiquement les données
- 📦 **Maintenabilité** : Séparation claire des responsabilités

---

## Les endpoints API

### 🏘️ Borough (Arrondissements)

#### GET `/api/boroughs/`

**Récupère tous les arrondissements**

```bash
curl http://localhost:8000/api/boroughs/
```

**Réponse** :

```json
[
  {
    "name": "Le Plateau-Mont-Royal",
    "statistics": {...},
    "attractions": {...},
    "scores": null,
    "created_at": "2025-12-29T...",
    "updated_at": "2025-12-29T..."
  }
]
```

#### POST `/api/boroughs/`

**Crée un nouvel arrondissement**

```bash
curl -X POST http://localhost:8000/api/boroughs/ \
  -H "Content-Type: application/json" \
  -d '{"name": "Villeray", "statistics": {...}, "attractions": {...}}'
```

#### PUT `/api/boroughs/{id}`

**Met à jour un arrondissement**

#### DELETE `/api/boroughs/{id}`

**Supprime un arrondissement**

---

### 📊 Rankings (Classements)

#### GET `/api/rankings/`

**Récupère le classement avec tri et filtres**

**Paramètres** :

| Paramètre        | Type   | Défaut         | Description                                                       |
| ---------------- | ------ | -------------- | ----------------------------------------------------------------- |
| `sort_by`        | string | `global_score` | Champ de tri (voir options)                                       |
| `order`          | string | `desc`         | `asc` ou `desc`                                                   |
| `limit`          | int    | `10`           | Nombre de résultats (max 100)                                     |
| `offset`         | int    | `0`            | Pagination                                                        |
| `profile`        | string | `general`      | `general`, `famille`, `etudiant`, `personne_agee`, `petit_budget` |
| `min_population` | int    | null           | Filtre population min                                             |
| `max_population` | int    | null           | Filtre population max                                             |
| `min_income`     | int    | null           | Filtre revenu médian min                                          |

**Exemples** :

```bash
# Classement par score pour les familles
curl "http://localhost:8000/api/rankings/?profile=famille&sort_by=global_score&order=desc"

# Classement par transport, max 20 résultats
curl "http://localhost:8000/api/rankings/?sort_by=population&limit=20"

# Arrondissements abordables pour petits budgets
curl "http://localhost:8000/api/rankings/?profile=petit_budget&min_population=50000&max_population=150000"
```

---

## Système de scoring

### 📐 Calcul des scores détaillés

Chaque arrondissement reçoit **5 scores détaillés** (0-100) :

#### 🚇 Transport (score_calculator.py)

```python
def calculate_transport_score(borough):
    metro = attrs.get("metro_stations", 0)
    score = min((metro / 12) * 100, 100)
    # 12+ stations = 100pts
    # 0 station = 0pts
```

#### 🎪 Loisirs

```python
# Pondération:
# - Parcs: 40%
# - Espaces verts: 35%
# - Complexes sportifs: 25%
leisure_score = (parks/50)*40 + (green_spaces/100)*35 + (sports/2)*25
```

#### 💼 Services

```python
# Pondération:
# - Bibliothèques: 60%
# - Piscines: 40%
services_score = (libraries/5)*60 + (pools/7)*40
```

#### 💰 Budget

```python
# Inversement proportionnel à la valeur immobilière
# 250k$ = 100pts, 850k$ = 0pts
budget_score = 100 - ((price - 250000) / 600000 * 100)
```

#### 🛡️ Sécurité

```python
# Basé sur revenu médian (proxy temporaire)
# 30k$ = 0pts, 95k$ = 100pts
security_score = ((income - 30000) / 65000) * 100
```

### 📊 Score global par profil

Le **score global** est une **moyenne pondérée** selon le profil :

```python
def calculate_scores_by_profile(borough, profile="general"):
    scores = {
        "general": {        # Usage par défaut
            "transport": 0.30,
            "leisure": 0.25,
            "budget": 0.20,
            "services": 0.15,
            "security": 0.10
        },
        "famille": {        # Priorité aux services
            "transport": 0.20,
            "leisure": 0.25,
            "budget": 0.15,
            "services": 0.25,  # ⬆️ Important (écoles)
            "security": 0.15   # ⬆️ Important
        },
        "etudiant": {       # Priorité au budget & transport
            "transport": 0.35,  # ⬆️ Très important
            "leisure": 0.15,
            "budget": 0.35,     # ⬆️ Très important
            "services": 0.10,
            "security": 0.05
        },
        "personne_agee": {  # Équilibre entre transport et services
            "transport": 0.30,
            "leisure": 0.15,
            "budget": 0.20,
            "services": 0.25,   # ⬆️ Services de santé
            "security": 0.10
        },
        "petit_budget": {   # Priorité absolue au budget
            "transport": 0.25,
            "leisure": 0.10,
            "budget": 0.50,     # ⬆️⬆️⬆️ PRIORITÉ
            "services": 0.10,
            "security": 0.05
        }
    }

    global_score = (
        transport * weights["transport"] +
        leisure * weights["leisure"] +
        budget * weights["budget"] +
        services * weights["services"] +
        security * weights["security"]
    )
    return round(global_score, 2)
```

---

## Flux de données

### 📥 Entrant : MongoDB → FastAPI

```
MongoDB (boroughs collection)
    │
    ├─ name: "Le Plateau"
    ├─ statistics:
    │  ├─ population: 104000
    │  ├─ median_property_value: 737200
    │  └─ median_household_income: 47816
    ├─ attractions:
    │  ├─ metro_stations: 1
    │  ├─ parks: 46
    │  ├─ libraries: 2
    │  └─ pools: 6
    │
    ▼
database.py (boroughs_collection.find())
    │
    ▼
rankings.py (endpoint)
    │
    ├─→ score_calculator.py (calcul des 5 scores)
    │   ├─ transport_score: 8.33 (1 station ≈ 8%)
    │   ├─ leisure_score: 28.5 (parcs + espaces verts)
    │   ├─ services_score: 36.0 (bibliothèques + piscines)
    │   ├─ budget_score: 77.0 (737k$ est cher)
    │   └─ security_score: 72.3 (revenu décent)
    │
    ├─→ Pondération par profil (ex: famille)
    │   global_score = 8.33*0.20 + 28.5*0.25 + 36.0*0.25 + 77.0*0.15 + 72.3*0.15
    │              = 1.67 + 7.13 + 9.0 + 11.55 + 10.85 = 40.2
    │
    ▼
borough.py (Modèle Pydantic)
    │
    └─ Valide et sérialise en JSON
    │
    ▼
Client (JSON)
```

### 📤 Sortant : FastAPI → Client

```json
{
  "name": "Le Plateau-Mont-Royal",
  "statistics": {
    "population": 104000,
    "median_property_value": 737200,
    "median_household_income": 47816,
    "density_per_km2": 12840,
    "area_km2": 8.1
  },
  "attractions": {
    "metro_stations": 1,
    "parks": 46,
    "libraries": 2,
    "pools": 6,
    "green_spaces": 37,
    "sports_complexes": null
  },
  "scores": {
    "global_score": 40.2,
    "transport": 8.33,
    "leisure": 28.5,
    "services": 36.0,
    "budget": 77.0,
    "security": 72.3
  },
  "created_at": "2025-12-29T10:30:00Z",
  "updated_at": "2025-12-29T10:30:00Z"
}
```

---

## Ajout de nouvelles fonctionnalités

### ✅ Exemple 1 : Ajouter un nouveau score (ex: "Environnement")

**Étape 1** : Mettre à jour `models/borough.py`

```python
class Scores(BaseModel):
    global_score: Optional[float] = None
    transport: Optional[float] = None
    leisure: Optional[float] = None
    services: Optional[float] = None
    budget: Optional[float] = None
    security: Optional[float] = None
    environment: Optional[float] = None  # ✅ Nouveau
```

**Étape 2** : Ajouter la fonction dans `services/score_calculator.py`

```python
def calculate_environment_score(borough):
    """Calcule le score d'environnement"""
    attrs = borough.get("attractions", {})
    green_spaces = attrs.get("green_spaces", 0) or 0
    parks = attrs.get("parks", 0) or 0
    # Logique...
    return round(score, 2)
```

**Étape 3** : Mettre à jour `calculate_all_scores()`

```python
def calculate_all_scores(borough):
    environment = calculate_environment_score(borough)  # ✅ Nouveau
    global_score = (
        transport * 0.30 +
        leisure * 0.25 +
        budget * 0.20 +
        services * 0.15 +
        security * 0.10
        # environment ne compte pas dans global_score par défaut
    )
    return {
        ...,
        "environment": environment
    }
```

### ✅ Exemple 2 : Ajouter un nouveau filtre

**Dans `routes/rankings.py`** :

```python
@router.get("/")
async def get_borough_rankings(
    ...,
    min_metro_stations: Optional[int] = Query(
        default=None,
        description="Nombre minimum de stations de métro"
    )
):
    # Construction du filtre
    if min_metro_stations is not None:
        query_filter["attractions.metro_stations"] = {"$gte": min_metro_stations}
```

### ✅ Exemple 3 : Ajouter un nouveau profil

**Dans `services/score_calculator.py`** :

```python
weights = {
    ...,
    "chercheur_emploi": {  # ✅ Nouveau profil
        "transport": 0.40,   # Très important
        "leisure": 0.10,
        "budget": 0.30,      # Important
        "services": 0.15,    # Clubs, centres
        "security": 0.05
    }
}
```

---

## Guides supplémentaires

- [📱 Comment intégrer les endpoints dans le frontend](./FRONTEND_INTEGRATION.md)
- [🔧 Configuration et variables d'environnement](./CONFIGURATION.md)
- [🧪 Testing et débogage](./TESTING.md)
- [📈 Déploiement en production](./DEPLOYMENT.md)

---

## 🚀 Quick Start

```bash
# 1. Installer les dépendances
cd backend
pip install -r requirements.txt

# 2. Configurer MongoDB
export MONGO_URI=mongodb://localhost:27017
export DATABASE_NAME=urban_score

# 3. Démarrer le serveur
uvicorn app.main:app --reload

# 4. Accéder à la documentation interactive
# http://localhost:8000/docs
```

---

## 📚 Ressources

- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [Pydantic Docs](https://docs.pydantic.dev/)
- [MongoDB Docs](https://docs.mongodb.com/)
- [PyMongo Docs](https://pymongo.readthedocs.io/)

---

**Dernière mise à jour** : 8 janvier 2026
