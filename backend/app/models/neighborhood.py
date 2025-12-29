from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime, timezone

class ScoreCategory(BaseModel):
    """Catégorie de score d'un quartier"""
    category: str  # ex: "transport", "écoles", "espaces_verts"
    score: float = Field(ge=0, le=100)
    description: Optional[str] = None

class Neighborhood(BaseModel):
    """Modèle pour un quartier de Montréal"""
    name: str
    borough: str  # Arrondissement
    population: Optional[int] = None
    area_km2: Optional[float] = None
    median_income: Optional[float] = None
    
    # Scores par catégorie
    scores: List[ScoreCategory] = []
    global_score: float = Field(default=0, ge=0, le=100)
    
    # Métadonnées
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class NeighborhoodCreate(BaseModel):
    """Modèle pour créer un quartier"""
    name: str
    borough: str
    population: Optional[int] = None
    area_km2: Optional[float] = None
    median_income: Optional[float] = None
    scores: List[ScoreCategory] = []

class NeighborhoodUpdate(BaseModel):
    """Modèle pour mettre à jour un quartier"""
    name: Optional[str] = None
    borough: Optional[str] = None
    population: Optional[int] = None
    area_km2: Optional[float] = None
    median_income: Optional[float] = None
    scores: Optional[List[ScoreCategory]] = None
