import { RecipeCard } from "../components/card-components/RecipeCard"
import { ScrollBtnSection } from "../components/scroll-btn/ScrollBtnSection"
import type { RecipeInterface } from "../types/recipes"

type DiscoverRecipesProps = {

  // Array di ricette da visualizzare nel carosello
  recipes: RecipeInterface[]

  // Callback richiamata quando l'utente clicca "Dettagli ricetta" su una carta
  onRecipeDetailClick: (recipe: RecipeInterface) => void

  // Callback richiamata quando l'utente clicca il logo per tornare alla homepage
  goToHomepage:()=> void

  // Indice della ricetta attualmente visualizzata nel carosello
  currentIndex: number
  
  // Callback per aggiornare l'indice quando l'utente naviga tra le ricette
  setCurrentIndex: (index: number) => void
}

function DiscoverRecipes({ currentIndex, recipes, onRecipeDetailClick, goToHomepage, setCurrentIndex }: DiscoverRecipesProps) {
  // ========== COMPONENTE DISCOVER RECIPES ==========
  // Questo componente mostra un carosello di ricette
  // 
  // Struttura:
  // 1. Area scrollabile in alto: mostra la ricetta attualmente selezionata
  // 2. Area bottoni in basso: permette di navigare tra le ricette
  //
  // Flusso:
  // - L'utente vede la prima ricetta della lista (indice 0)
  // - Può scorrere in alto per leggere tutti i dettagli della ricetta
  // - Può cliccare i bottoni in basso per navigare alle ricette precedente/successiva
  // - Può cliccare "View Details" per andare alla pagina completa della ricetta

  return (
    <main
      id="recipe-card-container"
      className="w-full h-full flex flex-col gap-0 overflow-hidden min-h-0"
    >

      {/* SEZIONE 1: Area scrollabile con la ricetta corrente */}
      {/* flex-1 significa che usa tutto lo spazio disponibile */}
      {/* min-h-0 è necessario per far funzionare correttamente il flex layout */}
      {/* overflow-y-auto permette di scrollare se il contenuto è troppo lungo */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="px-4 py-4">
          {/* RecipeCard: mostra titolo, tempo, ingredienti, immagine della ricetta */}
          {/* recipes[currentIndex] seleziona la ricetta in base all'indice corrente */}
          {/* onClickDetails è il callback quando l'utente clicca "View Details" */}
          <RecipeCard recipe={recipes[currentIndex]} onClickDetails={onRecipeDetailClick} />
        </div>
      </div>

      {/* SEZIONE 2: Area bottoni per la navigazione */}
      {/* shrink-0 significa che questa sezione non si riduce (rimane sempre visibile) */}
      <div className="shrink-0">
        {/* ScrollBtnSection: contiene i bottoni per navigare tra le ricette */}
        <ScrollBtnSection
          currentIndex={currentIndex}
          maxIndex={recipes.length-1}
          setCurrentIndex={setCurrentIndex}
          goToHomepage={goToHomepage}
        />
      </div>

    </main>
  )
}

export default DiscoverRecipes
