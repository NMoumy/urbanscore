import Image from "next/image";

export default function Compare() {
  return (
    <div className="px-4 md:px-6">
      <div className="container-main py-6 md:py-10 flex flex-col items-center">
        <h1 className="pb-3">Page de comparaison des quartiers</h1>
        <p>Developpement de la page en cours...</p>

        <Image src="/images/dev.svg" alt="Développement en cours" width={400} height={400} className="mix-blend-darken" />
      </div>
    </div>
  );
}
