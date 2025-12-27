"use client";

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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-semibold text-black mb-2 md:mb-0">Scores détaillés</h2>
        <p className="text-foreground">
          Score global <span className="font-semibold text-black">{score}</span>
        </p>
      </div>

      {/* Grille de scores */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6 mb-6">
        {scores.map((s) => (
          <div key={s.label} className="flex flex-col items-start">
            <p className="text-sm text-foreground mb-1">{s.label}</p>
            <p className="text-2xl font-semibold text-accent">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Message informatif */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <svg className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clipRule="evenodd"
          />
        </svg>
        <p className="text-sm text-blue-700">Un score élevé grâce à un bon équilibre des indicateurs urbains</p>
      </div>
    </div>
  );
}
