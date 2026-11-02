const fills = {
  emerald: 'bg-emerald-400',
  rose: 'bg-rose-400',
  violet: 'bg-violet-400',
  sky: 'bg-sky-400',
  amber: 'bg-amber-400',
}

export default function ProgressBar({
  label,
  value,
  max,
  right,
  tone = 'emerald',
  sub,
}) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-[13px] font-medium text-slate-300">{label}</p>
          {sub && <p className="text-[11px] text-slate-500">{sub}</p>}
        </div>
        <p className="shrink-0 text-[12px] font-semibold tabular-nums text-slate-200">
          {right}
        </p>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className={`h-full rounded-full ${fills[tone]} transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
