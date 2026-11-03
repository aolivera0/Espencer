import { useState } from 'react'
import { createHousehold } from '../../lib/household'
import { IconUsers } from '../Icons'

export default function HouseholdSetup({ user }) {
  const [name, setName] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const create = async (event) => {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      await createHousehold(user, name.trim() || 'Mi hogar')
    } catch (cause) {
      console.error(cause)
      setError('No se pudo crear el hogar. Revisa tu conexión e inténtalo de nuevo.')
      setBusy(false)
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="text-[13px] font-medium text-emerald-400/90">Gastos diarios</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-[28px]">
          Comparte los gastos del día a día
        </h1>
        <p className="mt-1 max-w-xl text-[13px] text-slate-500">
          Crea un hogar e invita a tu pareja o a quien viva contigo. Los dos registran las compras, ven lo mismo en
          tiempo real y saben quién le debe a quién.
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        <form onSubmit={create} className="rounded-2xl border border-white/[0.06] bg-[#0f1117] p-5">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-400/10 text-emerald-300">
            <IconUsers />
          </span>
          <h2 className="mt-4 text-[15px] font-semibold text-white">Crear un hogar</h2>
          <label className="mt-3 block">
            <span className="text-[12px] text-slate-500">Nombre</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Ej. Casa"
              className="mt-1.5 w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 text-base text-slate-100 outline-none placeholder:text-slate-600 focus:border-emerald-400/40 md:text-[14px]"
            />
          </label>
          {error && <p className="mt-3 text-[13px] text-rose-300">{error}</p>}
          <button
            type="submit"
            disabled={busy}
            className="mt-4 h-11 rounded-xl bg-emerald-400 px-5 text-[14px] font-semibold text-[#06120d] transition hover:bg-emerald-300 disabled:opacity-60"
          >
            Crear hogar
          </button>
        </form>

        <div className="rounded-2xl border border-white/[0.06] bg-[#0f1117] p-5">
          <h2 className="text-[15px] font-semibold text-white">¿Te invitaron?</h2>
          <p className="mt-2 text-[13px] leading-relaxed text-slate-400">
            Abre el enlace de invitación que te enviaron, con esta misma cuenta de Google. Te llevará directo a unirte
            al hogar.
          </p>
        </div>
      </div>
    </div>
  )
}
