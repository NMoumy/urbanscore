# Guide d'intégration Frontend-Backend

## 📋 Table des matières

1. [Architecture](#architecture)
2. [Fichiers créés](#fichiers-créés)
3. [Configuration](#configuration)
4. [Démarrage](#démarrage)
5. [Appels API depuis le Frontend](#appels-api-depuis-le-frontend)
6. [Dépannage](#dépannage)

---

## Architecture

```
Frontend (Next.js - Port 3000)
    │
    ├─ RankingList.tsx (composant React)
    │  │
    │  └─ Appelle: apiService.getRankings()
    │
    ├─ services/api.ts (ApiService)
    │  │
    │  └─ Envoie requête HTTP
    │
    └─ config/api.ts (Configuration)
       │
       └─ API_BASE_URL = http://localhost:8000/api
            │
            ▼
Backend (FastAPI - Port 8000)
    │
    ├─ /api/rankings/ (endpoint)
    │
    └─ Retourne JSON avec scores
            │
            ▼
Frontend reçoit et affiche
```

---

## Fichiers créés

### 1. `src/config/api.ts`

Configuration centralisée des URLs API

```typescript
export const API_BASE_URL = "http://localhost:8000/api";
export const API_ENDPOINTS = {
  BOROUGHS: "/boroughs",
  RANKINGS: "/rankings",
};
```

### 2. `src/services/api.ts`

Service API avec toutes les fonctions pour appeler le backend

```typescript
// Exemples d'utilisation
await apiService.getRankings({ profile: "famille" });
await apiService.getBoroughs();
await apiService.getBorough(id);
```

### 3. `src/components/RankingList.tsx`

**Mis à jour** pour utiliser le backend au lieu des données statiques

- ✅ Récupère les données du backend
- ✅ Gère le chargement et les erreurs
- ✅ Applique le filtrage par profil
- ✅ Trie les résultats

### 4. `.env.local`

Variables d'environnement pour le frontend

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

---

## Configuration

### Frontend

#### .env.local (déjà créé)

**Development** :

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

**Production** :

```env
NEXT_PUBLIC_API_URL=https://urbanscore-api.herokuapp.com/api
```

#### Pourquoi .env.local ?

- ✅ Variables accessibles au frontend (préfixe `NEXT_PUBLIC_`)
- ✅ Ignoré par Git (pour secrets)
- ✅ Différent par environnement

### Backend

Assurez-vous que le fichier `backend/.env` existe :

```env
MONGO_URI=mongodb://localhost:27017
DATABASE_NAME=urban_score
ENVIRONMENT=development
DEBUG=True
```

---

## Démarrage

### Étape 1 : Lancer MongoDB

```bash
# Windows avec Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Ou si MongoDB est installé localement
mongod
```

### Étape 2 : Lancer le backend (Terminal 1)

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload
```

✅ Backend lancé sur `http://localhost:8000`

### Étape 3 : Lancer le frontend (Terminal 2)

```bash
cd frontend
npm install
npm run dev
```

✅ Frontend lancé sur `http://localhost:3000`

### Étape 4 : Vérifier la connexion

1. Aller sur `http://localhost:3000`
2. La page doit afficher les arrondissements depuis le backend
3. Vérifier la console (F12) pour les erreurs

---

## Appels API depuis le Frontend

### Exemple 1 : Récupérer le classement pour une famille

```typescript
import apiService from "@/services/api";

const boroughs = await apiService.getRankings({
  profile: "famille",
  sort_by: "global_score",
  order: "desc",
  limit: 10,
});

console.log(boroughs);
// [
//   {
//     name: "Rosemont",
//     scores: {
//       global_score: 68.42,
//       transport: 75.0,
//       security: 72.0,
//       ...
//     }
//   }
// ]
```

### Exemple 2 : Récupérer tous les arrondissements

```typescript
const allBoroughs = await apiService.getBoroughs();
```

### Exemple 3 : Récupérer un arrondissement spécifique

```typescript
const borough = await apiService.getBorough("507f1f77bcf86cd799439011");
```

### Exemple 4 : Dans un composant React

```typescript
"use client";

import { useEffect, useState } from "react";
import apiService, { Borough } from "@/services/api";

export default function MyComponent() {
  const [boroughs, setBoroughs] = useState<Borough[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await apiService.getRankings({ profile: "etudiant" });
        setBoroughs(data);
      } catch (error) {
        console.error("Erreur:", error);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  if (loading) return <div>Chargement...</div>;
  if (boroughs.length === 0) return <div>Aucun résultat</div>;

  return (
    <div>
      {boroughs.map((borough) => (
        <div key={borough.name}>
          <h2>{borough.name}</h2>
          <p>Score: {borough.scores?.global_score}</p>
        </div>
      ))}
    </div>
  );
}
```

---

## Modification des profils

### Dans RankingFilters.tsx

Les profils sont mappés automatiquement :

```typescript
const profileMap: { [key: string]: Profile } = {
  all: "general",
  Famille: "famille",
  Étudiants: "etudiant",
  "Personne âgée": "personne_agee",
  "Petit budget": "petit_budget",
};
```

Quand l'utilisateur sélectionne "Famille", le frontend envoie `profile=famille` au backend.

---

## Dépannage

### ❌ "Cannot GET /api/rankings"

**Cause** : Backend n'est pas lancé

**Solution** :

```bash
cd backend
uvicorn app.main:app --reload
```

### ❌ "CORS error" ou "blocked by CORS"

**Cause** : Frontend ne peut pas accéder au backend

**Solution** : Vérifier dans `backend/app/config.py` que `localhost:3000` est dans `ALLOWED_ORIGINS`

```python
ALLOWED_ORIGINS = [
    "http://localhost:3000",  # ✅ Doit être là
    "http://localhost:8000",
    "http://127.0.0.1:3000"
]
```

### ❌ "Chargement des classements..." qui ne finit pas

**Cause** :

- Backend ne répond pas
- MongoDB n'est pas lancé

**Solution** :

```bash
# Vérifier MongoDB
docker ps  # Doit voir le container mongodb

# Vérifier le backend
http://localhost:8000/docs  # Doit ouvrir Swagger
```

### ❌ Données vides (aucun arrondissement)

**Cause** : MongoDB est vide

**Solution** : Importer les données

```bash
cd backend
python -m app.scripts.import_montreal_data
```

### ❌ Scores à 0

**Cause** : Les attraits (attractions) n'existent pas dans les données

**Solution** : Vérifier les données MongoDB

```bash
db.boroughs.findOne()  # Doit avoir "attractions"
```

---

## Architecture des types TypeScript

### Type Borough du Backend

```typescript
// Dans src/services/api.ts
type Borough = {
  name: string;
  statistics: {
    area_km2?: number;
    population?: number;
    density_per_km2?: number;
    median_property_value?: number;
    median_household_income?: number;
  };
  attractions: {
    green_spaces?: number;
    parks?: number;
    libraries?: number;
    pools?: number;
    metro_stations?: number;
    sports_complexes?: number;
  };
  scores?: {
    global_score: number;
    transport: number;
    leisure: number;
    services: number;
    budget: number;
    security: number;
  };
  created_at: string;
  updated_at: string;
};
```

### Transformation dans RankingList

```typescript
// Backend retourne Borough
// Frontend transforme en NeighborhoodDisplay

const transformed = data.map((borough: Borough) => ({
  id: `${index}`,
  name: borough.name,
  score: borough.scores?.global_score ?? 0,
  security: borough.scores?.security ?? 0,
  transport: borough.scores?.transport ?? 0,
  service: borough.scores?.services ?? 0, // ⚠️ "services" → "service"
  cost: borough.scores?.budget ?? 0, // ⚠️ "budget" → "cost"
  leisure: borough.scores?.leisure ?? 0,
}));
```

---

## Prochaines étapes

- [ ] Créer un composant de détail arrondissement (`/neighborhood/[id]`)
- [ ] Implémenter la page de comparaison (`/compare`)
- [ ] Ajouter cache côté frontend
- [ ] Tester en production
- [ ] Documenter les requêtes API dans Postman

---

**Dernière mise à jour** : 8 janvier 2026
