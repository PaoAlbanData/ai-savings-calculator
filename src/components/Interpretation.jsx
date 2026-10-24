import { CircleAlert, CircleCheck, Info, TriangleAlert } from 'lucide-react'
import { getVerdict } from '../utils/calculations.js'
import { formatCurrency, formatHours, formatPayback } from '../utils/format.js'

export function getInterpretation(results) {
  const verdict = getVerdict(results)
  const payback =
    results.paybackMonths === 0
      ? 'de forma inmediata'
      : `en ${formatPayback(results.paybackMonths).toLowerCase()}`
  const net = formatCurrency(Math.abs(results.netBenefit))
  const hours = formatHours(results.freedHours)

  switch (verdict) {
    case 'sin-datos':
      return {
        tone: 'info',
        title: 'Faltan datos para estimar resultados',
        text: 'Introduce empleados, horas semanales y un porcentaje de reducción mayores que cero para calcular el impacto.',
      }
    case 'sin-coste':
      return {
        tone: 'info',
        title: 'Sin costes de solución indicados',
        text: `Se liberarían ${hours} al año, pero sin coste de implantación ni mantenimiento el ROI no es aplicable. Añade los costes previstos para obtener una estimación realista.`,
      }
    case 'muy-favorable':
      return {
        tone: 'good',
        title: 'Escenario muy favorable',
        text: `La inversión se recuperaría ${payback} y el valor potencial de las horas liberadas superaría los costes del primer año en ${net}. Merece la pena validar estos supuestos con una prueba piloto.`,
      }
    case 'favorable':
      return {
        tone: 'good',
        title: 'Escenario favorable',
        text: `El valor potencial superaría los costes del primer año en ${net} y la inversión se recuperaría ${payback}. Conviene definir cómo se reasignarán las ${hours} liberadas para convertirlas en ahorro real.`,
      }
    case 'medio-plazo':
      return {
        tone: 'warning',
        title: 'Rentable a medio plazo',
        text: `El primer año no compensaría los costes (resultado de −${net}), pero la inversión se recuperaría ${payback}. Evalúa el proyecto con un horizonte de varios años.`,
      }
    case 'largo-plazo':
      return {
        tone: 'warning',
        title: 'Recuperación a largo plazo',
        text: `La inversión se recuperaría ${payback}, por encima de un horizonte habitual de tres años. Revisa los costes, el alcance del proceso o el porcentaje de reducción esperado antes de decidir.`,
      }
    default:
      return {
        tone: 'bad',
        title: 'La inversión no se recuperaría',
        text: 'El coste mensual de mantenimiento iguala o supera el valor mensual de las horas liberadas. Con estos supuestos la automatización no resulta rentable.',
      }
  }
}

const styles = {
  good: { box: 'border-accent-100 bg-accent-50', icon: CircleCheck, iconColor: 'text-accent-600' },
  warning: { box: 'border-amber-200 bg-amber-50', icon: TriangleAlert, iconColor: 'text-amber-600' },
  bad: { box: 'border-red-200 bg-red-50', icon: CircleAlert, iconColor: 'text-red-600' },
  info: { box: 'border-slate-200 bg-white', icon: Info, iconColor: 'text-navy-500' },
}

export default function Interpretation({ results }) {
  const { tone, title, text } = getInterpretation(results)
  const { box, icon: Icon, iconColor } = styles[tone]

  return (
    <div className={`flex gap-3 rounded-2xl border p-5 transition-colors duration-300 ${box}`} aria-live="polite">
      <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${iconColor}`} aria-hidden="true" />
      <div>
        <p className="font-semibold text-navy-900">{title}</p>
        <p className="mt-1 text-sm leading-relaxed text-slate-700">{text}</p>
      </div>
    </div>
  )
}
