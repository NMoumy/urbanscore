from typing import List, Optional

from fastapi import APIRouter, HTTPException, Query

from app.database import boroughs_collection
from backend.app.models.borough import Borough

router = APIRouter(prefix="/rankings", tags=["boroughs-rankings"])

@router.get("/", response_model=List[Borough])
async def get_borough_rankings(
    sort_by: str = Query(
        default="population",
        description="Champ de tri : population, density_per_km2, median_property_value, median_household_income, area_km2, name"
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
    Récupère le classement des arrondissements avec filtres et tri simples.
    """
    if boroughs_collection is None:
        raise HTTPException(status_code=500, detail="Base de données non disponible")
    
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
        boroughs = list(
            boroughs_collection
            .find(query_filter)
            .sort(sort_field, sort_direction)
            .skip(offset)
            .limit(limit)
        )
        
        # Convertir ObjectId en string
        for borough in boroughs:
            borough["_id"] = str(borough["_id"])
        
        return boroughs
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erreur lors de la récupération des classements : {str(e)}"
        )
