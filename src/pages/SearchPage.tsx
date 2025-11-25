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
    const searchBarRef = useRef<{ reset: () => void }>(null);

    const handleResetAll = () => {
      searchBarRef.current?.reset();
      onResetClick();
    };
    return (
        <div className="w-full flex flex-col items-center p-4 bg-gradient-to-b from-purple-100 via-white to-purple-200">
            
            {/* Card principale */}
            <div className="flex flex-col gap-4 w-full max-w-md bg-white/100 backdrop-blur-lg rounded-3xl shadow-xl p-5">
                
                {/* Titolo sezione */}
                <p className="text-purple-800 font-bold text-lg text-center tracking-tight">
                    🧩 Ingredienti per la ricetta
                </p>
                
                {/* Barra di ricerca */}
                <div className="relative rounded-xl border border-purple-300 focus-within:ring-4 focus-within:ring-purple-200">
                  <SearchBar ref={searchBarRef} handleSuggestClick={onSuggestClick} />
                </div>

                {/* Lista ingredienti selezionati */}
                <div className="mt-1">
                  <SelectedList 
                      ingredients={selectedIng} 
                      handleRemove={onBadgeRemove}
                  />
                </div>

                {/* Bottone Discover Recipe */}
                <div className="mt-2 w-full">
                  <DiscoverRecipeBtn 
                      ingredients={selectedIng} 
                      onSearchClick={onSearchClick} 
                      isDiscover={isDiscover}
                  />
                </div>

                {/* Bottone Reset Ingredients */}
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
