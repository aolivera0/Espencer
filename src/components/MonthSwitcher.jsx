import { IconCaretLeft, IconCaretRight } from './Icons'

const button =
  'grid h-9 w-9 place-items-center rounded-lg text-slate-400 transition hover:bg-white/[0.05] hover:text-white'

export default function MonthSwitcher({ month, isCurrent, onPrevious, onNext, onToday }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
      <div className="flex items-center gap-1" role="group" aria-label="Cambiar de mes">
        <button type="button" onClick={onPrevious} className={button} aria-label="Mes anterior">
          <IconCaretLeft className="h-4 w-4" />
        </button>
        <span
          className="min-w-36 text-center text-[14px] font-medium text-slate-200"
          aria-live="polite"
        >
          {month.label} {month.year}
        </span>
        <button type="button" onClick={onNext} className={button} aria-label="Mes siguiente">
          <IconCaretRight className="h-4 w-4" />
        </button>
      </div>
      {!isCurrent && (
        <button
          type="button"
          onClick={onToday}
          className="h-9 rounded-lg border border-emerald-400/25 bg-emerald-400/[0.08] px-3 text-[13px] font-medium text-emerald-300 transition hover:bg-emerald-400/[0.14]"
        >
          Ir al mes actual
        </button>
      )}
    </div>
  )
}
