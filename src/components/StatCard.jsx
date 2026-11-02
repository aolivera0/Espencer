const tones = {
  emerald: {
    icon: 'bg-emerald-400/10 text-emerald-300',
    bar: 'bg-emerald-400',
  },
  rose: {
    icon: 'bg-rose-400/10 text-rose-300',
    bar: 'bg-rose-400',
  },
  violet: {
    icon: 'bg-violet-400/10 text-violet-300',
    bar: 'bg-violet-400',
  },
  amber: {
    icon: 'bg-amber-400/10 text-amber-300',
    bar: 'bg-amber-400',
  },
  sky: {
    icon: 'bg-sky-400/10 text-sky-300',
    bar: 'bg-sky-400',
  },
}

export default function StatCard({
  label,
  value,
  hint,
  percent,
  percentLabel,
  icon: Icon,
  tone = 'emerald',
  delay = 0,
}) {
  const t = tones[tone]
  return (
    <div
      className="animate-rise relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0f1117] p-5"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[12px] font-medium text-slate-400">{label}</p>
          <p className="mt-2 truncate text-[22px] font-semibold tracking-tight text-white">
            {value}
          </p>
        </div>
        <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${t.icon}`}>
          <Icon className="h-[18px] w-[18px]" />
        </span>
      </div>
      <div className="relative mt-4 flex flex-wrap items-center justify-between gap-x-3 gap-y-0.5">
        <span className="text-[11px] text-slate-500">{hint}</span>
        {percent !== undefined && (
          <span className="text-[11px] font-semibold text-slate-300">{percentLabel}</span>
        )}
      </div>
      {percent !== undefined && (
        <div className="relative mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
          <div
            className={`h-full rounded-full ${t.bar}`}
            style={{ width: `${Math.min(Math.max(percent, 0), 100)}%` }}
          />
        </div>
      )}
    </div>
  )
}
