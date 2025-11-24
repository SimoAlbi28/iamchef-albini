import type { RecipeInterface, IngredientInterface } from "./types/recipes";
import type { currentPage } from './types/pages.ts'
import { recipeMock } from './mock/mock'
import { useState } from 'react'
import DiscoverRecipes from './pages/DiscoverRecipes.tsx'
import RecipeDetails from './pages/RecipeDetails.tsx'
import SearchPage from './pages/SearchPage.tsx'
import Layout from "./components/layout/Layout"
import Header from './components/header/Header'
import Footer from './Footer'
import Intropage from "./pages/Intropage.tsx"

function App() {
  // ========== STATI GLOBALI ==========
  // Gestisce la pagina attualmente visualizzata (homepage, discover-recipes, recipe-details)
  const [currentPage, setCurrentPage] = useState<currentPage>({currentPage: {page: "Intropage"}})
  
  // Array degli ingredienti selezionati dall'utente tramite la searchbar
  const [selectedIng, setSelectedIng] = useState<IngredientInterface[]>([])
  
  // Array di ricette ottenuto dalla API (simulata da recipeMock)
  const [recipes, setRecipes] = useState<RecipeInterface[]>([])
  
  // Indice attuale della ricetta visualizzata nel carosello di discover-recipes
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  
  // Flag per indicare se la ricerca è in corso (usato per mostrare lo stato "loading")
  const [isDiscover, setIsDiscover] = useState<boolean>(false)

  // ========== HANDLER PER LA RICERCA ==========
  // Gestisce il click sul bottone "Discover Recipe"
  // 1. Mostra lo stato "loading"
  // 2. Simula una chiamata API con ritardo
  // 3. Carica le ricette dal mock
  // 4. Naviga alla pagina discover-recipes
  
  //TODO: Migrare lo state recipes in uno Zustand store dedicato alle ricette API
  //TODO: Lo state isDiscover dovrebbe essere gestito dal Zustand store
  //TODO: Creare un'action nel store che:
  //TODO:   1. Accetta gli ingredienti selezionati
  //TODO:   2. Chiama l'API reale (findByIngredients endpoint)
  //TODO:   3. Gestisce loading, data, error stato
  //TODO: Sostituire la simulazione con una vera chiamata API usando gli ingredienti selezionati
  //TODO: Usare gli ingredienti da selectedIng per fare la query all'API
  const handleSearchClick = async () => {
    setIsDiscover(true)
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simula una chiamata API
    setRecipes(recipeMock); // Carica le ricette dal mock
    console.log(selectedIng);
    setCurrentPage({currentPage: {page: "discover-recipes"}})
    setIsDiscover(false)
  }

  // ========== HANDLER PER INGREDIENTI ==========
  // Aggiunge un ingrediente alla lista degli ingredienti selezionati
  // Evita duplicati controllando se è già presente nell'array
  const handleSuggestClick = (ing: IngredientInterface) => {
    if (selectedIng.includes(ing)) { 
      return null // Non aggiungiamo se già presente
    }
    setSelectedIng(prev => [...prev, ing])
  }

  // Rimuove un ingrediente dalla lista degli ingredienti selezionati
  const handleSuggestRemove = (ing: IngredientInterface) => {
    const filtArray = selectedIng.filter(item => item != ing);
    setSelectedIng(filtArray)
  }

  // ========== HANDLER PER LA NAVIGAZIONE ==========
  // Naviga alla pagina dei dettagli della ricetta selezionata
  const handleRecipeDetailClick = (recipe:RecipeInterface) => {
    setCurrentPage({currentPage: {page: "recipe-details", recipeData: recipe}});
  }

  // Torna alla homepage
  const goToHomepage = () => {
    setCurrentPage({currentPage: {page: "Intropage"}});
  }

  // Torna alla pagina discover-recipes mantenendo l'indice della ricetta precedentemente visualizzata
  const handleClickBack = (id:number) => {
    setCurrentPage({
      currentPage: {page: 'discover-recipes'},
      id: id
    })
  }

  // ========== RENDERING CONDIZIONALE ==========
  // Determina quale componente renderizzare in base alla pagina corrente
  let mainContent = null;

  switch (currentPage.currentPage.page) {
    case "Intropage":
      // Mostra la pagina di introduzione con callback per navigare a discover-recipes dopo il salvataggio
      mainContent = <Intropage onApiKeySaved={() => setCurrentPage({currentPage: {page: "SearchPage"}})} />;
      break;
    case "discover-recipes":
      // Mostra il carosello di ricette
      mainContent = <DiscoverRecipes setCurrentIndex={setCurrentIndex} currentIndex={currentIndex} recipes={recipes} onRecipeDetailClick={handleRecipeDetailClick} goToHomepage={goToHomepage}/> 
      break;
    case "recipe-details":
      // Mostra i dettagli della ricetta selezionata
      mainContent = <RecipeDetails id={currentIndex} goToBack={handleClickBack} recipeData={currentPage.currentPage.recipeData!}/>
      break;
    default:
      // Mostra la pagina di ricerca (homepage)
      mainContent = <SearchPage onSuggestClick={handleSuggestClick} onBadgeRemove={handleSuggestRemove} selectedIng={selectedIng} onSearchClick={handleSearchClick} isDiscover={isDiscover}/>
      break;
  }
  
  // ========== RENDER ==========
  return <Layout 
      header={<Header />}
      main={mainContent}
      footer={<Footer />}
      />
}

export default App
