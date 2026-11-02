import { useState } from 'react'

export default function EmptyMonth({ month, previous, onCopy, onSeed }) {
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState('')

  const run = async (action) => {
    setBusy(true)
    setNotice('')
    try {
      const copied = await action()
      if (copied === 0) setNotice(`${previous.label} no tiene datos para copiar.`)
    } catch (error) {
      console.error(error)
      setNotice('No se pudo completar la acción. Inténtalo de nuevo.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mb-6 rounded-2xl border border-white/[0.06] bg-[#0f1117] p-5">
      <h2 className="text-[15px] font-semibold text-white">{month.label} está vacío</h2>
      <p className="mt-1 text-[13px] text-slate-500">
        Copia los gastos y objetivos del mes anterior, o empieza agregando los tuyos.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={busy}
          onClick={() => run(onCopy)}
          className="inline-flex h-10 items-center rounded-xl bg-emerald-400 px-4 text-[13px] font-semibold text-[#06120d] transition hover:bg-emerald-300 disabled:opacity-60"
        >
          Copiar de {previous.label.toLowerCase()}
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => run(onSeed)}
          className="inline-flex h-10 items-center rounded-xl border border-white/[0.08] px-4 text-[13px] font-medium text-slate-300 transition hover:border-white/[0.16] hover:text-white disabled:opacity-60"
        >
          Cargar datos de ejemplo
        </button>
      </div>
      {notice && (
        <p role="status" className="mt-3 text-[13px] text-amber-300">
          {notice}
        </p>
      )}
    </div>
  )
}
