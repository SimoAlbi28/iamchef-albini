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
  // ========== STATI LOCALI ==========
  // Stato per dati dettagliati della ricetta (dai endpoint /recipes/{id}/information)
  // Inizialmente null, viene riempito dal fetch
  const [fullRecipe, setFullRecipe] = useState<RecipeInterface | null>(null);
  
  // Flag per mostrare uno stato di caricamento mentre fetcha i dettagli
  const [loading, setLoading] = useState(false);
  
  // Stringa di errore se il fetch fallisce
  const [error, setError] = useState<string | null>(null);

  // API Key dal Zustand store
  const { apiKey } = useApiConfigStore();

  // ========== EFFETTO: FETCH DETTAGLI RICETTA ==========
  // Quando il componente monta, fetcha i dettagli completi della ricetta
  // 
  // Flusso:
  // 1. Se recipeData.id manca, esce (niente da fare)
  // 2. Costruisce l'URL all'endpoint /recipes/{id}/information
  // 3. Fa il fetch e parsea il JSON
  // 4. Salva il risultato in fullRecipe
  // 5. Se c'è un errore, lo salva in error
  // 6. Il componente può essere smontato nel frattempo, quindi controlla cancelled
  useEffect(() => {
    let cancelled = false;
    const fetchDetails = async () => {
      if (!recipeData?.id) return;
      const baseUrl = import.meta.env.VITE_BASE_URL;
      // includeNutrition=false per risparmiare crediti API
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

  // ========== SELEZIONE DATI ==========
  // Priorità: se fullRecipe (da fetch) esiste, usalo
  // Se non esiste, usa recipeData (passato da parent)
  // Se non esiste nemmeno quello, usa il fallback mock
  // Questo permette di mostrare qualcosa anche se il fetch fallisce
  const recipe = fullRecipe ?? recipeData ?? fallbackRecipe;

  // ========== NORMALIZZAZIONE INGREDIENTI ==========
  // L'endpoint findByIngredients ritorna ingredienti in formato diverso:
  // - extendedIngredients: array con dettagli completi
  // - usedIngredients + missedIngredients: separati (quando l'utente ha alcuni ingredienti)
  //
  // Questa funzione normalizza tutto in un unico formato
  const normalizeIngredients = (r: any) => {
    // Se ci sono extendedIngredients, usali direttamente
    if (Array.isArray(r?.extendedIngredients)) return r.extendedIngredients;

    // Altrimenti, combina usedIngredients e missedIngredients
    const used = Array.isArray(r?.usedIngredients) ? r.usedIngredients : [];
    const missed = Array.isArray(r?.missedIngredients) ? r.missedIngredients : [];
    const combined = [...used, ...missed];

    // Se c'è qualcosa, mappa i campi mancanti con valori di default
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

    // Se non ci sono ingredienti, ritorna array vuoto
    return [] as any[];
  }

  // ========== PREPARAZIONE DATI PER RENDER ==========
  // Numero massimo di ingredienti da mostrare nella sezione "Displayed Ingredients"
  // Se ci sono più ingredienti, l'utente deve scrollare per vederli tutti
  const maxIngredientsToShow = 4;
  
  // Normalizza gli ingredienti usando la funzione sopra
  const normalizedIngredients = normalizeIngredients(recipe);
  
  // Prende solo i primi 4 ingredienti per la sezione speciale "Displayed Ingredients"
  // Se ce ne sono meno, mostra quelli che ci sono
  const displayedIngredients = (normalizedIngredients ?? []).slice(0, maxIngredientsToShow);

  // ========== TAG INTERESSANTI ==========
  // Crea un array di tag speciali based sulle proprietà della ricetta
  // Filtra solo i tag che hanno valore true
  // Es: se recipe.vegetarian è true, aggiunge "Vegetarian"
  const interestingTags = [
    recipe.vegetarian && 'Vegetarian',
    recipe.vegan && 'Vegan',
    recipe.glutenFree && 'Gluten Free',
    recipe.dairyFree && 'Dairy Free',
    recipe.veryHealthy && 'Healthy',
  ].filter(Boolean);

  // ========== RENDER DELLA PAGINA ==========
  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-b from-purple-100 via-purple-50 to-white min-h-0 overflow-hidden">

      {/* SEZIONE 1: Area scrollabile con i dettagli della ricetta */}
      {/* min-h-0 è necessario per far funzionare il flex layout */}
      {/* overflow-y-auto permette di scrollare se il contenuto è troppo lungo */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4">
        <section className="flex flex-col shadow-xl rounded-3xl bg-white p-4 gap-4 animate-fadeIn max-w-full">

          {/* 1.1: Immagine ricetta */}
          <RecipeImage image={recipe.image} title={recipe.title} />

          {/* 1.2: Titolo e badges principali */}
          <div className="flex flex-col gap-2 shrink-0">
            {/* Titolo della ricetta */}
            <h1 className="text-xl font-extrabold text-purple-800 tracking-tight leading-tight">
              {recipe.title || "Unknown Recipe"}
            </h1>
            <div className="flex flex-col gap-2">

              {/* Badge: Difficoltà (basata su readyInMinutes) */}
              <IconBadge icon={"⚡"} text={getDifficulty(recipe.readyInMinutes)} color={"bg-purple-500 text-white"} />

              {/* Badge: Costo per porzione */}
              {getCost(recipe.pricePerServing)}

              {/* Sezione: Lista di TUTTI gli ingredienti (estesa) */}
              <RecipeIngredients extendedIngredients={recipe.extendedIngredients} />

              {/* Badges: Tag speciali (Vegetarian, Vegan, etc.) */}
              {interestingTags.map(tag => <IconBadge key={tag as string} icon={"⭐"} text={tag as string} color="bg-purple-200 text-purple-800" />)}
            </div>
          </div>

          {/* 1.3: Info basilari: tempo, porzioni, health score, cucine */}
          <div className="w-full flex gap-2 flex-wrap items-start shrink-0">
            {/* Tempo di preparazione */}
            <IconBadge icon={"⏱️"} text={`${recipe.readyInMinutes || '-'} min`} color="bg-purple-200 text-purple-800"/>
            {/* Numero di porzioni */}
            <IconBadge icon={"🍽️"} text={`${recipe.servings || '-'} servings`} color="bg-purple-200 text-purple-800"/>
            {/* Health score (da 0 a 100) */}
            {getHealtScore(recipe.healthScore)}
            {/* Cucine (es: Italian, American, etc.) */}
            <RecipeCuisines cuisines={recipe.cuisines} />
          </div>

          {/* 1.4: Descrizione/Riassunto della ricetta */}
          <p className="text-purple-800 text-sm italic bg-purple-100 rounded-lg px-3 py-2 leading-relaxed shrink-0">
            {getSummary(recipe.summary)}
          </p>

          {/* 1.5: Primi 4 ingredienti in evidenza */}
          <DisplayedIngredients displayedIngredients={displayedIngredients} />

          {/* 1.6: Consigli di abbinamento vino (se disponibile) */}
          {recipe.winePairing?.pairingText && <WinePairingComponent winePairing={recipe.winePairing}/> }

        </section>
      </div>

      {/* SEZIONE 2: Bottone "Go Back" */}
      {/* Questo rimane sempre visibile in basso (shrink-0) */}
      {/* Al click, torna alla pagina discover-recipes mantenendo l'indice della ricetta */}
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
