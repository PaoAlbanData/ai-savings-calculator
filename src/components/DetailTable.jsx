import { Scale } from 'lucide-react'
import {
  formatCurrency,
  formatHours,
  formatPayback,
  formatPercent,
} from '../utils/format.js'

export default function DetailTable({ results }) {
  const groups = [
    {
      title: 'Capacidad laboral (valor potencial)',
      rows: [
        ['Horas anuales dedicadas al proceso', formatHours(results.annualHours), 'Empleados × horas semanales × semanas al año.'],
        ['Coste laboral anual actual', formatCurrency(results.annualLaborCost), 'Lo que la empresa paga hoy por el tiempo dedicado al proceso.'],
        ['Horas anuales potencialmente liberadas', formatHours(results.freedHours), 'Horas actuales × % de reducción estimado.'],
        ['Valor económico anual de las horas liberadas', formatCurrency(results.freedValue), 'Horas liberadas × coste por hora. Solo es ahorro si esas horas se reasignan o se reducen.'],
      ],
    },
    {
      title: 'Inversión y rentabilidad (primer año)',
      rows: [
        ['Coste total de la solución (año 1)', formatCurrency(results.firstYearCost), 'Implantación + 12 meses de mantenimiento. Es un desembolso real.'],
        ['Beneficio neto potencial (año 1)', formatCurrency(results.netBenefit), 'Valor de las horas liberadas − coste total del primer año.'],
        ['ROI potencial (año 1)', formatPercent(results.roi), 'Beneficio neto potencial ÷ coste total del primer año × 100.'],
        ['Periodo de recuperación', formatPayback(results.paybackMonths), 'Meses hasta que el valor mensual neto cubre el coste de implantación.'],
      ],
    },
  ]

  return (
    <div className="card animate-fade-up overflow-hidden">
      <div className="flex gap-3 border-b border-slate-100 bg-accent-50/60 p-5">
        <Scale className="mt-0.5 h-5 w-5 shrink-0 text-accent-700" aria-hidden="true" />
        <div className="text-sm text-slate-700">
          <p className="font-semibold text-navy-900">Ahorro real frente a capacidad liberada</p>
          <p className="mt-1 leading-relaxed">
            Las horas liberadas tienen un <strong>valor económico potencial</strong>, pero no se
            convierten automáticamente en dinero ahorrado: el ahorro real solo se materializa si ese
            tiempo se reasigna a tareas de mayor valor, se evitan contrataciones u horas extra, o se
            reduce el coste laboral. En cambio, los costes de implantación y mantenimiento sí son
            desembolsos reales.
          </p>
        </div>
      </div>

      <div className="grid divide-y divide-slate-100 md:grid-cols-2 md:divide-x md:divide-y-0">
        {groups.map((group) => (
          <div key={group.title} className="p-5">
            <h3 className="text-xs font-semibold tracking-wider text-slate-400 uppercase">{group.title}</h3>
            <dl className="mt-3 space-y-3">
              {group.rows.map(([label, value, help]) => (
                <div key={label}>
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="text-sm text-slate-700">{label}</dt>
                    <dd className="text-sm font-semibold whitespace-nowrap text-navy-900 tabular-nums">{value}</dd>
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500">{help}</p>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </div>
  )
}
