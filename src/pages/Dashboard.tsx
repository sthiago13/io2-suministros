import { useState, useMemo } from 'react'
import type { QueueInput } from '../utils/queue-calculator'
import { calculateMMS, generateRecommendation } from '../utils/queue-calculator'
import { saveScenario } from '../config/supabase'
import QueueForm from '../components/QueueForm'
import ResultsPanel from '../components/ResultsPanel'
import RecommendationsPanel from '../components/RecommendationsPanel'

export default function Dashboard() {
  const [input, setInput] = useState<QueueInput>({
    lambda: 30,
    mu: 20,
    servers: 2,
  })

  const results = useMemo(() => {
    if (input.lambda <= 0 || input.mu <= 0 || input.servers <= 0) return null
    return calculateMMS(input)
  }, [input])

  const handleSave = async () => {
    if (!results) return
    const rec = generateRecommendation(results, input.servers)
    try {
      await saveScenario({
        lambda: input.lambda,
        mu: input.mu,
        servers: input.servers,
        wq: results.wq,
        lq: results.lq,
        rho: results.rho,
        recommendations: rec.message,
      })
      alert('Escenario guardado exitosamente.')
    } catch {
      alert(
        'No se pudo guardar el escenario. Verifica la conexión con Supabase.'
      )
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Centro de Acopio Post-Sismo
        </h2>
        <p className="mt-1 text-gray-400">
          Modelo de colas M/M/s &mdash; Distribuci&oacute;n de suministros
          vitales
        </p>
      </div>

      <div className="rounded-2xl border border-gray-700 bg-gray-800 p-6">
        <h3 className="mb-4 text-lg font-semibold">
          Par&aacute;metros de entrada
        </h3>
        <QueueForm input={input} onChange={setInput} />
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold">
          Resultados del modelo
        </h3>
        <ResultsPanel results={results} />
      </div>

      <RecommendationsPanel
        results={results}
        servers={input.servers}
      />

      {results && (
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700 active:bg-blue-800"
          >
            Guardar escenario
          </button>
        </div>
      )}
    </div>
  )
}
