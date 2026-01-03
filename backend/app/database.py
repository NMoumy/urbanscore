from pymongo import MongoClient
from pymongo.errors import ServerSelectionTimeoutError
from app.config import settings

try:
    client = MongoClient(settings.mongo_uri, serverSelectionTimeoutMS=5000)
    # Vérifier la connexion
    client.admin.command('ping')
    db = client[settings.database_name]
    boroughs_collection = db["boroughs"]
    print("Connexion MongoDB établie")
except ServerSelectionTimeoutError:
    print(f"Erreur : MongoDB n'est pas accessible")
    print("Assurez-vous que MongoDB est en cours d'exécution")
    db = None
    boroughs_collection = None
except Exception as e:
    print(f"Erreur de connexion: {e}")
    db = None
    boroughs_collection = None
