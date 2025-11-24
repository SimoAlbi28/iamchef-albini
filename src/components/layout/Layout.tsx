import React from 'react'

interface LayoutProps {
  header?: React.ReactNode
  main?: React.ReactNode
  footer?: React.ReactNode
}

function Layout({ header, main, footer }: LayoutProps) {
  return (
    <main className="w-screen max-w-96 h-screen flex flex-col mx-auto bg-gradient-to-b from-purple-900 via-purple-800 to-purple-700 text-purple-100">
      
      {/* Header */}
      <header className="mb-6 shrink-0">
        {header}
      </header>

      {/* Contenuto principale */}
      <section className="w-full flex-1 flex justify-center items-start min-h-0 p-4">
        {main}
      </section>

      {/* Footer */}
      {footer && (
        <footer className="mt-4 p-4 text-center text-purple-200 border-t border-purple-600">
          {footer}
        </footer>
      )}

    </main>
  )
}

export default Layout
