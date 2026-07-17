import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase no está configurado. Crea un archivo .env con VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface ScenarioRecord {
  id?: string
  lambda: number
  mu: number
  servers: number
  wq: number
  lq: number
  rho: number
  recommendations: string
  created_at?: string
}

export async function saveScenario(scenario: ScenarioRecord) {
  const { data, error } = await supabase
    .from('scenarios')
    .insert([scenario])
    .select()
    .single()
  if (error) throw error
  return data
}

export async function getScenarios() {
  const { data, error } = await supabase
    .from('scenarios')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data as ScenarioRecord[]
}
