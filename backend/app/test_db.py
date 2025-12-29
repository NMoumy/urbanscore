"""
Script de test pour vérifier la connexion à MongoDB
Exécutez: python -m app.test_db
"""

from app.database import neighborhoods_collection, db, client

def test_connection():
    """Teste la connexion à MongoDB"""
    print("🔍 Test de connexion MongoDB...\n")
    
    try:
        # Vérifier la connexion
        client.admin.command('ping')
        print("✅ Connecté à MongoDB avec succès!")
        
        # Obtenir les informations de la base de données
        stats = db.command("dbstats")
        print(f"   Base de données: {stats['db']}")
        print(f"   Collections: {stats['collections']}")
        print(f"   Taille: {stats['dataSize']} bytes\n")
        
        # Lister les collections
        collections = db.list_collection_names()
        if collections:
            print(f"📋 Collections disponibles: {', '.join(collections)}")
        else:
            print("📋 Aucune collection - la base est vide")
        
        # Vérifier la collection neighborhoods
        count = neighborhoods_collection.count_documents({})
        print(f"\n📍 Documents dans 'neighborhoods': {count}")
        
        if count > 0:
            print("\n   Premiers documents:")
            for doc in neighborhoods_collection.find().limit(3):
                print(f"   - {doc['name']} ({doc['borough']}) - Score: {doc.get('global_score', 'N/A')}")
        
        return True
        
    except Exception as e:
        print(f"❌ Erreur lors du test: {e}")
        print("\nAssurez-vous que MongoDB est en cours d'exécution")
        return False

if __name__ == "__main__":
    test_connection()
