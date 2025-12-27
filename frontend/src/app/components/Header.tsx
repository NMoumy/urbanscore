"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MapPinIcon, MagnifyingGlassIcon } from "@phosphor-icons/react";
import { ListIcon as MenuIcon, XIcon as CloseIcon } from "@phosphor-icons/react";

export const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-xs w-full py-3 md:h-16 flex items-center justify-center px-4 md:px-6 outline outline-gray-light">
      <div className="container-main relative flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-0">
        {/* Barre supérieure: logo + nav desktop + bouton burger */}
        <div className="w-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-1">
            <MapPinIcon size={28} weight="fill" className="text-accent" aria-hidden="true" />
            <p className="text-black text-lg md:text-xl font-semibold">
              Urban<span className="text-accent">Score</span>
            </p>
          </Link>

          {/* Nav desktop */}
          <nav className="hidden md:flex gap-6 text-base">
            <Link href="/">Accueil</Link>
            <Link href="/#classement">À propos</Link>
            <Link href="/#comparaison">Comparaison</Link>
          </nav>

          {/* Barre de recherche desktop */}
          <div className="hidden md:flex items-center outline outline-gray-light bg-white rounded-lg px-3 py-2 gap-2 md:flex-1 md:max-w-xs shadow-xs ml-6">
            <MagnifyingGlassIcon size={18} className="text-gray-medium" aria-hidden="true" />
            <input
              type="text"
              placeholder="Rechercher un quartier..."
              className="bg-transparent outline-none text-sm w-full"
            />
          </div>

          {/* Bouton burger mobile */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center p-2 rounded-lg outline outline-gray-light hover:bg-gray-50 cursor-pointer"
            aria-label="Ouvrir le menu"
            aria-controls="mobile-menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? (
              <CloseIcon size={20} className="text-gray-dark" aria-hidden="true" />
            ) : (
              <MenuIcon size={20} className="text-gray-dark" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Menu mobile déroulant (absolu sous la barre) */}
        {menuOpen && (
          <>
            {/* Overlay sombre cliquable */}
            <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setMenuOpen(false)} aria-hidden="true" />
            <div id="mobile-menu" className="md:hidden absolute left-0 right-0 top-full z-50">
              <div className="bg-white border border-gray-light rounded-lg p-3 shadow-xs mt-2">
                {/* Liens de navigation */}
                <nav className="flex flex-col gap-2">
                  <Link href="/" onClick={() => setMenuOpen(false)} className="py-1">
                    Accueil
                  </Link>
                  <Link href="/#classement" onClick={() => setMenuOpen(false)} className="py-1">
                    À propos
                  </Link>
                  <Link href="/#comparaison" onClick={() => setMenuOpen(false)} className="py-1">
                    Comparaison
                  </Link>
                </nav>

                {/* Barre de recherche mobile (en bas du panneau) */}
                <div className="mt-3 flex items-center outline outline-gray-light bg-white rounded-lg px-3 py-2 gap-2 w-full shadow-xs">
                  <MagnifyingGlassIcon size={18} className="text-gray-medium" aria-hidden="true" />
                  <input
                    type="text"
                    placeholder="Rechercher un quartier..."
                    className="bg-transparent outline-none text-sm w-full"
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
};
