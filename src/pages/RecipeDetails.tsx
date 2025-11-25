import type { RecipeInterface } from "../types/recipes.ts";
import { useEffect, useState } from "react";
import { useApiConfigStore } from "../store/apiConfigStore";
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
  id: number;
  recipeData: RecipeInterface;
  goToBack: (id:number) => void; 
};

export const RecipeDetails = ({ id, recipeData, goToBack}: RecipeDetailsProps) => {
  // stato per dati dettagliati (chiamata /recipes/{id}/information)
  const [fullRecipe, setFullRecipe] = useState<RecipeInterface | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { apiKey } = useApiConfigStore();

  // Se abbiamo un id della ricetta, fetchiamo i dettagli completi
  useEffect(() => {
    let cancelled = false;
    const fetchDetails = async () => {
      if (!recipeData?.id) return;
      const baseUrl = import.meta.env.VITE_BASE_URL;
      const url = `${baseUrl}/recipes/${recipeData.id}/information?apiKey=${apiKey ?? ""}&includeNutrition=false`;
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(url);
        if (!res.ok) {
          setError(`Errore fetching details: ${res.status}`);
          return;
        }
        const json = await res.json();
        if (cancelled) return;
        setFullRecipe(json as RecipeInterface);
      } catch (err) {
        if (!cancelled) setError((err as Error).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchDetails();
    return () => { cancelled = true }
  }, [recipeData?.id, apiKey]);

  // Usa i dettagli completi se presenti, altrimenti la recipeData passata o il fallback
  const recipe = fullRecipe ?? recipeData ?? fallbackRecipe;

  // Normalizza gli ingredienti perché l'endpoint `findByIngredients` può restituire
  // `usedIngredients` / `missedIngredients` invece di `extendedIngredients`.
  const normalizeIngredients = (r: any) => {
    if (Array.isArray(r?.extendedIngredients)) return r.extendedIngredients;

    const used = Array.isArray(r?.usedIngredients) ? r.usedIngredients : [];
    const missed = Array.isArray(r?.missedIngredients) ? r.missedIngredients : [];
    const combined = [...used, ...missed];

    if (combined.length > 0) {
      return combined.map((it: any, idx: number) => ({
        aisle: it.aisle ?? "",
        amount: it.amount ?? it.measures?.metric?.amount ?? 0,
        consistency: it.consistency ?? "",
        id: it.id ?? idx,
        image: it.image ?? "",
        measures: it.measures ?? { metric: { amount: it.amount ?? 0, unitLong: it.unit ?? "", unitShort: it.unit ?? "" }, us: { amount: it.amount ?? 0, unitLong: it.unit ?? "", unitShort: it.unit ?? "" } },
        meta: it.meta ?? [],
        name: it.name ?? it.originalName ?? "Ingrediente",
        original: it.original ?? "",
        originalName: it.originalName ?? it.name ?? "",
        unit: it.unit ?? "",
      }));
    }

    // fallback: se non ci sono ingredienti, ritorna array vuoto
    return [] as any[];
  }

  const maxIngredientsToShow = 4;
  const normalizedIngredients = normalizeIngredients(recipe);
  const displayedIngredients = (normalizedIngredients ?? []).slice(0, maxIngredientsToShow);

  const interestingTags = [
    recipe.vegetarian && 'Vegetarian',
    recipe.vegan && 'Vegan',
    recipe.glutenFree && 'Gluten Free',
    recipe.dairyFree && 'Dairy Free',
    recipe.veryHealthy && 'Healthy',
  ].filter(Boolean);

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-b from-purple-100 via-purple-50 to-white min-h-0 overflow-hidden">

      {/* Scrollable area */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4">
        <section className="flex flex-col shadow-xl rounded-3xl bg-white p-4 gap-4 animate-fadeIn max-w-full">

          {/* Recipe Image */}
          <RecipeImage image={recipe.image} title={recipe.title} />

          {/* Title & Badges */}
          <div className="flex flex-col gap-2 shrink-0">
            <h1 className="text-xl font-extrabold text-purple-800 tracking-tight leading-tight">
              {recipe.title || "Unknown Recipe"}
            </h1>
            <div className="flex flex-col gap-2">

              {/* Difficulty */}
              <IconBadge icon={"⚡"} text={getDifficulty(recipe.readyInMinutes)} color={"bg-purple-500 text-white"} />

              {/* Cost per serving */}
              {getCost(recipe.pricePerServing)}

              {/* Full ingredients */}
              <RecipeIngredients extendedIngredients={recipe.extendedIngredients} />

              {/* Special tags */}
              {interestingTags.map(tag => <IconBadge key={tag as string} icon={"⭐"} text={tag as string} color="bg-purple-200 text-purple-800" />)}
            </div>
          </div>

          {/* Basic Info: time, servings, health score, cuisines */}
          <div className="w-full flex gap-2 flex-wrap items-start shrink-0">
            <IconBadge icon={"⏱️"} text={`${recipe.readyInMinutes || '-'} min`} color="bg-purple-200 text-purple-800"/>
            <IconBadge icon={"🍽️"} text={`${recipe.servings || '-'} servings`} color="bg-purple-200 text-purple-800"/>
            {getHealtScore(recipe.healthScore)}
            <RecipeCuisines cuisines={recipe.cuisines} />
          </div>

          {/* Recipe Summary */}
          <p className="text-purple-800 text-sm italic bg-purple-100 rounded-lg px-3 py-2 leading-relaxed shrink-0">
            {getSummary(recipe.summary)}
          </p>

          {/* Displayed Ingredients */}
          <DisplayedIngredients displayedIngredients={displayedIngredients} />

          {/* Wine Pairing */}
          {recipe.winePairing?.pairingText && <WinePairingComponent winePairing={recipe.winePairing}/> }

        </section>
      </div>

      {/* Back Button */}
      <div className="w-full px-4 pb-4 pt-2 shrink-0 bg-gradient-to-t from-white to-transparent">
        <button
          type="button"
          onClick={() => goToBack(id)}
          className="w-full py-3 text-base font-bold bg-purple-700 hover:bg-purple-800 active:bg-purple-900 transition-colors text-white rounded-2xl shadow-lg cursor-pointer"
          style={{ letterSpacing: "0.05em" }}
        >
          ← Go Back
        </button>
      </div>
    </div>
  );
};

export default RecipeDetails;
