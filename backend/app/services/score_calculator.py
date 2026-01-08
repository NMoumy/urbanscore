from typing import Dict, Any


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


def calculate_transport_score(borough: Dict[str, Any]) -> float:
    """
    Calcule le score de transport basé sur les stations de métro.
    Score maximum: 100 points
    
    Args:
        borough: Dictionnaire contenant les données de l'arrondissement
        
    Returns:
        Score de transport sur 100
    """
    attrs = borough.get("attractions", {})
    metro = attrs.get("metro_stations", 0) or 0
    
    # 12+ stations = 100 pts, 0 station = 0 pts
    score = min((metro / 12) * 100, 100)
    return round(score, 2)


def calculate_leisure_score(borough: Dict[str, Any]) -> float:
    """
    Calcule le score de loisirs basé sur parcs, espaces verts et complexes sportifs.
    Score maximum: 100 points
    
    Args:
        borough: Dictionnaire contenant les données de l'arrondissement
        
    Returns:
        Score de loisirs sur 100
    """
    attrs = borough.get("attractions", {})
    parks = attrs.get("parks", 0) or 0
    green_spaces = attrs.get("green_spaces", 0) or 0
    sports = attrs.get("sports_complexes", 0) or 0
    
    # Pondération: parcs (40%), espaces verts (35%), complexes sportifs (25%)
    parks_score = min((parks / 50) * 40, 40)
    green_score = min((green_spaces / 100) * 35, 35)
    sports_score = min((sports / 2) * 25, 25)
    
    total_score = parks_score + green_score + sports_score
    return round(total_score, 2)


def calculate_services_score(borough: Dict[str, Any]) -> float:
    """
    Calcule le score de services basé sur bibliothèques et piscines.
    Score maximum: 100 points
    
    Args:
        borough: Dictionnaire contenant les données de l'arrondissement
        
    Returns:
        Score de services sur 100
    """
    attrs = borough.get("attractions", {})
    libraries = attrs.get("libraries", 0) or 0
    pools = attrs.get("pools", 0) or 0
    
    # Pondération: bibliothèques (60%), piscines (40%)
    library_score = min((libraries / 5) * 60, 60)
    pool_score = min((pools / 7) * 40, 40)
    
    total_score = library_score + pool_score
    return round(total_score, 2)


def calculate_budget_score(borough: Dict[str, Any]) -> float:
    """
    Calcule le score de budget (inversement proportionnel à la valeur des propriétés).
    Score maximum: 100 points
    
    Args:
        borough: Dictionnaire contenant les données de l'arrondissement
        
    Returns:
        Score de budget sur 100
    """
    stats = borough.get("statistics", {})
    property_value = stats.get("median_property_value")
    
    if not property_value:
        return 50.0  # Score neutre si pas de données
    
    # Plus c'est abordable, meilleur est le score
    # 250k$ = 100pts, 850k$ = 0pts
    min_value = 250000
    max_value = 850000
    
    if property_value <= min_value:
        return 100.0
    elif property_value >= max_value:
        return 0.0
    
    score = 100 - ((property_value - min_value) / (max_value - min_value) * 100)
    return round(score, 2)


def calculate_security_score(borough: Dict[str, Any]) -> float:
    """
    Calcule le score de sécurité basé sur le revenu médian (proxy temporaire).
    Score maximum: 100 points
    
    Args:
        borough: Dictionnaire contenant les données de l'arrondissement
        
    Returns:
        Score de sécurité sur 100
    """
    stats = borough.get("statistics", {})
    income = stats.get("median_household_income")
    
    if not income:
        return 50.0  # Score neutre si pas de données
    
    # Revenu médian comme proxy de sécurité
    # 30k$ = 0pts, 95k$ = 100pts
    min_income = 30000
    max_income = 95000
    
    if income >= max_income:
        return 100.0
    elif income <= min_income:
        return 0.0
    
    score = ((income - min_income) / (max_income - min_income)) * 100
    return round(score, 2)


def calculate_all_scores(borough: Dict[str, Any]) -> Dict[str, float]:
    """
    Calcule tous les scores pour un arrondissement.
    
    Args:
        borough: Dictionnaire contenant les données de l'arrondissement
        
    Returns:
        Dictionnaire avec tous les scores
    """
    transport = calculate_transport_score(borough)
    leisure = calculate_leisure_score(borough)
    services = calculate_services_score(borough)
    budget = calculate_budget_score(borough)
    security = calculate_security_score(borough)
    
    # Score global: moyenne pondérée par défaut
    # Transport: 30%, Loisirs: 25%, Budget: 20%, Services: 15%, Sécurité: 10%
    global_score = (
        transport * 0.30 +
        leisure * 0.25 +
        budget * 0.20 +
        services * 0.15 +
        security * 0.10
    )
    
    return {
        "global_score": round(global_score, 2),
        "transport": transport,
        "leisure": leisure,
        "services": services,
        "budget": budget,
        "security": security
    }


def calculate_scores_by_profile(borough: Dict[str, Any], profile: str = "general") -> Dict[str, float]:
    """
    Calcule les scores selon le profil utilisateur avec des pondérations différentes.
    
    Args:
        borough: Dictionnaire contenant les données de l'arrondissement
        profile: Type de profil ('general', 'famille', 'etudiant', 'personne_agee', 'petit_budget')
        
    Returns:
        Dictionnaire avec tous les scores dont global_score adapté au profil
    """
    transport = calculate_transport_score(borough)
    leisure = calculate_leisure_score(borough)
    services = calculate_services_score(borough)
    budget = calculate_budget_score(borough)
    security = calculate_security_score(borough)
    
    # Pondérations selon le profil
    weights = {
        "general": {
            "transport": 0.30,
            "leisure": 0.25,
            "budget": 0.20,
            "services": 0.15,
            "security": 0.10
        },
        "famille": {
            "transport": 0.20,
            "leisure": 0.25,
            "budget": 0.15,
            "services": 0.25,  # Plus important pour les écoles
            "security": 0.15   # Plus important pour la sécurité
        },
        "etudiant": {
            "transport": 0.35,  # Très important
            "leisure": 0.15,
            "budget": 0.35,     # Très important
            "services": 0.10,   # Bibliothèques
            "security": 0.05
        },
        "personne_agee": {
            "transport": 0.30,  # Accès au métro important
            "leisure": 0.15,    # Parcs pour se promener
            "budget": 0.20,
            "services": 0.25,   # Services de santé, proximité
            "security": 0.10
        },
        "petit_budget": {
            "transport": 0.25,
            "leisure": 0.10,
            "budget": 0.50,     # Priorité absolue
            "services": 0.10,
            "security": 0.05
        }
    }
    
    # Utiliser les poids du profil ou ceux par défaut
    profile_weights = weights.get(profile, weights["general"])
    
    # Calculer le score global avec les pondérations du profil
    global_score = (
        transport * profile_weights["transport"] +
        leisure * profile_weights["leisure"] +
        budget * profile_weights["budget"] +
        services * profile_weights["services"] +
        security * profile_weights["security"]
    )
    
    return {
        "global_score": round(global_score, 2),
        "transport": transport,
        "leisure": leisure,
        "services": services,
        "budget": budget,
        "security": security
    }


def calculate_borough_score(borough: Dict[str, Any]) -> float:
    """
    Calcule le score global d'un arrondissement.
    
    Args:
        borough: Dictionnaire contenant les données de l'arrondissement
        
    Returns:
        Score global sur 100 points
    """
    scores = calculate_all_scores(borough)
    return scores["global_score"]
