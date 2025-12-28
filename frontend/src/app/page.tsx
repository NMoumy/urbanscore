import RankingList from "../components/RankingList";

export default function Home() {
  return (
    <div className="px-6 bg-background">
      <div className="container-main flex flex-col items-start py-10">
        <h1 className="pb-3 text-color-black">Classement des quartiers de Montréal</h1>
        <p className="text-foreground mb-8">Un algorithme de scoring pour évaluer la qualité de vie urbaine</p>
        <RankingList />
      </div>
    </div>
  );
}
