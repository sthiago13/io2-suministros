export interface QueueInput {
  lambda: number
  mu: number
  servers: number
}

export interface QueueResults {
  rho: number
  p0: number
  lq: number
  wq: number
  l: number
  w: number
  pw: number
  isStable: boolean
}

export type TrafficLevel = 'green' | 'yellow' | 'red'

export function getTrafficLevel(wq: number): TrafficLevel {
  if (!Number.isFinite(wq)) return 'red'
  if (wq <= 10 / 60) return 'green'
  if (wq <= 30 / 60) return 'yellow'
  return 'red'
}

export function getTrafficColor(level: TrafficLevel): string {
  switch (level) {
    case 'green':
      return 'bg-green-500'
    case 'yellow':
      return 'bg-yellow-500'
    case 'red':
      return 'bg-red-500'
  }
}

export function getTrafficLabel(level: TrafficLevel): string {
  switch (level) {
    case 'green':
      return 'Tiempo de espera aceptable'
    case 'yellow':
      return 'Tiempo de espera moderado'
    case 'red':
      return 'Tiempo de espera crítico'
  }
}

function factorial(n: number): number {
  if (n <= 1) return 1
  let result = 1
  for (let i = 2; i <= n; i++) {
    result *= i
  }
  return result
}

export function calculateMMS(input: QueueInput): QueueResults {
  const { lambda, mu, servers } = input

  if (servers <= 0 || lambda <= 0 || mu <= 0) {
    return {
      rho: 0,
      p0: 0,
      lq: 0,
      wq: 0,
      l: 0,
      w: 0,
      pw: 0,
      isStable: false,
    }
  }

  const rho = lambda / (servers * mu)
  const roundedRho = Math.round(rho * 10000) / 10000

  if (rho >= 1) {
    return {
      rho: roundedRho,
      p0: 0,
      lq: Number.POSITIVE_INFINITY,
      wq: Number.POSITIVE_INFINITY,
      l: Number.POSITIVE_INFINITY,
      w: Number.POSITIVE_INFINITY,
      pw: 1,
      isStable: false,
    }
  }

  const r = lambda / mu

  let sum = 0
  for (let n = 0; n <= servers - 1; n++) {
    sum += Math.pow(r, n) / factorial(n)
  }
  const lastTerm = Math.pow(r, servers) / (factorial(servers) * (1 - rho))

  const p0 = 1 / (sum + lastTerm)
  const lq =
    (p0 * Math.pow(r, servers) * rho) /
    (factorial(servers) * Math.pow(1 - rho, 2))
  const wq = lq / lambda
  const l = lq + r
  const w = wq + 1 / mu
  const pw =
    (p0 * Math.pow(r, servers)) / (factorial(servers) * (1 - rho))

  return {
    rho: roundedRho,
    p0: Math.round(p0 * 10000) / 10000,
    lq: Math.round(lq * 10000) / 10000,
    wq: Math.round(wq * 10000) / 10000,
    l: Math.round(l * 10000) / 10000,
    w: Math.round(w * 10000) / 10000,
    pw: Math.round(pw * 10000) / 10000,
    isStable: true,
  }
}

export function generateRecommendation(
  results: QueueResults,
  servers: number
): {
  level: TrafficLevel
  message: string
  suggestedServers: number
} {
  const { wq, rho, isStable } = results

  if (!isStable) {
    const minServers = Math.ceil(rho * servers) + 1
    return {
      level: 'red',
      message: `El sistema está colapsado con ${servers} ${
        servers === 1 ? 'mesa' : 'mesas'
      } (ρ = ${(rho * 100).toFixed(1)}%). La tasa de llegada supera la capacidad de servicio. Se requiere habilitar al menos ${minServers} ${
        minServers === 1 ? 'mesa' : 'mesas'
      } de entrega de forma inmediata.`,
      suggestedServers: minServers,
    }
  }

  const trafficLevel = getTrafficLevel(wq)

  if (trafficLevel === 'green') {
    return {
      level: 'green',
      message: `El sistema opera de manera óptima con ${servers} ${
        servers === 1 ? 'mesa' : 'mesas'
      }. El tiempo promedio de espera es de ${wq.toFixed(2)} horas (${
        Math.round(wq * 60)
      } minutos), lo cual es aceptable para la atención de damnificados.`,
      suggestedServers: servers,
    }
  }

  if (trafficLevel === 'yellow') {
    const suggested = servers + 1
    return {
      level: 'yellow',
      message: `El tiempo de espera es moderado (${Math.round(
        wq * 60
      )} minutos). Se recomienda habilitar al menos ${suggested} ${
        suggested === 1 ? 'mesa' : 'mesas'
      } de entrega para reducir el tiempo de espera y mejorar la atención.`,
      suggestedServers: suggested,
    }
  }

  const suggested = servers + 2
  return {
    level: 'red',
    message: `El tiempo de espera es crítico (${Math.round(
      wq * 60
    )} minutos). Se requiere habilitar ${suggested} ${
      suggested === 1 ? 'mesa' : 'mesas'
    } de entrega adicionales de forma inmediata para evitar el colapso del sistema y garantizar la atención digna de los damnificados.`,
    suggestedServers: suggested,
  }
}
