import type { TrafficLevel } from '../utils/queue-calculator'
import { getTrafficColor } from '../utils/queue-calculator'

interface TrafficLightProps {
  level: TrafficLevel
}

export default function TrafficLight({ level }: TrafficLightProps) {
  const colors: TrafficLevel[] = ['green', 'yellow', 'red']
  return (
    <div className="flex gap-2">
      {colors.map((c) => (
        <div
          key={c}
          className={`h-6 w-6 rounded-full border-2 ${
            c === level
              ? getTrafficColor(c) + ' border-white shadow-lg shadow-current'
              : 'border-gray-600 bg-gray-700'
          }`}
        />
      ))}
    </div>
  )
}
