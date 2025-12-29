from typing import List
from app.models.neighborhood import ScoreCategory

def calculate_global_score(scores: List[ScoreCategory]) -> float:
    """
    Calcule le score global à partir des scores par catégorie
    
    Args:
        scores: Liste des scores par catégorie
        
    Returns:
        Le score global moyen
    """
    if not scores:
        return 0.0
    
    total = sum(score.score for score in scores)
    return round(total / len(scores), 2)


def normalize_score(value: float, min_val: float, max_val: float) -> float:
    """
    Normalise une valeur à une échelle 0-100
    
    Args:
        value: La valeur à normaliser
        min_val: Valeur minimale de la plage
        max_val: Valeur maximale de la plage
        
    Returns:
        Score normalisé entre 0 et 100
    """
    if max_val == min_val:
        return 50.0
    
    normalized = ((value - min_val) / (max_val - min_val)) * 100
    return max(0, min(100, round(normalized, 2)))
