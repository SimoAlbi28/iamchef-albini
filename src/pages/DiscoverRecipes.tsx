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
  // Visualizza un carosello di ricette con:
  // 1. RecipeCard: mostra i dettagli della ricetta corrente
  // 2. ScrollBtnSection: bottoni per navigare tra le ricette

  return (
    <main
      id="recipe-card-container"
      className="w-full h-full flex flex-col gap-0 overflow-hidden min-h-0"
    >

      {/* Sezione principale: mostra la ricetta attualmente visualizzata */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="px-4 py-4">
          <RecipeCard recipe={recipes[currentIndex]} onClickDetails={onRecipeDetailClick} />
        </div>
      </div>

      {/* Sezione di navigazione: bottoni per scorrere le ricette */}
      <div className="shrink-0">
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
