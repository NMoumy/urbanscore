"use client";

import React, { useState, useMemo } from "react";
import NeighborhoodCard from "./NeighborhoodCard";
import RankingFilters from "./RankingFilters";

type Neighborhood = {
  id: string;
  name: string;
  score: number;
  security: number;
  transport: number;
  service: number;
  cost: number;
  leisure: number;
};

const data: Neighborhood[] = [
  { id: "1", name: "Rosemont", score: 82, security: 96, transport: 81, service: 78, cost: 82, leisure: 83 },
  { id: "2", name: "Plateau-Mont-Royal", score: 82, security: 78, transport: 81, service: 85, cost: 50, leisure: 75 },
  { id: "3", name: "Villeray", score: 82, security: 88, transport: 84, service: 82, cost: 75, leisure: 80 },
  { id: "4", name: "Outremont", score: 75, security: 85, transport: 80, service: 78, cost: 65, leisure: 70 },
];

export default function RankingList() {
  const [sortBy, setSortBy] = useState<"best" | "worst">("best");
  const [filterProfile, setFilterProfile] = useState<string>("all");

  const sortedData = useMemo(() => {
    const filtered = filterProfile === "all" ? data : data.filter((n) => n.name === filterProfile);
    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === "best") return b.score - a.score;
      if (sortBy === "worst") return a.score - b.score;
      return 0;
    });
    return sorted;
  }, [sortBy, filterProfile]);

  const profiles = ["Famille", "Étudiants", "Personne âgée", "Petit budget"];

  return (
    <div className="w-full pb-8">
      <RankingFilters
        sortBy={sortBy}
        setSortBy={setSortBy}
        filterCategory={filterProfile}
        setFilterCategory={setFilterProfile}
        categories={profiles}
      />

      {/* Liste */}
      <div className="space-y-4">
        {sortedData.map((neighborhood, index) => (
          <NeighborhoodCard key={neighborhood.id} neighborhood={neighborhood} index={index} />
        ))}
      </div>
    </div>
  );
}
