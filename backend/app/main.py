from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import ALLOWED_ORIGINS
from app.routes.borough import router as boroughs_router
from app.routes.rankings import router as rankings_router

app = FastAPI(
    title="Urban Score API",
    description="API pour classifier et comparer les arrondissements de Montréal",
    version="1.0.0"
)

# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclusion des routes
app.include_router(boroughs_router, prefix="/api")
app.include_router(rankings_router, prefix="/api")

@app.get("/")
def root():
    return {
        "message": "Urban Score API is running",
        "version": "1.0.0",
        "docs": "/docs",
        "redoc": "/redoc"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}
