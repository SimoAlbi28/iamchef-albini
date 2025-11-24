import { X } from "lucide-react";
import type { IngredientInterface } from "../../../../types/recipes";

type SelectedIngredientProps = {
    // ID univoco del componente
    id: string,
    // Oggetto ingrediente da visualizzare
    ingredient: IngredientInterface,
    // Callback richiamata quando l'utente clicca il bottone X per rimuovere l'ingrediente
    handleRemove: (ing: IngredientInterface) => void
}

// Componente che renderizza un ingrediente come badge (pill) con bottone di rimozione
const SelectedIngredient = ({ id, ingredient, handleRemove }: SelectedIngredientProps) => {
    // ========== COMPONENTE SELECTED ITEM ==========
    // Mostra un singolo ingrediente come badge rettangolare
    // Include il nome e un bottone X per la rimozione
    
    return (
        <span
          id={id}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-wrap rounded-full bg-green-100
             text-green-700 text-sm font-medium shadow-sm hover:bg-green-200 transition-colors`}
        >
          {/* Nome dell'ingrediente */}
          {ingredient.name}

          {/* Bottone di rimozione */}
          <button
            onClick={() => handleRemove(ingredient)}
            className="hover:bg-green-300 rounded-full p-0.5 transition-colors cursor-pointer"
            aria-label={`Rimuovi ${ingredient}`}
          >
            {/* Icona X per indicare la rimozione */}
            <X size={14} className="stroke-[2.5]" />
          </button>
        </span>
    );
};

export default SelectedIngredient;
