import type { IngredientInterface } from "../types/recipes"
import { useRef } from "react"
import SearchBar from "../components/header/components/search-bar/Searchbar"
import SelectedList from "../components/header/components/selected-item/SelectedList"
import DiscoverRecipeBtn from "../components/header/components/discover-recipes-btn/DiscoverRecipeBtn"
import ResetIngredientsBtn from "../components/header/components/reset-ingredients-btn/ResetIngredientsBtn"

type SearchPageProps = {
    onSuggestClick: (ing: IngredientInterface) => void,
    onBadgeRemove: (ing: IngredientInterface) => void,
    selectedIng: IngredientInterface[],
    onSearchClick: () => void,
    onResetClick: () => void,
    isDiscover: boolean
}

const SearchPage =({onSuggestClick, onBadgeRemove, selectedIng, onSearchClick, onResetClick, isDiscover}: SearchPageProps) => {
    // ========== REF PER LA SEARCHBAR ==========
    // useRef per accedere ai metodi della SearchBar
    // Permette a SearchPage di controllare la searchbar dall'esterno
    // Usato per il reset: quando clicchi "Reset", pulisce anche il testo della barra
    const searchBarRef = useRef<{ reset: () => void }>(null);

    // ========== HANDLER RESET ==========
    // Quando l'utente clicca il bottone "Reset":
    // 1. Chiama il metodo reset della searchbar (pulisce il testo e chiude i suggerimenti)
    // 2. Chiama onResetClick (che pulisce la lista degli ingredienti selezionati in App.tsx)
    const handleResetAll = () => {
      searchBarRef.current?.reset();
      onResetClick();
    };
    return (
        <div className="w-full flex flex-col items-center p-4 bg-gradient-to-b from-purple-100 via-white to-purple-200">
            
            {/* Card principale - Container per tutti gli elementi */}
            <div className="flex flex-col gap-4 w-full max-w-md bg-white/100 backdrop-blur-lg rounded-3xl shadow-xl p-5">
                
                {/* SEZIONE 1: Titolo */}
                <p className="text-purple-800 font-bold text-lg text-center tracking-tight">
                    🧩 Ingredienti per la ricetta
                </p>
                
                {/* SEZIONE 2: Barra di ricerca */}
                {/* Permette all'utente di cercare e selezionare ingredienti */}
                {/* Mostra la tendina con i suggerimenti quando l'utente digita */}
                <div className="relative rounded-xl border border-purple-300 focus-within:ring-4 focus-within:ring-purple-200">
                  <SearchBar ref={searchBarRef} handleSuggestClick={onSuggestClick} />
                </div>

                {/* SEZIONE 3: Lista ingredienti selezionati */}
                {/* Mostra gli ingredienti già selezionati come badge piccoli */}
                {/* Ogni badge ha una X per rimuovere l'ingrediente */}
                {/* Se ci sono più di 4 righe di ingredienti, si può scrollare */}
                <div className="mt-1">
                  <SelectedList 
                      ingredients={selectedIng} 
                      handleRemove={onBadgeRemove}
                  />
                </div>

                {/* SEZIONE 4: Bottone "Discover Recipes" */}
                {/* Appare solo se almeno un ingrediente è selezionato */}
                {/* Al click, costruisce l'URL e fetcha le ricette dall'API */}
                {/* Mostra "Discovering..." mentre la ricerca è in corso */}
                <div className="mt-2 w-full">
                  <DiscoverRecipeBtn 
                      ingredients={selectedIng} 
                      onSearchClick={onSearchClick} 
                      isDiscover={isDiscover}
                  />
                </div>

                {/* SEZIONE 5: Bottone "Reset Ingredients" */}
                {/* Appare solo se almeno un ingrediente è selezionato */}
                {/* Al click: pulisce il testo della searchbar, chiude i suggerimenti, cancella gli ingredienti */}
                <div className="w-full">
                  <ResetIngredientsBtn 
                      ingredients={selectedIng}
                      onReset={handleResetAll}
                  />
                </div>

            </div>
        </div>
    )
}

export default SearchPage
