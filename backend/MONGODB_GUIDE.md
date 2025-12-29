# 🍃 MongoDB Guide - Pour Débutants

## Qu'est-ce que MongoDB ?

MongoDB est une **base de données NoSQL** qui stocke les données au format JSON (techniquement BSON - Binary JSON).

### Différence avec les bases SQL traditionnelles

| Concept SQL | Concept MongoDB | Exemple Urban Score        |
| ----------- | --------------- | -------------------------- |
| Database    | Database        | `urban_score`              |
| Table       | Collection      | `neighborhoods`            |
| Row         | Document        | Un quartier spécifique     |
| Column      | Field           | `name`, `borough`, `score` |

---

## 🔑 Concepts Clés

### 1. Database (Base de données)

C'est un conteneur pour les collections.

- **Pour Urban Score** : `urban_score`

### 2. Collection

Équivalent d'une "table" en SQL, mais sans schéma fixe.

- **Pour Urban Score** : `neighborhoods` (les quartiers)

### 3. Document

Un enregistrement individuel au format JSON.

- **Pour Urban Score** : Un quartier avec tous ses détails

### 4. Field (Champ)

Une propriété d'un document.

- **Exemples** : `name`, `borough`, `population`, `scores`

---

## 📄 Structure d'un Document

Voici à quoi ressemble un quartier dans MongoDB :

```json
{
  "_id": ObjectId("6772abc123def456789012"),
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
    {
      "category": "écoles",
      "score": 78,
      "description": "Bonne qualité scolaire"
    }
  ],
  "global_score": 79.6,
  "created_at": ISODate("2025-12-29T10:30:00.000Z"),
  "updated_at": ISODate("2025-12-29T10:30:00.000Z")
}
```

### Points importants :

- **`_id`** : ID unique généré automatiquement par MongoDB
- **Types variés** : strings, nombres, arrays, objets imbriqués
- **Flexible** : chaque document peut avoir des champs différents
- **Imbrication** : les `scores` sont un array d'objets

---

## 🔍 Requêtes MongoDB de Base

### Dans PyMongo (notre code Python)

```python
from app.database import neighborhoods_collection

# CREATE - Insérer un document
result = neighborhoods_collection.insert_one({
    "name": "Villeray",
    "borough": "Villeray-Saint-Michel",
    "population": 80000
})

# READ - Trouver tous les documents
all_neighborhoods = neighborhoods_collection.find()

# READ - Trouver un document spécifique
plateau = neighborhoods_collection.find_one({"name": "Le Plateau-Mont-Royal"})

# READ - Trouver avec filtre
high_pop = neighborhoods_collection.find({"population": {"$gt": 50000}})

# UPDATE - Mettre à jour
neighborhoods_collection.update_one(
    {"name": "Villeray"},
    {"$set": {"population": 85000}}
)

# DELETE - Supprimer
neighborhoods_collection.delete_one({"name": "Villeray"})

# COUNT - Compter
count = neighborhoods_collection.count_documents({})
```

---

## 🎯 Opérations Courantes dans Urban Score

### 1. Lister tous les quartiers

```python
neighborhoods = list(neighborhoods_collection.find())
# Retourne tous les documents de la collection
```

### 2. Trouver un quartier par ID

```python
from bson import ObjectId

neighborhood = neighborhoods_collection.find_one({
    "_id": ObjectId("6772abc123def456789012")
})
```

### 3. Filtrer par arrondissement

```python
plateau_neighborhoods = neighborhoods_collection.find({
    "borough": "Plateau-Mont-Royal"
})
```

### 4. Trier par score

```python
top_neighborhoods = neighborhoods_collection.find().sort("global_score", -1)
# -1 = décroissant, 1 = croissant
```

### 5. Limiter les résultats

```python
top_3 = neighborhoods_collection.find().sort("global_score", -1).limit(3)
```

---

## 🔎 Opérateurs MongoDB

### Opérateurs de Comparaison

| Opérateur | Signification      | Exemple                                          |
| --------- | ------------------ | ------------------------------------------------ |
| `$eq`     | Égal à             | `{"score": {"$eq": 80}}`                         |
| `$gt`     | Plus grand que     | `{"population": {"$gt": 50000}}`                 |
| `$gte`    | Plus grand ou égal | `{"score": {"$gte": 70}}`                        |
| `$lt`     | Plus petit que     | `{"score": {"$lt": 60}}`                         |
| `$lte`    | Plus petit ou égal | `{"score": {"$lte": 80}}`                        |
| `$ne`     | Différent de       | `{"borough": {"$ne": "Outremont"}}`              |
| `$in`     | Dans une liste     | `{"borough": {"$in": ["Plateau", "Outremont"]}}` |

### Opérateurs Logiques

| Opérateur | Signification | Exemple                                                              |
| --------- | ------------- | -------------------------------------------------------------------- |
| `$and`    | ET logique    | `{"$and": [{"score": {"$gt": 70}}, {"population": {"$gt": 50000}}]}` |
| `$or`     | OU logique    | `{"$or": [{"borough": "Plateau"}, {"borough": "Outremont"}]}`        |
| `$not`    | NON logique   | `{"score": {"$not": {"$lt": 50}}}`                                   |

---

## 🛠️ MongoDB Atlas (Notre Setup)

### Qu'est-ce que MongoDB Atlas?

MongoDB Atlas est la version **cloud** de MongoDB (hébergée sur Internet).

### Avantages :

- ✅ **Gratuit** jusqu'à 512 MB
- ✅ **Pas d'installation locale** nécessaire
- ✅ **Accessible partout**
- ✅ **Backups automatiques**
- ✅ **Interface web** pour visualiser les données

### Notre Configuration :

```
URI: mongodb+srv://moumyndiaye_db_user:***@cluster0.emw4iii.mongodb.net/
Database: urban_score
Collection: neighborhoods
```

### Accéder à vos données :

1. Aller sur https://www.mongodb.com/cloud/atlas
2. Se connecter avec vos credentials
3. Cliquer sur "Browse Collections"
4. Voir la database `urban_score`
5. Voir la collection `neighborhoods`

---

## 📊 Visualiser Vos Données

### Option 1 : MongoDB Atlas Web UI

1. Connexion à Atlas : https://cloud.mongodb.com
2. Cliquer sur "Browse Collections"
3. Sélectionner `urban_score` → `neighborhoods`
4. Voir tous les documents

### Option 2 : MongoDB Compass (Desktop App)

1. Télécharger : https://www.mongodb.com/products/compass
2. Connecter avec l'URI de `.env`
3. Explorer visuellement les données

### Option 3 : Python Script

```python
from app.database import neighborhoods_collection
import json

# Récupérer et afficher tous les quartiers
for neighborhood in neighborhoods_collection.find():
    print(json.dumps(neighborhood, indent=2, default=str))
```

---

## 🔐 Sécurité MongoDB

### ⚠️ Règles Importantes :

1. **Ne JAMAIS partager l'URI MongoDB**

   - Contient vos credentials
   - Dans le fichier `.env`
   - Ne pas commiter dans Git

2. **Utiliser des variables d'environnement**

   ```python
   # ✅ Bon
   mongo_uri = os.getenv("MONGO_URI")

   # ❌ Mauvais
   mongo_uri = "mongodb+srv://user:password@..."
   ```

3. **Limiter les accès**
   - Dans Atlas, configurer l'IP Whitelist
   - Créer des utilisateurs avec permissions limitées

---

## 💾 Backup et Restauration

### Backup Automatique (Atlas)

MongoDB Atlas fait des backups automatiques gratuits.

### Backup Manuel

```bash
# Exporter la collection
mongoexport --uri="VOTRE_URI" --collection=neighborhoods --out=backup.json

# Importer la collection
mongoimport --uri="VOTRE_URI" --collection=neighborhoods --file=backup.json
```

---

## 🧪 Tester MongoDB

### Via Python

```bash
python -m app.test_db
```

### Via MongoDB Shell (si installé)

```bash
mongosh "VOTRE_URI"
```

Puis dans le shell :

```javascript
// Lister les databases
show dbs

// Utiliser urban_score
use urban_score

// Lister les collections
show collections

// Trouver tous les quartiers
db.neighborhoods.find()

// Compter les documents
db.neighborhoods.countDocuments()

// Trouver un quartier spécifique
db.neighborhoods.findOne({name: "Le Plateau-Mont-Royal"})
```

---

## 📈 Performance et Indexation

### Pourquoi créer des index?

Les index accélèrent les requêtes (comme un index de livre).

### Créer un index

```python
# Index sur le nom (recherche plus rapide)
neighborhoods_collection.create_index("name")

# Index sur le borough
neighborhoods_collection.create_index("borough")

# Index sur le score global (pour le tri)
neighborhoods_collection.create_index("global_score")
```

### Voir les index

```python
indexes = neighborhoods_collection.list_indexes()
for index in indexes:
    print(index)
```

---

## 🎯 Cas d'Usage Spécifiques à Urban Score

### 1. Trouver les meilleurs quartiers

```python
top_neighborhoods = neighborhoods_collection.find().sort("global_score", -1).limit(5)
```

### 2. Quartiers avec bon transport

```python
good_transport = neighborhoods_collection.find({
    "scores": {
        "$elemMatch": {
            "category": "transport",
            "score": {"$gte": 80}
        }
    }
})
```

### 3. Quartiers par population

```python
populous = neighborhoods_collection.find({
    "population": {"$gt": 50000}
}).sort("population", -1)
```

### 4. Recherche par nom (insensible à la casse)

```python
import re
neighborhood = neighborhoods_collection.find_one({
    "name": re.compile("plateau", re.IGNORECASE)
})
```

---

## 🆘 Dépannage MongoDB

### Problème : "Connection Timeout"

**Solution** :

- Vérifier votre connexion internet
- Vérifier l'URI dans `.env`
- Vérifier l'IP Whitelist dans Atlas (ajouter `0.0.0.0/0` pour tout autoriser)

### Problème : "Authentication Failed"

**Solution** :

- Vérifier le username et password dans l'URI
- Régénérer le mot de passe dans Atlas

### Problème : "Database Access Denied"

**Solution** :

- Vérifier les permissions de l'utilisateur dans Atlas
- L'utilisateur doit avoir accès à `urban_score`

---

## 📚 Ressources

### Documentation

- [MongoDB Manual](https://docs.mongodb.com/manual/)
- [PyMongo Documentation](https://pymongo.readthedocs.io/)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)

### Tutoriels

- [MongoDB University](https://university.mongodb.com/) - Cours gratuits
- [MongoDB in 30 Minutes](https://www.youtube.com/results?search_query=mongodb+tutorial)

### Outils

- [MongoDB Compass](https://www.mongodb.com/products/compass) - GUI Desktop
- [Studio 3T](https://studio3t.com/) - IDE pour MongoDB
- [NoSQLBooster](https://nosqlbooster.com/) - Client MongoDB

---

## 🎓 Résumé

| Concept        | Ce que c'est             | Urban Score            |
| -------------- | ------------------------ | ---------------------- |
| **Database**   | Conteneur principal      | `urban_score`          |
| **Collection** | Groupe de documents      | `neighborhoods`        |
| **Document**   | Un enregistrement JSON   | Un quartier            |
| **Field**      | Propriété d'un document  | `name`, `score`, etc.  |
| **Query**      | Recherche de documents   | `find()`, `find_one()` |
| **Index**      | Accélérateur de requêtes | Sur `name`, `borough`  |

---

**MongoDB est flexible, rapide et parfait pour Urban Score !** 🚀

Pour plus d'aide, consultez la [documentation officielle](https://docs.mongodb.com/).
