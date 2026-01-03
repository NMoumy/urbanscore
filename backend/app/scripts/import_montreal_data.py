"""Importe les données réelles JSON dans MongoDB.

Usage depuis la racine du projet :
    python -m app.scripts.import_montreal_data
"""

import json
from datetime import datetime, timezone
from pathlib import Path

from app.database import boroughs_collection

# Chemin vers le JSON à la racine du projet
DATA_PATH = Path(__file__).resolve().parents[2] / "data" / "borough.json"


def load_boroughs(json_path: Path = DATA_PATH) -> int:
    """Charge le fichier JSON et insère/écrase les données dans MongoDB."""
    if boroughs_collection is None:
        print("Base de données non disponible")
        return 0

    if not json_path.exists():
        print(f"Fichier introuvable : {json_path}")
        return 0

    with json_path.open("r", encoding="utf-8") as fh:
        raw = json.load(fh)

    if not isinstance(raw, list):
        print("Format inattendu : le JSON doit contenir une liste")
        return 0

    metadata = {}
    entries = raw
    if raw and isinstance(raw[0], dict) and "source" in raw[0]:
        metadata = raw[0]
        entries = raw[1:]

    docs = []
    now = datetime.now(timezone.utc)
    for entry in entries:
        if not isinstance(entry, dict) or "name" not in entry:
            continue

        doc = {
            "name": entry.get("name"),
            "statistics": entry.get("statistics", {}),
            "attractions": entry.get("attractions", {}),
            "date_consultation": metadata.get("date_consultation"),
            "created_at": now,
            "updated_at": now,
        }
        docs.append(doc)

    if not docs:
        print("Aucun enregistrement valide dans le fichier")
        return 0

    deleted = boroughs_collection.delete_many({}).deleted_count
    print(f"Suppression de {deleted} documents existants")

    result = boroughs_collection.insert_many(docs)
    print(f"Insertion de {len(result.inserted_ids)} arrondissements depuis {json_path.name}")
    return len(result.inserted_ids)


def main():
    load_boroughs()


if __name__ == "__main__":
    main()
