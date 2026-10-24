import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  formatCompactCurrency,
  formatCompactNumber,
  formatCurrency,
  formatHours,
} from '../utils/format.js'

// Paleta validada para daltonismo (ver README). Las barras llevan además etiquetas directas.
export const CHART_COLORS = {
  navy: '#2c4f8f',
  green: '#059669',
  amber: '#d97706',
  grid: '#e2e8f0',
  axis: '#64748b',
}

// El texto de la leyenda va en gris neutro; el color lo aporta solo el icono.
export const legendText = (value) => <span style={{ color: CHART_COLORS.axis }}>{value}</span>

const axisProps = {
  tick: { fill: CHART_COLORS.axis, fontSize: 12 },
  axisLine: false,
  tickLine: false,
}

function ChartCard({ id, title, subtitle, children }) {
  return (
    <figure className="card animate-fade-up p-5">
      <figcaption>
        <h3 className="text-base font-semibold text-navy-900">{title}</h3>
        <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>
      </figcaption>
      <div id={id} className="mt-4 h-72">
        {children}
      </div>
    </figure>
  )
}

function TooltipBox({ title, rows }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg">
      <p className="mb-1 font-semibold text-navy-900">{title}</p>
      {rows.map(({ color, name, value }) => (
        <p key={name} className="flex items-center gap-2 text-slate-600">
          <span className="h-2.5 w-2.5 rounded-sm" style={{ background: color }} />
          {name}: <span className="font-semibold text-navy-900">{value}</span>
        </p>
      ))}
    </div>
  )
}

function HoursChart({ results }) {
  const data = [
    { name: 'Antes de la IA', proceso: results.annualHours, liberadas: 0 },
    { name: 'Con IA', proceso: results.remainingHours, liberadas: results.freedHours },
  ]

  return (
    <ChartCard
      id="chart-hours"
      title="Horas anuales: antes y después"
      subtitle="Horas dedicadas al proceso y horas que quedarían liberadas"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 24, right: 8, left: 0, bottom: 0 }} barCategoryGap="30%">
          <CartesianGrid vertical={false} stroke={CHART_COLORS.grid} />
          <XAxis dataKey="name" {...axisProps} />
          <YAxis {...axisProps} width={56} tickFormatter={formatCompactNumber} />
          <Tooltip
            cursor={{ fill: '#f1f5f9' }}
            content={({ active, payload, label }) =>
              active && payload?.length ? (
                <TooltipBox
                  title={label}
                  rows={payload
                    .filter((p) => p.value > 0)
                    .map((p) => ({ color: p.color, name: p.name, value: formatHours(p.value) }))}
                />
              ) : null
            }
          />
          <Legend iconType="square" wrapperStyle={{ fontSize: 12 }} formatter={legendText} />
          <Bar
            dataKey="proceso"
            name="Horas dedicadas al proceso"
            stackId="h"
            fill={CHART_COLORS.navy}
            stroke="#fff"
            strokeWidth={2}
            isAnimationActive
          >
            <LabelList
              dataKey="proceso"
              position="center"
              fill="#fff"
              fontSize={12}
              formatter={(v) => (v > 0 ? formatHours(v) : '')}
            />
          </Bar>
          <Bar
            dataKey="liberadas"
            name="Horas liberadas"
            stackId="h"
            fill={CHART_COLORS.green}
            stroke="#fff"
            strokeWidth={2}
            radius={[4, 4, 0, 0]}
          >
            <LabelList
              dataKey="liberadas"
              position="center"
              fill="#fff"
              fontSize={12}
              formatter={(v) => (v > 0 ? formatHours(v) : '')}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}

function CostBenefitChart({ results }) {
  const data = [
    { name: 'Implantación', value: results.firstYearCost - results.annualMaintenance, color: CHART_COLORS.amber },
    { name: 'Mantenimiento (12 meses)', value: results.annualMaintenance, color: CHART_COLORS.amber },
    { name: 'Valor horas liberadas', value: results.freedValue, color: CHART_COLORS.green },
    { name: 'Beneficio neto potencial', value: results.netBenefit, color: CHART_COLORS.navy },
  ]

  const legend = [
    { label: 'Costes de la solución', color: CHART_COLORS.amber },
    { label: 'Valor potencial', color: CHART_COLORS.green },
    { label: 'Resultado neto', color: CHART_COLORS.navy },
  ]

  return (
    <ChartCard
      id="chart-costs"
      title="Costes y beneficios del primer año"
      subtitle="Desembolsos de la solución frente al valor potencial de las horas liberadas"
    >
      <div className="flex h-full flex-col">
        <div className="min-h-0 flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 0, right: 64, left: 0, bottom: 0 }}>
              <CartesianGrid horizontal={false} stroke={CHART_COLORS.grid} />
              <XAxis type="number" {...axisProps} tickFormatter={formatCompactCurrency} />
              <YAxis type="category" dataKey="name" {...axisProps} width={112} interval={0} />
              <Tooltip
                cursor={{ fill: '#f1f5f9' }}
                content={({ active, payload }) =>
                  active && payload?.length ? (
                    <TooltipBox
                      title={payload[0].payload.name}
                      rows={[{ color: payload[0].payload.color, name: 'Importe', value: formatCurrency(payload[0].value) }]}
                    />
                  ) : null
                }
              />
              <Bar dataKey="value" radius={4} barSize={26}>
                {data.map((d) => (
                  <Cell key={d.name} fill={d.color} />
                ))}
                {/* Etiqueta propia: la de Recharts se parte en líneas cuando la barra es corta. */}
                <LabelList
                  dataKey="value"
                  content={({ x, y, width, height, value }) => (
                    <text
                      x={Math.max(x, x + width) + 6}
                      y={y + height / 2}
                      dy={4}
                      fill="#334155"
                      fontSize={12}
                    >
                      {formatCompactCurrency(value)}
                    </text>
                  )}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <ul className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-slate-500">
          {legend.map((l) => (
            <li key={l.label} className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm" style={{ background: l.color }} />
              {l.label}
            </li>
          ))}
        </ul>
      </div>
    </ChartCard>
  )
}

export default function Charts({ results }) {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <HoursChart results={results} />
      <CostBenefitChart results={results} />
    </div>
  )
}
