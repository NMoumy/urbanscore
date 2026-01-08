// Service API pour toutes les requêtes HTTP au backend

import { API_BASE_URL, API_ENDPOINTS } from "@/config/api";

export type Borough = {
  name: string;
  statistics: {
    area_km2?: number;
    population?: number;
    density_per_km2?: number;
    median_property_value?: number;
    median_household_income?: number;
  };
  attractions: {
    green_spaces?: number;
    parks?: number;
    libraries?: number;
    pools?: number;
    metro_stations?: number;
    sports_complexes?: number;
  };
  scores?: {
    global_score: number;
    transport: number;
    leisure: number;
    services: number;
    budget: number;
    security: number;
  };
  created_at: string;
  updated_at: string;
};

export type Profile = "general" | "famille" | "etudiant" | "personne_agee" | "petit_budget";

export type RankingsParams = {
  sort_by?: string;
  order?: "asc" | "desc";
  limit?: number;
  offset?: number;
  profile?: Profile;
  min_population?: number;
  max_population?: number;
  min_income?: number;
};

class ApiService {
  /**
   * Récupère tous les arrondissements (sans scores)
   */
  async getBoroughs(): Promise<Borough[]> {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.BOROUGHS}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    } catch (error) {
      console.error("Erreur getBoroughs:", error);
      throw error;
    }
  }

  /**
   * Récupère le classement avec tri, filtres et scores basés sur le profil
   */
  async getRankings(params: RankingsParams = {}): Promise<Borough[]> {
    try {
      const queryParams = new URLSearchParams();

      if (params.sort_by) queryParams.append("sort_by", params.sort_by);
      if (params.order) queryParams.append("order", params.order);
      if (params.limit) queryParams.append("limit", params.limit.toString());
      if (params.offset) queryParams.append("offset", params.offset.toString());
      if (params.profile) queryParams.append("profile", params.profile);
      if (params.min_population) queryParams.append("min_population", params.min_population.toString());
      if (params.max_population) queryParams.append("max_population", params.max_population.toString());
      if (params.min_income) queryParams.append("min_income", params.min_income.toString());

      const url = `${API_BASE_URL}${API_ENDPOINTS.RANKINGS}?${queryParams.toString()}`;
      const response = await fetch(url);

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    } catch (error) {
      console.error("Erreur getRankings:", error);
      throw error;
    }
  }

  /**
   * Récupère un arrondissement spécifique
   */
  async getBorough(id: string): Promise<Borough> {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.BOROUGHS}/${id}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    } catch (error) {
      console.error("Erreur getBorough:", error);
      throw error;
    }
  }

  /**
   * Crée un nouvel arrondissement
   */
  async createBorough(borough: Omit<Borough, "created_at" | "updated_at">) {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.BOROUGHS}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(borough),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    } catch (error) {
      console.error("Erreur createBorough:", error);
      throw error;
    }
  }

  /**
   * Met à jour un arrondissement
   */
  async updateBorough(id: string, updates: Partial<Borough>) {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.BOROUGHS}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    } catch (error) {
      console.error("Erreur updateBorough:", error);
      throw error;
    }
  }

  /**
   * Supprime un arrondissement
   */
  async deleteBorough(id: string) {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.BOROUGHS}/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    } catch (error) {
      console.error("Erreur deleteBorough:", error);
      throw error;
    }
  }
}

export default new ApiService();
