from pymongo import MongoClient
from pymongo.errors import ServerSelectionTimeoutError
from app.config import settings

try:
    client = MongoClient(settings.mongo_uri, serverSelectionTimeoutMS=5000)
    # Vérifier la connexion
    client.admin.command('ping')
    db = client[settings.database_name]
    neighborhoods_collection = db["neighborhoods"]
    print("✅ Connexion MongoDB établie")
except ServerSelectionTimeoutError:
    print("❌ Erreur : MongoDB n'est pas accessible à", settings.mongo_uri)
    print("   Assurez-vous que MongoDB est en cours d'exécution")
    db = None
    neighborhoods_collection = None
except Exception as e:
    print(f"❌ Erreur de connexion: {e}")
    db = None
    neighborhoods_collection = None
