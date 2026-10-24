import { BookOpen } from 'lucide-react'
import { DISCLAIMER } from '../data/defaults.js'

export const FORMULAS = [
  ['Horas anuales del proceso', 'Empleados × Horas semanales por empleado × Semanas al año'],
  ['Coste laboral anual actual', 'Horas anuales × Coste laboral por hora'],
  ['Horas anuales liberadas', 'Horas anuales × (% de reducción ÷ 100)'],
  ['Valor económico potencial', 'Horas liberadas × Coste laboral por hora'],
  ['Coste total del primer año', 'Coste de implantación + (Mantenimiento mensual × 12)'],
  ['Beneficio neto potencial', 'Valor económico potencial − Coste total del primer año'],
  ['ROI potencial (%)', '(Beneficio neto potencial ÷ Coste total del primer año) × 100'],
  ['Periodo de recuperación (meses)', 'Coste de implantación ÷ (Valor potencial ÷ 12 − Mantenimiento mensual)'],
]

export default function Methodology({ weeksPerYear }) {
  return (
    <section id="metodologia" aria-labelledby="method-title" className="card p-5 sm:p-6">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-navy-50 text-navy-600">
          <BookOpen className="h-5 w-5" aria-hidden="true" />
        </span>
        <h2 id="method-title" className="text-xl font-bold text-navy-900">
          Metodología de cálculo
        </h2>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {FORMULAS.map(([name, formula]) => (
          <div key={name} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-navy-900">{name}</p>
            <p className="mt-1 font-mono text-xs leading-relaxed text-slate-600">{formula}</p>
          </div>
        ))}
      </div>

      <h3 className="mt-6 text-sm font-semibold text-navy-900">Supuestos y criterios</h3>
      <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-slate-600">
        <li>
          Se consideran <strong>{weeksPerYear} semanas</strong> laborables al año (52 por defecto,
          modificable en el formulario).
        </li>
        <li>
          El <strong>valor económico potencial</strong> mide la capacidad laboral liberada, no un
          ahorro de caja. Solo se convierte en ahorro real si las horas se reasignan, se evitan
          contrataciones u horas extra, o se reduce el coste laboral.
        </li>
        <li>
          El <strong>ROI potencial</strong> se calcula sobre el primer año e incluye la implantación
          completa y 12 meses de mantenimiento. No se calcula si el coste total es 0 €.
        </li>
        <li>
          El <strong>periodo de recuperación</strong> solo se muestra cuando el valor mensual de las
          horas liberadas supera el mantenimiento mensual; en caso contrario la inversión no se
          recupera.
        </li>
        <li>
          No se consideran impuestos, inflación, curva de adopción, costes de oportunidad ni el
          valor temporal del dinero.
        </li>
        <li>
          Los escenarios (20 %, 40 % y 60 %) son hipótesis ilustrativas y no resultados
          garantizados.
        </li>
      </ul>

      <p className="mt-6 rounded-xl border border-navy-100 bg-navy-50 p-4 text-sm text-navy-800">{DISCLAIMER}</p>
    </section>
  )
}
