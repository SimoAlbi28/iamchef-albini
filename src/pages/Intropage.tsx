import { useState } from "react";
import { useApiConfigStore } from "../store/apiConfigStore";

type IntropageProps = {
  onApiKeySaved?: () => void;
};

export function Intropage({ onApiKeySaved }: IntropageProps) {
  const { apiKey, setApiKey } = useApiConfigStore();
  const [inputApiKey, setInputApiKey] = useState<string>(apiKey || "");
  const [showKey, setShowKey] = useState(false);

  const handleSaveApiKey = () => {
    if (inputApiKey.trim()) {
      setApiKey(inputApiKey);
      if (onApiKeySaved) onApiKeySaved();
    }
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
          Ricette smart. Senza stress. 😎🔥
        </p>
      </section>

      {/* CARD */}
      <section className="w-full max-w-sm backdrop-blur-xl bg-white/80 border border-purple-200 rounded-3xl shadow-xl p-6">

        <h2 className="text-xl font-bold text-purple-800 mb-4 flex items-center gap-2">
          🔑 Configura API
        </h2>

        {/* LABEL */}
        <label className="block text-sm font-semibold text-purple-700 mb-2">
          Inserisci la tua chiave Spoonacular
        </label>

        {/* INPUT + OCCHIO + RESET */}
        <div className="relative flex items-center">
          <input
            type={showKey ? "text" : "password"}
            value={inputApiKey}
            onChange={(e) => setInputApiKey(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Scrivi qui la tua API Key..."
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
        {apiKey && (
          <p className="text-sm text-purple-600 font-medium mt-3 flex items-center gap-2">
            ✅ Chiave salvata con successo
          </p>
        )}

        {/* BUTTON SALVA */}
        <button
          onClick={handleSaveApiKey}
          className="mt-5 w-full py-3 px-4 bg-purple-700 hover:bg-purple-800 active:bg-purple-900 text-white font-bold rounded-xl shadow-md active:scale-95 transition-all flex justify-center items-center gap-2"
        >
          🧩 Entra
        </button>

        {/* LINK */}
        <p className="text-xs text-gray-600 mt-5 text-center">
          Non possiedi una key?{" "}
          <a
            href="https://spoonacular.com/food-api"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-700 font-bold hover:underline"
          >
            Ottienila qui
          </a>
        </p>
      </section>
    </main>
  );
}

export default Intropage;
