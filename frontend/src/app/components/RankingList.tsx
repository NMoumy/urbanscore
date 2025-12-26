"use client";

import React, { useState, useMemo } from "react";
import QuartierCard from "./QuartierCard";
import RankingFilters from "./RankingFilters";

type Quartier = {
  id: string;
  name: string;
  score: number;
  security: number;
  transport: number;
  service: number;
  cost: number;
  leisure: number;
};

const data: Quartier[] = [
  { id: "1", name: "Rosemont", score: 82, security: 96, transport: 81, service: 78, cost: 82, leisure: 83 },
  { id: "2", name: "Plateau-Mont-Royal", score: 82, security: 78, transport: 81, service: 85, cost: 50, leisure: 75 },
  { id: "3", name: "Villeray", score: 82, security: 88, transport: 84, service: 82, cost: 75, leisure: 80 },
  { id: "4", name: "Outremont", score: 75, security: 85, transport: 80, service: 78, cost: 65, leisure: 70 },
];

export default function RankingList() {
  const [sortBy, setSortBy] = useState<"score" | "name">("score");
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const sortedData = useMemo(() => {
    const filtered = filterCategory === "all" ? data : data.filter((q) => q.name === filterCategory);
    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === "score") return b.score - a.score;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return 0;
    });
    return sorted;
  }, [sortBy, filterCategory]);

  const categories = useMemo(() => data.map((q) => q.name), []);

  return (
    <div className="w-full pb-8">
      <RankingFilters
        sortBy={sortBy}
        setSortBy={setSortBy}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        categories={categories}
      />

      {/* Liste */}
      {/* <div className="space-y-4">
        {sortedData.map((quartier, index) => (
          <QuartierCard key={quartier.id} quartier={quartier} index={index} />
        ))}
      </div> */}
    </div>
  );
}
