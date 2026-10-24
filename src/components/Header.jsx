import { Sparkles } from 'lucide-react'

export default function Header() {
  return (
    <header className="relative mb-8 overflow-hidden bg-navy-800 text-white">
      <div
        className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-accent-500/20 blur-3xl"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-accent-100 ring-1 ring-white/15">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            AI Savings Calculator
          </span>
          <h1 className="mt-4 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">
            Calculadora Empresarial de Ahorro con IA
          </h1>
          <p className="mt-3 max-w-2xl text-base text-navy-100 sm:text-lg">
            Estima cuánto tiempo y valor económico podría liberar tu empresa automatizando tareas
            repetitivas, y cuándo se recuperaría la inversión.
          </p>
        </div>
      </div>
    </header>
  )
}
