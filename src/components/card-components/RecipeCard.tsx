import { fallbackRecipe } from "../../mock/mock";
import type { RecipeInterface } from "../../types/recipes";
import { getDifficulty } from "../../utils/getDifficulty";
import RecipeDishTypes from "./RecipeDishTypes";
import RecipeImage from "./RecipeImage";
import { RecipeIngredients } from "./RecipeIngredients";
import RecipeServings from "./RecipeServings";
import RecipeTime from "./RecipeTime";

type RecipeCardProps = {
  // Oggetto ricetta contente titolo, immagine, ingredienti, tempo, porzioni, ecc.
  recipe: RecipeInterface;
  // Callback eseguita quando l'utente clicca il bottone "Dettagli ricetta"
  onClickDetails: (recipe: RecipeInterface) => void;
};

export const RecipeCard = ({ recipe, onClickDetails }: RecipeCardProps) => {
  // ========== COMPONENTE RECIPE CARD ==========
  // Visualizza una singola ricetta con:
  // - Immagine della ricetta
  // - Titolo della ricetta
  // - Metadati: tempo di preparazione, porzioni, tipo di piatto, difficoltà
  // - Lista ingredienti
  // - Bottone "Dettagli ricetta" per navigare alla pagina dei dettagli

  // Utilizza fallbackRecipe se l'oggetto ricetta non è disponibile
  const data = recipe || fallbackRecipe;

  return (
    <div className="w-full h-full bg-linear-to-br from-green-50 to-green-100 rounded-3xl shadow-xl p-4 flex flex-col gap-6 overflow-hidden min-h-0">

      {/* ========== IMMAGINE RICETTA ========== */}
      <RecipeImage image={data.image} title={data.title} />

      {/* ========== TITOLO RICETTA ========== */}
      <h2 className="text-green-800 text-xl font-extrabold tracking-tight underline decoration-green-200 mb-1">
        {data.title || "Ricetta sconosciuta"}
      </h2>

      {/* ========== METADATI RICETTA ========== */}
      {/* Mostra tempo di preparazione, porzioni, tipo di piatto e difficoltà */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <RecipeTime readyInMinutes={data.readyInMinutes} />
        <span className="text-gray-400">·</span>
        <RecipeServings servings={data.servings} />
        <span className="text-gray-400">·</span>
        <RecipeDishTypes dishTypes={data.dishTypes} />
        <span className="text-gray-400">·</span>
        <span className="flex items-center gap-1 bg-green-200 text-green-800 rounded-full px-2 py-0.5 font-bold">
          <span role="img" aria-label="difficoltà">⭐</span>
          {getDifficulty(data.readyInMinutes)}
        </span>
      </div>

      {/* ========== LISTA INGREDIENTI ========== */}
      <RecipeIngredients extendedIngredients={data.extendedIngredients} />

      {/* ========== BOTTONE DETTAGLI ========== */}
      {/* Cliccando questo bottone viene eseguita la callback onClickDetails */}
      {/* che naviga alla pagina dei dettagli della ricetta */}
      <button
        onClick={() => onClickDetails(data)}
        className="mt-auto w-full bg-green-700 text-white rounded-xl py-3 text-base font-extrabold shadow-md transition hover:bg-green-800 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-600 cursor-pointer"
      >
        Dettagli ricetta
      </button>
    </div>
  );
};
