// Fórmulas de la calculadora. Funciones puras, sin dependencias de React,
// para que sean fáciles de revisar, reutilizar (PDF) y probar.

const toSafeNumber = (value, min = 0) => {
  const n = Number(value)
  if (!Number.isFinite(n)) return min
  return Math.max(min, n)
}

/** Limpia las entradas: sin negativos, porcentaje entre 0 y 100, semanas >= 1. */
export function sanitizeInputs(inputs) {
  return {
    employees: toSafeNumber(inputs.employees),
    hoursPerWeek: toSafeNumber(inputs.hoursPerWeek),
    hourlyCost: toSafeNumber(inputs.hourlyCost),
    reductionPct: Math.min(100, toSafeNumber(inputs.reductionPct)),
    implementationCost: toSafeNumber(inputs.implementationCost),
    monthlyMaintenance: toSafeNumber(inputs.monthlyMaintenance),
    weeksPerYear: Math.min(53, toSafeNumber(inputs.weeksPerYear, 1)),
  }
}

/**
 * Calcula todos los indicadores. Si se pasa `reductionPctOverride`
 * se usa ese porcentaje en lugar del introducido (para los escenarios).
 */
export function calculate(rawInputs, reductionPctOverride) {
  const i = sanitizeInputs(rawInputs)
  const reductionPct =
    reductionPctOverride === undefined
      ? i.reductionPct
      : Math.min(100, toSafeNumber(reductionPctOverride))

  const annualHours = i.employees * i.hoursPerWeek * i.weeksPerYear
  const annualLaborCost = annualHours * i.hourlyCost
  const freedHours = annualHours * (reductionPct / 100)
  const remainingHours = annualHours - freedHours
  const freedValue = freedHours * i.hourlyCost

  const annualMaintenance = i.monthlyMaintenance * 12
  const firstYearCost = i.implementationCost + annualMaintenance
  const netBenefit = freedValue - firstYearCost

  // ROI potencial: sin coste no hay inversión sobre la que calcularlo.
  const roi = firstYearCost > 0 ? (netBenefit / firstYearCost) * 100 : null

  // Recuperación: meses para que el valor mensual neto cubra la implantación.
  const monthlyNetValue = freedValue / 12 - i.monthlyMaintenance
  let paybackMonths = null
  if (monthlyNetValue > 0) {
    paybackMonths = i.implementationCost / monthlyNetValue
  }

  return {
    reductionPct,
    annualHours,
    annualLaborCost,
    freedHours,
    remainingHours,
    freedValue,
    annualMaintenance,
    firstYearCost,
    netBenefit,
    roi,
    monthlyNetValue,
    paybackMonths,
  }
}

/** Clasifica el resultado para el mensaje interpretativo. */
export function getVerdict(results) {
  const { annualHours, freedHours, netBenefit, paybackMonths, firstYearCost } = results
  if (annualHours === 0 || freedHours === 0) return 'sin-datos'
  if (firstYearCost === 0) return 'sin-coste'
  if (paybackMonths === null) return 'no-recupera'
  if (netBenefit >= 0) return paybackMonths <= 6 ? 'muy-favorable' : 'favorable'
  if (paybackMonths <= 36) return 'medio-plazo'
  return 'largo-plazo'
}
