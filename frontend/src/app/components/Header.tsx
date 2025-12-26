"use client";

import React from "react";
import { MapPinIcon, MagnifyingGlassIcon } from "@phosphor-icons/react";

export const Header = () => {
  return (
    <header className="bg-white shadow-xs w-full h-16 flex items-center justify-center px-6 outline outline-gray-light">
      <div className="container-main flex items-center justify-between">
        <div className="flex items-center gap-1">
          <MapPinIcon size={30} weight="fill" className="text-accent" aria-hidden="true" />
          <p className="text-black text-xl font-semibold">
            Urban<span className="text-accent">Score</span>
          </p>
        </div>

        <nav className="flex gap-6">
          <a href="#">Accueil</a>
          <a href="#">Classement</a>
          <a href="#">À propos</a>
        </nav>

        <div className="flex items-center outline outline-gray-light bg-white rounded-lg px-3 py-2 gap-2 flex-1 max-w-xs shadow-xs">
          <MagnifyingGlassIcon size={18} className="text-gray-medium" aria-hidden="true" />
          <input
            type="text"
            placeholder="Rechercher un quartier..."
            className="bg-transparent outline-none text-sm w-full"
          />
        </div>
      </div>
    </header>
  );
};
