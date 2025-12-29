"""
Script pour initialiser la base de données MongoDB avec des données d'exemple
Exécutez: python -m app.init_db
"""

from app.database import neighborhoods_collection, db
from app.services.score_calculator import calculate_global_score
from datetime import datetime, timezone

# Données d'exemple de quartiers de Montréal
SAMPLE_NEIGHBORHOODS = [
    {
        "name": "Le Plateau-Mont-Royal",
        "borough": "Plateau-Mont-Royal",
        "population": 105000,
        "area_km2": 7.4,
        "median_income": 55000,
        "scores": [
            {"category": "transport", "score": 85, "description": "Excellent transport en commun"},
            {"category": "écoles", "score": 78, "description": "Bonne qualité scolaire"},
            {"category": "espaces_verts", "score": 72, "description": "Parcs et espaces verts"},
            {"category": "commerces", "score": 88, "description": "Commerces et restaurants"},
            {"category": "sécurité", "score": 75, "description": "Indice de criminalité moyen"},
        ],
    },
    {
        "name": "Vieux-Montréal",
        "borough": "Vieux-Montréal",
        "population": 4200,
        "area_km2": 1.3,
        "median_income": 48000,
        "scores": [
            {"category": "transport", "score": 90, "description": "Excellent accès au transport"},
            {"category": "écoles", "score": 65, "description": "Peu d'écoles, zone résidentielle limitée"},
            {"category": "espaces_verts", "score": 60, "description": "Limité, zone urbaine dense"},
            {"category": "commerces", "score": 95, "description": "Commerce touristique important"},
            {"category": "sécurité", "score": 70, "description": "Surveillance touristique"},
        ],
    },
    {
        "name": "Outremont",
        "borough": "Outremont",
        "population": 27000,
        "area_km2": 3.5,
        "median_income": 75000,
        "scores": [
            {"category": "transport", "score": 75, "description": "Bon accès au transport"},
            {"category": "écoles", "score": 88, "description": "Excellentes écoles"},
            {"category": "espaces_verts", "score": 80, "description": "Bons espaces verts"},
            {"category": "commerces", "score": 82, "description": "Bonne variété commerciale"},
            {"category": "sécurité", "score": 85, "description": "Très sûr"},
        ],
    },
    {
        "name": "Griffintown",
        "borough": "Sud-Ouest",
        "population": 8500,
        "area_km2": 1.8,
        "median_income": 52000,
        "scores": [
            {"category": "transport", "score": 80, "description": "Bon transport, près du canal"},
            {"category": "écoles", "score": 70, "description": "Écoles en développement"},
            {"category": "espaces_verts", "score": 75, "description": "Canal de Lachine"},
            {"category": "commerces", "score": 85, "description": "Commerces en croissance"},
            {"category": "sécurité", "score": 72, "description": "En amélioration"},
        ],
    },
]

def init_db():
    """Initialise la base de données avec les données d'exemple"""
    
    if neighborhoods_collection is None:
        print("❌ Erreur : Impossible de se connecter à MongoDB")
        print("   Assurez-vous que:")
        print("   1. MongoDB est installé et en cours d'exécution")
        print("   2. La variable MONGO_URI dans .env est correcte")
        return
    
    try:
        # Vérifier si la collection contient déjà des données
        count = neighborhoods_collection.count_documents({})
        if count > 0:
            print(f"ℹ️  La collection contient déjà {count} documents")
            response = input("Voulez-vous réinitialiser la base de données? (oui/non): ")
            if response.lower() != "oui":
                print("Opération annulée")
                return
            neighborhoods_collection.delete_many({})
            print("✅ Base de données vidée")
        
        # Ajouter les scores globaux et insérer les données
        for neighborhood in SAMPLE_NEIGHBORHOODS:
            # Calculer le score global depuis les scores
            total_score = sum(s["score"] for s in neighborhood["scores"])
            global_score = round(total_score / len(neighborhood["scores"]), 2) if neighborhood["scores"] else 0.0
            
            neighborhood["global_score"] = global_score
            neighborhood["created_at"] = datetime.now(timezone.utc)
            neighborhood["updated_at"] = datetime.now(timezone.utc)
        
        result = neighborhoods_collection.insert_many(SAMPLE_NEIGHBORHOODS)
        print(f"✅ {len(result.inserted_ids)} quartiers ajoutés à la base de données")
        
        # Afficher les quartiers insérés
        all_neighborhoods = neighborhoods_collection.find()
        print("\n📍 Quartiers dans la base de données:")
        for neighborhood in all_neighborhoods:
            print(f"  - {neighborhood['name']} ({neighborhood['borough']}) - Score global: {neighborhood['global_score']}")
        
    except Exception as e:
        print(f"❌ Erreur lors de l'initialisation: {e}")


if __name__ == "__main__":
    init_db()
