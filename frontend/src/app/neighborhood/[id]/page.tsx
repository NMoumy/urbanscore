import { notFound } from "next/navigation";
import Link from "next/link";
import { CaretLeftIcon } from "@phosphor-icons/react/dist/ssr";
import NeighborhoodScores from "../../components/NeighborhoodScores";
import NeighborhoodStatistics from "../../components/NeighborhoodStatistics";
import NeighborhoodStrengths from "../../components/NeighborhoodStrengths";

// Données temporaires - à remplacer par appel API
const neighborhoodsData = {
  "1": {
    id: "1",
    name: "Rosemont",
    description: "Découvrez les informations clés du quartier Rosemont",
    score: 82,
    security: 96,
    transport: 81,
    service: 78,
    cost: 82,
    leisure: 83,
    statistics: {
      medianIncome: "62 000 $",
      population: "142 000",
      subwayStations: 3,
    },
    strengths: ["Nombreux parcs et services", "Excellent accès au transport"],
    weaknesses: ["Loyers plus élevés"],
  },
  "2": {
    id: "2",
    name: "Plateau-Mont-Royal",
    description: "Découvrez les informations clés du quartier Plateau-Mont-Royal",
    score: 82,
    security: 78,
    transport: 81,
    service: 85,
    cost: 50,
    leisure: 75,
    statistics: {
      medianIncome: "55 000 $",
      population: "108 000",
      subwayStations: 5,
    },
    strengths: ["Vie culturelle vibrante", "Nombreux restaurants et cafés"],
    weaknesses: ["Coût de logement élevé", "Stationnement difficile"],
  },
  "3": {
    id: "3",
    name: "Villeray",
    description: "Découvrez les informations clés du quartier Villeray",
    score: 82,
    security: 88,
    transport: 84,
    service: 82,
    cost: 75,
    leisure: 80,
    statistics: {
      medianIncome: "58 000 $",
      population: "95 000",
      subwayStations: 4,
    },
    strengths: ["Bon équilibre qualité-prix", "Quartier familial"],
    weaknesses: ["Moins d'options de divertissement"],
  },
  "4": {
    id: "4",
    name: "Outremont",
    description: "Découvrez les informations clés du quartier Outremont",
    score: 75,
    security: 85,
    transport: 80,
    service: 78,
    cost: 65,
    leisure: 70,
    statistics: {
      medianIncome: "75 000 $",
      population: "24 000",
      subwayStations: 2,
    },
    strengths: ["Quartier résidentiel calme", "Excellentes écoles"],
    weaknesses: ["Moins accessible en transport", "Prix élevés"],
  },
};

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function NeighborhoodPage({ params }: PageProps) {
  const { id } = await params;
  const neighborhood = neighborhoodsData[id as keyof typeof neighborhoodsData];

  if (!neighborhood) {
    notFound();
  }

  return (
    <div className="px-4 md:px-6 bg-background">
      <div className="container-main py-6 md:py-10">
        {/* Bouton retour + Titre et Description alignés à gauche */}
        <div className="flex items-start gap-3 mb-8">
          <Link
            href="/"
            className="inline-flex items-center justify-center w-8 h-8 rounded hover:bg-gray-light transition-colors shrink-0"
            aria-label="Retour à la liste"
          >
            <CaretLeftIcon size={24} weight="bold" className="text-foreground" />
          </Link>
          <div>
            <h1 className="text-black mb-2">{neighborhood.name}</h1>
            <p className="text-foreground">{neighborhood.description}</p>
          </div>
        </div>

        {/* Composant de détails */}
        <div className="mb-8">
          <NeighborhoodScores
            score={neighborhood.score}
            security={neighborhood.security}
            transport={neighborhood.transport}
            service={neighborhood.service}
            cost={neighborhood.cost}
            leisure={neighborhood.leisure}
          />
        </div>

        {/* Statistiques & Force & Faiblesse */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <NeighborhoodStatistics statistics={neighborhood.statistics} />
          <NeighborhoodStrengths strengths={neighborhood.strengths} weaknesses={neighborhood.weaknesses} />
        </div>
      </div>
    </div>
  );
}
