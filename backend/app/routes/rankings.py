from typing import List, Optional

from fastapi import APIRouter, HTTPException, Query

from app.database import boroughs_collection
from app.services.score_calculator import calculate_scores_by_profile
from backend.app.models.borough import Borough

router = APIRouter(prefix="/rankings", tags=["boroughs-rankings"])

@router.get("/", response_model=List[Borough])
async def get_borough_rankings(
    sort_by: str = Query(
        default="global_score",
        description="Champ de tri : global_score, population, density_per_km2, median_property_value, median_household_income, area_km2, name"
    ),
    order: str = Query(
        default="desc",
        description="Ordre de tri : 'asc' (croissant) ou 'desc' (décroissant)"
    ),
    limit: int = Query(
        default=10,
        ge=1,
        le=100,
        description="Nombre de résultats (max 100)"
    ),
    offset: int = Query(
        default=0,
        ge=0,
        description="Pagination : nombre de résultats à sauter"
    ),
    profile: str = Query(
        default="general",
        description="Profil de calcul du score : general, famille, etudiant, personne_agee, petit_budget"
    ),
    min_population: Optional[int] = Query(
        default=None,
        ge=0,
        description="Population minimum"
    ),
    max_population: Optional[int] = Query(
        default=None,
        ge=0,
        description="Population maximum"
    ),
    min_income: Optional[int] = Query(
        default=None,
        ge=0,
        description="Revenu médian minimum"
    )
):
    """
    Récupère le classement des arrondissements avec filtres, tri et profil utilisateur.
    Le score global est calculé selon le profil sélectionné avec des pondérations différentes.
    """
    if boroughs_collection is None:
        raise HTTPException(status_code=500, detail="Base de données non disponible")
    
    # Validation du profil
    valid_profiles = ["general", "famille", "etudiant", "personne_agee", "petit_budget"]
    if profile not in valid_profiles:
        raise HTTPException(
            status_code=400,
            detail=f"Profil invalide. Utilisez : {', '.join(valid_profiles)}"
        )
    
    # Construction du filtre MongoDB
    query_filter = {}

    if min_population is not None or max_population is not None:
        population_filter = {}
        if min_population is not None:
            population_filter["$gte"] = min_population
        if max_population is not None:
            population_filter["$lte"] = max_population
        query_filter["statistics.population"] = population_filter

    if min_income is not None:
        query_filter["statistics.median_household_income"] = {"$gte": min_income}

    # Validation du champ de tri
    valid_sort_fields = {
        "global_score": "global_score",
        "population": "statistics.population",
        "density_per_km2": "statistics.density_per_km2",
        "median_property_value": "statistics.median_property_value",
        "median_household_income": "statistics.median_household_income",
        "area_km2": "statistics.area_km2",
        "name": "name",
    }

    if sort_by not in valid_sort_fields:
        raise HTTPException(
            status_code=400,
            detail=f"Champ de tri invalide. Utilisez : {', '.join(valid_sort_fields.keys())}"
        )

    sort_field = valid_sort_fields[sort_by]
    
    # Direction du tri
    sort_direction = -1 if order.lower() == "desc" else 1
    
    # Requête MongoDB avec tri, limite et offset
    try:
        # Si on trie par global_score, on doit d'abord calculer le score pour chaque arrondissement
        if sort_by == "global_score":
            # Récupérer tous les arrondissements (avec filtres)
            boroughs = list(boroughs_collection.find(query_filter))
            
            # Calculer tous les scores pour chaque arrondissement selon le profil
            for borough in boroughs:
                scores = calculate_scores_by_profile(borough, profile)
                borough["scores"] = scores
                borough["_id"] = str(borough["_id"])
            
            # Trier par score global en Python
            boroughs.sort(key=lambda x: x.get("scores", {}).get("global_score", 0), reverse=(sort_direction == -1))
            
            # Appliquer pagination
            boroughs = boroughs[offset:offset + limit]
        else:
            # Pour les autres champs, utiliser le tri MongoDB standard
            boroughs = list(
                boroughs_collection
                .find(query_filter)
                .sort(sort_field, sort_direction)
                .skip(offset)
                .limit(limit)
            )
            
            # Convertir ObjectId en string et ajouter tous les scores selon le profil
            for borough in boroughs:
                borough["_id"] = str(borough["_id"])
                scores = calculate_scores_by_profile(borough, profile)
                borough["scores"] = scores
        
        return boroughs
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erreur lors de la récupération des classements : {str(e)}"
        )
