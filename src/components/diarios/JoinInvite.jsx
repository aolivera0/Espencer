import { useEffect, useState } from 'react'
import { useAuth } from '../../context/auth'
import useHousehold from '../../hooks/useHousehold'
import { joinHousehold, loadInvite } from '../../lib/household'
import { IconUsers } from '../Icons'

export default function JoinInvite({ invite, onDone }) {
  const { user } = useAuth()
  const current = useHousehold(user.uid)
  const [info, setInfo] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    loadInvite(invite).then((result) => {
      if (!cancelled) setInfo(result)
    })
    return () => {
      cancelled = true
    }
  }, [invite])

  const join = async () => {
    setBusy(true)
    setError('')
    try {
      await joinHousehold(user, invite)
      onDone(true)
    } catch (cause) {
      console.error(cause)
      setError('No se pudo completar. Es posible que la invitación haya vencido o se haya revocado.')
      setBusy(false)
    }
  }

  const loading = !info || current.loading
  const sameHousehold = current.householdId === invite.householdId && !current.removed
  const otherHousehold = current.householdId && !sameHousehold && !current.removed

  let body
  if (loading) {
    body = <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-emerald-400" />
  } else if (info.status !== 'valid') {
    body = (
      <>
        <h1 className="text-[18px] font-semibold text-white">
          {info.status === 'expired' ? 'Esta invitación ya venció' : 'Esta invitación no existe'}
        </h1>
        <p className="mt-2 text-[13px] text-slate-400">Pide a quien te invitó que te envíe un enlace nuevo.</p>
      </>
    )
  } else if (sameHousehold) {
    body = (
      <>
        <h1 className="text-[18px] font-semibold text-white">Ya eres parte de {info.householdName}</h1>
        <p className="mt-2 text-[13px] text-slate-400">Encuentras los gastos compartidos en Gastos diarios.</p>
      </>
    )
  } else if (otherHousehold) {
    body = (
      <>
        <h1 className="text-[18px] font-semibold text-white">Ya perteneces a otro hogar</h1>
        <p className="mt-2 text-[13px] text-slate-400">
          Para unirte a {info.householdName}, primero sal de tu hogar actual desde Gastos diarios y vuelve a abrir el
          enlace.
        </p>
      </>
    )
  } else {
    body = (
      <>
        <h1 className="text-[18px] font-semibold text-white">
          {info.inviterName} te invitó a {info.householdName}
        </h1>
        <p className="mt-2 text-[13px] text-slate-400">
          Verán y registrarán juntos los gastos diarios en tiempo real. Tu presupuesto, objetivos y deudas siguen siendo
          privados.
        </p>
        {error && <p className="mt-3 text-[13px] text-rose-300">{error}</p>}
      </>
    )
  }

  const canJoin = !loading && info.status === 'valid' && !sameHousehold && !otherHousehold

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-white/[0.06] bg-[#0f1117] p-6 text-center">
      <span className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-emerald-400/10 text-emerald-300">
        <IconUsers className="h-6 w-6" />
      </span>
      {body}
      {!loading && (
        <div className="mt-6 flex flex-col gap-2">
          {canJoin && (
            <button
              type="button"
              onClick={join}
              disabled={busy}
              className="h-11 rounded-xl bg-emerald-400 px-5 text-[14px] font-semibold text-[#06120d] transition hover:bg-emerald-300 disabled:opacity-60"
            >
              Unirme al hogar
            </button>
          )}
          <button
            type="button"
            onClick={() => onDone(sameHousehold)}
            className="h-11 rounded-xl border border-white/[0.1] px-5 text-[14px] font-medium text-slate-300 transition hover:text-white"
          >
            {canJoin ? 'Ahora no' : 'Continuar'}
          </button>
        </div>
      )}
    </div>
  )
}
