export default function Titlesubtitle() {
  // ========== COMPONENTE TITLESUBTITLE ==========
  // Componente che mostra il titolo e il logo dell'applicazione
  // Non ha nessuna dipendenza da props o stato - è completamente statico
  // Renderizza: logo + descrizione dell'app

  return (
    <div className="flex flex-col gap-4 items-center w-full pb-6">
      {/* Container logo */}
      <div className="w-1/4">
        <img src="/icons/iAmChef_Logo.jpg" alt="logo app" className="rounded-lg" />
      </div>
      
      {/* Titolo descrittivo dell'app */}
      <p className="text-white font-jainiPurva text-lg font-normal leading-[1.2em]">
        Dimmi gli ingredienti e ti dirò una ricetta{" "}
      </p>
    </div>
  );
}