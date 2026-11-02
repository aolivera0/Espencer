import { IconCheck } from './Icons'

const tones = {
  done: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300',
  pending: 'border-amber-400/25 bg-amber-400/[0.07] text-amber-300',
}

const marks = {
  done: 'border-emerald-400 bg-emerald-400 text-[#06120d]',
  pending: 'border-amber-400/60',
}

const base =
  'inline-flex items-center gap-1.5 rounded-full border px-3 text-[12px] font-medium transition'

function Mark({ done }) {
  return (
    <span className={`grid h-3.5 w-3.5 place-items-center rounded-full border ${marks[done ? 'done' : 'pending']}`}>
      {done && <IconCheck className="h-2.5 w-2.5" />}
    </span>
  )
}

export function StatusBadge({ done, doneLabel, className = '' }) {
  return (
    <span className={`${base} py-1 ${tones[done ? 'done' : 'pending']} ${className}`}>
      <Mark done={done} />
      {done ? doneLabel : 'Pendiente'}
    </span>
  )
}

export function StatusButton({ done, doneLabel, onToggle, className = '' }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={done}
      className={`${base} h-9 hover:brightness-125 md:h-8 ${tones[done ? 'done' : 'pending']} ${className}`}
    >
      <Mark done={done} />
      {done ? doneLabel : 'Pendiente'}
    </button>
  )
}
