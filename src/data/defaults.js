// Datos de ejemplo con los que arranca la aplicación (y a los que vuelve "Restablecer").
export const DEFAULT_INPUTS = {
  processName: 'Gestión y clasificación de facturas de proveedores',
  employees: 8,
  hoursPerWeek: 10,
  hourlyCost: 28,
  reductionPct: 40,
  implementationCost: 25000,
  monthlyMaintenance: 600,
  weeksPerYear: 52,
}

// Hipótesis ilustrativas de reducción de tiempo, no resultados garantizados.
export const DEFAULT_SCENARIOS = [
  { id: 'conservador', name: 'Conservador', pct: 20 },
  { id: 'moderado', name: 'Moderado', pct: 40 },
  { id: 'optimista', name: 'Optimista', pct: 60 },
]

// Límites de validación de cada campo numérico.
export const FIELD_LIMITS = {
  employees: { min: 0, max: 10000, step: 1, integer: true },
  hoursPerWeek: { min: 0, max: 60, step: 0.5 },
  hourlyCost: { min: 0, max: 500, step: 0.5 },
  reductionPct: { min: 0, max: 100, step: 1 },
  implementationCost: { min: 0, max: 10000000, step: 500 },
  monthlyMaintenance: { min: 0, max: 1000000, step: 50 },
  weeksPerYear: { min: 1, max: 53, step: 1, integer: true },
}

export const DISCLAIMER =
  'Esta herramienta realiza estimaciones orientativas basadas en los datos y supuestos introducidos. No utiliza un modelo predictivo de inteligencia artificial y sus resultados no garantizan ahorros reales.'
