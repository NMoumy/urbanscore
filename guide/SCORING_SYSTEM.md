# Calcul des Scores - Documentation Détaillée

## 📋 Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Architecture du système de scoring](#architecture-du-système-de-scoring)
3. [Les 5 scores détaillés](#les-5-scores-détaillés)
4. [Score global et pondérations](#score-global-et-pondérations)
5. [Exemple d'un arrondissement complet](#exemple-dun-arrondissement-complet)
6. [Modifications et améliorations](#modifications-et-améliorations)

---

## Vue d'ensemble

Le système de scoring d'UrbanScore utilise une **approche multi-critères** pour évaluer la qualité de vie dans chaque arrondissement.

### Flux général

```
Données brutes (MongoDB)
    │
    ├─ statistics.population
    ├─ statistics.median_property_value
    ├─ statistics.median_household_income
    ├─ attractions.metro_stations
    ├─ attractions.parks
    ├─ attractions.libraries
    ├─ attractions.pools
    └─ attractions.green_spaces
    │
    ▼
Calcul des 5 scores individuels (0-100)
    │
    ├─ Transport Score
    ├─ Leisure Score
    ├─ Services Score
    ├─ Budget Score
    └─ Security Score
    │
    ▼
Pondération selon le profil utilisateur
    │
    ▼
Score Global (0-100)
```

---

## Architecture du système de scoring

### Fichier responsable : `app/services/score_calculator.py`

```python
# Structure générale

# 1. Fonctions de calcul individuelles (5 scores)
def calculate_transport_score(borough)       → float (0-100)
def calculate_leisure_score(borough)         → float (0-100)
def calculate_services_score(borough)        → float (0-100)
def calculate_budget_score(borough)          → float (0-100)
def calculate_security_score(borough)        → float (0-100)

# 2. Fonction de calcul combiné
def calculate_all_scores(borough)            → Dict[str, float]

# 3. Fonction avec profils
def calculate_scores_by_profile(borough, profile) → Dict[str, float]

# 4. Fonction wrapper
def calculate_borough_score(borough)         → float
```

---

## Les 5 scores détaillés

### 1️⃣ Transport Score

**Responsable de** : Accessibilité aux transports en commun

**Source de données** : `attractions.metro_stations`

**Formule** :

```python
metro = attrs.get("metro_stations", 0) or 0
score = min((metro / 12) * 100, 100)
```

**Interprétation** :

- 0 stations = 0 pts
- 6 stations = 50 pts
- 12+ stations = 100 pts

**Exemple** :

```
Le Plateau-Mont-Royal:
- metro_stations: 1
- score = (1 / 12) * 100 = 8.33 pts
```

**Logique** : 12 est le maximum théorique (Ville-Marie a 12 stations)

---

### 2️⃣ Leisure Score

**Responsable de** : Accès aux loisirs (parcs, espaces verts, sports)

**Sources de données** :

- `attractions.parks`
- `attractions.green_spaces`
- `attractions.sports_complexes`

**Formule** :

```python
parks = attrs.get("parks", 0) or 0
green_spaces = attrs.get("green_spaces", 0) or 0
sports = attrs.get("sports_complexes", 0) or 0

parks_score = min((parks / 50) * 40, 40)           # 40% du score
green_score = min((green_spaces / 100) * 35, 35)   # 35% du score
sports_score = min((sports / 2) * 25, 25)          # 25% du score

total = parks_score + green_score + sports_score
```

**Interprétation** :

- 50 parcs → 40 pts
- 100 espaces verts → 35 pts
- 2 complexes sportifs → 25 pts
- Maximum = 100 pts

**Exemple** :

```
Le Plateau:
- parks: 46 → (46/50)*40 = 36.8
- green_spaces: 37 → (37/100)*35 = 12.95
- sports: 0 → (0/2)*25 = 0
- Total = 36.8 + 12.95 + 0 = 49.75
```

**Pondération** :

- Parcs : 40% (plus important pour les enfants)
- Espaces verts : 35% (tout public)
- Complexes sportifs : 25% (moins nombreux)

---

### 3️⃣ Services Score

**Responsable de** : Accès aux services essentiels (bibliothèques, piscines)

**Sources de données** :

- `attractions.libraries`
- `attractions.pools`

**Formule** :

```python
libraries = attrs.get("libraries", 0) or 0
pools = attrs.get("pools", 0) or 0

library_score = min((libraries / 5) * 60, 60)    # 60% du score
pool_score = min((pools / 7) * 40, 40)          # 40% du score

total = library_score + pool_score
```

**Interprétation** :

- 5 bibliothèques → 60 pts
- 7 piscines → 40 pts
- Maximum = 100 pts

**Exemple** :

```
Le Plateau:
- libraries: 2 → (2/5)*60 = 24
- pools: 6 → (6/7)*40 = 34.29
- Total = 24 + 34.29 = 58.29
```

**Pondération** :

- Bibliothèques : 60% (services culturels)
- Piscines : 40% (installations sportives)

---

### 4️⃣ Budget Score

**Responsable de** : Affordabilité / Accessibilité financière

**Source de données** : `statistics.median_property_value`

**Formule** :

```python
property_value = stats.get("median_property_value")

if not property_value:
    return 50.0  # Score neutre

min_value = 250000    # Valeur très abordable
max_value = 850000    # Valeur très chère

if property_value <= min_value:
    return 100.0
elif property_value >= max_value:
    return 0.0

score = 100 - ((property_value - min_value) / (max_value - min_value) * 100)
```

**Interprétation** :

- 250k$ = 100 pts (très abordable)
- 550k$ = 50 pts (moyen)
- 850k$ = 0 pts (très cher)

**Exemple** :

```
Le Plateau (737k$):
- score = 100 - ((737000 - 250000) / 600000 * 100)
- score = 100 - (487000 / 600000 * 100)
- score = 100 - 81.17 = 18.83
```

**⚠️ À noter** : Le Plateau est cher, donc faible score budgétaire

---

### 5️⃣ Security Score

**Responsable de** : Sécurité (proxy temporaire via revenu)

**Source de données** : `statistics.median_household_income`

**Formule** :

```python
income = stats.get("median_household_income")

if not income:
    return 50.0  # Score neutre

min_income = 30000    # Revenu faible
max_income = 95000    # Revenu élevé

if income >= max_income:
    return 100.0
elif income <= min_income:
    return 0.0

score = ((income - min_income) / (max_income - min_income)) * 100
```

**Interprétation** :

- 30k$ = 0 pts (faible)
- 62.5k$ = 50 pts (moyen)
- 95k$ = 100 pts (élevé)

**Exemple** :

```
Le Plateau (47.816k$):
- score = ((47816 - 30000) / 65000) * 100
- score = (17816 / 65000) * 100 = 27.41
```

**⚠️ À noter** : Le revenu moyen du Plateau est bas, donc faible score sécurité

**Limitation** : Le revenu est un proxy approximatif de la sécurité. Idéalement, il faudrait les données réelles de criminalité.

---

## Score global et pondérations

### Pondérations par profil

Le **score global** est calculé comme une **moyenne pondérée** des 5 scores selon le profil.

#### 🌐 Profil "general" (défaut)

```python
weights = {
    "transport": 0.30,   # 30%
    "leisure": 0.25,     # 25%
    "budget": 0.20,      # 20%
    "services": 0.15,    # 15%
    "security": 0.10     # 10%
}

global_score = (
    transport * 0.30 +
    leisure * 0.25 +
    budget * 0.20 +
    services * 0.15 +
    security * 0.10
)
```

**Logique** : Équilibre entre tous les critères

#### 👨‍👩‍👧‍👦 Profil "famille"

```python
weights = {
    "transport": 0.20,     # ⬇️ Moins critique
    "leisure": 0.25,       # Important (parcs, enfants)
    "budget": 0.15,        # ⬇️ Moins critique
    "services": 0.25,      # ⬆️ PRIORITÉ (écoles)
    "security": 0.15       # ⬆️ PRIORITÉ
}
```

**Logique** :

- Services élevés pour les écoles et garderies
- Sécurité importante pour les enfants
- Parcs et loisirs essentiels

#### 🎓 Profil "etudiant"

```python
weights = {
    "transport": 0.35,     # ⬆️ PRIORITÉ (aller aux cours)
    "leisure": 0.15,       # Faible (peu de temps)
    "budget": 0.35,        # ⬆️ PRIORITÉ (budget limité)
    "services": 0.10,      # Bibliothèques
    "security": 0.05       # Faible
}
```

**Logique** :

- Budget et transport sont critiques
- Loisirs moins importants (études prioritaires)

#### 👴 Profil "personne_agee"

```python
weights = {
    "transport": 0.30,     # Important (mobilité)
    "leisure": 0.15,       # Parcs pour promenades
    "budget": 0.20,        # Important (retraite fixe)
    "services": 0.25,      # ⬆️ PRIORITÉ (santé, proximité)
    "security": 0.10
}
```

**Logique** :

- Services critiques (accès aux soins, pharmacies)
- Transport pour mobilité réduite
- Quartiers calmes préférés

#### 💰 Profil "petit_budget"

```python
weights = {
    "transport": 0.25,     # Modéré
    "leisure": 0.10,       # Faible (gratuit ou loin)
    "budget": 0.50,        # ⬆️⬆️⬆️ PRIORITÉ ABSOLUE
    "services": 0.10,      # Basique
    "security": 0.05       # Faible
}
```

**Logique** :

- Le budget est la préoccupation principale (50% du score !)
- Tous les autres critères sont secondaires

---

## Exemple d'un arrondissement complet

### Données brutes : Le Plateau-Mont-Royal

```json
{
  "name": "Le Plateau-Mont-Royal",
  "statistics": {
    "area_km2": 8.1,
    "population": 104000,
    "density_per_km2": 12840,
    "median_property_value": 737200,
    "median_household_income": 47816
  },
  "attractions": {
    "green_spaces": 37,
    "parks": 46,
    "libraries": 2,
    "pools": 6,
    "metro_stations": 1,
    "sports_complexes": null
  }
}
```

### Calcul des 5 scores

```
1. TRANSPORT
   metro = 1
   score = (1 / 12) * 100 = 8.33

2. LEISURE
   parks_score = (46 / 50) * 40 = 36.8
   green_score = (37 / 100) * 35 = 12.95
   sports_score = (0 / 2) * 25 = 0
   total = 36.8 + 12.95 + 0 = 49.75

3. SERVICES
   library_score = (2 / 5) * 60 = 24
   pool_score = (6 / 7) * 40 = 34.29
   total = 24 + 34.29 = 58.29

4. BUDGET
   score = 100 - ((737200 - 250000) / 600000 * 100)
   score = 100 - 81.17 = 18.83

5. SECURITY
   score = ((47816 - 30000) / 65000) * 100
   score = 27.41
```

### Score global selon le profil

```
GÉNÉRAL (défaut):
global = 8.33*0.30 + 49.75*0.25 + 18.83*0.20 + 58.29*0.15 + 27.41*0.10
global = 2.50 + 12.44 + 3.77 + 8.74 + 2.74 = 30.19

FAMILLE:
global = 8.33*0.20 + 49.75*0.25 + 18.83*0.15 + 58.29*0.25 + 27.41*0.15
global = 1.67 + 12.44 + 2.82 + 14.57 + 4.11 = 35.61

ÉTUDIANT:
global = 8.33*0.35 + 49.75*0.15 + 18.83*0.35 + 58.29*0.10 + 27.41*0.05
global = 2.92 + 7.46 + 6.59 + 5.83 + 1.37 = 24.17

PERSONNE AGÉE:
global = 8.33*0.30 + 49.75*0.15 + 18.83*0.20 + 58.29*0.25 + 27.41*0.10
global = 2.50 + 7.46 + 3.77 + 14.57 + 2.74 = 31.04

PETIT BUDGET:
global = 8.33*0.25 + 49.75*0.10 + 18.83*0.50 + 58.29*0.10 + 27.41*0.05
global = 2.08 + 4.98 + 9.42 + 5.83 + 1.37 = 23.68
```

### Résultat final

```json
{
  "name": "Le Plateau-Mont-Royal",
  "scores": {
    "transport": 8.33,
    "leisure": 49.75,
    "services": 58.29,
    "budget": 18.83,
    "security": 27.41,
    "global_score": 30.19 // ← Score "general" par défaut
  }
}
```

**Interprétation** :

- Le Plateau excelle en loisirs et services
- Faible en transport et budget (peu de stations de métro, très cher)
- Score moyen pour les étudiants et petits budgets

---

## Modifications et améliorations

### 🔧 Comment modifier une formule de calcul

**Exemple** : Augmenter l'importance des parcs dans le score de loisirs

**Avant** :

```python
parks_score = (parks / 50) * 40
green_score = (green_spaces / 100) * 35
sports_score = (sports / 2) * 25
```

**Après** :

```python
parks_score = (parks / 50) * 50      # 50% au lieu de 40%
green_score = (green_spaces / 100) * 30
sports_score = (sports / 2) * 20
```

**Impact** : Les arrondissements avec beaucoup de parcs auront un meilleur score de loisirs.

### 🎯 Ajouter un nouveau critère au score global

**Exemple** : Ajouter un score "Culture" (musées, théâtres)

**Étape 1** : Ajouter les données dans MongoDB

```json
"attractions": {
  ...,
  "museums": 5,
  "theaters": 2
}
```

**Étape 2** : Créer la fonction

```python
def calculate_culture_score(borough):
    attrs = borough.get("attractions", {})
    museums = attrs.get("museums", 0) or 0
    theaters = attrs.get("theaters", 0) or 0

    culture = (museums * 5) + (theaters * 10)
    return min(culture, 100)
```

**Étape 3** : Intégrer dans `calculate_all_scores()`

```python
def calculate_all_scores(borough):
    ...
    culture = calculate_culture_score(borough)

    # Exemple: Culture compte pour 5% du score global
    global_score = (
        transport * 0.28 +  # Réduit de 30% à 28%
        leisure * 0.24 +    # Réduit de 25% à 24%
        budget * 0.20 +
        services * 0.15 +
        security * 0.10 +
        culture * 0.05      # Nouveau
    )

    return {
        ...,
        "culture": culture
    }
```

### 📊 Recalibrer les seuils

**Problème** : Tous les arrondissements ont des scores entre 20-40, pas assez de variance.

**Solution** : Changer les seuils max/min

```python
# Ancien
min_value = 250000
max_value = 850000

# Nouveau (plus spread)
min_value = 300000
max_value = 900000
```

**Impact** : Les scores s'étaleront plus, meilleure différenciation.

---

**Dernière mise à jour** : 8 janvier 2026
