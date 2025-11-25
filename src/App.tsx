import type { RecipeInterface, IngredientInterface } from "./types/recipes";
import type { currentPage } from './types/pages.ts'
import { useState, useEffect } from 'react'
import DiscoverRecipes from './pages/DiscoverRecipes.tsx'
import RecipeDetails from './pages/RecipeDetails.tsx'
import SearchPage from './pages/SearchPage.tsx'
import Layout from "./components/layout/Layout"
import Header from './components/header/Header'
import Footer from './components/Footer'
import Intropage from "./pages/Intropage.tsx"
import { getRecipesURL } from "./hooks/useApi.ts";
import { useApiConfigStore } from "./store/apiConfigStore.ts";

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

  // ========== API / URLS ==========
  // URL per la ricerca delle ricette
  const [URL, setURL] = useState<string>("")
  // Flag che abilita la fetch delle ricette (evita chiamate automatiche non volute)
  const [recipesFetchEnabled, setRecipesFetchEnabled] = useState<boolean>(false)
  // Quando recipesFetchEnabled è true e URL è settata, esegui la fetch qui
  useEffect(() => {
    let cancelled = false

    const fetchRecipes = async () => {
      if (!recipesFetchEnabled || !URL) return
      try {
        setIsDiscover(true)
        const res = await fetch(URL)
        const json = await res.json()

        if (cancelled) return

        // Normalizza le risposte: può essere un array (findByIngredients) o un oggetto con `results`
        let recipesData: RecipeInterface[] = []
        if (Array.isArray(json)) {
          recipesData = json as unknown as RecipeInterface[]
        } else if (json && typeof json === 'object' && 'results' in json) {
          // @ts-ignore
          recipesData = json.results
        } else {
          // fallback: prova ad assegnare l'oggetto direttamente
          recipesData = json as RecipeInterface[]
        }

        setRecipes(recipesData || [])
        setCurrentPage({ currentPage: { page: 'discover-recipes' } })
      } catch (err) {
        console.error('Fetch recipes error', err)
      } finally {
        if (!cancelled) {
          setIsDiscover(false)
          setRecipesFetchEnabled(false)
        }
      }
    }

    fetchRecipes()

    return () => { cancelled = true }
  }, [recipesFetchEnabled, URL])
  // API Key dal Zustand store
  const { apiKey } = useApiConfigStore()

  // NOTE: non costruiamo l'URL automaticamente quando cambia selectedIng
  // La fetch deve partire SOLO al click su Discover (handleSearchClick)

  // ========== HANDLER PER LA RICERCA ==========
  // Gestisce il click sul bottone "Discover Recipe"
  // 1. Mostra lo stato "loading"
  // 2. Verifica l'URL e fa la chiamata API tramite useApi
  // 3. Carica le ricette dall'API
  // 4. Naviga alla pagina discover-recipes
  const handleSearchClick = () => {
    setIsDiscover(true)
    setCurrentIndex(0)

    const ingredientNames = selectedIng.map(ing => ing.name).join(", ")
    console.log("Ingredienti selezionati:", ingredientNames)

    const url = getRecipesURL(ingredientNames, apiKey ?? "")
    console.log("URL generato:", url)
    
    if (!url) {
      console.error("URL non valido - verifica baseUrl e apiKey")
      setIsDiscover(false)
      return
    }

    // Abilita la fetch e imposta l'URL: useApi effettuerà la chiamata
    // Abilita la fetch e imposta l'URL: l'useEffect sopra effettuerà la chiamata
    setRecipesFetchEnabled(true)
    setURL(url)
  }

  // ========== HANDLER PER INGREDIENTI ==========
  // Aggiunge un ingrediente alla lista degli ingredienti selezionati
  // Evita duplicati controllando se è già presente nell'array
  const handleSuggestClick = (ingredient: IngredientInterface) => {
    if (selectedIng.includes(ingredient)) {
      return null
    }
    setSelectedIng(prev => [...prev, ingredient])
  }

  // Rimuove un ingrediente dalla lista degli ingredienti selezionati
  const handleSuggestRemove = (ingredient: IngredientInterface) => {
    setSelectedIng(selectedIng.filter(tag => tag != ingredient))
  }

  // ========== HANDLER PER LA NAVIGAZIONE ==========
  // Naviga alla pagina dei dettagli della ricetta selezionata
  const handleRecipeDetailClick = (recipe:RecipeInterface) => {
    // ensure currentIndex matches the clicked recipe so RecipeDetails shows correct id
    const idx = recipes.findIndex(r => r?.id === recipe?.id)
    if (idx >= 0) setCurrentIndex(idx)
    setCurrentPage({currentPage: {page: "recipe-details", recipeData: recipe}, id: idx >= 0 ? idx : undefined});
  }

  // Torna alla homepage
  const goToHomepage = () => {
    setCurrentPage({currentPage: {page: "SearchPage"}});
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
      mainContent = <Intropage onApiKeySaved={() => setCurrentPage({currentPage: {page: "SearchPage"}})} />;
      break;
    case "discover-recipes":
      mainContent = <DiscoverRecipes setCurrentIndex={setCurrentIndex} currentIndex={currentIndex} recipes={recipes} onRecipeDetailClick={handleRecipeDetailClick} goToHomepage={goToHomepage}/> 
      break;
    case "recipe-details":
      mainContent = <RecipeDetails id={currentIndex} goToBack={handleClickBack} recipeData={currentPage.currentPage.recipeData!}/>
      break;
    default:
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
