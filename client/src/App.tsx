import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ContributeWizard } from '@/components/ContributeWizard'

function App() {
  const [showComingSoon, setShowComingSoon] = useState(false)
  const [showWizard, setShowWizard] = useState(false)

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="max-w-3xl mx-auto flex flex-col items-center gap-8">

        {/* Tag */}
        <span className="text-xs font-medium tracking-widest uppercase text-purple-400 border border-purple-400/30 rounded-full px-4 py-1.5">
          Decentralized · Fair · Private
        </span>

        {/* Hero */}
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground leading-tight">
          Welcome to the world's first{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-violet-300">
            completely fair data DAO
          </span>
        </h1>

        <p className="text-muted-foreground text-lg max-w-xl">
          A protocol where you own your data, set the terms, and continuously earn with your data.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 items-center mt-2">
          <Button
            variant="outline"
            size="lg"
            className="border-border text-foreground hover:bg-muted min-w-44"
            onClick={() => setShowComingSoon((v) => !v)}
          >
            Explore Concepts
          </Button>

          <Button
            size="lg"
            className="bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-900/40 min-w-44 text-base font-semibold"
            onClick={() => setShowWizard((v) => !v)}
          >
            Contribute Your Data
          </Button>
        </div>

        {/* Coming soon */}
        {showComingSoon && (
          <div className="mt-2 px-6 py-4 rounded-xl border border-purple-400/20 bg-purple-950/30 text-muted-foreground text-sm">
            Coming soon — concepts are on their way.
          </div>
        )}

        {/* Contribute wizard */}
        {showWizard && (
          <ContributeWizard onClose={() => setShowWizard(false)} />
        )}
      </div>
    </main>
  )
}

export default App
