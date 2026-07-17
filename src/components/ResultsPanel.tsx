import type { QueueResults } from '../utils/queue-calculator'
import { getTrafficLevel, getTrafficLabel } from '../utils/queue-calculator'
import TrafficLight from './TrafficLight'

interface ResultsPanelProps {
  results: QueueResults | null
}

function MetricCard({
  label,
  value,
  unit,
  sub,
}: {
  label: string
  value: string
  unit: string
  sub?: string
}) {
  return (
    <div className="rounded-xl border border-gray-700 bg-gray-800 p-5">
      <p className="text-sm font-medium text-gray-400">{label}</p>
      <p className="mt-2 text-3xl font-bold text-white">
        {value}{' '}
        <span className="text-lg font-normal text-gray-500">{unit}</span>
      </p>
      {sub && <p className="mt-1 text-xs text-gray-500">{sub}</p>}
    </div>
  )
}

function fmtFinite(value: number, decimals: number): string {
  if (!Number.isFinite(value)) return '∞'
  return value.toFixed(decimals)
}

function fmtMinutes(wq: number): string {
  if (!Number.isFinite(wq)) return '—'
  return `${Math.round(wq * 60)} min`
}

export default function ResultsPanel({ results }: ResultsPanelProps) {
  if (!results) {
    return (
      <div className="rounded-2xl border border-gray-700 bg-gray-800/50 p-10 text-center text-gray-500">
        Ingresa los par&aacute;metros para visualizar los resultados del modelo
        M/M/s.
      </div>
    )
  }

  const level = results.isStable
    ? getTrafficLevel(results.wq)
    : 'red'

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 rounded-2xl border border-gray-700 bg-gray-800 p-5">
        <TrafficLight level={level} />
        <div>
          <p className="text-lg font-semibold">
            {results.isStable
              ? getTrafficLabel(level)
              : 'Sistema colapsado'}
          </p>
          <p className="text-sm text-gray-400">
            {results.isStable
              ? `Wq = ${results.wq.toFixed(2)} h (${fmtMinutes(results.wq)})`
              : 'La cola crece sin límite — se requieren más mesas'}
          </p>
        </div>
        {!results.isStable && (
          <span className="ml-auto rounded-full bg-red-600/20 px-3 py-1 text-sm font-bold text-red-400">
            SISTEMA INESTABLE (&rho; &ge; 1)
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <MetricCard
          label="Factor de utilización (ρ)"
          value={(results.rho * 100).toFixed(1)}
          unit="%"
          sub={
            !results.isStable
              ? 'Sobrecarga — la demanda supera la capacidad'
              : results.rho >= 0.8
                ? 'Carga alta — considere ampliar capacidad'
                : 'Carga dentro de rango operativo'
          }
        />
        <MetricCard
          label="Probabilidad sistema vacío (P₀)"
          value={(results.p0 * 100).toFixed(1)}
          unit="%"
        />
        <MetricCard
          label="Longitud promedio de cola (Lq)"
          value={fmtFinite(results.lq, 2)}
          unit="personas"
          sub={
            results.lq === 0
              ? 'No hay fila de espera'
              : !Number.isFinite(results.lq)
                ? 'La cola crece sin límite'
                : 'Personas esperando en fila'
          }
        />
        <MetricCard
          label="Tiempo promedio en cola (Wq)"
          value={fmtFinite(results.wq, 2)}
          unit="horas"
          sub={fmtMinutes(results.wq) === '—' ? 'El sistema no converge' : `${fmtMinutes(results.wq)} de espera`}
        />
        <MetricCard
          label="Personas en el sistema (L)"
          value={fmtFinite(results.l, 2)}
          unit="personas"
          sub="En cola + en servicio"
        />
        <MetricCard
          label="Tiempo total en sistema (W)"
          value={fmtFinite(results.w, 2)}
          unit="horas"
          sub={
            Number.isFinite(results.w)
              ? `${Math.round(results.w * 60)} minutos totales`
              : 'El sistema no converge'
          }
        />
      </div>
    </div>
  )
}
