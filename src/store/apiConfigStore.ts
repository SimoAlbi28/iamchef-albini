import { create } from "zustand";
import { persist } from "zustand/middleware";

// ========== INTERFACE STORE ACTIONS ==========
// Definisce le azioni disponibili nel store
interface ApiConfigActions {
  apiKey: string | null;
  // Imposta l'API Key (utile se cambia dinamicamente)
  setApiKey: (key: string) => void;
}

// ========== ZUSTAND STORE ==========
// Store centralizzato per gestire la configurazione delle API (API_KEY, BASE_URL)
// Persistente nel localStorage con chiave "api-config-storage"
export const useApiConfigStore = create<ApiConfigActions>()(
  persist(
    (set) => ({
      // ========== INITIAL STATE ==========
      // Valori caricati da .env (import.meta.env)
      apiKey: null,
      // ========== ACTIONS ==========
      // Azione per aggiornare l'API Key
      setApiKey: (key: string | null) => {
        set({ apiKey: key });
      },
    }),
    {
      name: "api-config-storage", // Nome della chiave nel localStorage
    }
)
);
