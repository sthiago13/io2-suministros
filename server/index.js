import express from 'express'
import cors from 'cors'
import pg from 'pg'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const { Pool } = pg

const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_FILE = join(__dirname, 'data.json')

let pool = null

function jsonStore() {
  if (!existsSync(DATA_FILE)) {
    writeFileSync(
      DATA_FILE,
      JSON.stringify(
        [
          { id: 'seed-1', lambda: 30, mu: 20, servers: 2, wq: 0.6857, lq: 20.5714, rho: 0.75, recommendations: 'El tiempo de espera es crítico (41 minutos). Se requiere habilitar 4 mesas de entrega adicionales.', created_at: '2026-06-15T12:30:00.000Z' },
          { id: 'seed-2', lambda: 30, mu: 20, servers: 4, wq: 0.0553, lq: 1.6599, rho: 0.375, recommendations: 'El sistema opera de manera óptima con 4 mesas.', created_at: '2026-06-16T14:00:00.000Z' },
          { id: 'seed-3', lambda: 45, mu: 18, servers: 3, wq: 0.8196, lq: 36.8822, rho: 0.8333, recommendations: 'El tiempo de espera es crítico (49 minutos). Se requiere habilitar 5 mesas adicionales.', created_at: '2026-06-17T18:15:00.000Z' },
          { id: 'seed-4', lambda: 45, mu: 18, servers: 5, wq: 0.1157, lq: 5.2071, rho: 0.5, recommendations: 'El tiempo de espera es moderado (10 minutos). Se recomienda 6 mesas.', created_at: '2026-06-18T13:45:00.000Z' },
          { id: 'seed-5', lambda: 15, mu: 10, servers: 2, wq: 0.0643, lq: 0.9643, rho: 0.75, recommendations: 'El sistema opera de manera óptima con 2 mesas.', created_at: '2026-06-19T15:00:00.000Z' },
          { id: 'seed-6', lambda: 60, mu: 20, servers: 4, wq: 0.1912, lq: 11.473, rho: 0.75, recommendations: 'El tiempo de espera es moderado (11 minutos). Se recomienda 5 mesas.', created_at: '2026-06-20T20:30:00.000Z' },
        ],
        null,
        2
      )
    )
  }
  const raw = readFileSync(DATA_FILE, 'utf-8')
  return JSON.parse(raw)
}

function jsonSave(data) {
  writeFileSync(DATA_FILE, JSON.stringify(data, null, 2))
}

function getScenariosJson() {
  const rows = jsonStore()
  return rows.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
}

function addScenarioJson(scenario) {
  const rows = jsonStore()
  const newRow = {
    id: crypto.randomUUID(),
    ...scenario,
    recommendations: scenario.recommendations ?? null,
    created_at: new Date().toISOString(),
  }
  rows.push(newRow)
  jsonSave(rows)
  return newRow
}

const app = express()
app.use(cors())
app.use(express.json())

const USE_PG = !!process.env.DATABASE_URL

if (USE_PG) {
  pool = new Pool({ connectionString: process.env.DATABASE_URL })
  console.log('Usando PostgreSQL')
} else {
  jsonStore()
  console.log('Usando almacenamiento JSON local (sin Docker)')
}

app.get('/rest/v1/scenarios', async (req, res) => {
  try {
    const select = req.query.select
    if (select !== '*') {
      return res.status(400).json({ message: 'Solo se soporta select=*' })
    }

    if (USE_PG && pool) {
      const order = req.query.order
      let orderClause = 'ORDER BY created_at DESC'
      if (order === 'created_at.asc.nullslast') orderClause = 'ORDER BY created_at ASC NULLS LAST'
      else if (order === 'created_at.desc.nullslast') orderClause = 'ORDER BY created_at DESC NULLS LAST'
      const result = await pool.query(`SELECT * FROM scenarios ${orderClause}`)
      return res.json(result.rows)
    }

    res.json(getScenariosJson())
  } catch (err) {
    console.error('GET /scenarios error:', err)
    res.status(500).json({ message: 'Error al obtener escenarios' })
  }
})

app.post('/rest/v1/scenarios', async (req, res) => {
  try {
    const { lambda, mu, servers, wq, lq, rho, recommendations } = req.body
    if (!lambda || !mu || !servers) {
      return res.status(400).json({ message: 'Faltan campos requeridos' })
    }

    let row
    if (USE_PG && pool) {
      const result = await pool.query(
        `INSERT INTO scenarios (lambda, mu, servers, wq, lq, rho, recommendations)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [lambda, mu, servers, wq, lq, rho, recommendations ?? null]
      )
      row = result.rows[0]
    } else {
      row = addScenarioJson({ lambda, mu, servers, wq, lq, rho, recommendations })
    }

    const prefer = req.get('prefer') ?? ''
    if (prefer.includes('return=representation')) {
      return res.status(201).json(row)
    }
    res.status(201).json(null)
  } catch (err) {
    console.error('POST /scenarios error:', err)
    res.status(500).json({ message: 'Error al guardar el escenario' })
  }
})

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', storage: USE_PG ? 'postgres' : 'json' })
})

const PORT = process.env.PORT ?? 54321
app.listen(PORT, () => {
  console.log(`API de suministros en http://localhost:${PORT}`)
})
