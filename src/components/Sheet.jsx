import { useEffect, useRef } from 'react'
import { IconClose } from './Icons'

// Panel modal: hoja inferior en móvil y ventana centrada en escritorio.
export default function Sheet({ open, title, onClose, children }) {
  const dialog = useRef(null)

  useEffect(() => {
    const node = dialog.current
    if (!node) return
    if (open && !node.open) node.showModal()
    if (!open && node.open) node.close()
  }, [open])

  return (
    <dialog
      ref={dialog}
      aria-label={title}
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
      className="m-0 mt-auto max-h-[92svh] w-full max-w-none overflow-y-auto rounded-t-2xl border border-white/[0.08] bg-[#0f1117] p-0 text-slate-200 shadow-2xl backdrop:bg-black/70 backdrop:backdrop-blur-sm sm:m-auto sm:max-w-lg sm:rounded-2xl"
    >
      {open && (
        <div className="p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-[16px] font-semibold text-white">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              className="grid h-9 w-9 place-items-center rounded-lg text-slate-400 transition hover:bg-white/5 hover:text-white"
              aria-label="Cerrar"
            >
              <IconClose />
            </button>
          </div>
          <div className="mt-4">{children}</div>
        </div>
      )}
    </dialog>
  )
}
