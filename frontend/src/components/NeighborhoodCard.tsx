"use client";

import React from "react";
import Link from "next/link";
import StarRating from "./StarRating";

type NeighborhoodCardProps = {
  neighborhood: {
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

export default function NeighborhoodCard({ neighborhood, index }: NeighborhoodCardProps) {
  const details = [
    { label: "Sécurité", value: neighborhood.security },
    { label: "Transport", value: neighborhood.transport },
    { label: "Service", value: neighborhood.service },
    { label: "Budget", value: neighborhood.cost },
    { label: "Loisirs", value: neighborhood.leisure },
  ];

  return (
    <div className="bg-white border border-gray-light rounded-lg px-4 py-4 md:px-8 md:py-6">
      {/* En-tête avec numéro, nom, étoiles, score */}
      <div className="flex items-center gap-3 mb-2 flex-wrap">
        <div
          className={`shrink-0 w-8 h-8 rounded flex items-center justify-center text-white font-semibold text-sm ${
            index === 0 ? "bg-green-400 border-green-500 border" : index <= 2 ? "bg-orange-500" : "bg-red-500"
          }`}
        >
          {index + 1}
        </div>
        <h3>{neighborhood.name}</h3>
        <StarRating score={neighborhood.score} />
        <p className="w-full md:hidden order-1 ml-0">Score global {neighborhood.score}</p>
        <Link
          href={`/neighborhood/${neighborhood.id}`}
          className="w-full md:w-auto ml-0 md:ml-auto order-2 md:order-0 btn-primary-small text-center"
        >
          Voir le quartier
        </Link>
      </div>

      <p className="mb-4 ml-0 md:ml-11 hidden md:block">Score global {neighborhood.score}</p>

      {/* Horizontal line */}
      <div className="line-horizontal"></div>

      {/* Détails */}
      <div className="grid grid-cols-2 gap-3 md:flex md:flex-wrap md:justify-between md:gap-x-5 md:gap-y-4 ml-0 md:ml-11">
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
