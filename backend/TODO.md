# 📋 TODO - Prochaines Étapes pour Urban Score Backend

## ✅ Complété

- [x] Configuration du projet FastAPI
- [x] Connexion MongoDB Atlas
- [x] Modèles Pydantic (Neighborhood, ScoreCategory)
- [x] Endpoints CRUD complets
- [x] Service de calcul de scores
- [x] Initialisation avec données d'exemple
- [x] Documentation complète (README, GUIDE, LEARNING_GUIDE)
- [x] Scripts de test et vérification

---

## 🚀 Fonctionnalités Prioritaires

### 1. Rankings et Classements

- [ ] Endpoint GET `/api/rankings` - Trier par score global
- [ ] Filtres : par borough, population, score minimum
- [ ] Pagination (limite, offset)
- [ ] Trier par catégorie spécifique (ex: meilleur transport)

**Fichier à modifier** : `app/routes/rankings.py`

```python
@router.get("/")
async def get_rankings(
    sort_by: str = "global_score",
    order: str = "desc",
    limit: int = 10,
    borough: Optional[str] = None
):
    # Implémenter ici
    pass
```

---

### 2. Comparaison de Quartiers

- [ ] Endpoint POST `/api/compare` - Comparer 2+ quartiers
- [ ] Retourner différences de scores par catégorie
- [ ] Visualisation des forces/faiblesses

**Nouveau fichier** : `app/routes/compare.py`

```python
@router.post("/")
async def compare_neighborhoods(neighborhood_ids: List[str]):
    # Récupérer les quartiers
    # Calculer les différences
    # Retourner comparaison
    pass
```

---

### 3. Recherche et Filtres Avancés

- [ ] Recherche par nom (fuzzy search)
- [ ] Filtrer par plage de population
- [ ] Filtrer par plage de revenus
- [ ] Filtrer par score minimum dans une catégorie

**Fichier à modifier** : `app/routes/neighborhood.py`

```python
@router.get("/search")
async def search_neighborhoods(
    query: Optional[str] = None,
    min_population: Optional[int] = None,
    max_population: Optional[int] = None,
    min_score: Optional[float] = None,
    category: Optional[str] = None
):
    # Implémenter recherche avancée
    pass
```

---

### 4. Statistiques Globales

- [ ] Endpoint `/api/stats` - Statistiques générales
- [ ] Nombre total de quartiers
- [ ] Score global moyen
- [ ] Distribution des scores par catégorie
- [ ] Top 5 arrondissements

**Nouveau fichier** : `app/routes/stats.py`

```python
@router.get("/")
async def get_statistics():
    return {
        "total_neighborhoods": count,
        "average_global_score": avg,
        "top_borough": "...",
        "category_averages": {...}
    }
```

---

## 📊 Données Réelles

### 5. Import de Données de Montréal

- [ ] Script pour importer données de https://donnees.montreal.ca/
- [ ] Parser les datasets CSV/JSON
- [ ] Mapper aux scores de catégories
- [ ] Valider et nettoyer les données

**Nouveau fichier** : `app/scripts/import_montreal_data.py`

**Sources de données** :

- Population par quartier
- Transport en commun (STM)
- Espaces verts et parcs
- Écoles et services
- Criminalité et sécurité

---

### 6. Calcul Automatique des Scores

- [ ] Service de calcul basé sur données brutes
- [ ] Normalisation automatique (0-100)
- [ ] Pondération des catégories
- [ ] Mise à jour périodique

**Nouveau fichier** : `app/services/auto_score_calculator.py`

```python
def calculate_transport_score(neighborhood_data):
    # Distance moyenne aux stations
    # Fréquence du service
    # Couverture réseau
    return normalized_score

def calculate_safety_score(crime_data):
    # Taux de criminalité
    # Types de crimes
    # Tendances
    return normalized_score
```

---

## 🔧 Améliorations Techniques

### 7. Validation et Erreurs

- [ ] Meilleure gestion des erreurs HTTP
- [ ] Messages d'erreur en français
- [ ] Validation stricte des IDs MongoDB
- [ ] Gestion des duplications (même nom de quartier)

---

### 8. Performance

- [ ] Créer des index MongoDB sur champs fréquents
- [ ] Cache avec Redis (optionnel)
- [ ] Pagination efficace
- [ ] Compression des réponses JSON

**Index à créer** :

```python
neighborhoods_collection.create_index("name")
neighborhoods_collection.create_index("borough")
neighborhoods_collection.create_index("global_score")
neighborhoods_collection.create_index([("name", "text")])  # Full-text search
```

---

### 9. Tests Unitaires

- [ ] Tests pour chaque endpoint
- [ ] Tests des services (score_calculator)
- [ ] Tests de la connexion DB
- [ ] Tests d'intégration

**Nouveau dossier** : `tests/`

```bash
tests/
├── test_neighborhoods.py
├── test_rankings.py
├── test_score_calculator.py
└── conftest.py
```

**Framework** : pytest

```bash
pip install pytest pytest-asyncio httpx
pytest tests/
```

---

### 10. Documentation API

- [ ] Enrichir les docstrings
- [ ] Exemples de requêtes dans Swagger
- [ ] Descriptions détaillées des réponses
- [ ] Guide d'utilisation de l'API

---

## 🌐 Déploiement

### 11. Préparation au Déploiement

- [ ] Variables d'environnement pour production
- [ ] Configuration CORS stricte (domaines autorisés)
- [ ] Logging structuré
- [ ] Health check robuste

---

### 12. Déploiement sur Heroku/Railway

- [ ] Créer `Procfile` pour Heroku
- [ ] Configurer les variables d'environnement
- [ ] Tester en staging
- [ ] Déployer en production

**Procfile** :

```
web: uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

---

### 13. Monitoring et Logs

- [ ] Logging avec structlog ou loguru
- [ ] Monitoring avec Sentry (erreurs)
- [ ] Métriques de performance
- [ ] Alertes en cas d'erreur

---

## 🎨 Fonctionnalités Avancées

### 14. Authentification (Optionnel)

- [ ] Système d'utilisateurs
- [ ] API Keys pour accès
- [ ] Rate limiting (limiter requêtes par utilisateur)
- [ ] Rôles (admin, user)

---

### 15. Favoris et Recommandations

- [ ] Sauvegarder quartiers favoris
- [ ] Recommander quartiers similaires
- [ ] Historique de recherche

---

### 16. Notifications et Alertes

- [ ] Alerter quand un quartier change de score
- [ ] Notification de nouveaux quartiers
- [ ] Newsletter mensuelle

---

## 📱 API v2 (Futur)

### 17. Versioning de l'API

- [ ] Créer `/api/v2/`
- [ ] Maintenir v1 pour compatibilité
- [ ] Migration progressive

---

### 18. GraphQL (Alternative à REST)

- [ ] Implémenter GraphQL avec Strawberry
- [ ] Requêtes flexibles côté client
- [ ] Réduire over-fetching

---

### 19. WebSocket pour Temps Réel

- [ ] Notifications en temps réel
- [ ] Mises à jour live des scores
- [ ] Chat support

---

## 📚 Documentation

### 20. Documentation Étendue

- [ ] API Reference complète
- [ ] Exemples d'intégration
- [ ] SDKs (JavaScript, Python)
- [ ] Postman Collection

---

## 🎯 Priorités

### Court Terme (1-2 semaines)

1. ✨ Rankings et classements
2. 📊 Statistiques globales
3. 🔍 Recherche avancée
4. 📈 Import données réelles

### Moyen Terme (1 mois)

5. ⚡ Performance et index
6. 🧪 Tests unitaires
7. 🚀 Déploiement production
8. 📊 Monitoring

### Long Terme (2-3 mois)

9. 🔐 Authentification
10. 💾 Cache et optimisation
11. 📱 API v2
12. 🌐 Internationalisation

---

## 💡 Idées Créatives

- [ ] Carte interactive des quartiers
- [ ] Prédiction de l'évolution des scores
- [ ] Comparaison avec d'autres villes
- [ ] Mode "recommandation personnalisée"
- [ ] Intégration avec données météo
- [ ] Prix immobiliers vs scores
- [ ] Tendances temporelles (évolution dans le temps)

---

## 📝 Notes

### Commandes Utiles

```bash
# Créer une nouvelle route
touch app/routes/nouvelle_route.py

# Tester un endpoint
curl http://localhost:8000/api/...

# Voir les logs
tail -f logs/app.log

# Lancer les tests
pytest tests/ -v
```

### Ressources

- FastAPI Best Practices : https://github.com/zhanymkanov/fastapi-best-practices
- MongoDB Indexing : https://docs.mongodb.com/manual/indexes/
- Python Testing : https://docs.pytest.org/

---

**Mettez à jour ce fichier au fur et à mesure que vous complétez les tâches !**

🎯 Concentrez-vous d'abord sur les fonctionnalités prioritaires.
🚀 Puis améliorez progressivement.
📚 N'oubliez pas de documenter votre code !
