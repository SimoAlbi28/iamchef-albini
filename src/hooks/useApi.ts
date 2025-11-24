import { useEffect, useState } from "react";

interface UseApiReturn<T> {
  data: T | null
  loading: boolean
  error: string | null
}

//https://api.spoonacular.com/recipes/findByIngredients

// https://api.spoonacular.com BASE URL
// /food/ingredients/search ENDPOINT
// ?api_key=${API_KEY}
// &query=${debouncedSearchIng}&number=${resultNum}

//TODO: Migrare questo hook in uno Zustand store per gestire lo state globale delle API
//TODO: Lo state (data, loading, error) dovrebbe essere centralizzato in Zustand anziché in useState
//TODO: Mantenere la logica di fetch e useEffect, ma orchestrarla tramite il Zustand store

function useApi<T = any>(url: string): UseApiReturn<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    let cancelled = false
    
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch(url)
        const result = await response.json()
        
        if (!cancelled) {
          setData(result.results)
        }
      } catch (err) {
        if (!cancelled) {
          setError((err as Error).message)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }
    
    if (url.length>0) fetchData();
    
    return () => {
      cancelled = true
    }
  }, [url]);
  
  return { data, loading, error }
}

/**
 * Funzione di helper per costruire l’URL della chiamata API per la ricerca degli ingredienti.
 * @param query stringa di ricerca
 * @returns URL completo per la chiamata API
 */

export const getIngredientURL= (query: string, apiKey: string) =>{
    const ENDPOINT= "/food/ingredients/search";
    const RESULT_NUM= 10;
    return `${import.meta.env.VITE_BASE_URL}${ENDPOINT}?apiKey=${apiKey}&query=${query}&number=${RESULT_NUM}`;//qua
}

export default useApi

