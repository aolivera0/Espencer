import { useEffect, useId, useRef, useState } from 'react'
import { IconCaretDown, IconCheck } from './Icons'

// Menú desplegable propio: lista junto al botón en escritorio y hoja inferior en móvil.
export default function Select({ value, options, onChange, label }) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const root = useRef(null)
  const listId = useId()

  useEffect(() => {
    if (!open) return undefined
    const onPointer = (event) => {
      if (!root.current?.contains(event.target)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointer)
    return () => document.removeEventListener('pointerdown', onPointer)
  }, [open])

  const openList = () => {
    setActive(Math.max(options.indexOf(value), 0))
    setOpen(true)
  }

  const choose = (option) => {
    onChange(option)
    setOpen(false)
    root.current?.querySelector('button')?.focus()
  }

  const onKeyDown = (event) => {
    if (event.key === 'Escape' && open) {
      event.preventDefault()
      setOpen(false)
      return
    }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      if (!open) return openList()
      const step = event.key === 'ArrowDown' ? 1 : -1
      setActive((current) => (current + step + options.length) % options.length)
    }
    if ((event.key === 'Enter' || event.key === ' ') && open) {
      event.preventDefault()
      choose(options[active])
    }
  }

  return (
    <div ref={root} className="relative" onKeyDown={onKeyDown}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-label={label}
        onClick={() => (open ? setOpen(false) : openList())}
        className="flex h-10 w-full items-center justify-between gap-2 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 text-[14px] text-slate-200 transition hover:border-white/[0.16] md:h-8 md:w-auto md:rounded-md md:border-transparent md:px-2.5 md:text-[12px]"
      >
        <span className="truncate">{value}</span>
        <IconCaretDown className="h-3 w-3 shrink-0 text-slate-500" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40 bg-black/60 md:hidden" aria-hidden="true" />
          <div
            id={listId}
            role="listbox"
            aria-label={label}
            className="fixed inset-x-0 bottom-0 z-50 max-h-[70vh] overflow-y-auto rounded-t-2xl border border-white/[0.08] bg-[#0f1117] p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-2xl md:absolute md:inset-x-auto md:bottom-auto md:left-0 md:top-full md:mt-1 md:max-h-64 md:w-max md:min-w-full md:rounded-xl md:pb-2"
          >
            <p className="px-3 pb-1 pt-2 text-[12px] text-slate-500 md:hidden">{label}</p>
            {options.map((option, index) => (
              <div
                key={option}
                role="option"
                aria-selected={option === value}
                tabIndex={-1}
                onClick={() => choose(option)}
                onMouseEnter={() => setActive(index)}
                className={`flex min-h-11 cursor-pointer items-center justify-between gap-6 rounded-lg px-3 text-[14px] md:min-h-9 md:text-[13px] ${
                  index === active ? 'bg-white/[0.06] text-white' : 'text-slate-300'
                }`}
              >
                {option}
                {option === value && <IconCheck className="h-3.5 w-3.5 text-emerald-300" />}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
