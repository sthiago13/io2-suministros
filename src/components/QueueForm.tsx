import type { QueueInput } from '../utils/queue-calculator'

interface QueueFormProps {
  input: QueueInput
  onChange: (input: QueueInput) => void
}

export default function QueueForm({ input, onChange }: QueueFormProps) {
  const handleChange =
    (field: keyof QueueInput) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = Number(e.target.value)
      onChange({ ...input, [field]: value })
    }

  const inputClass =
    'w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50'

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-300">
          &lambda; (Lambda) &mdash; Tasa de llegada
        </label>
        <input
          type="number"
          min="0.1"
          step="0.1"
          value={input.lambda || ''}
          onChange={handleChange('lambda')}
          placeholder="Ej: 30"
          className={inputClass}
        />
        <p className="mt-1 text-xs text-gray-500">
          Personas que llegan por hora al centro de acopio
        </p>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-300">
          &mu; (Mu) &mdash; Tasa de servicio
        </label>
        <input
          type="number"
          min="0.1"
          step="0.1"
          value={input.mu || ''}
          onChange={handleChange('mu')}
          placeholder="Ej: 20"
          className={inputClass}
        />
        <p className="mt-1 text-xs text-gray-500">
          Kits de suministros entregados por hora por cada mesa
        </p>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-300">
          s &mdash; N&uacute;mero de servidores
        </label>
        <input
          type="number"
          min="1"
          step="1"
          value={input.servers || ''}
          onChange={handleChange('servers')}
          placeholder="Ej: 3"
          className={inputClass}
        />
        <p className="mt-1 text-xs text-gray-500">
          Mesas o estaciones de entrega activas
        </p>
      </div>
    </div>
  )
}
