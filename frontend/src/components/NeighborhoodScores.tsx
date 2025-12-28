"use client";
import { WarningCircleIcon } from '@phosphor-icons/react'

type NeighborhoodScoresProps = {
  score: number;
  security: number;
  transport: number;
  service: number;
  cost: number;
  leisure: number;
};

export default function NeighborhoodScores({
  score,
  security,
  transport,
  service,
  cost,
  leisure,
}: NeighborhoodScoresProps) {
  const scores = [
    { label: "Sécurité", value: security },
    { label: "Transport", value: transport },
    { label: "Service", value: service },
    { label: "Budget", value: cost },
    { label: "Loisirs", value: leisure },
  ];

  return (
    <div className="bg-white border border-gray-light rounded-lg p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h3 className="text-black mb-2 md:mb-0">Scores détaillés</h3>
        <p className="text-foreground">
          Score global <span className="font-semibold text-black">{score}</span>
        </p>
      </div>

      <div className="line-horizontal"></div>

      {/* Grille de scores */}
      <div className="grid grid-cols-3 md:grid-cols-5 gap-4 md:gap-6 mb-6">
        {scores.map((s) => (
          <div key={s.label} className="flex flex-col items-start">
            <p className="text-md text-foreground mb-1">{s.label}</p>
            <p className="text-lg font-semibold text-accent">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Message informatif */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        
        <WarningCircleIcon size={24} weight="fill" className="text-accent" />
        <p className="text-sm text-accent">Un score élevé grâce à un bon équilibre des indicateurs urbains</p>
      </div>
    </div>
  );
}
