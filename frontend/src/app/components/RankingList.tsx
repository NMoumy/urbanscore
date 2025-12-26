"use client";

import React, { useState } from "react";

type Quartier = {
  id: string;
  name: string;
  score: number;
  security: number;
  transport: number;
  leisure: number;
  cost: number;
};

const data: Quartier[] = [
  { id: "1", name: "Rosemont", score: 80, security: 88, transport: 85, leisure: 80, cost: 70 },
  { id: "2", name: "Plateau-Mont-Royal", score: 80, security: 88, transport: 85, leisure: 80, cost: 70 },
  { id: "3", name: "Outremont", score: 75, security: 85, transport: 80, leisure: 78, cost: 65 },
  { id: "4", name: "Villeray", score: 70, security: 80, transport: 75, leisure: 72, cost: 60 },
];

export default function RankingList() {
  const [sortedData] = useState(data);

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
      <h1>Classement des quartiers de Montréal</h1>

      <div style={{ marginBottom: "20px" }}>
        <button style={{ marginRight: "10px", padding: "8px 16px", cursor: "pointer" }}>Tous</button>
        <button style={{ marginRight: "10px", padding: "8px 16px", cursor: "pointer" }}>Famille</button>
        <button style={{ marginRight: "10px", padding: "8px 16px", cursor: "pointer" }}>Calme</button>
        <button style={{ marginRight: "10px", padding: "8px 16px", cursor: "pointer" }}>Étudiants</button>
        <button style={{ padding: "8px 16px", cursor: "pointer" }}>Budget</button>
      </div>

      {sortedData.map((quartier, index) => (
        <div
          key={quartier.id}
          style={{
            display: "flex",
            gap: "20px",
            padding: "15px",
            marginBottom: "10px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            alignItems: "center",
          }}
        >
          <div style={{ fontSize: "32px", fontWeight: "bold", minWidth: "40px" }}>{index + 1}</div>

          <div style={{ flex: 1 }}>
            <h3 style={{ margin: "0 0 10px 0" }}>{quartier.name}</h3>
            <div style={{ display: "flex", gap: "20px", fontSize: "14px" }}>
              <span>Sécurité {quartier.security}</span>
              <span>Transport {quartier.transport}</span>
              <span>Loisir {quartier.leisure}</span>
              <span>Coût {quartier.cost}</span>
            </div>
          </div>

          <div style={{ fontSize: "24px", fontWeight: "bold", minWidth: "80px", textAlign: "right" }}>
            Score {quartier.score}
          </div>
        </div>
      ))}
    </div>
  );
}
