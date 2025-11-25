import { useState } from "react";
import { useApiConfigStore } from "../store/apiConfigStore";

type IntropageProps = {
  onApiKeySaved?: () => void;
};

export function Intropage({ onApiKeySaved }: IntropageProps) {
  const { apiKey, setApiKey } = useApiConfigStore();
  const [inputApiKey, setInputApiKey] = useState<string>(apiKey || "");
  const [showKey, setShowKey] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Valida l'API key facendo una richiesta di test a Spoonacular
  const validateApiKey = async (key: string): Promise<boolean> => {
    try {
      const baseUrl = import.meta.env.VITE_BASE_URL;
      
      // Usa l'endpoint leggero per gli ingredienti (non dovrebbe consumare crediti)
      const testUrl = `${baseUrl}/food/ingredients/search?apiKey=${key}&query=tomato&number=1`;
      const response = await fetch(testUrl);

      // 401/403 = key non valida
      if (response.status === 401 || response.status === 403) {
        setValidationError("❌ API key non valida o autorizzazione negata");
        return false;
      }

      // Altri status non-ok: mostra messaggio generico ma NON triggerare chiamate a recipes
      if (!response.ok) {
        setValidationError(`❌ Errore API: ${response.status} - ${response.statusText}`);
        return false;
      }

      // Successo
      setValidationError(null);
      return true;
    } catch (err) {
      setValidationError(`❌ Errore di connessione: ${(err as Error).message}`);
      return false;
    }
  };

  const handleSaveApiKey = async () => {
    if (!inputApiKey.trim()) {
      setValidationError("❌ Inserisci una API key");
      return;
    }

    setIsValidating(true);
    setValidationError(null);
    
    const isValid = await validateApiKey(inputApiKey);
    
    if (isValid) {
      setApiKey(inputApiKey);
      setValidationError(null);
      if (onApiKeySaved) onApiKeySaved();
    }
    
    setIsValidating(false);
  };

  const handleReset = () => setInputApiKey("");

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSaveApiKey();
  };

  return (
    <main className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-purple-200 via-white to-purple-100 p-6">

      {/* HEADER */}
      <section className="text-center mb-10">
        <h1 className="text-5xl font-black text-purple-800 drop-shadow-md tracking-tight">
          I AM CHEF 🧑‍🍳
        </h1>
        <p className="text-lg text-purple-600 font-medium mt-2">
          Smart recipes. No stress. 😎🔥
        </p>
      </section>

      {/* CARD */}
      <section className="w-full max-w-2xl sm:max-w-xl backdrop-blur-xl bg-white/80 border border-purple-200 rounded-3xl shadow-xl p-6">

        <h2 className="text-xl font-bold text-purple-800 mb-4 flex items-center gap-2">
          🔑 Setup API
        </h2>

        {/* LABEL */}
        <label className="block text-sm font-semibold text-purple-700 mb-2">
          Enter your Spoonacular API Key
        </label>

        {/* INPUT + SHOW/HIDE + RESET */}
        <div className="relative flex items-center">
          <input
            type={showKey ? "text" : "password"}
            value={inputApiKey}
            onChange={(e) => setInputApiKey(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your API key here..."
            className="w-full px-4 py-3 rounded-lg bg-purple-50 border-2 border-purple-300 focus:ring-4 focus:ring-purple-200 focus:border-purple-700 transition-all outline-none text-purple-900 font-semibold placeholder-purple-400"
          />

          {/* 👁 Show/Hide */}
          <button
            type="button"
            onClick={() => setShowKey((prev) => !prev)}
            className="absolute right-10 text-purple-800 hover:opacity-75 transition cursor-pointer"
          >
            {showKey ? "🙈" : "👁️"}
          </button>

          {/* ❌ Reset */}
          {inputApiKey && (
            <button
              type="button"
              onClick={handleReset}
              className="absolute right-2 text-red-600 text-lg hover:opacity-70"
            >
              ✖
            </button>
          )}
        </div>

        {/* FEEDBACK */}
        {apiKey && !validationError && (
          <p className="text-sm text-purple-600 font-medium mt-3 flex items-center gap-2">
            ✅ Key saved successfully
          </p>
        )}

        {/* ERROR MESSAGE */}
        {validationError && (
          <p className="text-sm text-red-600 font-medium mt-3">
            {validationError}
          </p>
        )}

        {/* SAVE BUTTON */}
        <button
          onClick={handleSaveApiKey}
          disabled={isValidating}
          className={`mt-5 w-full py-3 px-4 ${
            isValidating
              ? "bg-purple-500 cursor-not-allowed opacity-70"
              : "bg-purple-700 hover:bg-purple-800 active:bg-purple-900 active:scale-95"
          } text-white font-bold rounded-xl shadow-md transition-all flex justify-center items-center gap-2`}
        >
          {isValidating ? "🔄 Validating..." : "🧩 Enter"}
        </button>

        {/* LINK */}
        <p className="text-xs text-gray-600 mt-5 text-center">
          Don’t have a key?{" "}
          <a
            href="https://spoonacular.com/food-api"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-700 font-bold hover:underline"
          >
            Get it here
          </a>
        </p>
      </section>
    </main>
  );
}

export default Intropage;
