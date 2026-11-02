import { formatMoney } from '../data/mock'

export default function CategoryBars({ rows }) {
  const max = Math.max(...rows.flatMap((row) => [row.total, row.average ?? 0]), 1)

  return (
    <ul className="space-y-4">
      {rows.map((row) => (
        <li key={row.name}>
          <div className="flex items-baseline justify-between gap-3">
            <p className="truncate text-[13px] font-medium text-slate-300">{row.name}</p>
            <p className="shrink-0 text-[13px] font-semibold tabular-nums text-slate-100">
              {formatMoney(row.total)}
            </p>
          </div>
          <div
            className="relative mt-2 h-2.5 rounded-full bg-white/[0.04]"
            role="img"
            aria-label={`${row.name}: ${formatMoney(row.paid)} pagado, ${formatMoney(row.pending)} por pagar`}
          >
            <div className="flex h-full gap-0.5" style={{ width: `${(row.total / max) * 100}%` }}>
              {row.paid > 0 && (
                <div
                  className="h-full rounded-full bg-emerald-400 transition-[flex-grow] duration-500"
                  style={{ flexGrow: row.paid }}
                />
              )}
              {row.pending > 0 && (
                <div
                  className="h-full rounded-full bg-amber-400/80 transition-[flex-grow] duration-500"
                  style={{ flexGrow: row.pending }}
                />
              )}
            </div>
            {row.average > 0 && (
              <span
                title={`Promedio: ${formatMoney(row.average)}`}
                className="absolute -bottom-1 -top-1 w-0.5 rounded bg-slate-200/80"
                style={{ left: `${(row.average / max) * 100}%` }}
              />
            )}
          </div>
        </li>
      ))}
    </ul>
  )
}
