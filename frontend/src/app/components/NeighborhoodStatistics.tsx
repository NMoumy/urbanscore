"use client";

import { CurrencyDollarIcon, UserIcon, TrainIcon } from "@phosphor-icons/react";

type NeighborhoodStatisticsProps = {
  statistics: {
    medianIncome: string;
    population: string;
    subwayStations: number;
  };
};

export default function NeighborhoodStatistics({ statistics }: NeighborhoodStatisticsProps) {
  return (
    <div className="bg-white border border-gray-light rounded-lg p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-black">Statistiques</h3>
        <button
          className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          aria-label="Informations supplémentaires"
        >
          <span className="text-xs text-gray-600">?</span>
        </button>
      </div>

      <div className="line-horizontal"></div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
              <CurrencyDollarIcon size={18} weight="fill" className="text-yellow-500" />
            </div>
            <p>Revenu médian</p>
          </div>
          <p className="text-black">{statistics.medianIncome}</p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <UserIcon size={18} weight="fill" className="text-blue-500" />
            </div>
            <p>Population</p>
          </div>
          <p className=" text-black">{statistics.population}</p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <TrainIcon size={18} weight="fill" className="text-green-500" />
            </div>
            <p>Station de métro</p>
          </div>
          <p className=" text-black">{statistics.subwayStations}</p>
        </div>
      </div>
    </div>
  );
}
