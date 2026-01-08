// Configurations d'environnement
// Frontend appelle le backend FastAPI

const isDevelopment = process.env.NODE_ENV === "development";

export const API_BASE_URL = isDevelopment
  ? "http://localhost:8000/api"
  : process.env.NEXT_PUBLIC_API_URL || "https://urbanscore-api.herokuapp.com/api";

export const API_ENDPOINTS = {
  BOROUGHS: "/boroughs",
  RANKINGS: "/rankings",
} as const;
