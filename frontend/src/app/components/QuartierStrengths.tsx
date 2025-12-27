"use client";

import { CheckCircleIcon, XCircleIcon } from "@phosphor-icons/react";

type QuartierStrengthsProps = {
  strengths: string[];
  weaknesses: string[];
};

export default function QuartierStrengths({ strengths, weaknesses }: QuartierStrengthsProps) {
  return (
    <div className="bg-white border border-gray-light rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-black">Force & Faiblesse</h3>
        <button
          className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          aria-label="Informations supplémentaires"
        >
          <span className="text-xs text-gray-600">?</span>
        </button>
      </div>

      <div className="space-y-4">
        {/* Forces */}
        {strengths.map((strength, index) => (
          <div key={`strength-${index}`} className="flex items-start gap-3">
            <CheckCircleIcon size={20} weight="fill" className="text-green-500 shrink-0 mt-0.5" />
            <p className="text-foreground">{strength}</p>
          </div>
        ))}

        {/* Faiblesses */}
        {weaknesses.map((weakness, index) => (
          <div key={`weakness-${index}`} className="flex items-start gap-3">
            <XCircleIcon size={20} weight="fill" className="text-red-500 shrink-0 mt-0.5" />
            <p className="text-foreground">{weakness}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
