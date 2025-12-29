from fastapi import APIRouter

router = APIRouter(prefix="/rankings", tags=["rankings"])

@router.get("/")
async def get_rankings():
    """
    Récupère le classement des quartiers par score
    """
    return {"message": "Rankings endpoint - À implémenter"}
