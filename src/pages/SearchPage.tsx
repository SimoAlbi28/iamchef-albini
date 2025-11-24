import type { IngredientInterface } from "../types/recipes"
import SearchBar from "../components/header/components/search-bar/Searchbar"
import SelectedList from "../components/header/components/selected-item/SelectedList"
import DiscoverRecipeBtn from "../components/header/components/discover-recipes-btn/DiscoverRecipeBtn"


type SearchPageProps = {
    // Callback richiamata quando l'utente seleziona un ingrediente dalla lista suggerita
    onSuggestClick: (ing: IngredientInterface) => void,
    // Callback richiamata quando l'utente rimuove un ingrediente selezionato
    onBadgeRemove: (ing: IngredientInterface) => void,
    // Array degli ingredienti attualmente selezionati
    selectedIng: IngredientInterface[]
    // Callback richiamata quando l'utente clicca il bottone "Discover Recipe"
    onSearchClick: () => void
    // Flag per indicare se la ricerca è in corso (mostra stato "loading")
    isDiscover: boolean
}

const SearchPage =({onSuggestClick, onBadgeRemove, selectedIng, onSearchClick, isDiscover}: SearchPageProps) => {
    // ========== COMPONENTE SEARCH PAGE ==========
    // Pagina principale che mostra:
    // 1. Barra di ricerca per inserire ingredienti
    // 2. Lista degli ingredienti selezionati
    // 3. Bottone per iniziare la ricerca di ricette
    
    return (
        <div>
               <div className="flex flex-col gap-4">
                {/* Titolo della sezione */}
                <p>
                   INGREDIENTI PER LA RICETTA
                </p>
                
                {/* Barra di ricerca - gestisce l'input e filtra gli ingredienti */}
                <SearchBar handleSuggestClick={onSuggestClick} />

                {/* Lista degli ingredienti selezionati - permette la rimozione */}
                <SelectedList 
                    ingredients={selectedIng} 
                    handleRemove={onBadgeRemove}/>

                {/* Bottone per iniziare la ricerca - disabilitato se nessun ingrediente è selezionato */}
                <DiscoverRecipeBtn ingredients={selectedIng} onSearchClick={onSearchClick} isDiscover={isDiscover}/>
            </div>
        </div>
    )
}

export default SearchPage