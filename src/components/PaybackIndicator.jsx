import { Timer } from 'lucide-react'
import { formatPayback } from '../utils/format.js'

const HORIZON = 36 // meses representados en la barra
const TICKS = [0, 6, 12, 18, 24, 30, 36]

export function paybackStatus(months) {
  if (months === null) return { label: 'No se recupera con estos datos', color: 'bg-red-500', text: 'text-red-600' }
  if (months <= 12) return { label: 'Dentro del primer año', color: 'bg-accent-500', text: 'text-accent-700' }
  if (months <= HORIZON) return { label: 'Entre 1 y 3 años', color: 'bg-amber-500', text: 'text-amber-700' }
  return { label: 'Más de 3 años', color: 'bg-red-500', text: 'text-red-600' }
}

export default function PaybackIndicator({ results }) {
  const { paybackMonths } = results
  const status = paybackStatus(paybackMonths)
  const pct = paybackMonths === null ? 100 : Math.min(paybackMonths / HORIZON, 1) * 100

  return (
    <section className="card animate-fade-up p-5" aria-labelledby="payback-title">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-navy-50 text-navy-600">
            <Timer className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h3 id="payback-title" className="text-base font-semibold text-navy-900">
              Periodo estimado de recuperación
            </h3>
            <p className="text-xs text-slate-500">
              Tiempo hasta que el valor mensual neto cubre el coste de implantación.
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-navy-900 tabular-nums">{formatPayback(paybackMonths)}</p>
          <p className={`text-xs font-medium ${status.text}`}>{status.label}</p>
        </div>
      </div>

      <div className="mt-6">
        <div
          className="relative h-3 rounded-full bg-slate-100"
          role="meter"
          aria-valuemin={0}
          aria-valuemax={HORIZON}
          aria-valuenow={paybackMonths === null ? HORIZON : Math.min(paybackMonths, HORIZON)}
          aria-label="Meses hasta recuperar la inversión"
        >
          {/* Zona del primer año */}
          <div className="absolute inset-y-0 left-0 w-1/3 rounded-l-full bg-accent-100" aria-hidden="true" />
          <div
            className={`absolute inset-y-0 left-0 rounded-full ${status.color} ${paybackMonths === null ? 'opacity-30' : ''} transition-all duration-500 ease-out`}
            style={{ width: `${Math.max(pct, 1.5)}%` }}
          />
          {paybackMonths !== null && paybackMonths <= HORIZON && (
            <div
              className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white bg-navy-800 shadow transition-all duration-500 ease-out"
              style={{ left: `${pct}%` }}
              aria-hidden="true"
            />
          )}
        </div>
        <div className="relative mt-2 h-4 text-[11px] text-slate-400">
          {TICKS.map((t) => (
            <span
              key={t}
              className="absolute -translate-x-1/2 whitespace-nowrap tabular-nums first:translate-x-0 last:-translate-x-full"
              style={{ left: `${(t / HORIZON) * 100}%` }}
            >
              {t === 0 ? '0' : `${t} m`}
            </span>
          ))}
        </div>
        {paybackMonths !== null && paybackMonths > HORIZON && (
          <p className="mt-2 text-xs text-slate-500">
            La recuperación supera el horizonte de 36 meses representado.
          </p>
        )}
      </div>
    </section>
  )
}
