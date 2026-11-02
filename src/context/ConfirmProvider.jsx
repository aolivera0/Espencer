import { useCallback, useEffect, useRef, useState } from 'react'
import { ConfirmContext } from './confirm'

export default function ConfirmProvider({ children }) {
  const dialogRef = useRef(null)
  const resolver = useRef(null)
  const [options, setOptions] = useState(null)

  const confirm = useCallback(
    (next) =>
      new Promise((resolve) => {
        resolver.current?.(false)
        resolver.current = resolve
        setOptions(next)
      }),
    [],
  )

  useEffect(() => {
    const dialog = dialogRef.current
    if (options && dialog && !dialog.open) dialog.showModal()
  }, [options])

  const finish = (result) => {
    resolver.current?.(result)
    resolver.current = null
    dialogRef.current?.close()
    setOptions(null)
  }

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <dialog
        ref={dialogRef}
        aria-labelledby="confirm-title"
        aria-describedby="confirm-message"
        onCancel={(event) => {
          event.preventDefault()
          finish(false)
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) finish(false)
        }}
        className="m-auto w-[calc(100%-2rem)] max-w-sm rounded-2xl border border-white/[0.08] bg-[#0f1117] p-0 text-slate-200 shadow-2xl backdrop:bg-black/70 backdrop:backdrop-blur-sm"
      >
        {options && (
          <div className="p-5">
            <h2 id="confirm-title" className="text-[16px] font-semibold text-white">
              {options.title}
            </h2>
            <p id="confirm-message" className="mt-2 text-[13px] leading-relaxed text-slate-400">
              {options.message}
            </p>
            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                autoFocus
                onClick={() => finish(false)}
                className="h-10 rounded-xl border border-white/[0.1] px-4 text-[13px] font-medium text-slate-300 transition hover:border-white/[0.2] hover:text-white"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => finish(true)}
                className="h-10 rounded-xl bg-rose-400 px-4 text-[13px] font-semibold text-[#1a0508] transition hover:bg-rose-300"
              >
                {options.confirmLabel || 'Eliminar'}
              </button>
            </div>
          </div>
        )}
      </dialog>
    </ConfirmContext.Provider>
  )
}
