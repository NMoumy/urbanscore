#!/usr/bin/env python3
"""
Script de vérification du setup du backend Urban Score
Exécutez: python check_setup.py
"""

import os
import sys
from pathlib import Path

def check_file_exists(path, description):
    """Vérifie si un fichier existe"""
    if os.path.exists(path):
        print(f"  ✅ {description}")
        return True
    else:
        print(f"  ❌ {description}")
        return False

def check_directory_exists(path, description):
    """Vérifie si un répertoire existe"""
    if os.path.isdir(path):
        print(f"  ✅ {description}")
        return True
    else:
        print(f"  ❌ {description}")
        return False

def check_imports():
    """Vérifie si les packages sont installés"""
    packages = {
        'fastapi': 'FastAPI',
        'uvicorn': 'Uvicorn',
        'pymongo': 'PyMongo',
        'pydantic': 'Pydantic',
        'dotenv': 'python-dotenv',
    }
    
    print("\n📦 Vérification des packages Python")
    print("=" * 50)
    
    missing = []
    for package, name in packages.items():
        try:
            __import__(package)
            print(f"  ✅ {name}")
        except ImportError:
            print(f"  ❌ {name}")
            missing.append(package)
    
    return len(missing) == 0

def check_structure():
    """Vérifie la structure des fichiers"""
    print("\n📁 Vérification de la structure des fichiers")
    print("=" * 50)
    
    checks = [
        ("app/__init__.py", "Package app"),
        ("app/config.py", "Configuration"),
        ("app/database.py", "Base de données"),
        ("app/main.py", "Application FastAPI"),
        ("app/test_db.py", "Test de connexion"),
        ("app/init_db.py", "Initialisation BD"),
        ("app/models/__init__.py", "Package models"),
        ("app/models/neighborhood.py", "Modèle Neighborhood"),
        ("app/routes/__init__.py", "Package routes"),
        ("app/routes/neighborhood.py", "Routes Neighborhood"),
        ("app/routes/rankings.py", "Routes Rankings"),
        ("app/services/__init__.py", "Package services"),
        ("app/services/score_calculator.py", "Score Calculator"),
        ("requirements.txt", "Dépendances"),
        (".env", "Variables d'environnement"),
        (".gitignore", "Git ignore"),
        ("README.md", "Documentation"),
        ("GUIDE.md", "Guide de démarrage"),
        ("SETUP_COMPLETE.md", "Résumé setup"),
        ("LEARNING_GUIDE.md", "Guide pour débutants"),
    ]
    
    all_ok = True
    for file_path, description in checks:
        if not check_file_exists(file_path, description):
            all_ok = False
    
    return all_ok

def check_env_file():
    """Vérifie le fichier .env"""
    print("\n🔧 Vérification du fichier .env")
    print("=" * 50)
    
    if not os.path.exists('.env'):
        print("  ❌ Fichier .env manquant")
        return False
    
    with open('.env', 'r') as f:
        content = f.read()
    
    required = ['MONGO_URI', 'ENVIRONMENT', 'DEBUG']
    missing = []
    
    for var in required:
        if var in content:
            print(f"  ✅ {var} configuré")
        else:
            print(f"  ❌ {var} manquant")
            missing.append(var)
    
    return len(missing) == 0

def main():
    """Fonction principale"""
    print("\n" + "=" * 50)
    print("🏙️  VÉRIFICATION SETUP - URBAN SCORE BACKEND")
    print("=" * 50)
    
    # Vérifier la structure
    structure_ok = check_structure()
    
    # Vérifier .env
    env_ok = check_env_file()
    
    # Vérifier les imports
    imports_ok = check_imports()
    
    # Résumé
    print("\n" + "=" * 50)
    print("📊 RÉSUMÉ")
    print("=" * 50)
    
    all_checks = [
        ("Fichiers et répertoires", structure_ok),
        ("Configuration .env", env_ok),
        ("Packages Python", imports_ok),
    ]
    
    passed = sum(1 for _, ok in all_checks if ok)
    total = len(all_checks)
    
    for check_name, ok in all_checks:
        status = "✅ OK" if ok else "❌ ERREUR"
        print(f"  {status} - {check_name}")
    
    print("\n" + "=" * 50)
    
    if passed == total:
        print("✨ TOUT EST EN ORDRE! Prêt à démarrer.")
        print("\nProchaines étapes:")
        print("  1. python -m app.test_db          (Tester MongoDB)")
        print("  2. python -m app.init_db          (Initialiser BD)")
        print("  3. uvicorn app.main:app --reload  (Démarrer serveur)")
        return 0
    else:
        print(f"⚠️  {total - passed} problème(s) détecté(s).")
        print("\nConsultez GUIDE.md pour l'aide.")
        return 1

if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)
