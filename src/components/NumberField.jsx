import { useEffect, useId, useState } from 'react'

const toDisplay = (value) => String(value).replace('.', ',')

/** Valida un texto numérico y devuelve { value } o { error }. Admite coma decimal. */
export function parseNumber(text, { min = 0, max = Infinity, integer = false } = {}) {
  const normalized = text.trim().replace(/\s/g, '').replace(',', '.')
  if (normalized === '') return { error: 'Este campo es obligatorio.' }
  const n = Number(normalized)
  if (!Number.isFinite(n)) return { error: 'Introduce un número válido.' }
  if (n < 0) return { error: 'No se admiten valores negativos.' }
  if (n < min) return { error: `El valor mínimo es ${toDisplay(min)}.` }
  if (n > max) return { error: `El valor máximo es ${toDisplay(max)}.` }
  if (integer && !Number.isInteger(n)) return { error: 'Debe ser un número entero.' }
  return { value: n }
}

/**
 * Campo numérico con validación y slider opcional.
 * Mientras el texto es inválido se muestra el error y se mantiene el último valor válido.
 */
export default function NumberField({
  label,
  hint,
  icon: Icon,
  value,
  onChange,
  limits,
  prefix,
  suffix,
  slider = false,
  sliderMax,
  compact = false,
  ariaLabel,
}) {
  const id = useId()
  const [text, setText] = useState(toDisplay(value))
  const [error, setError] = useState('')

  // Sincroniza cuando el valor cambia desde fuera (slider, escenarios, restablecer).
  useEffect(() => {
    setText((current) => {
      const parsed = parseNumber(current, limits)
      return parsed.value === value ? current : toDisplay(value)
    })
    setError('')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  const handleText = (next) => {
    setText(next)
    const parsed = parseNumber(next, limits)
    if (parsed.error) {
      setError(parsed.error)
      return
    }
    setError('')
    if (parsed.value !== value) onChange(parsed.value)
  }

  const rangeMax = sliderMax ?? limits.max

  return (
    <div className={compact ? '' : 'space-y-2'}>
      {label && (
        <label htmlFor={id} className="flex items-center gap-2 text-sm font-medium text-slate-700">
          {Icon && <Icon className="h-4 w-4 text-navy-500" aria-hidden="true" />}
          {label}
        </label>
      )}
      <div
        className={`flex items-center rounded-xl border bg-white transition-colors focus-within:ring-2 ${
          error
            ? 'border-red-300 focus-within:ring-red-100'
            : 'border-slate-200 focus-within:border-navy-500 focus-within:ring-navy-100'
        }`}
      >
        {prefix && <span className="pl-3 text-sm text-slate-400">{prefix}</span>}
        <input
          id={id}
          type="text"
          inputMode="decimal"
          value={text}
          onChange={(e) => handleText(e.target.value)}
          aria-label={label ? undefined : ariaLabel}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          className="w-full min-w-0 rounded-xl bg-transparent px-3 py-2 text-right text-sm font-semibold text-navy-900 tabular-nums outline-none"
        />
        {suffix && <span className="pr-3 text-sm whitespace-nowrap text-slate-400">{suffix}</span>}
      </div>
      {slider && (
        <input
          type="range"
          min={limits.min}
          max={rangeMax}
          step={limits.step}
          value={Math.min(value, rangeMax)}
          onChange={(e) => handleText(e.target.value)}
          aria-label={label}
          className="w-full"
        />
      )}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-xs text-red-600">
          {error} Se mantiene el último valor válido.
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="text-xs text-slate-500">
            {hint}
          </p>
        )
      )}
    </div>
  )
}
