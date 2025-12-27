"use client";

import { CurrencyDollarIcon, UserIcon, TrainIcon } from "@phosphor-icons/react";

type QuartierStatisticsProps = {
  statistics: {
    medianIncome: string;
    population: string;
    metroStations: number;
  };
};

export default function QuartierStatistics({ statistics }: QuartierStatisticsProps) {
  return (
    <div className="bg-white border border-gray-light rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-black">Statistiques</h3>
        <button
          className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          aria-label="Informations supplémentaires"
        >
          <span className="text-xs text-gray-600">?</span>
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
              <CurrencyDollarIcon size={18} weight="fill" className="text-yellow-600" />
            </div>
            <p className="text-foreground">Revenu médian</p>
          </div>
          <p className="font-medium text-black">{statistics.medianIncome}</p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <UserIcon size={18} weight="fill" className="text-blue-600" />
            </div>
            <p className="text-foreground">Population</p>
          </div>
          <p className="font-medium text-black">{statistics.population}</p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <TrainIcon size={18} weight="fill" className="text-green-600" />
            </div>
            <p className="text-foreground">Station de métro</p>
          </div>
          <p className="font-medium text-black">{statistics.metroStations}</p>
        </div>
      </div>
    </div>
  );
}
