import { formatPercent } from '../data/mock'

const W = 600
const H = 120

export default function TrendLine({ months, currentId, values, average }) {
  const low = Math.min(...values, average)
  const high = Math.max(...values, average)
  const pad = Math.max((high - low) * 0.25, 1)
  const floor = Math.max(low - pad, 0)
  const range = high + pad - floor
  const x = (index) => (months.length > 1 ? (index / (months.length - 1)) * W : W / 2)
  const y = (value) => H - ((value - floor) / range) * H
  const points = values.map((value, index) => `${x(index)},${y(value)}`).join(' ')

  return (
    <figure>
      <div className="relative mx-3 h-32 sm:mx-4">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
          role="img"
          aria-label={`Porcentaje del ingreso destinado a objetivos por mes, promedio ${formatPercent(average)}`}
          className="h-full w-full overflow-visible"
        >
          <line
            x1="0"
            x2={W}
            y1={y(average)}
            y2={y(average)}
            strokeWidth="1"
            strokeDasharray="4 4"
            vectorEffect="non-scaling-stroke"
            className="stroke-slate-500"
          />
          <polyline
            points={points}
            fill="none"
            strokeWidth="2.5"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            className="stroke-violet-400"
          />
        </svg>
        {values.map((value, index) => (
          <span
            key={months[index].id}
            title={`${months[index].label}: ${formatPercent(value)}`}
            className={`absolute h-2.5 w-2.5 -translate-x-1/2 translate-y-1/2 rounded-full border-2 border-[#0f1117] ${
              months[index].id === currentId ? 'bg-emerald-300' : 'bg-violet-400'
            }`}
            style={{ left: `${(x(index) / W) * 100}%`, bottom: `${(1 - y(value) / H) * 100}%` }}
          />
        ))}
      </div>
      <div className="mt-2 flex gap-2 sm:gap-4">
        {months.map((month, index) => (
          <span key={month.id} className="min-w-0 flex-1 text-center text-[12px] tabular-nums text-slate-500">
            {Math.round(values[index])}%
          </span>
        ))}
      </div>
      <figcaption className="mt-3 flex items-center gap-1.5 text-[12px] text-slate-400">
        <span className="h-0 w-4 border-t border-dashed border-slate-500" />
        Promedio {formatPercent(average)}
      </figcaption>
    </figure>
  )
}
