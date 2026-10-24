import { Layers } from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import NumberField from './NumberField.jsx'
import { CHART_COLORS, legendText } from './Charts.jsx'
import { FIELD_LIMITS } from '../data/defaults.js'
import {
  formatCompactCurrency,
  formatCurrency,
  formatHours,
  formatPayback,
  formatPercent,
} from '../utils/format.js'

const accents = ['border-t-slate-400', 'border-t-navy-500', 'border-t-accent-500']

export default function Scenarios({ scenarios, scenarioResults, currentPct, onScenariosChange, onApply }) {
  const updatePct = (id, pct) =>
    onScenariosChange(scenarios.map((s) => (s.id === id ? { ...s, pct } : s)))

  const chartData = scenarioResults.map((s) => ({
    name: `${s.name} (${s.pct} %)`,
    valor: s.results.freedValue,
    neto: s.results.netBenefit,
  }))

  return (
    <section aria-labelledby="scenarios-title" className="space-y-5">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-navy-50 text-navy-600">
          <Layers className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h2 id="scenarios-title" className="text-xl font-bold text-navy-900">
            Comparativa de escenarios
          </h2>
          <p className="text-sm text-slate-500">
            Los porcentajes son hipótesis ilustrativas, no resultados garantizados. Puedes
            personalizarlos.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {scenarioResults.map((s, index) => {
          const r = s.results
          const isActive = s.pct === currentPct
          return (
            <article
              key={s.id}
              className={`card animate-fade-up border-t-4 p-5 ${accents[index]} ${
                isActive ? 'ring-2 ring-accent-500/40' : ''
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-semibold text-navy-900">{s.name}</h3>
                <div className="w-28">
                  <NumberField
                    compact
                    ariaLabel={`Reducción de tiempo del escenario ${s.name}`}
                    value={s.pct}
                    onChange={(v) => updatePct(s.id, v)}
                    limits={FIELD_LIMITS.reductionPct}
                    suffix="%"
                  />
                </div>
              </div>

              <dl className="mt-4 space-y-2 text-sm">
                {[
                  ['Horas liberadas', formatHours(r.freedHours)],
                  ['Valor potencial anual', formatCurrency(r.freedValue)],
                  ['Beneficio neto (año 1)', formatCurrency(r.netBenefit)],
                  ['ROI potencial', formatPercent(r.roi)],
                  ['Recuperación', formatPayback(r.paybackMonths)],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-3">
                    <dt className="text-slate-500">{label}</dt>
                    <dd
                      className={`font-semibold tabular-nums ${
                        label.startsWith('Beneficio') && r.netBenefit < 0 ? 'text-red-600' : 'text-navy-900'
                      }`}
                    >
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>

              <button
                type="button"
                onClick={() => onApply(s.pct)}
                disabled={isActive}
                className="btn-secondary mt-5 w-full disabled:cursor-default disabled:border-accent-100 disabled:bg-accent-50 disabled:text-accent-700 print:hidden"
              >
                {isActive ? 'Escenario aplicado' : 'Aplicar a la calculadora'}
              </button>
            </article>
          )
        })}
      </div>

      <figure className="card p-5">
        <figcaption>
          <h3 className="text-base font-semibold text-navy-900">Valor potencial y beneficio neto por escenario</h3>
          <p className="mt-0.5 text-xs text-slate-500">Primer año, con los mismos costes de implantación y mantenimiento</p>
        </figcaption>
        <div id="chart-scenarios" className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} barGap={2}>
              <CartesianGrid vertical={false} stroke={CHART_COLORS.grid} />
              <XAxis dataKey="name" tick={{ fill: CHART_COLORS.axis, fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fill: CHART_COLORS.axis, fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                width={64}
                tickFormatter={formatCompactCurrency}
              />
              <Tooltip
                cursor={{ fill: '#f1f5f9' }}
                formatter={(value) => formatCurrency(value)}
                contentStyle={{ borderRadius: 8, borderColor: '#e2e8f0', fontSize: 12 }}
              />
              <Legend iconType="square" wrapperStyle={{ fontSize: 12 }} formatter={legendText} />
              <Bar dataKey="valor" name="Valor potencial anual" fill={CHART_COLORS.green} radius={[4, 4, 0, 0]} maxBarSize={48} />
              <Bar dataKey="neto" name="Beneficio neto (año 1)" fill={CHART_COLORS.navy} radius={[4, 4, 0, 0]} maxBarSize={48} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </figure>
    </section>
  )
}
