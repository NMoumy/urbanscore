import React from "react";
import {
  Target,
  Laptop,
  ChartBar,
  Brain,
  Car,
  Train,
  ChatsCircle,
  TreeEvergreen,
  CurrencyDollar,
  DeviceMobile,
  UserCircle,
  Star,
} from "@phosphor-icons/react/dist/ssr";

export default function About() {
  return (
    <div className="px-6 bg-background">
      {/* IMPORTANT CREER DES COMPOSANTS POUR CHAQUE SECTION AVEC UNE CLASSE POUR LE STYLE */}
      <div className="container-main flex flex-col items-start py-10">
        {/* En-tête */}
        <div className="mb-8 w-full">
          <h1 className="pb-3 text-color-black">À propos d&apos;UrbanScore</h1>
          <p className="text-foreground">
            En savoir plus sur notre mission, notre méthodologie et les équipes qui se cachent derrière
            l&apos;application
          </p>
        </div>

        {/* Grille des sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {/* Section 1: Notre mission */}
          <div className="bg-white rounded-lg shadow-xs p-6 md:p-8 border border-gray-light">
            <div className="flex items-start gap-4 mb-4">
              <Target size={40} weight="duotone" className="text-accent" />
              <h2 className="text-lg md:text-xl font-semibold text-black">Notre mission</h2>
            </div>
            <p className="text-foreground leading-relaxed">
              UrbanScore aide à choisir un quartier de façon éclairée, en transformant des données urbaines complexes en
              scores simples, compréhensibles et <span className="font-semibold">comparables</span>.
            </p>
          </div>

          {/* Section 2: Qui a créé UrbanScore ? */}
          <div className="bg-white rounded-lg shadow-xs p-6 md:p-8 border border-gray-light">
            <div className="flex items-start gap-4 mb-4">
              <Laptop size={40} weight="duotone" className="text-accent" />
              <h2 className="text-lg md:text-xl font-semibold text-black">Qui a créé UrbanScore ?</h2>
            </div>
            <p className="text-foreground leading-relaxed">
              UrbanScore est un projet réalisé par une étudiante en génie logiciel. Ce projet a été développé dans un
              esprit académique, professionnel, et d&apos;impact social.
            </p>
          </div>

          {/* Section 3: Quelles données sont utilisées ? */}
          <div className="bg-white rounded-lg shadow-xs p-6 md:p-8 border border-gray-light">
            <div className="flex items-start gap-4 mb-4">
              <ChartBar size={40} weight="duotone" className="text-accent" />
              <h2 className="text-lg md:text-xl font-semibold text-black">Quelles données sont utilisées ?</h2>
            </div>
            <p className="text-foreground mb-4">
              UrbanScore s&apos;appuie sur des données publiques et fiables, notamment :
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Car size={28} weight="duotone" className="text-orange-500 flex-shrink-0" />
                <div>
                  <strong className="text-black">Sécurité :</strong>
                  <span className="text-foreground"> statistiques de criminalité.</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Train size={28} weight="duotone" className="text-accent flex-shrink-0" />
                <div>
                  <strong className="text-black">Transport :</strong>
                  <span className="text-foreground"> densité du métro, bus, accessibilité.</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <ChatsCircle size={28} weight="duotone" className="text-purple-500 flex-shrink-0" />
                <div>
                  <strong className="text-black">Services :</strong>
                  <span className="text-foreground"> écoles, commerces, services essentiels</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <TreeEvergreen size={28} weight="duotone" className="text-green-600 flex-shrink-0" />
                <div>
                  <strong className="text-black">Loisirs :</strong>
                  <span className="text-foreground"> parcs, installations sportives, culture</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CurrencyDollar size={28} weight="duotone" className="text-yellow-600 flex-shrink-0" />
                <div>
                  <strong className="text-black">Données socio-économiques :</strong>
                  <span className="text-foreground"> revenu médian, population</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Section 4: Comment les scores sont-ils calculés ? */}
          <div className="bg-white rounded-lg shadow-xs p-6 md:p-8 border border-gray-light">
            <div className="flex items-start gap-4 mb-4">
              <Brain size={40} weight="duotone" className="text-accent" />
              <h2 className="text-lg md:text-xl font-semibold text-black">Comment les scores sont-ils calculés ?</h2>
            </div>

            {/* Score global */}
            <div className="space-y-4">
              <p className="text-foreground leading-relaxed">
                Le score global est calculé sur <span className="font-semibold text-black">100 points</span> en
                combinant les performances du quartier dans quatre catégories principales :
              </p>

              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent"></div>
                  <span className="text-foreground">
                    <strong className="text-black">Transport</strong> : 30%
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-600"></div>
                  <span className="text-foreground">
                    <strong className="text-black">Loisirs</strong> : 25%
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-yellow-600"></div>
                  <span className="text-foreground">
                    <strong className="text-black">Budget</strong> : 25%
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                  <span className="text-foreground">
                    <strong className="text-black">Sécurité</strong> : 20%
                  </span>
                </li>
              </ul>

              <p className="text-sm text-foreground pt-2">
                Chaque critère est normalisé et pondéré selon son importance pour offrir une évaluation équilibrée de la
                qualité de vie.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
