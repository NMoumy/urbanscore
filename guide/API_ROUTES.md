# Guide des Routes FastAPI

## 📋 Table des matières

1. [Structure générale](#structure-générale)
2. [Routes Borough (CRUD)](#routes-borough-crud)
3. [Routes Rankings](#routes-rankings)
4. [Codes de réponse HTTP](#codes-de-réponse-http)
5. [Format JSON](#format-json)
6. [Exemples cURL](#exemples-curl)
7. [Intégration Frontend](#intégration-frontend)

---

## Structure générale

### Tous les endpoints

```
API Base: http://localhost:8000/api

/api/boroughs/           ← Gestion des arrondissements (CRUD)
/api/rankings/           ← Classements et tri
/docs                    ← Documentation Swagger (interactive)
/redoc                   ← Documentation ReDoc
```

### Hiérarchie des fichiers

```
app/
├── main.py
│   └─ Inclut les routers
│      ├── /api/boroughs → app/routes/borough.py
│      └── /api/rankings → app/routes/rankings.py
│
├── routes/
│   ├── borough.py        ← CRUD + gestion
│   └── rankings.py       ← Tri + classement
│
└── models/
    └── borough.py        ← Validation Pydantic
```

---

## Routes Borough (CRUD)

### 📌 GET `/api/boroughs/`

**Récupère la liste de TOUS les arrondissements sans tri avancé**

```http
GET /api/boroughs/ HTTP/1.1
Host: localhost:8000
```

**Paramètres** : Aucun

**Réponse** (200 OK) :

```json
[
  {
    "name": "Ahuntsic-Cartierville",
    "statistics": {
      "area_km2": 24.0,
      "population": 135336,
      "density_per_km2": 5639,
      "median_property_value": 424720,
      "median_household_income": null
    },
    "attractions": {
      "green_spaces": 118,
      "parks": 77,
      "libraries": 3,
      "pools": 6,
      "metro_stations": 3,
      "sports_complexes": 1
    },
    "scores": null,
    "date_consultation": null,
    "created_at": "2025-12-29T10:30:00Z",
    "updated_at": "2025-12-29T10:30:00Z"
  },
  ...
]
```

**Utilité** : Liste brute sans traitement des scores. Utile pour affichages simples.

---

### 📌 GET `/api/boroughs/{borough_id}`

**Récupère un arrondissement spécifique par son ID**

```http
GET /api/boroughs/507f1f77bcf86cd799439011 HTTP/1.1
Host: localhost:8000
```

**Paramètres** :

- `borough_id` (path) : ID MongoDB (ObjectId)

**Réponse** (200 OK) :

```json
{
  "name": "Ahuntsic-Cartierville",
  "statistics": {...},
  "attractions": {...},
  "scores": null,
  "created_at": "2025-12-29T10:30:00Z",
  "updated_at": "2025-12-29T10:30:00Z"
}
```

**Erreurs** :

- `404 Not Found` : ID inexistant
- `400 Bad Request` : ID invalide

---

### 📌 POST `/api/boroughs/`

**Crée un nouvel arrondissement**

```http
POST /api/boroughs/ HTTP/1.1
Host: localhost:8000
Content-Type: application/json

{
  "name": "Nouveau Quartier",
  "statistics": {
    "area_km2": 15.5,
    "population": 80000,
    "density_per_km2": 5000,
    "median_property_value": 450000,
    "median_household_income": 55000
  },
  "attractions": {
    "green_spaces": 50,
    "parks": 30,
    "libraries": 2,
    "pools": 4,
    "metro_stations": 5,
    "sports_complexes": 1
  },
  "date_consultation": "2025-12-29"
}
```

**Paramètres** : Corps JSON validé par `BoroughCreate`

**Réponse** (201 Created) :

```json
{
  "id": "507f1f77bcf86cd799439011",
  "message": "Arrondissement créé avec succès"
}
```

**Erreurs** :

- `422 Unprocessable Entity` : Champs manquants ou invalides

---

### 📌 PUT `/api/boroughs/{borough_id}`

**Met à jour un arrondissement**

```http
PUT /api/boroughs/507f1f77bcf86cd799439011 HTTP/1.1
Host: localhost:8000
Content-Type: application/json

{
  "name": "Ahuntsic-Cartierville (Updated)",
  "statistics": {
    "population": 140000
  }
}
```

**Paramètres** :

- `borough_id` (path)
- Corps JSON avec champs à mettre à jour (tous optionnels)

**Réponse** (200 OK) :

```json
{
  "message": "Arrondissement mis à jour avec succès"
}
```

**Notes** :

- Les champs `null` ne sont pas mis à jour
- Seuls les champs fournis sont modifiés

---

### 📌 DELETE `/api/boroughs/{borough_id}`

**Supprime un arrondissement**

```http
DELETE /api/boroughs/507f1f77bcf86cd799439011 HTTP/1.1
Host: localhost:8000
```

**Paramètres** :

- `borough_id` (path)

**Réponse** (200 OK) :

```json
{
  "message": "Arrondissement supprimé avec succès"
}
```

**Erreurs** :

- `404 Not Found` : ID inexistant

---

## Routes Rankings

### 📊 GET `/api/rankings/`

**Récupère le classement avec tri, filtres et profil utilisateur**

Cette route est la plus puissante et la plus utilisée.

```http
GET /api/rankings/?profile=famille&sort_by=global_score&limit=10 HTTP/1.1
Host: localhost:8000
```

#### Paramètres Query

| Paramètre        | Type   | Défaut         | Description                 |
| ---------------- | ------ | -------------- | --------------------------- |
| `sort_by`        | string | `global_score` | Champ de tri                |
| `order`          | string | `desc`         | `asc` ou `desc`             |
| `limit`          | int    | `10`           | Nombre de résultats (1-100) |
| `offset`         | int    | `0`            | Pagination                  |
| `profile`        | string | `general`      | Profil d'utilisateur        |
| `min_population` | int    | null           | Population minimale         |
| `max_population` | int    | null           | Population maximale         |
| `min_income`     | int    | null           | Revenu médian minimum       |

#### Options de `sort_by`

```
"global_score"          ← Recommandé
"population"
"density_per_km2"
"median_property_value"
"median_household_income"
"area_km2"
"name"
```

#### Options de `profile`

```
"general"               ← Défaut, équilibré
"famille"               ← Services & sécurité
"etudiant"              ← Budget & transport
"personne_agee"         ← Services & transport
"petit_budget"          ← Budget maximal
```

### Exemple 1 : Classement pour une famille

```http
GET /api/rankings/?profile=famille&sort_by=global_score&order=desc&limit=5 HTTP/1.1
```

**Réponse** (200 OK) :

```json
[
  {
    "name": "Rosemont–La Petite-Patrie",
    "statistics": {...},
    "attractions": {...},
    "scores": {
      "global_score": 68.42,
      "transport": 75.0,
      "leisure": 82.5,
      "services": 84.0,      ← Haut (écoles)
      "budget": 65.0,
      "security": 72.0       ← Haut (sécurité)
    }
  },
  {
    "name": "Villeray–Saint-Michel–Parc-Extension",
    "scores": {
      "global_score": 65.18,
      ...
    }
  },
  ...
]
```

### Exemple 2 : Classement pour étudiant avec budget limité

```http
GET /api/rankings/?profile=etudiant&sort_by=global_score&limit=3 HTTP/1.1
```

**Réponse** :

```json
[
  {
    "name": "Montréal-Nord",
    "scores": {
      "global_score": 52.85,
      "transport": 65.0,      ← Transport bon
      "budget": 85.0,         ← Budget excellent
      "leisure": 45.0,
      "services": 30.0,
      "security": 40.0
    }
  },
  ...
]
```

### Exemple 3 : Filtrage + classement

```http
GET /api/rankings/?min_population=100000&max_population=150000&sort_by=population HTTP/1.1
```

Retourne uniquement les arrondissements avec 100k-150k habitants, triés par population.

---

## Codes de réponse HTTP

| Code  | Signification         | Exemple                     |
| ----- | --------------------- | --------------------------- |
| `200` | OK                    | Requête réussie             |
| `201` | Created               | Ressource créée             |
| `400` | Bad Request           | Paramètres invalides        |
| `404` | Not Found             | Ressource n'existe pas      |
| `422` | Unprocessable Entity  | Validation Pydantic échouée |
| `500` | Internal Server Error | Erreur serveur (MongoDB)    |

### Exemple d'erreur 400

```http
GET /api/rankings/?profile=invalide HTTP/1.1

HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "detail": "Profil invalide. Utilisez : general, famille, etudiant, personne_agee, petit_budget"
}
```

### Exemple d'erreur 422

```http
POST /api/boroughs/
Content-Type: application/json

{
  "name": "Quartier"
  // manque statistics et attractions
}

HTTP/1.1 422 Unprocessable Entity
Content-Type: application/json

{
  "detail": [
    {
      "loc": ["body", "statistics"],
      "msg": "field required",
      "type": "value_error.missing"
    },
    {
      "loc": ["body", "attractions"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```

---

## Format JSON

### Structure Borough complète

```json
{
  "name": "string",
  "statistics": {
    "area_km2": 0.0,
    "population": 0,
    "density_per_km2": 0.0,
    "median_property_value": 0.0,
    "median_household_income": 0.0
  },
  "attractions": {
    "green_spaces": 0,
    "parks": 0,
    "libraries": 0,
    "pools": 0,
    "metro_stations": 0,
    "sports_complexes": 0
  },
  "scores": {
    "global_score": 0.0,
    "transport": 0.0,
    "leisure": 0.0,
    "services": 0.0,
    "budget": 0.0,
    "security": 0.0
  },
  "date_consultation": "string",
  "created_at": "2025-12-29T10:30:00Z",
  "updated_at": "2025-12-29T10:30:00Z"
}
```

### Types et validations (Pydantic)

```python
class Statistics(BaseModel):
    area_km2: Optional[float] = None          # Peut être null
    population: Optional[int] = None
    density_per_km2: Optional[float] = None
    median_property_value: Optional[float] = None
    median_household_income: Optional[float] = None

class Attractions(BaseModel):
    green_spaces: Optional[int] = None
    parks: Optional[int] = None
    libraries: Optional[int] = None
    pools: Optional[int] = None
    metro_stations: Optional[int] = None
    sports_complexes: Optional[int] = None

class Scores(BaseModel):
    global_score: Optional[float] = None      # Score total
    transport: Optional[float] = None
    leisure: Optional[float] = None
    services: Optional[float] = None
    budget: Optional[float] = None
    security: Optional[float] = None
```

---

## Exemples cURL

### 1. Récupérer tous les arrondissements

```bash
curl http://localhost:8000/api/boroughs/
```

### 2. Classement par score (général)

```bash
curl "http://localhost:8000/api/rankings/?sort_by=global_score&order=desc&limit=5"
```

### 3. Classement pour une famille

```bash
curl "http://localhost:8000/api/rankings/?profile=famille&limit=10"
```

### 4. Classement pour petit budget

```bash
curl "http://localhost:8000/api/rankings/?profile=petit_budget&sort_by=global_score"
```

### 5. Filtrer par population

```bash
curl "http://localhost:8000/api/rankings/?min_population=80000&max_population=140000"
```

### 6. Créer un arrondissement

```bash
curl -X POST http://localhost:8000/api/boroughs/ \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nouveau Quartier",
    "statistics": {
      "area_km2": 10.0,
      "population": 50000
    },
    "attractions": {
      "parks": 20,
      "metro_stations": 3
    }
  }'
```

### 7. Mettre à jour un arrondissement

```bash
curl -X PUT http://localhost:8000/api/boroughs/ID_ICI \
  -H "Content-Type: application/json" \
  -d '{
    "statistics": {
      "population": 55000
    }
  }'
```

### 8. Supprimer un arrondissement

```bash
curl -X DELETE http://localhost:8000/api/boroughs/ID_ICI
```

---

## Intégration Frontend

### Exemple React/Next.js

```typescript
// Récupérer le classement pour une famille
const response = await fetch("http://localhost:8000/api/rankings/?profile=famille&sort_by=global_score&limit=10");
const boroughs = await response.json();

// Utiliser les données
boroughs.forEach((borough) => {
  console.log(`${borough.name}: ${borough.scores.global_score}`);
});
```

### Avec axios

```typescript
import axios from 'axios';

const API_BASE = 'http://localhost:8000/api';

// Récupérer tous les arrondissements
const boroughs = await axios.get(`${API_BASE}/boroughs/`);

// Récupérer le classement avec profil
const rankings = await axios.get(`${API_BASE}/rankings/`, {
  params: {
    profile: 'famille',
    sort_by: 'global_score',
    limit: 10
  }
});

// Créer un nouvel arrondissement
const newBorough = await axios.post(`${API_BASE}/boroughs/`, {
  name: 'Nouveau',
  statistics: {...},
  attractions: {...}
});
```

---

**Dernière mise à jour** : 8 janvier 2026
