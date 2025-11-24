import Titlesubtitle from "./components/title-subtitle/TitleSubtitle"

const Header = () => {
  // ========== COMPONENTE HEADER ==========
  // Componente semplice che renderizza solo il titolo/sottotitolo
  // È completamente indipendente dallo stato della pagina corrente
  // Non riceve nessuna prop relativa alla gestione della ricerca o della navigazione

    return (
        <div>
          {/* Titolo e logo dell'app */}
          <div className="">
                <Titlesubtitle />
            </div>
        </div>
    )
}

export default Header