import { formatMoney } from '../data/mock'

const parts = [
  { key: 'expenses', label: 'Gastos fijos', bar: 'bg-rose-400' },
  { key: 'goals', label: 'Objetivos', bar: 'bg-violet-400' },
  { key: 'free', label: 'Libre', bar: 'bg-sky-400' },
]

export default function MonthlyChart({ months, currentId }) {
  const max = Math.max(...months.map((month) => month.expenses + month.goals + Math.max(month.free, 0)), 1)

  return (
    <figure>
      <div className="flex h-48 items-end gap-2 sm:gap-4">
        {months.map((month) => (
          <div key={month.id} className="flex h-full min-w-0 flex-1 flex-col justify-end">
            <div
              className="flex flex-col-reverse gap-0.5"
              style={{ height: `${((month.expenses + month.goals + Math.max(month.free, 0)) / max) * 100}%` }}
              role="img"
              aria-label={`${month.label}: gastos ${formatMoney(month.expenses)}, objetivos ${formatMoney(month.goals)}, libre ${formatMoney(month.free)}`}
            >
              {parts.map(({ key, bar, label }) => {
                const value = Math.max(month[key], 0)
                if (value === 0) return null
                return (
                  <div
                    key={key}
                    title={`${label}: ${formatMoney(value)}`}
                    className={`min-h-[3px] w-full first:rounded-b-md last:rounded-t-md ${bar} ${
                      month.id === currentId ? '' : 'opacity-70'
                    }`}
                    style={{ flexGrow: value, flexBasis: 0 }}
                  />
                )
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-2 sm:gap-4">
        {months.map((month) => (
          <span
            key={month.id}
            className={`min-w-0 flex-1 text-center text-[12px] ${
              month.id === currentId ? 'font-semibold text-emerald-300' : 'text-slate-500'
            }`}
          >
            {month.label}
          </span>
        ))}
      </div>
      <figcaption className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-slate-400">
        {parts.map(({ key, label, bar }) => (
          <span key={key} className="flex items-center gap-1.5">
            <span className={`h-2 w-2 rounded-full ${bar}`} />
            {label}
          </span>
        ))}
      </figcaption>
    </figure>
  )
}
