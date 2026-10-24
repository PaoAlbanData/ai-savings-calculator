// Formato español: separador de miles con punto, decimales con coma, euros.
// `useGrouping: 'always'` fuerza el punto también en números de 4 cifras (1.234).

const currency0 = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
  useGrouping: 'always',
})

const number0 = new Intl.NumberFormat('es-ES', {
  maximumFractionDigits: 0,
  useGrouping: 'always',
})

const number1 = new Intl.NumberFormat('es-ES', {
  maximumFractionDigits: 1,
  useGrouping: 'always',
})

export const formatCurrency = (value) => currency0.format(Number.isFinite(value) ? value : 0)

export const formatNumber = (value) => number0.format(Number.isFinite(value) ? value : 0)

export const formatDecimal = (value) => number1.format(Number.isFinite(value) ? value : 0)

export const formatHours = (value) => `${formatNumber(value)} h`

export const formatPercent = (value) =>
  value === null || !Number.isFinite(value) ? 'N/A' : `${number1.format(value)} %`

/** Versión compacta para ejes de gráficos: 12.500 € -> 12,5 mil €. */
export const formatCompactCurrency = (value) => {
  const abs = Math.abs(value)
  if (abs >= 1_000_000) return `${number1.format(value / 1_000_000)} M€`
  if (abs >= 1_000) return `${number1.format(value / 1_000)} mil €`
  return `${number0.format(value)} €`
}

export const formatCompactNumber = (value) => {
  const abs = Math.abs(value)
  if (abs >= 1_000_000) return `${number1.format(value / 1_000_000)} M`
  if (abs >= 1_000) return `${number1.format(value / 1_000)} mil`
  return number0.format(value)
}

export function formatPayback(months) {
  if (months === null || !Number.isFinite(months)) return 'No se recupera'
  if (months === 0) return 'Inmediata'
  if (months < 1) return 'Menos de 1 mes'
  if (months < 24) return `${number1.format(months)} meses`
  return `${number1.format(months / 12)} años`
}
