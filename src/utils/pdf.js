import { jsPDF } from 'jspdf'
import { DISCLAIMER } from '../data/defaults.js'
import { FORMULAS } from '../components/Methodology.jsx'
import { getInterpretation } from '../components/Interpretation.jsx'
import {
  formatCurrency,
  formatDecimal,
  formatHours,
  formatPayback,
  formatPercent,
} from './format.js'

const NAVY = [19, 41, 75]
const GREEN = [5, 150, 105]
const SLATE = [100, 116, 139]
const DARK = [30, 41, 59]
const LINE = [226, 232, 240]

const PAGE_W = 210
const PAGE_H = 297
const MARGIN = 16
const CONTENT_W = PAGE_W - MARGIN * 2

// Las fuentes estándar de jsPDF usan WinAnsi: normalizamos espacios y signos no soportados.
const clean = (text) =>
  String(text)
    .replace(/[  ]/g, ' ')
    .replace(/−/g, '-')
    .replace(/[×]/g, 'x')

/** Convierte el SVG de un gráfico de Recharts en PNG para incrustarlo en el PDF. */
async function svgToPng(containerId) {
  const svg = document.querySelector(`#${containerId} svg.recharts-surface`)
  if (!svg) return null
  const { width, height } = svg.getBoundingClientRect()
  if (!width || !height) return null

  const clone = svg.cloneNode(true)
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  clone.setAttribute('width', width)
  clone.setAttribute('height', height)
  clone.setAttribute('style', 'font-family: Helvetica, Arial, sans-serif')

  const url = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(new XMLSerializer().serializeToString(clone))}`
  const img = new Image()
  await new Promise((resolve, reject) => {
    img.onload = resolve
    img.onerror = reject
    img.src = url
  })

  const scale = 2
  const canvas = document.createElement('canvas')
  canvas.width = width * scale
  canvas.height = height * scale
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
  return { dataUrl: canvas.toDataURL('image/png'), ratio: height / width }
}

export async function generatePdfReport({ inputs, results, scenarioResults }) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  let y = 0

  const ensureSpace = (needed) => {
    if (y + needed > PAGE_H - 18) {
      doc.addPage()
      y = MARGIN
    }
  }

  const sectionTitle = (title) => {
    ensureSpace(16)
    y += 4
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.setTextColor(...NAVY)
    doc.text(clean(title), MARGIN, y)
    y += 2
    doc.setDrawColor(...GREEN)
    doc.setLineWidth(0.6)
    doc.line(MARGIN, y, MARGIN + 18, y)
    y += 6
  }

  const paragraph = (text, { size = 9, color = DARK, style = 'normal' } = {}) => {
    doc.setFont('helvetica', style)
    doc.setFontSize(size)
    doc.setTextColor(...color)
    const lines = doc.splitTextToSize(clean(text), CONTENT_W)
    const lineH = size * 0.42
    ensureSpace(lines.length * lineH + 2)
    doc.text(lines, MARGIN, y)
    y += lines.length * lineH + 2
  }

  const keyValueTable = (rows) => {
    doc.setFontSize(9)
    rows.forEach(([label, value], i) => {
      ensureSpace(7)
      if (i % 2 === 0) {
        doc.setFillColor(248, 250, 252)
        doc.rect(MARGIN, y - 4.5, CONTENT_W, 7, 'F')
      }
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(...SLATE)
      doc.text(clean(label), MARGIN + 2, y)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(...DARK)
      doc.text(clean(value), PAGE_W - MARGIN - 2, y, { align: 'right' })
      y += 7
    })
    y += 2
  }

  // Cabecera
  doc.setFillColor(...NAVY)
  doc.rect(0, 0, PAGE_W, 34, 'F')
  doc.setFillColor(...GREEN)
  doc.rect(0, 34, PAGE_W, 1.2, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(18)
  doc.text('Informe de ahorro potencial con IA', MARGIN, 16)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.text(clean(`AI Savings Calculator  ·  ${new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}`), MARGIN, 25)
  y = 46

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  doc.setTextColor(...NAVY)
  doc.text(clean(`Proceso: ${inputs.processName.trim() || 'Proceso sin nombre'}`), MARGIN, y)
  y += 6

  // KPIs principales
  const kpis = [
    ['Horas liberadas / año', formatHours(results.freedHours)],
    ['Valor potencial / año', formatCurrency(results.freedValue)],
    ['Beneficio neto año 1', formatCurrency(results.netBenefit)],
    ['ROI potencial año 1', formatPercent(results.roi)],
  ]
  const boxW = (CONTENT_W - 3 * 4) / 4
  kpis.forEach(([label, value], i) => {
    const x = MARGIN + i * (boxW + 4)
    doc.setDrawColor(...LINE)
    doc.setFillColor(255, 255, 255)
    doc.roundedRect(x, y, boxW, 20, 2, 2, 'FD')
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7.5)
    doc.setTextColor(...SLATE)
    doc.text(clean(label), x + 3, y + 6)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11.5)
    doc.setTextColor(...NAVY)
    doc.text(clean(value), x + 3, y + 14)
  })
  y += 27

  const interpretation = getInterpretation(results)
  paragraph(interpretation.title, { size: 10, color: NAVY, style: 'bold' })
  paragraph(interpretation.text)

  sectionTitle('Datos introducidos')
  keyValueTable([
    ['Empleados que realizan el proceso', formatDecimal(inputs.employees)],
    ['Horas semanales por empleado', `${formatDecimal(inputs.hoursPerWeek)} h`],
    ['Coste laboral por hora', `${formatDecimal(inputs.hourlyCost)} €`],
    ['Reducción de tiempo estimada', formatPercent(inputs.reductionPct)],
    ['Coste inicial de implantación', formatCurrency(inputs.implementationCost)],
    ['Coste mensual de mantenimiento', formatCurrency(inputs.monthlyMaintenance)],
    ['Semanas laborables al año', formatDecimal(inputs.weeksPerYear)],
  ])

  sectionTitle('Resultados')
  keyValueTable([
    ['Horas anuales dedicadas al proceso', formatHours(results.annualHours)],
    ['Coste laboral anual actual', formatCurrency(results.annualLaborCost)],
    ['Horas anuales potencialmente liberadas', formatHours(results.freedHours)],
    ['Valor económico anual potencial (capacidad liberada)', formatCurrency(results.freedValue)],
    ['Coste total de la solución (año 1)', formatCurrency(results.firstYearCost)],
    ['Beneficio neto potencial (año 1)', formatCurrency(results.netBenefit)],
    ['ROI potencial (año 1)', formatPercent(results.roi)],
    ['Periodo de recuperación', formatPayback(results.paybackMonths)],
  ])
  paragraph(
    'El valor económico potencial representa capacidad laboral liberada, no ahorro de caja: solo se convierte en ahorro real si las horas se reasignan, se evitan contrataciones u horas extra, o se reduce el coste laboral.',
    { size: 8.5, color: SLATE },
  )

  // Gráficos
  const charts = [
    ['chart-hours', 'Horas anuales: antes y después (azul: horas dedicadas · verde: horas liberadas)'],
    ['chart-costs', 'Costes y beneficios del primer año (ámbar: costes · verde: valor potencial · azul: resultado neto)'],
  ]
  for (const [id, caption] of charts) {
    const image = await svgToPng(id).catch(() => null)
    if (!image) continue
    const w = CONTENT_W * 0.85
    const h = w * image.ratio
    ensureSpace(h + 14)
    if (id === charts[0][0]) sectionTitle('Gráficos')
    paragraph(caption, { size: 8.5, color: SLATE })
    doc.addImage(image.dataUrl, 'PNG', MARGIN + (CONTENT_W - w) / 2, y, w, h, undefined, 'FAST')
    y += h + 6
  }

  // Escenarios
  sectionTitle('Comparativa de escenarios')
  const cols = ['Escenario', 'Reducción', 'Horas liberadas', 'Valor potencial', 'Beneficio neto', 'ROI', 'Recuperación']
  const colX = [0, 30, 50, 78, 108, 138, 156].map((x) => MARGIN + x)
  ensureSpace(8 + scenarioResults.length * 7)
  doc.setFillColor(...NAVY)
  doc.rect(MARGIN, y - 4.5, CONTENT_W, 7, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(255, 255, 255)
  cols.forEach((c, i) => doc.text(c, colX[i] + 1.5, y))
  y += 7
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...DARK)
  scenarioResults.forEach((s, idx) => {
    if (idx % 2 === 1) {
      doc.setFillColor(248, 250, 252)
      doc.rect(MARGIN, y - 4.5, CONTENT_W, 7, 'F')
    }
    const r = s.results
    const cells = [
      s.name,
      formatPercent(s.pct),
      formatHours(r.freedHours),
      formatCurrency(r.freedValue),
      formatCurrency(r.netBenefit),
      formatPercent(r.roi),
      formatPayback(r.paybackMonths),
    ]
    cells.forEach((c, i) => doc.text(clean(c), colX[i] + 1.5, y))
    y += 7
  })
  y += 1
  paragraph('Los porcentajes de los escenarios son hipótesis ilustrativas, no resultados garantizados.', {
    size: 8.5,
    color: SLATE,
  })

  // Metodología
  sectionTitle('Metodología y supuestos')
  FORMULAS.forEach(([name, formula]) => {
    paragraph(`${name}: ${formula}`, { size: 8.5 })
  })
  paragraph(
    `Supuestos: ${formatDecimal(inputs.weeksPerYear)} semanas laborables al año; el ROI potencial y el beneficio neto se refieren al primer año e incluyen la implantación completa y 12 meses de mantenimiento; no se consideran impuestos, inflación, curva de adopción ni valor temporal del dinero.`,
    { size: 8.5 },
  )

  ensureSpace(20)
  y += 2
  doc.setFillColor(241, 245, 251)
  const disclaimerLines = doc.splitTextToSize(clean(DISCLAIMER), CONTENT_W - 8)
  const boxH = disclaimerLines.length * 4 + 6
  doc.rect(MARGIN, y, CONTENT_W, boxH, 'F')
  doc.setFont('helvetica', 'italic')
  doc.setFontSize(8.5)
  doc.setTextColor(...NAVY)
  doc.text(disclaimerLines, MARGIN + 4, y + 6)

  // Pie de página con numeración
  const pages = doc.getNumberOfPages()
  for (let p = 1; p <= pages; p++) {
    doc.setPage(p)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7.5)
    doc.setTextColor(...SLATE)
    doc.text('AI Savings Calculator · Estimación orientativa', MARGIN, PAGE_H - 8)
    doc.text(`Página ${p} de ${pages}`, PAGE_W - MARGIN, PAGE_H - 8, { align: 'right' })
  }

  const slug =
    inputs.processName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 40) || 'proceso'
  doc.save(`informe-ahorro-ia-${slug}.pdf`)
}
