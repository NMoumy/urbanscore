"use client";

import React from "react";
import StarRating from "./StarRating";

type QuartierCardProps = {
  quartier: {
    id: string;
    name: string;
    score: number;
    security: number;
    transport: number;
    service: number;
    cost: number;
    leisure: number;
  };
  index: number;
};

export default function QuartierCard({ quartier, index }: QuartierCardProps) {
  const details = [
    { label: "Sécurité", value: quartier.security },
    { label: "Transport", value: quartier.transport },
    { label: "Service", value: quartier.service },
    { label: "Budget", value: quartier.cost },
    { label: "Loisirs", value: quartier.leisure },
  ];

  return (
    <div className="bg-white border border-gray-light rounded-lg px-10 py-6">
      {/* En-tête avec numéro, nom, étoiles, score */}
      <div className="flex items-center gap-3 mb-2">
        <div
          className={`shrink-0 w-8 h-8 rounded flex items-center justify-center text-white font-semibold text-sm ${
            index === 0 ? "bg-green-400 border-green-500 border" : index <= 2 ? "bg-orange-500" : "bg-red-500"
          }`}
        >
          {index + 1}
        </div>
        <h3 className="text-xl font-semibold ">{quartier.name}</h3>
        <StarRating score={quartier.score} />
        <button className="ml-auto btn-primary-small">Voir le quartier</button>
      </div>

      <p className="mb-4 ml-11">Score global {quartier.score}</p>

      {/* Horizontal line */}
      <div className="line-horizontal"></div>

      {/* Détails */}
      <div className="flex justify-between gap-x-5 gap-4 ml-11">
        {details.map((detail) => (
          <div key={detail.label} className="flex items-center gap-2">
            <p className="text-black">{detail.label} :</p>
            <p className="font-medium text-accent">{detail.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
