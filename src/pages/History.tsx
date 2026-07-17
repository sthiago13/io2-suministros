import { useEffect, useState } from 'react'
import type { ScenarioRecord } from '../config/supabase'
import { getScenarios } from '../config/supabase'
import HistoryCard from '../components/HistoryCard'

export default function History() {
  const [scenarios, setScenarios] = useState<ScenarioRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getScenarios()
      .then(setScenarios)
      .catch(() =>
        setError(
          'No se pudieron cargar los escenarios. Verifica la conexión con Supabase.'
        )
      )
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Historial de escenarios
        </h2>
        <p className="mt-1 text-gray-400">
          Escenarios guardados de simulaciones de distribuci&oacute;n de
          suministros
        </p>
      </div>

      {loading && (
        <div className="rounded-2xl border border-gray-700 bg-gray-800/50 p-10 text-center text-gray-500">
          Cargando escenarios...
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-red-300">
          {error}
        </div>
      )}

      {!loading && !error && scenarios.length === 0 && (
        <div className="rounded-2xl border border-gray-700 bg-gray-800/50 p-10 text-center text-gray-500">
          No hay escenarios guardados a&uacute;n. Ve al Dashboard para crear y
          guardar tu primera simulaci&oacute;n.
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {scenarios.map((s) => (
          <HistoryCard key={s.id} scenario={s} />
        ))}
      </div>
    </div>
  )
}
