from datetime import datetime, timezone
from typing import List

from bson import ObjectId
from fastapi import APIRouter, HTTPException

from app.database import boroughs_collection
from backend.app.models.borough import Borough, BoroughCreate, BoroughUpdate

router = APIRouter(prefix="/boroughs", tags=["boroughs"])

@router.get("/", response_model=List[Borough])
async def get_all_boroughs():
    """
    Récupère tous les arrondissements
    """
    if boroughs_collection is None:
        raise HTTPException(status_code=500, detail="Base de données non disponible")
    
    boroughs = list(boroughs_collection.find())
    
    # Convertir ObjectId en string pour la sérialisation
    for borough in boroughs:
        borough["_id"] = str(borough["_id"])
    
    return boroughs


@router.get("/{borough_id}", response_model=Borough)
async def get_borough(borough_id: str):
    """
    Récupère un arrondissement par son ID
    """
    if boroughs_collection is None:
        raise HTTPException(status_code=500, detail="Base de données non disponible")
    
    try:
        borough = boroughs_collection.find_one({"_id": ObjectId(borough_id)})
        
        if not borough:
            raise HTTPException(status_code=404, detail="Arrondissement non trouvé")
        
        borough["_id"] = str(borough["_id"])
        return borough
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"ID invalide: {str(e)}")


@router.post("/", response_model=dict)
async def create_borough(borough: BoroughCreate):
    """
    Crée un nouvel arrondissement
    """
    if boroughs_collection is None:
        raise HTTPException(status_code=500, detail="Base de données non disponible")
    
    # Préparer le document aligné sur les données réelles
    doc = borough.model_dump()
    doc["created_at"] = datetime.now(timezone.utc)
    doc["updated_at"] = datetime.now(timezone.utc)
    
    result = boroughs_collection.insert_one(doc)
    
    return {
        "id": str(result.inserted_id),
        "message": "Arrondissement créé avec succès"
    }


@router.put("/{borough_id}", response_model=dict)
async def update_borough(borough_id: str, borough: BoroughUpdate):
    """
    Met à jour un arrondissement
    """
    if boroughs_collection is None:
        raise HTTPException(status_code=500, detail="Base de données non disponible")
    
    try:
        # Préparer les données à mettre à jour
        update_data = {}
        
        if borough.name is not None:
            update_data["name"] = borough.name

        if borough.statistics is not None:
            stats = {
                key: value
                for key, value in borough.statistics.model_dump().items()
                if value is not None
            }
            update_data.update({f"statistics.{k}": v for k, v in stats.items()})

        if borough.attractions is not None:
            attrs = {
                key: value
                for key, value in borough.attractions.model_dump().items()
                if value is not None
            }
            update_data.update({f"attractions.{k}": v for k, v in attrs.items()})

        if borough.source is not None:
            update_data["source"] = borough.source
        if borough.author is not None:
            update_data["author"] = borough.author
        if borough.date_consultation is not None:
            update_data["date_consultation"] = borough.date_consultation

        update_data["updated_at"] = datetime.now(timezone.utc)

        result = boroughs_collection.update_one(
            {"_id": ObjectId(borough_id)},
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Arrondissement non trouvé")
        
        return {"message": "Arrondissement mis à jour avec succès"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Erreur: {str(e)}")


@router.delete("/{borough_id}", response_model=dict)
async def delete_borough(borough_id: str):
    """
    Supprime un arrondissement
    """
    if boroughs_collection is None:
        raise HTTPException(status_code=500, detail="Base de données non disponible")
    
    try:
        result = boroughs_collection.delete_one({"_id": ObjectId(borough_id)})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Arrondissement non trouvé")
        
        return {"message": "Arrondissement supprimé avec succès"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Erreur: {str(e)}")



