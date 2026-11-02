import { formatMoney } from '../data/mock'

const W = 600
const H = 200

export default function BalanceChart({ total, rows }) {
  if (rows.length === 0 || total <= 0) {
    return (
      <p className="py-10 text-center text-[13px] text-slate-500">
        Agrega abonos para ver la evolución del saldo.
      </p>
    )
  }

  const balances = [total, ...rows.map((row) => Math.max(row.balance, 0))]
  const x = (index) => (index / (balances.length - 1)) * W
  const y = (value) => H - (value / total) * H
  const point = (index) => `${x(index)},${y(balances[index])}`

  const lastPaid = rows.reduce((last, row, index) => (row.paid ? index + 1 : last), 0)
  const solid = balances.slice(0, lastPaid + 1).map((_, index) => point(index))
  const planned = balances.slice(lastPaid).map((_, index) => point(index + lastPaid))
  const area = `${solid.join(' ')} ${x(lastPaid)},${H} 0,${H}`

  return (
    <figure>
      <div className="relative h-44 sm:h-52">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
          role="img"
          aria-label={`Saldo de la deuda: de ${formatMoney(total)} a ${formatMoney(balances[balances.length - 1])}`}
          className="h-full w-full overflow-visible"
        >
          {[0, 0.5, 1].map((fraction) => (
            <line
              key={fraction}
              x1="0"
              x2={W}
              y1={H * fraction}
              y2={H * fraction}
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
              className="stroke-white/[0.06]"
            />
          ))}
          {lastPaid > 0 && <polygon points={area} className="fill-emerald-400/10" />}
          {lastPaid > 0 && (
            <polyline
              points={solid.join(' ')}
              fill="none"
              strokeWidth="2.5"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
              className="stroke-emerald-400"
            />
          )}
          {lastPaid < rows.length && (
            <polyline
              points={planned.join(' ')}
              fill="none"
              strokeWidth="2"
              strokeDasharray="5 5"
              vectorEffect="non-scaling-stroke"
              className="stroke-amber-400/80"
            />
          )}
        </svg>
        <span className="absolute left-0 top-0 -translate-y-full pb-1 text-[11px] tabular-nums text-slate-500">
          {formatMoney(total)}
        </span>
      </div>
      <figcaption className="mt-3 flex items-center justify-between gap-3 text-[12px] text-slate-400">
        <span className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="h-0.5 w-4 rounded bg-emerald-400" />
            Pagado
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-0.5 w-4 rounded border-t-2 border-dashed border-amber-400/80" />
            Pendiente
          </span>
        </span>
        <span className="tabular-nums text-slate-500">
          Saldo final {formatMoney(balances[balances.length - 1])}
        </span>
      </figcaption>
    </figure>
  )
}
