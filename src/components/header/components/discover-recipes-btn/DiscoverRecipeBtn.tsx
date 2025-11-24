import { ArrowRight } from "lucide-react"
import type { IngredientInterface } from "../../../../types/recipes";

type DiscoverRecipeBtnProps = {
  // Array degli ingredienti selezionati (usato per nascondere il bottone se vuoto)
  ingredients: IngredientInterface[],
  // Callback richiamata quando l'utente clicca il bottone di ricerca
  onSearchClick: () => void
  // Flag per indicare se la ricerca è in corso (mostra stato "loading")
  isDiscover: boolean
}

const DiscoverRecipeBtn = ({ ingredients, onSearchClick, isDiscover }: DiscoverRecipeBtnProps) => {
    // ========== COMPONENTE DISCOVER RECIPE BUTTON ==========
    // Bottone che avvia la ricerca di ricette basata sugli ingredienti selezionati
    // Il bottone è:
    // - Nascosto se nessun ingrediente è selezionato
    // - Disabilitato e mostra "Discovering..." durante la ricerca
    // - Abilitato e cliccabile quando non è in ricerca
    
    // Non mostrare il bottone se non ci sono ingredienti selezionati
    if (!ingredients || ingredients.length == 0) {
        return null
    }

  return (
    <button 
      className={`flex justify-center gap-2 flex-nowrap text-green-600 py-2 rounded-lg font-bold ${isDiscover ? "bg-green-100 cursor-default" : "bg-white hover:bg-green-100 cursor-pointer"} transition-all duration-300`}
      onClick={onSearchClick}
    >
        {/* Mostra testo e icona diversi a seconda se è in ricerca o no */}
        {isDiscover ? "Discovering ..." : "Discover Recipe"} <ArrowRight />
    </button>
  )
}

export default DiscoverRecipeBtn