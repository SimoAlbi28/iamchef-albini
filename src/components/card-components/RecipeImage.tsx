type RecipeImageProps = {
  image: string;
  title: string;
};

const RecipeImage = ({ image, title }: RecipeImageProps) => (
  <div className="w-full h-50 rounded-2xl overflow-hidden shadow-lg relative bg-gray-100 flex items-center justify-center mb-2">
    <img
      src={

        //! INVERTIRE ORDINE DELLA CONDIZIONE PER FARE IN MODO CHE VENGA CORRETTAMENTE CARICATA L'IMMAGINE DELLA CARD PRESA DALL'API
        image?.length
          ? "https://images.unsplash.com/photo-1547385203-cfe7977b9fd0?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1171"
          : image
      }
      alt={title || "Titolo non disponibile"}
      className="object-cover w-full h-full"
    />
    <div className="absolute inset-0" />
  </div>
);

export default RecipeImage;
