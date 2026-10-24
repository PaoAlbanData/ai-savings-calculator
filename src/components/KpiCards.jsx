import { Clock, PiggyBank, TrendingUp, Wallet } from 'lucide-react'
import { formatCurrency, formatHours, formatPercent } from '../utils/format.js'

export default function KpiCards({ results }) {
  const { freedHours, freedValue, netBenefit, roi } = results

  const cards = [
    {
      label: 'Horas anuales liberadas',
      value: formatHours(freedHours),
      help: 'Tiempo que el equipo dejaría de dedicar al proceso cada año.',
      icon: Clock,
      tone: 'navy',
    },
    {
      label: 'Valor económico anual potencial',
      value: formatCurrency(freedValue),
      help: 'Lo que cuestan hoy esas horas. Es capacidad liberada, no ahorro garantizado.',
      icon: Wallet,
      tone: 'accent',
    },
    {
      label: 'Beneficio neto potencial (año 1)',
      value: formatCurrency(netBenefit),
      help: 'Valor potencial menos implantación y 12 meses de mantenimiento.',
      icon: PiggyBank,
      tone: netBenefit >= 0 ? 'accent' : 'negative',
    },
    {
      label: 'ROI potencial (año 1)',
      value: formatPercent(roi),
      help:
        roi === null
          ? 'No aplicable: no se han indicado costes de la solución.'
          : 'Beneficio neto potencial dividido entre el coste total del primer año.',
      icon: TrendingUp,
      tone: roi === null || roi >= 0 ? 'navy' : 'negative',
    },
  ]

  const tones = {
    navy: 'bg-navy-50 text-navy-600',
    accent: 'bg-accent-50 text-accent-700',
    negative: 'bg-red-50 text-red-600',
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(({ label, value, help, icon: Icon, tone }, index) => (
        <article
          key={label}
          className="card animate-fade-up p-5 transition-shadow duration-200 hover:shadow-md"
          style={{ animationDelay: `${index * 60}ms` }}
        >
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-sm font-medium text-slate-500">{label}</h3>
            <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${tones[tone]}`}>
              <Icon className="h-4 w-4" aria-hidden="true" />
            </span>
          </div>
          <p
            className={`mt-3 text-2xl font-bold tracking-tight tabular-nums ${
              tone === 'negative' ? 'text-red-600' : 'text-navy-900'
            }`}
          >
            {value}
          </p>
          <p className="mt-2 text-xs leading-relaxed text-slate-500">{help}</p>
        </article>
      ))}
    </div>
  )
}
