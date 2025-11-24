import type { RecipeInterface } from "../types/recipes.ts";
import { getDifficulty } from "../utils/getDifficulty.ts";
import { IconBadge } from "../components/card-components/IconBadge.tsx";
import { getCost } from "../utils/getCost.tsx";
import { RecipeCuisines } from "../components/card-components/RecipeCuisines.tsx";
import { getHealtScore } from "../utils/getHealtScore.ts";
import { getSummary } from "../utils/getSummary.ts";
import DisplayedIngredients from "../components/card-components/DisplayedIngredients.tsx";
import WinePairingComponent from "../components/card-components/WinePairing.tsx";
import RecipeImage from "../components/card-components/RecipeImage.tsx";
import { RecipeIngredients } from "../components/card-components/RecipeIngredients.tsx";
import { fallbackRecipe } from "../mock/mock.ts";   

type RecipeDetailsProps = {
  // ID della ricetta per identificarla quando si ritorna indietro
  id: number;
  // Oggetto ricetta contenente tutti i dati (titolo, immagine, ingredienti, ecc.)
  recipeData: RecipeInterface;
  // Callback eseguita quando l'utente clicca "Torna indietro"
  // Riceve l'id della ricetta per poter tornare alla pagina discover-recipes
  goToBack: (id:number) => void; 
};

export const RecipeDetails = ({ id, recipeData, goToBack}: RecipeDetailsProps) => {
  // ========== COMPONENTE RECIPE DETAILS ==========
  // Visualizza i dettagli completi di una ricetta con:
  // - Immagine della ricetta
  // - Titolo e badge (difficoltà, costo, tags speciali)
  // - Info di base: tempo, porzioni, health score, tipo di cucina
  // - Descrizione/summary della ricetta
  // - Ingredienti principali
  // - Pairing vino (se disponibile)
  // - Bottone "Torna indietro" per tornare al carosello

  // Utilizza fallbackRecipe se l'oggetto ricetta non è disponibile
  const recipe = recipeData || fallbackRecipe;

  // ========== FILTRO INGREDIENTI ==========
  // Mostra solo i primi 4 ingredienti nella sezione "Ingredienti principali"
  // (gli altri ingredienti sono comunque disponibili nella lista completa)
  const maxIngredientsToShow = 4;
  const displayedIngredients = recipe.extendedIngredients.slice(0, maxIngredientsToShow);

  // ========== TAG SPECIALI RICETTA ==========
  // Raccoglie tutti i tag applicabili alla ricetta (vegetariana, vegana, ecc.)
  // Filtra out i tag non applicabili (truthy check)
  const interestingTags = [
    recipe.vegetarian && 'Vegetariana',
    recipe.vegan && 'Vegana',
    recipe.glutenFree && 'Senza Glutine',
    recipe.dairyFree && 'Senza Lattosio',
    recipe.veryHealthy && 'Salutare',
  ].filter(Boolean);

  return (
    <div className="w-full h-full flex flex-col bg-linear-to-b from-green-50 to-white min-h-0 overflow-hidden">
      
      {/* ========== AREA SCROLLABILE ==========  */}
      {/* Contiene i dettagli della ricetta, scrollabile se il contenuto è troppo lungo */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4">
        <section className="flex flex-col shadow-xl rounded-3xl bg-white p-4 gap-4 animate-fadeIn max-w-full">
          
          {/* ========== IMMAGINE RICETTA ========== */}
          <RecipeImage image={recipe.image} title={recipe.title} />

          {/* ========== TITOLO E BADGE PRINCIPALI ========== */}
          <div className="flex flex-col gap-2 shrink-0">
            <h1 className="text-xl font-extrabold text-green-900 tracking-tight leading-tight">
              {recipe.title || "Ricetta sconosciuta"}
            </h1>
            <div className="flex flex-col gap-2">

              {/* Difficoltà calcolata in base al tempo di preparazione */}
              <IconBadge icon={"⚡"} text={getDifficulty(recipe.readyInMinutes)} color={"bg-green-500 text-white"} />

              {/* Costo per porzione */}
              {getCost(recipe.pricePerServing)}

              {/* Lista completa ingredienti */}
              <RecipeIngredients extendedIngredients={recipe.extendedIngredients} />

              {/* Tag speciali: vegetariana, vegana, senza glutine, ecc. */}
              {interestingTags.map(tag => <IconBadge icon={"⭐"} text={tag as string} />)}
            </div>
          </div>

          {/* ========== INFO DI BASE RICETTA ========== */}
          {/* Tempo di preparazione, porzioni, health score, tipo di cucina */}
          <div className="w-full flex gap-2 flex-wrap items-start shrink-0">
            {<IconBadge icon={"⏱️"} text={`${recipe.readyInMinutes || '-'} min`} />}
            {<IconBadge icon={"🍽️"} text={`${recipe.servings || '-'} porzioni`} />}
            {getHealtScore(recipe.healthScore)}
            {/* Tipo di cucina */}
            < RecipeCuisines cuisines={recipe.cuisines} /> 
          </div>

          {/* ========== DESCRIZIONE RICETTA ========== */}
          {/* Summary della ricetta in stile italico con sfondo verde chiaro */}
          <p className="text-green-900 text-xs italic bg-green-50 rounded-lg px-3 py-2 leading-relaxed shrink-0">
            {getSummary(recipe.summary)}
          </p>

          {/* ========== INGREDIENTI PRINCIPALI ========== */}
          {/* Mostra solo i primi 4 ingredienti */}
          <DisplayedIngredients displayedIngredients={displayedIngredients} />

          {/* ========== PAIRING VINO ========== */}
          {/* Visualizzato solo se la ricetta ha dati di wine pairing disponibili */}
          {recipe.winePairing?.pairingText && <WinePairingComponent winePairing={recipe.winePairing}/> }

        </section>
      </div>

      {/* ========== BOTTONE TORNA INDIETRO ========== */}
      {/* Bottone fisso in basso dello schermo */}
      {/* Cliccando viene eseguita la callback goToBack con l'id della ricetta */}
      {/* Questo consente di tornare al carosello (DiscoverRecipes) mantenendo la posizione */}
      <div className="w-full px-4 pb-4 pt-2 shrink-0 bg-linear-to-t from-white to-transparent">
        <button
          type="button"
          onClick={() => goToBack(id)}
          className="w-full py-3 text-base font-bold bg-green-600 hover:bg-green-700 active:bg-green-800 transition-colors text-white rounded-2xl shadow-lg cursor-pointer"
          style={{ letterSpacing: "0.05em" }}
        >
          ← Torna indietro
        </button>
      </div>
    </div>
  );
};

export default RecipeDetails;
