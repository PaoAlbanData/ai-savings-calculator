import { Info } from 'lucide-react'
import { DISCLAIMER } from '../data/defaults.js'

export default function Disclaimer() {
  return (
    <div
      role="note"
      className="flex gap-3 rounded-2xl border border-navy-100 bg-navy-50 p-4 text-sm text-navy-800"
    >
      <Info className="mt-0.5 h-5 w-5 shrink-0 text-navy-500" aria-hidden="true" />
      <p>
        <strong className="font-semibold">Nota importante: </strong>
        {DISCLAIMER}
      </p>
    </div>
  )
}
