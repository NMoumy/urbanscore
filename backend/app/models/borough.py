from datetime import datetime, timezone
from typing import Optional
from pydantic import BaseModel, Field


class Statistics(BaseModel):
    """Données chiffrées d'un arrondissement"""
    area_km2: Optional[float] = None
    population: Optional[int] = None
    density_per_km2: Optional[float] = None
    median_property_value: Optional[float] = None
    median_household_income: Optional[float] = None


class Attractions(BaseModel):
    """Comptage des services et équipements"""
    green_spaces: Optional[int] = None
    parks: Optional[int] = None
    libraries: Optional[int] = None
    pools: Optional[int] = None
    metro_stations: Optional[int] = None
    sports_complexes: Optional[int] = None


class Borough(BaseModel):
    """Modèle pour un arrondissement de Montréal"""
    name: str
    statistics: Statistics
    attractions: Attractions
    source: Optional[str] = None
    author: Optional[str] = None
    date_consultation: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class BoroughCreate(BaseModel):
    """Payload pour créer un arrondissement"""
    name: str
    statistics: Statistics
    attractions: Attractions
    source: Optional[str] = None
    author: Optional[str] = None
    date_consultation: Optional[str] = None


class BoroughUpdate(BaseModel):
    """Payload pour mettre à jour un arrondissement"""
    name: Optional[str] = None
    statistics: Optional[Statistics] = None
    attractions: Optional[Attractions] = None
    source: Optional[str] = None
    author: Optional[str] = None
    date_consultation: Optional[str] = None
