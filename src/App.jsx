import { useMemo, useState } from 'react'
import Header from './components/Header.jsx'
import Disclaimer from './components/Disclaimer.jsx'
import InputForm from './components/InputForm.jsx'
import ActionBar from './components/ActionBar.jsx'
import KpiCards from './components/KpiCards.jsx'
import DetailTable from './components/DetailTable.jsx'
import Charts from './components/Charts.jsx'
import PaybackIndicator from './components/PaybackIndicator.jsx'
import Interpretation from './components/Interpretation.jsx'
import Scenarios from './components/Scenarios.jsx'
import Methodology from './components/Methodology.jsx'
import Footer from './components/Footer.jsx'
import { DEFAULT_INPUTS, DEFAULT_SCENARIOS } from './data/defaults.js'
import { calculate } from './utils/calculations.js'
import { formatCurrency, formatDecimal, formatPercent } from './utils/format.js'

// Solo visible al imprimir: el formulario interactivo se oculta en papel.
function PrintInputsSummary({ inputs }) {
  const rows = [
    ['Empleados', formatDecimal(inputs.employees)],
    ['Horas semanales por empleado', `${formatDecimal(inputs.hoursPerWeek)} h`],
    ['Coste laboral por hora', `${formatDecimal(inputs.hourlyCost)} €`],
    ['Reducción de tiempo estimada', formatPercent(inputs.reductionPct)],
    ['Coste de implantación', formatCurrency(inputs.implementationCost)],
    ['Mantenimiento mensual', formatCurrency(inputs.monthlyMaintenance)],
    ['Semanas al año', formatDecimal(inputs.weeksPerYear)],
  ]
  return (
    <div className="card hidden p-4 print:block">
      <h3 className="mb-2 text-sm font-semibold text-navy-900">Datos introducidos</h3>
      <dl className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs">
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between gap-2">
            <dt className="text-slate-500">{label}</dt>
            <dd className="font-semibold text-navy-900">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

export default function App() {
  const [inputs, setInputs] = useState(DEFAULT_INPUTS)
  const [scenarios, setScenarios] = useState(DEFAULT_SCENARIOS)
  // Cambia en cada "Restablecer" para que los campos descarten texto inválido pendiente.
  const [resetKey, setResetKey] = useState(0)

  const results = useMemo(() => calculate(inputs), [inputs])
  const scenarioResults = useMemo(
    () => scenarios.map((s) => ({ ...s, results: calculate(inputs, s.pct) })),
    [inputs, scenarios],
  )

  const updateInput = (field, value) => setInputs((prev) => ({ ...prev, [field]: value }))

  const handleReset = () => {
    setInputs(DEFAULT_INPUTS)
    setScenarios(DEFAULT_SCENARIOS)
    setResetKey((k) => k + 1)
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main className="mx-auto max-w-7xl space-y-8 px-4 pb-16 sm:px-6 lg:px-8">
        <Disclaimer />

        <div className="grid gap-8 lg:grid-cols-[minmax(320px,400px)_1fr]">
          <aside className="lg:sticky lg:top-6 lg:self-start">
            <InputForm key={resetKey} inputs={inputs} onChange={updateInput} />
          </aside>

          <section aria-labelledby="results-title" className="min-w-0 space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold tracking-wider text-accent-700 uppercase">
                  Resultados en tiempo real
                </p>
                <h2 id="results-title" className="mt-1 text-2xl font-bold text-navy-900">
                  {inputs.processName.trim() || 'Proceso sin nombre'}
                </h2>
              </div>
              <ActionBar
                inputs={inputs}
                results={results}
                scenarioResults={scenarioResults}
                onReset={handleReset}
              />
            </div>

            <PrintInputsSummary inputs={inputs} />
            <KpiCards results={results} />
            <Interpretation results={results} />
            <Charts results={results} />
            <PaybackIndicator results={results} />
            <DetailTable results={results} />
          </section>
        </div>

        <Scenarios
          key={`scenarios-${resetKey}`}
          scenarios={scenarios}
          scenarioResults={scenarioResults}
          currentPct={inputs.reductionPct}
          onScenariosChange={setScenarios}
          onApply={(pct) => updateInput('reductionPct', pct)}
        />

        <Methodology weeksPerYear={inputs.weeksPerYear} />
      </main>

      <Footer />
    </div>
  )
}
