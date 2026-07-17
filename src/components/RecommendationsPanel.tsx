import type { QueueResults } from '../utils/queue-calculator'
import { generateRecommendation, getTrafficColor } from '../utils/queue-calculator'

interface RecommendationsPanelProps {
  results: QueueResults | null
  servers: number
}

export default function RecommendationsPanel({
  results,
  servers,
}: RecommendationsPanelProps) {
  if (!results || servers <= 0) {
    return null
  }

  const rec = generateRecommendation(results, servers)

  return (
    <div
      className={`rounded-2xl border p-6 ${getTrafficColor(rec.level)} border-opacity-30 bg-opacity-10 ${
        rec.level === 'green'
          ? 'border-green-500 bg-green-500/10'
          : rec.level === 'yellow'
            ? 'border-yellow-500 bg-yellow-500/10'
            : 'border-red-500 bg-red-500/10'
      }`}
    >
      <h3 className="mb-3 text-lg font-bold">
        {rec.level === 'green'
          ? '✔️ Sistema operando correctamente'
          : rec.level === 'yellow'
            ? '⚠️ Atención requerida'
            : '🚨 Alerta crítica'}
      </h3>
      <p className="leading-relaxed text-gray-200">{rec.message}</p>
      <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-400">
        <span>
          Mesas sugeridas:{' '}
          <strong className="text-white">{rec.suggestedServers}</strong>
        </span>
        <span>
          Mesas actuales:{' '}
          <strong className="text-white">{servers}</strong>
        </span>
        <span>
          Factor &rho;:{' '}
          <strong className="text-white">
            {(results.rho * 100).toFixed(1)}%
          </strong>
        </span>
      </div>
    </div>
  )
}
