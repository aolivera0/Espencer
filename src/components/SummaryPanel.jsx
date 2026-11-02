import { formatMoney, formatPercent, month } from '../data/mock'
import DonutChart from './DonutChart'

export default function SummaryPanel({ income, totalExpenses, totalGoals }) {
  const free = income - totalExpenses - totalGoals
  const pct = (value) => (income > 0 ? (value / income) * 100 : 0)

  const rows = [
    { name: 'Gastos fijos', value: totalExpenses, dot: 'bg-rose-400', stroke: 'stroke-rose-400' },
    {
      name: 'Objetivos financieros',
      value: totalGoals,
      dot: 'bg-violet-400',
      stroke: 'stroke-violet-400',
    },
    { name: 'Libre', value: free, dot: 'bg-sky-400', stroke: 'stroke-sky-400' },
  ]

  return (
    <section className="rounded-2xl border border-white/[0.06] bg-[#0f1117] p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-[15px] font-semibold text-white">A dónde va tu ingreso</h2>
        <span className="rounded-md bg-white/[0.04] px-2 py-1 text-[12px] font-medium text-slate-500">
          {month.label}
        </span>
      </div>

      <div className="mt-5">
        <DonutChart
          segments={rows}
          label={`Reparto del ingreso: gastos ${formatPercent(pct(totalExpenses))}, objetivos ${formatPercent(pct(totalGoals))}, libre ${formatPercent(pct(free))}`}
        >
          <div>
            <p className="text-[12px] text-slate-500">{free < 0 ? 'Te pasaste' : 'Libre'}</p>
            <p
              className={`mt-0.5 text-[19px] font-semibold tabular-nums tracking-tight ${
                free < 0 ? 'text-rose-300' : 'text-white'
              }`}
            >
              {formatMoney(Math.abs(free))}
            </p>
            <p className="mt-0.5 text-[12px] tabular-nums text-slate-500">
              {formatPercent(pct(free))}
            </p>
          </div>
        </DonutChart>
      </div>

      <ul className="mt-5 space-y-3">
        {rows.map((row) => (
          <li key={row.name} className="flex flex-wrap items-center justify-between gap-x-3 gap-y-0.5">
            <span className="flex items-center gap-2 text-[13px] text-slate-300">
              <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${row.dot}`} />
              {row.name}
            </span>
            <span className="shrink-0 text-right text-[13px] tabular-nums">
              <span className="font-semibold text-white">{formatMoney(row.value)}</span>
              <span className="ml-2 inline-block w-12 text-right text-[12px] text-slate-500">
                {formatPercent(pct(row.value))}
              </span>
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-5 flex items-center justify-between rounded-xl border border-white/[0.05] bg-white/[0.02] px-3 py-2.5">
        <span className="text-[12px] text-slate-500">Ingresos del mes</span>
        <span className="text-[13px] font-semibold tabular-nums text-slate-200">
          {formatMoney(income)}
        </span>
      </div>
    </section>
  )
}
