import {
  Briefcase,
  CalendarDays,
  Clock,
  Euro,
  Percent,
  Rocket,
  SlidersHorizontal,
  Users,
  Wrench,
} from 'lucide-react'
import NumberField from './NumberField.jsx'
import { FIELD_LIMITS } from '../data/defaults.js'

export default function InputForm({ inputs, onChange }) {
  const field = (name) => ({
    value: inputs[name],
    onChange: (v) => onChange(name, v),
    limits: FIELD_LIMITS[name],
  })

  return (
    <form
      className="card animate-fade-up space-y-6 p-5 sm:p-6 print:hidden"
      onSubmit={(e) => e.preventDefault()}
      aria-labelledby="form-title"
    >
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-navy-50 text-navy-600">
          <SlidersHorizontal className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h2 id="form-title" className="text-base font-bold text-navy-900">
            Datos del proceso
          </h2>
          <p className="text-xs text-slate-500">Los resultados se actualizan al instante.</p>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="processName" className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <Briefcase className="h-4 w-4 text-navy-500" aria-hidden="true" />
          Proceso a automatizar
        </label>
        <input
          id="processName"
          type="text"
          maxLength={80}
          value={inputs.processName}
          onChange={(e) => onChange('processName', e.target.value)}
          placeholder="Ej.: Atención de consultas por email"
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-navy-900 outline-none focus:border-navy-500 focus:ring-2 focus:ring-navy-100"
        />
      </div>

      <fieldset className="space-y-5">
        <legend className="mb-3 text-xs font-semibold tracking-wider text-slate-400 uppercase">
          Situación actual
        </legend>
        <NumberField
          label="Empleados que realizan el proceso"
          icon={Users}
          suffix="personas"
          slider
          sliderMax={100}
          {...field('employees')}
        />
        <NumberField
          label="Horas semanales por empleado"
          icon={Clock}
          suffix="h/semana"
          slider
          {...field('hoursPerWeek')}
        />
        <NumberField
          label="Coste laboral por hora"
          hint="Coste total para la empresa (salario + cargas sociales)."
          icon={Euro}
          suffix="€/h"
          slider
          sliderMax={150}
          {...field('hourlyCost')}
        />
      </fieldset>

      <fieldset className="space-y-5">
        <legend className="mb-3 text-xs font-semibold tracking-wider text-slate-400 uppercase">
          Solución con IA
        </legend>
        <NumberField
          label="Reducción de tiempo estimada"
          hint="Hipótesis: porcentaje del tiempo actual que dejaría de dedicarse al proceso."
          icon={Percent}
          suffix="%"
          slider
          {...field('reductionPct')}
        />
        <NumberField
          label="Coste inicial de implantación"
          hint="Licencias, integración, consultoría y formación."
          icon={Rocket}
          suffix="€"
          slider
          sliderMax={200000}
          {...field('implementationCost')}
        />
        <NumberField
          label="Coste mensual de mantenimiento"
          icon={Wrench}
          suffix="€/mes"
          slider
          sliderMax={10000}
          {...field('monthlyMaintenance')}
        />
      </fieldset>

      <fieldset className="space-y-3 rounded-xl bg-slate-50 p-4">
        <legend className="sr-only">Supuestos</legend>
        <NumberField
          label="Semanas laborables al año"
          hint="Supuesto por defecto: 52. Puedes ajustarlo, p. ej. 47 descontando vacaciones y festivos."
          icon={CalendarDays}
          suffix="semanas"
          {...field('weeksPerYear')}
        />
      </fieldset>
    </form>
  )
}
