import { useState } from 'react'
import { FileDown, LoaderCircle, Printer, RotateCcw } from 'lucide-react'

export default function ActionBar({ inputs, results, scenarioResults, onReset }) {
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState('')

  const handlePdf = async () => {
    setGenerating(true)
    setError('')
    try {
      // Carga diferida: jsPDF solo se descarga cuando se pide el informe.
      const { generatePdfReport } = await import('../utils/pdf.js')
      await generatePdfReport({ inputs, results, scenarioResults })
    } catch (err) {
      console.error(err)
      setError('No se pudo generar el PDF. Inténtalo de nuevo.')
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="flex flex-col items-end gap-1 print:hidden">
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={onReset} className="btn-secondary">
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Restablecer
        </button>
        <button type="button" onClick={() => window.print()} className="btn-secondary">
          <Printer className="h-4 w-4" aria-hidden="true" />
          Imprimir
        </button>
        <button type="button" onClick={handlePdf} disabled={generating} className="btn-primary disabled:opacity-70">
          {generating ? (
            <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <FileDown className="h-4 w-4" aria-hidden="true" />
          )}
          {generating ? 'Generando…' : 'Descargar PDF'}
        </button>
      </div>
      {error && (
        <p role="alert" className="text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}
