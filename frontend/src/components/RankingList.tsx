"use client";

import React, { useState, useEffect } from "react";
import NeighborhoodCard from "./NeighborhoodCard";
import RankingFilters from "./RankingFilters";
import apiService, { Borough, Profile } from "@/services/api";

type NeighborhoodDisplay = {
  id: string;
  name: string;
  score: number;
  security: number;
  transport: number;
  service: number;
  cost: number;
  leisure: number;
};

const profileMap: { [key: string]: Profile } = {
  all: "general",
  Famille: "famille",
  Étudiants: "etudiant",
  "Personne âgée": "personne_agee",
  "Petit budget": "petit_budget",
};

export default function RankingList() {
  const [sortBy, setSortBy] = useState<"best" | "worst">("best");
  const [filterProfile, setFilterProfile] = useState<string>("all");
  const [neighborhoods, setNeighborhoods] = useState<NeighborhoodDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const profiles = ["Famille", "Étudiants", "Personne âgée", "Petit budget"];

  // Récupérer les données du backend
  useEffect(() => {
    const fetchRankings = async () => {
      try {
        setLoading(true);
        setError(null);

        const apiProfile = profileMap[filterProfile] || "general";
        const order = sortBy === "best" ? "desc" : "asc";

        const data = await apiService.getRankings({
          profile: apiProfile,
          sort_by: "global_score",
          order,
          limit: 20,
        });

        // Transformer les données du backend pour le frontend
        const transformed = data.map((borough: Borough, index: number) => ({
          id: `${index}`,
          name: borough.name,
          score: borough.scores?.global_score ?? 0,
          security: borough.scores?.security ?? 0,
          transport: borough.scores?.transport ?? 0,
          service: borough.scores?.services ?? 0,
          cost: borough.scores?.budget ?? 0,
          leisure: borough.scores?.leisure ?? 0,
        }));

        setNeighborhoods(transformed);
      } catch (err) {
        console.error("Erreur lors du chargement des classements:", err);
        setError("Impossible de charger les classements. Vérifiez que le backend est lancé.");
      } finally {
        setLoading(false);
      }
    };

    fetchRankings();
  }, [filterProfile, sortBy]);

  return (
    <div className="w-full pb-8">
      <RankingFilters
        sortBy={sortBy}
        setSortBy={setSortBy}
        filterCategory={filterProfile}
        setFilterCategory={setFilterProfile}
        categories={profiles}
      />

      {/* Message de chargement */}
      {loading && (
        <div className="text-center py-8">
          <p className="text-foreground">Chargement des classements...</p>
        </div>
      )}

      {/* Message d'erreur */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Liste */}
      {!loading && neighborhoods.length > 0 && (
        <div className="space-y-4">
          {neighborhoods.map((neighborhood, index) => (
            <NeighborhoodCard key={neighborhood.id} neighborhood={neighborhood} index={index} />
          ))}
        </div>
      )}

      {/* Pas de résultats */}
      {!loading && neighborhoods.length === 0 && !error && (
        <div className="text-center py-8">
          <p className="text-foreground">Aucun résultat trouvé</p>
        </div>
      )}
    </div>
  );
}
