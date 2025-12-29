from fastapi import APIRouter, HTTPException, status
from bson import ObjectId
from typing import List
from app.database import neighborhoods_collection
from app.models.neighborhood import Neighborhood, NeighborhoodCreate, NeighborhoodUpdate
from app.services.score_calculator import calculate_global_score
from datetime import datetime, timezone

router = APIRouter(prefix="/neighborhoods", tags=["neighborhoods"])

@router.get("/", response_model=List[Neighborhood])
async def get_all_neighborhoods():
    """
    Récupère tous les quartiers
    """
    if not neighborhoods_collection:
        raise HTTPException(status_code=500, detail="Base de données non disponible")
    
    neighborhoods = list(neighborhoods_collection.find())
    
    # Convertir ObjectId en string pour la sérialisation
    for neighborhood in neighborhoods:
        neighborhood["_id"] = str(neighborhood["_id"])
    
    return neighborhoods


@router.get("/{neighborhood_id}", response_model=Neighborhood)
async def get_neighborhood(neighborhood_id: str):
    """
    Récupère un quartier par son ID
    """
    if not neighborhoods_collection:
        raise HTTPException(status_code=500, detail="Base de données non disponible")
    
    try:
        neighborhood = neighborhoods_collection.find_one({"_id": ObjectId(neighborhood_id)})
        
        if not neighborhood:
            raise HTTPException(status_code=404, detail="Quartier non trouvé")
        
        neighborhood["_id"] = str(neighborhood["_id"])
        return neighborhood
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"ID invalide: {str(e)}")


@router.post("/", response_model=dict)
async def create_neighborhood(neighborhood: NeighborhoodCreate):
    """
    Crée un nouveau quartier
    """
    if not neighborhoods_collection:
        raise HTTPException(status_code=500, detail="Base de données non disponible")
    
    # Calculer le score global
    global_score = calculate_global_score(neighborhood.scores)
    
    # Préparer le document
    doc = {
        "name": neighborhood.name,
        "borough": neighborhood.borough,
        "population": neighborhood.population,
        "area_km2": neighborhood.area_km2,
        "median_income": neighborhood.median_income,
        "scores": [score.dict() for score in neighborhood.scores],
        "global_score": global_score,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    }
    
    result = neighborhoods_collection.insert_one(doc)
    
    return {
        "id": str(result.inserted_id),
        "message": "Quartier créé avec succès"
    }


@router.put("/{neighborhood_id}", response_model=dict)
async def update_neighborhood(neighborhood_id: str, neighborhood: NeighborhoodUpdate):
    """
    Met à jour un quartier
    """
    if not neighborhoods_collection:
        raise HTTPException(status_code=500, detail="Base de données non disponible")
    
    try:
        # Préparer les données à mettre à jour
        update_data = {}
        
        if neighborhood.name is not None:
            update_data["name"] = neighborhood.name
        if neighborhood.borough is not None:
            update_data["borough"] = neighborhood.borough
        if neighborhood.population is not None:
            update_data["population"] = neighborhood.population
        if neighborhood.area_km2 is not None:
            update_data["area_km2"] = neighborhood.area_km2
        if neighborhood.median_income is not None:
            update_data["median_income"] = neighborhood.median_income
        
        if neighborhood.scores is not None:
            update_data["scores"] = [score.dict() for score in neighborhood.scores]
            update_data["global_score"] = calculate_global_score(neighborhood.scores)
        
        update_data["updated_at"] = datetime.now(timezone.utc)
        
        result = neighborhoods_collection.update_one(
            {"_id": ObjectId(neighborhood_id)},
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Quartier non trouvé")
        
        return {"message": "Quartier mis à jour avec succès"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Erreur: {str(e)}")


@router.delete("/{neighborhood_id}", response_model=dict)
async def delete_neighborhood(neighborhood_id: str):
    """
    Supprime un quartier
    """
    if not neighborhoods_collection:
        raise HTTPException(status_code=500, detail="Base de données non disponible")
    
    try:
        result = neighborhoods_collection.delete_one({"_id": ObjectId(neighborhood_id)})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Quartier non trouvé")
        
        return {"message": "Quartier supprimé avec succès"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Erreur: {str(e)}")


@router.get("/borough/{borough_name}")
async def get_neighborhoods_by_borough(borough_name: str):
    """
    Récupère tous les quartiers d'un arrondissement
    """
    if not neighborhoods_collection:
        raise HTTPException(status_code=500, detail="Base de données non disponible")
    
    neighborhoods = list(neighborhoods_collection.find({"borough": borough_name}))
    
    if not neighborhoods:
        raise HTTPException(status_code=404, detail="Aucun quartier trouvé pour cet arrondissement")
    
    for neighborhood in neighborhoods:
        neighborhood["_id"] = str(neighborhood["_id"])
    
    return neighborhoods
