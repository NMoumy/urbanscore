"use client";

import { useEffect, useRef, useState } from "react";
import { CaretDownIcon } from "@phosphor-icons/react";

type RankingFiltersProps = {
  sortBy: "best" | "worst";
  setSortBy: (value: "best" | "worst") => void;
  filterCategory: string;
  setFilterCategory: (value: string) => void;
  categories: string[];
};

export default function RankingFilters({
  sortBy,
  setSortBy,
  filterCategory,
  setFilterCategory,
  categories,
}: RankingFiltersProps) {
  const [openCategory, setOpenCategory] = useState(false);
  const [openSort, setOpenSort] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentCategory = filterCategory === "all" ? "Tout" : filterCategory;
  const currentSort = sortBy === "best" ? "meilleur score" : "pire score";

  // Ferme les menus sur clic extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpenCategory(false);
        setOpenSort(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
      {/* Profil Section */}
      <div className="relative filter-container sm:w-70">
        <div className="sort-label">Profil</div>
        <div className="divider-vertical"></div>

        <div className="relative flex-1">
          <button
            className="sort-button"
            onClick={() => {
              setOpenCategory((v) => !v);
              setOpenSort(false);
            }}
          >
            <span>{currentCategory}</span>
            <CaretDownIcon size={16} weight="fill" className="text-gray-400" />
          </button>

          {openCategory && (
            <div className="filter-dropdown-menu w-full">
              <button
                onClick={() => {
                  setFilterCategory("all");
                  setOpenCategory(false);
                }}
                className={`filter-dropdown-option ${
                  filterCategory === "all" ? "filter-dropdown-option-selected" : "text-gray-900"
                }`}
              >
                Tout
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setFilterCategory(cat);
                    setOpenCategory(false);
                  }}
                  className={`filter-dropdown-option ${
                    filterCategory === cat ? "filter-dropdown-option-selected" : "text-gray-900"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Trier Par Section */}
      <div className="relative filter-container w-full sm:w-70">
        <div className="sort-label">Trier Par</div>
        <div className="divider-vertical"></div>

        <div className="relative flex-1">
          <button
            className="sort-button"
            onClick={() => {
              setOpenSort((v) => !v);
              setOpenCategory(false);
            }}
          >
            <span>{currentSort}</span>
            <CaretDownIcon size={16} weight="fill" className="text-gray-400" />
          </button>

          {openSort && (
            <div className="filter-dropdown-menu w-full">
              {["best", "worst"].map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    setSortBy(option as "best" | "worst");
                    setOpenSort(false);
                  }}
                  className={`filter-dropdown-option ${
                    sortBy === option ? "filter-dropdown-option-selected" : "text-gray-900"
                  }`}
                >
                  {option === "best" ? "meilleur score" : "pire score"}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
