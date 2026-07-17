import type { ScenarioRecord } from '../config/supabase'
import { getTrafficColor, getTrafficLevel } from '../utils/queue-calculator'

interface HistoryCardProps {
  scenario: ScenarioRecord
}

function fmtFinite(value: number, decimals: number): string {
  if (!Number.isFinite(value)) return '∞'
  return value.toFixed(decimals)
}

export default function HistoryCard({ scenario }: HistoryCardProps) {
  const isStable = scenario.rho < 1 && Number.isFinite(scenario.wq)
  const level = isStable ? getTrafficLevel(scenario.wq) : 'red'

  return (
    <div className="rounded-xl border border-gray-700 bg-gray-800 p-5 transition-colors hover:border-gray-600">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs text-gray-500">
          {scenario.created_at
            ? new Date(scenario.created_at).toLocaleString('es-VE')
            : '—'}
        </span>
        <span
          className={`h-3 w-3 rounded-full ${getTrafficColor(level)}`}
        />
      </div>
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-xs text-gray-500">λ (llegadas/h)</p>
          <p className="text-xl font-bold">{scenario.lambda}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">μ (servicio/h)</p>
          <p className="text-xl font-bold">{scenario.mu}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Mesas</p>
          <p className="text-xl font-bold">{scenario.servers}</p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-xs text-gray-500">ρ</p>
          <p className="font-semibold">{(scenario.rho * 100).toFixed(1)}%</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Lq</p>
          <p className="font-semibold">{fmtFinite(scenario.lq, 1)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Wq (min)</p>
          <p className="font-semibold">
            {Number.isFinite(scenario.wq)
              ? Math.round(scenario.wq * 60)
              : '∞'}
          </p>
        </div>
      </div>
      {!isStable && (
        <p className="mt-3 text-sm font-semibold text-red-400">
          Sistema colapsado — se requieren más mesas
        </p>
      )}
      {scenario.recommendations && isStable && (
        <p className="mt-3 text-sm italic text-gray-400">
          {scenario.recommendations}
        </p>
      )}
    </div>
  )
}
