import HouseholdSetup from '../components/diarios/HouseholdSetup'
import HouseholdView from '../components/diarios/HouseholdView'
import { useAuth } from '../context/auth'
import useHousehold from '../hooks/useHousehold'
import { forgetHousehold } from '../lib/household'

export default function Diarios({ month }) {
  const { user } = useAuth()
  const state = useHousehold(user.uid)

  if (state.loading) {
    return (
      <div className="grid h-64 place-items-center" role="status" aria-label="Cargando">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-emerald-400" />
      </div>
    )
  }

  if (state.removed) {
    return (
      <div className="rounded-2xl border border-white/[0.06] bg-[#0f1117] p-6">
        <h1 className="text-[17px] font-semibold text-white">Ya no perteneces a este hogar</h1>
        <p className="mt-1 text-[13px] text-slate-500">
          Saliste o te sacaron del hogar. Puedes crear uno nuevo o unirte con otra invitación.
        </p>
        <button
          type="button"
          onClick={() => forgetHousehold(user.uid)}
          className="mt-4 h-10 rounded-xl bg-emerald-400 px-4 text-[13px] font-semibold text-[#06120d] transition hover:bg-emerald-300"
        >
          Entendido
        </button>
      </div>
    )
  }

  if (!state.householdId) return <HouseholdSetup user={user} />

  return (
    <HouseholdView
      key={state.householdId}
      user={user}
      householdId={state.householdId}
      household={state.household}
      members={state.members}
      month={month}
    />
  )
}
