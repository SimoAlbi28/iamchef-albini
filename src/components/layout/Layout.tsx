import React from 'react'
interface LayoutProps {
  // ReactNode per l'header (logo, titolo, ecc.)
  header?: React.ReactNode,
  // ReactNode per il contenuto principale (pagina attuale)
  main?: React.ReactNode,
  // ReactNode per il footer
  footer?: React.ReactNode
}

function Layout({ header, main, footer }: LayoutProps) {
  // ========== LAYOUT PRINCIPALE ==========
  // Componente contenitore che gestisce la struttura della pagina
  // Usa flexbox per disporre verticalmente: header, main content, footer
  
    return (
        <main className={`w-screen max-w-96 h-screen flex flex-col mx-auto bg-green-700 overflow-hidden`}>
              {                
                // Sezione dell'header - mostra il componente header ricevuto come prop
                <header className="mb-6 shrink-0">
                  {header}
                </header>
              }
      
            {/* Sezione principale - contiene il contenuto della pagina corrente */}
            <section className={`w-full flex-1 flex justify-center min-h-0 overflow-hidden`}>
              {main}
            </section>

            {/* Footer della pagina */}
            {footer}
            
        </main>
    )
}

export default Layout