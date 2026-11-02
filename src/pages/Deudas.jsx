import { useCallback, useState } from 'react'
import DebtCard from '../components/DebtCard'
import { IconCard, IconCheck, IconClock, IconPlus, IconWallet } from '../components/Icons'
import StatCard from '../components/StatCard'
import { useAuth } from '../context/auth'
import { formatMoney, formatPercent } from '../data/mock'
import useCollection from '../hooks/useCollection'

export default function Deudas() {
  const { user } = useAuth()
  const debts = useCollection(`users/${user.uid}/debts`)
  const [stats, setStats] = useState({})
  const [justAdded, setJustAdded] = useState(null)

  const reportStats = useCallback((id, value) => {
    setStats((current) => {
      const previous = current[id]
      if (!value) {
        if (!previous) return current
        const next = { ...current }
        delete next[id]
        return next
      }
      if (
        previous &&
        previous.total === value.total &&
        previous.paid === value.paid &&
        previous.remaining === value.remaining
      ) {
        return current
      }
      return { ...current, [id]: value }
    })
  }, [])

  const addDebt = async () => {
    const created = await debts.add({ name: '', total: 0 })
    if (created) setJustAdded(created.id)
  }

  const values = Object.values(stats)
  const total = values.reduce((sum, item) => sum + item.total, 0)
  const paid = values.reduce((sum, item) => sum + item.paid, 0)
  const remaining = values.reduce((sum, item) => sum + item.remaining, 0)
  const active = values.filter((item) => item.remaining > 0).length
  const pct = (value) => (total > 0 ? (value / total) * 100 : 0)

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[13px] font-medium text-emerald-400/90">Deudas</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-[28px]">
            Cuánto te falta por pagar
          </h1>
          <p className="mt-1 text-[13px] text-slate-500">
            Registra cada abono y mira cómo baja el saldo de tus deudas.
          </p>
        </div>
        <button
          type="button"
          onClick={addDebt}
          className="inline-flex items-center gap-2 self-start rounded-xl bg-emerald-400 px-3.5 py-2.5 text-[13px] font-semibold text-[#06120d] transition hover:bg-emerald-300 sm:self-auto"
        >
          <IconPlus />
          Agregar deuda
        </button>
      </header>

      {!debts.ready ? (
        <div className="grid h-48 place-items-center" role="status" aria-label="Cargando">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-emerald-400" />
        </div>
      ) : (
        <>
          {debts.items.length > 0 && (
            <section className="grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
              <StatCard
                label="Deuda total"
                value={formatMoney(total)}
                hint={`${debts.items.length} ${debts.items.length === 1 ? 'deuda' : 'deudas'}`}
                icon={IconCard}
                tone="rose"
                delay={0}
              />
              <StatCard
                label="Abonado"
                value={formatMoney(paid)}
                hint="Abonos marcados como pagados"
                percent={pct(paid)}
                percentLabel={formatPercent(pct(paid))}
                icon={IconCheck}
                tone="emerald"
                delay={60}
              />
              <StatCard
                label="Restante"
                value={formatMoney(remaining)}
                hint="Lo que aún debes"
                percent={pct(remaining)}
                percentLabel={formatPercent(pct(remaining))}
                icon={IconWallet}
                tone="amber"
                delay={120}
              />
              <StatCard
                label="Deudas con saldo"
                value={String(active)}
                hint={active === 0 ? 'Todo al día' : 'Aún tienen pagos pendientes'}
                icon={IconClock}
                tone="violet"
                delay={180}
              />
            </section>
          )}

          <div className="space-y-4">
            {debts.items.map((debt) => (
              <DebtCard
                key={debt.id}
                uid={user.uid}
                debt={debt}
                defaultOpen={debts.items.length <= 3 || debt.id === justAdded}
                scrollOnMount={debt.id === justAdded}
                onChange={(patch) => debts.update(debt.id, patch)}
                onStats={reportStats}
              />
            ))}
          </div>

          {debts.items.length === 0 && (
            <div className="rounded-2xl border border-white/[0.06] bg-[#0f1117] p-8 text-center">
              <h2 className="text-[15px] font-semibold text-white">Aún no tienes deudas</h2>
              <p className="mx-auto mt-1 max-w-sm text-[13px] text-slate-500">
                Agrega una deuda con su valor total y registra los abonos para ver su tabla de amortización.
              </p>
              <button
                type="button"
                onClick={addDebt}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-3.5 py-2.5 text-[13px] font-semibold text-[#06120d] transition hover:bg-emerald-300"
              >
                <IconPlus />
                Agregar deuda
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
