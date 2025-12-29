# 📚 Guide pour Débutants - Concepts clés du Backend

## 🎯 À qui s'adresse ce guide?

Ce guide est pour vous si :

- C'est votre première fois avec FastAPI ou MongoDB
- Vous voulez comprendre comment le backend fonctionne
- Vous voulez apprendre les concepts clés

---

## 1️⃣ FastAPI - Framework Web

### Qu'est-ce que FastAPI?

FastAPI est un framework Python moderne et rapide pour créer des APIs REST.

**Avantages:**

- ⚡ Ultra-rapide (asynchrone)
- 🔍 Validation automatique des données
- 📚 Documentation auto-générée (Swagger)
- 🐍 Python pur, facile à apprendre

### Exemple simple

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/hello")
def hello():
    return {"message": "Hello World"}
```

### Points importants

- `@app.get()` - Route GET
- `@app.post()` - Route POST
- `@app.put()` - Route PUT
- `@app.delete()` - Route DELETE

---

## 2️⃣ MongoDB - Base de données NoSQL

### Qu'est-ce que MongoDB?

MongoDB est une base de données "NoSQL" qui stocke les données en JSON (appelé BSON).

### MongoDB vs SQL

| SQL (PostgreSQL) | NoSQL (MongoDB)       |
| ---------------- | --------------------- |
| Tables rigides   | Collections flexibles |
| Lignes           | Documents             |
| Colonnes         | Champs                |
| Schéma fixe      | Schéma flexible       |

### Exemple MongoDB

```json
{
  "_id": ObjectId("..."),
  "name": "Le Plateau",
  "borough": "Plateau-Mont-Royal",
  "population": 105000,
  "scores": [
    {"category": "transport", "score": 85}
  ]
}
```

### Avantages pour Urban Score

- ✅ Flexible : chaque quartier peut avoir différentes données
- ✅ Skalable : facile d'ajouter des quartiers
- ✅ JSON-native : facile à utiliser avec les APIs

---

## 3️⃣ Pydantic - Validation des données

### Qu'est-ce que Pydantic?

Pydantic valide automatiquement les données au format Python.

### Exemple

```python
from pydantic import BaseModel, Field

class ScoreCategory(BaseModel):
    category: str
    score: float = Field(ge=0, le=100)  # Entre 0 et 100
    description: Optional[str] = None

# ✅ Valide
data = ScoreCategory(category="transport", score=85)

# ❌ Invalide - score hors limites
data = ScoreCategory(category="transport", score=150)
# Erreur: value should be less than or equal to 100
```

### Avantages

- 🛡️ Sécurité : valide toutes les données
- 📋 Documentation : génère la doc automatiquement
- 🐛 Debugging : erreurs claires

---

## 4️⃣ Architecture du projet

### Flux de données

```
HTTP Request
    ↓
[FastAPI Route] (/api/neighborhoods)
    ↓
[Service Layer] (score_calculator.py)
    ↓
[Database] (MongoDB)
    ↓
HTTP Response (JSON)
```

### Couches de l'application

```
Routes (routes/neighborhood.py)
    ↓ Reçoit requêtes HTTP
    ↓ Valide avec Pydantic
    ↓
Services (services/score_calculator.py)
    ↓ Logique métier
    ↓
Database (database.py)
    ↓ Accès MongoDB
    ↓
Models (models/neighborhood.py)
    ↓ Structure des données
```

---

## 5️⃣ Concepts clés du code

### Config.py - Configuration

```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    mongo_uri: str = "mongodb://localhost:27017"
    database_name: str = "urban_score"

    class Config:
        env_file = ".env"  # Charge depuis .env

settings = Settings()
```

**Pourquoi?** Séparer la configuration du code (secrets, URIs).

### Models - Schémas de données

```python
class Neighborhood(BaseModel):
    name: str                      # Requis
    borough: str
    population: Optional[int] = None   # Optionnel
    scores: List[ScoreCategory] = []   # Liste
    global_score: float = Field(ge=0, le=100)
```

**Pourquoi?** Définir la structure et valider les données.

### Routes - Endpoints HTTP

```python
@router.get("/neighborhoods/{id}")
async def get_neighborhood(neighborhood_id: str):
    neighborhood = neighborhoods_collection.find_one({"_id": ObjectId(id)})
    return neighborhood
```

**Pourquoi?** Exposer les fonctionnalités via HTTP.

### Services - Logique métier

```python
def calculate_global_score(scores: List[ScoreCategory]) -> float:
    if not scores:
        return 0.0
    total = sum(score.score for score in scores)
    return round(total / len(scores), 2)
```

**Pourquoi?** Séparer la logique des routes (réutilisable).

### Database - Connexion BD

```python
client = MongoClient(settings.mongo_uri)
db = client[settings.database_name]
neighborhoods_collection = db["neighborhoods"]
```

**Pourquoi?** Centraliser la connexion à la base.

---

## 6️⃣ Workflow d'une requête

Prenons cet exemple : **Créer un quartier**

```bash
curl -X POST http://localhost:8000/api/neighborhoods \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Villeray",
    "borough": "Villeray-Saint-Michel",
    "population": 80000,
    "scores": [
      {"category": "transport", "score": 80}
    ]
  }'
```

### Étapes:

1. **Réception** (main.py)

   ```
   FastAPI reçoit la requête POST
   ```

2. **Validation** (models/neighborhood.py)

   ```
   Pydantic valide:
   - Tous les champs requis? ✅
   - Scores entre 0-100? ✅
   - Types corrects? ✅
   ```

3. **Logique métier** (routes/neighborhood.py)

   ```python
   global_score = calculate_global_score(neighborhood.scores)
   # Calcule le score global = 80
   ```

4. **Sauvegarde** (database.py)

   ```python
   neighborhoods_collection.insert_one({
       "name": "Villeray",
       "borough": "Villeray-Saint-Michel",
       "population": 80000,
       "scores": [...],
       "global_score": 80,
       "created_at": datetime.utcnow(),
       "updated_at": datetime.utcnow()
   })
   ```

5. **Réponse**
   ```json
   {
     "id": "507f1f77bcf86cd799439011",
     "message": "Quartier créé avec succès"
   }
   ```

---

## 7️⃣ Opérations CRUD

### CREATE (POST)

```bash
curl -X POST http://localhost:8000/api/neighborhoods \
  -H "Content-Type: application/json" \
  -d '{"name": "...", "borough": "..."}'
```

Crée un nouveau quartier.

### READ (GET)

```bash
curl http://localhost:8000/api/neighborhoods
curl http://localhost:8000/api/neighborhoods/507f1f77bcf86cd799439011
```

Récupère les quartiers.

### UPDATE (PUT)

```bash
curl -X PUT http://localhost:8000/api/neighborhoods/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -d '{"name": "Nouveau nom"}'
```

Met à jour un quartier existant.

### DELETE (DELETE)

```bash
curl -X DELETE http://localhost:8000/api/neighborhoods/507f1f77bcf86cd799439011
```

Supprime un quartier.

---

## 8️⃣ Gestion des erreurs

### Exemples d'erreurs

```python
# 404 - Non trouvé
raise HTTPException(status_code=404, detail="Quartier non trouvé")

# 400 - Mauvaise requête
raise HTTPException(status_code=400, detail="ID invalide")

# 500 - Erreur serveur
raise HTTPException(status_code=500, detail="Base de données non disponible")
```

### Codes HTTP courants

| Code | Signification                    |
| ---- | -------------------------------- |
| 200  | ✅ OK - Succès                   |
| 201  | ✅ Created - Créé                |
| 400  | ❌ Bad Request - Erreur client   |
| 404  | ❌ Not Found - Non trouvé        |
| 500  | ❌ Server Error - Erreur serveur |

---

## 9️⃣ Async / Await

### Pourquoi async?

```python
# ❌ Synchrone - bloque pendant 1 seconde
@app.get("/slow")
def slow():
    time.sleep(1)  # Bloque!
    return {"status": "ok"}

# ✅ Asynchrone - ne bloque pas
@app.get("/fast")
async def fast():
    await asyncio.sleep(1)  # N'attend pas
    return {"status": "ok"}
```

**Avantage:** Avec async, 100 requêtes simultanées ne prennent que 1 seconde au lieu de 100 secondes!

---

## 🔟 Démarrer avec le code

### 1. Comprendre la structure

```bash
ls -la app/
# routes/      - Endpoints HTTP
# models/      - Schémas Pydantic
# services/    - Logique métier
# config.py    - Configuration
# database.py  - MongoDB
# main.py      - Application
```

### 2. Étudier un endpoint

Ouvrir [app/routes/neighborhood.py](app/routes/neighborhood.py) et lire le code ligne par ligne.

### 3. Tester avec Swagger

- Démarrer le serveur: `uvicorn app.main:app --reload`
- Ouvrir: http://localhost:8000/docs
- Tester chaque endpoint

### 4. Modifier et explorer

Essayez de :

- Ajouter un nouveau champ à un quartier
- Créer une nouvelle route GET
- Ajouter une validation personnalisée

---

## 📚 Ressources pour apprendre

### FastAPI

- [Official Tutorial](https://fastapi.tiangolo.com/tutorial/) ⭐
- [YouTube: FastAPI in 30 minutes](https://www.youtube.com/results?search_query=fastapi+tutorial)

### MongoDB

- [MongoDB Atlas (Gratuit)](https://www.mongodb.com/cloud/atlas/register)
- [MongoDB Shell](https://www.mongodb.com/products/shell)

### Python Async

- [AsyncIO Docs](https://docs.python.org/3/library/asyncio.html)
- [Await Explanation](https://docs.python.org/3/library/asyncio-task.html)

---

## 🎓 Résumé

| Concept      | Rôle                       |
| ------------ | -------------------------- |
| **FastAPI**  | Framework pour créer l'API |
| **MongoDB**  | Base de données            |
| **Pydantic** | Validation des données     |
| **Routes**   | Endpoints HTTP (/api/...)  |
| **Models**   | Structure des données      |
| **Services** | Logique métier             |
| **Database** | Accès à MongoDB            |
| **Config**   | Configuration centralisée  |

---

## 💡 Conseils pour réussir

1. **Lisez le code** - Parcourez chaque fichier
2. **Utilisez Swagger** - Testez les endpoints visuellement
3. **Modifiez le code** - Expérimentez, cassez, apprenez
4. **Consultez la doc** - FastAPI et MongoDB ont d'excellente docs
5. **Posez des questions** - Ne pas comprendre? Demandez!

---

Bonne chance! 🚀
