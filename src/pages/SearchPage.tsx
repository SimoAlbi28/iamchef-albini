import type { IngredientInterface } from "../types/recipes"
import SearchBar from "../components/header/components/search-bar/Searchbar"
import SelectedList from "../components/header/components/selected-item/SelectedList"
import DiscoverRecipeBtn from "../components/header/components/discover-recipes-btn/DiscoverRecipeBtn"

type SearchPageProps = {
    onSuggestClick: (ing: IngredientInterface) => void,
    onBadgeRemove: (ing: IngredientInterface) => void,
    selectedIng: IngredientInterface[],
    onSearchClick: () => void,
    isDiscover: boolean
}

const SearchPage =({onSuggestClick, onBadgeRemove, selectedIng, onSearchClick, isDiscover}: SearchPageProps) => {
    return (
        <div className="w-full flex flex-col items-center p-6 bg-gradient-to-b from-purple-100 via-white to-purple-200">
            
            {/* Card principale */}
            <div className="flex flex-col gap-6 w-full max-w-md bg-white/100 backdrop-blur-lg rounded-3xl shadow-xl p-6">
                
                {/* Titolo sezione */}
                <p className="text-purple-800 font-bold text-lg text-center tracking-tight">
                    🧩 Ingredienti per la ricetta
                </p>
                
                {/* Barra di ricerca */}
                <div className="relative rounded-xl border border-purple-300 focus-within:ring-4 focus-within:ring-purple-200">
                  <SearchBar handleSuggestClick={onSuggestClick} />
                </div>

                {/* Lista ingredienti selezionati */}
                <div className="mt-2">
                  <SelectedList 
                      ingredients={selectedIng} 
                      handleRemove={onBadgeRemove}
                  />
                </div>

                {/* Bottone Discover Recipe */}
                <div className="mt-4 w-full">
                  <DiscoverRecipeBtn 
                      ingredients={selectedIng} 
                      onSearchClick={onSearchClick} 
                      isDiscover={isDiscover}
                  />
                </div>

            </div>
        </div>
    )
}

export default SearchPage
