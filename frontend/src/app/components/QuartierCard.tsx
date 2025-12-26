"use client";

import React from "react";
import { StarIcon } from "@phosphor-icons/react";

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
  const renderStarIcons = (score: number) => {
    const starIcons = Math.round(score / 20);
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <StarIcon
            key={i}
            size={16}
            weight={i < starIcons ? "fill" : "regular"}
            className={i < starIcons ? "text-accent" : "text-gray-light"}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white border border-gray-light rounded-lg p-6 flex gap-6 items-start">
      {/* Numéro */}
      <div
        className={`flex-shrink-0 w-12 h-12 rounded flex items-center justify-center text-white font-bold text-lg ${
          index === 0 ? "bg-green-500" : index === 1 ? "bg-orange-500" : "bg-orange-500"
        }`}
      >
        {index + 1}
      </div>

      {/* Infos principal */}
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <h3 className="text-lg font-semibold text-color-black">{quartier.name}</h3>
          {renderStarIcons(quartier.score)}
        </div>
        <p className="text-sm text-gray-medium mb-4">Score global {quartier.score}</p>

        {/* Détails */}
        <div className="grid grid-cols-5 gap-4 text-sm">
          <div>
            <span className="text-gray-medium">Sécurité</span>
            <p className="font-semibold text-accent">{quartier.security}</p>
          </div>
          <div>
            <span className="text-gray-medium">Transport</span>
            <p className="font-semibold text-accent">{quartier.transport}</p>
          </div>
          <div>
            <span className="text-gray-medium">Service</span>
            <p className="font-semibold text-accent">{quartier.service}</p>
          </div>
          <div>
            <span className="text-gray-medium">Budget</span>
            <p className="font-semibold text-accent">{quartier.cost}</p>
          </div>
          <div>
            <span className="text-gray-medium">Loisirs</span>
            <p className="font-semibold text-accent">{quartier.leisure}</p>
          </div>
        </div>
      </div>

      {/* Bouton */}
      <button className="flex-shrink-0 bg-accent text-white px-6 py-2 rounded-lg font-medium hover:opacity-90 transition">
        Voir le quartier
      </button>
    </div>
  );
}
