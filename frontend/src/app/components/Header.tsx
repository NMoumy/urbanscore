"use client";

import React from "react";
import { MapPinIcon, MagnifyingGlassIcon } from "@phosphor-icons/react";

export const Header = () => {
  return (
    <header className="bg-white shadow-2xs w-full h-16 flex items-center justify-between px-6">

      <div className="flex items-center gap-1">
        <MapPinIcon size={30} weight="fill" className="text-blue-500" aria-hidden="true" />
        <h1 className="text-black text-2xl font-semibold">
          Urban<span className="text-blue-500">Score</span>
        </h1>
      </div>

      <nav className="flex gap-6">
        <a href="#">Accueil</a>
        <a href="#">Classement</a>
        <a href="#">À propos</a>
      </nav>

      <div className="flex items-center outline outline-gray-400 bg-white rounded-lg px-3 py-2 gap-2 flex-1 max-w-xs shadow-xs">
        <MagnifyingGlassIcon size={18} className="text-gray-500" aria-hidden="true" />
        <input
          type="text"
          placeholder="Rechercher un quartier..."
          className="bg-transparent outline-none text-sm w-full"
        />
      </div>

    </header>
  );
};
