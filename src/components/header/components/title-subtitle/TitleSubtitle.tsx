export default function Titlesubtitle() {
  // ========== COMPONENTE TITLESUBTITLE ==========  
  // Mostra il logo e una descrizione dell'app  
  // Completamente statico, senza props o stato  

  return (
    <div className="flex flex-col gap-4 items-center w-full pb-6">
      
      {/* Container logo */}
      <div className="w-1/4">
        <img src="/icons/iAmChef_Logo.jpg" alt="logo app" className="rounded-lg shadow-md" />
      </div>
      
      {/* Titolo descrittivo dell'app */}
      <p className="text-purple-200 font-jainiPurva text-lg font-normal leading-[1.3em] text-center">
         Ingredienti → Ricetta pronta 🧑‍🍳✨
      </p>
    </div>
  );
}
