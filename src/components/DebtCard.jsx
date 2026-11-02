import { useEffect, useRef, useState } from 'react'
import { useConfirm } from '../context/confirm'
import useCollection from '../hooks/useCollection'
import { deleteDebt } from '../lib/debtActions'
import { formatDate, formatMoney, formatPercent } from '../data/mock'
import BalanceChart from './BalanceChart'
import DebtTable from './DebtTable'
import { IconCaretDown, IconPlus, IconTrash } from './Icons'
import MoneyInput from './MoneyInput'

const isoDate = (date) =>
  [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-')

// Siguiente abono: 15 días después del último, o hoy si aún no hay ninguno.
const nextPaymentDate = (last) => {
  const next = last ? new Date(`${last}T00:00:00`) : new Date()
  if (last) next.setDate(next.getDate() + 15)
  return isoDate(next)
}

export default function DebtCard({ uid, debt, defaultOpen, scrollOnMount, onChange, onStats }) {
  const payments = useCollection(`users/${uid}/debts/${debt.id}/payments`)
  const [open, setOpen] = useState(defaultOpen)
  const card = useRef(null)
  const confirm = useConfirm()

  const total = Number(debt.total || 0)
  const sorted = [...payments.items].sort((a, b) => a.date.localeCompare(b.date))
  const rows = sorted.map((payment, index) => ({
    ...payment,
    balance: total - sorted.slice(0, index + 1).reduce((sum, item) => sum + Number(item.amount || 0), 0),
  }))

  const paidTotal = payments.items
    .filter((payment) => payment.paid)
    .reduce((sum, payment) => sum + Number(payment.amount || 0), 0)
  const scheduledTotal = payments.items.reduce((sum, payment) => sum + Number(payment.amount || 0), 0)
  const remaining = Math.max(total - paidTotal, 0)
  const paidShare = total > 0 ? (paidTotal / total) * 100 : 0

  const lastPaid = [...rows].reverse().find((row) => row.paid)
  const pace = lastPaid ? Number(lastPaid.amount) : 0
  const paymentsLeft = pace > 0 && remaining > 0 ? Math.ceil(remaining / pace) : null

  useEffect(() => {
    onStats(debt.id, { total, paid: paidTotal, remaining })
  }, [debt.id, total, paidTotal, remaining, onStats])

  useEffect(() => () => onStats(debt.id, null), [debt.id, onStats])

  const addPayment = () => {
    const last = payments.items.map((item) => item.date).sort().pop()
    const amount = sorted.at(-1)?.amount ?? 0
    payments.add({ date: nextPaymentDate(last), amount, paid: false })
  }

  const showCard = () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    card.current?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
  }

  useEffect(() => {
    if (scrollOnMount) showCard()
  }, [scrollOnMount])

  const toggle = () => {
    if (!open) showCard()
    setOpen((value) => !value)
  }

  const remove = async () => {
    const accepted = await confirm({
      title: `¿Eliminar ${debt.name || 'esta deuda'}?`,
      message: `Se eliminará la deuda junto con sus ${payments.items.length} abonos, y también saldrán de Objetivos. No se puede deshacer.`,
    })
    if (!accepted) return
    try {
      await deleteDebt(uid, debt.id)
    } catch (error) {
      console.error('No se pudo eliminar la deuda', error)
    }
  }

  return (
    <article
      ref={card}
      className="scroll-mt-20 rounded-2xl border border-white/[0.06] bg-[#0f1117] lg:scroll-mt-6"
    >
      <div className="flex items-center gap-2 p-3 sm:p-4">
        <button
          type="button"
          onClick={toggle}
          aria-expanded={open}
          className="flex min-w-0 flex-1 items-center gap-3 rounded-xl p-2 text-left transition hover:bg-white/[0.03]"
        >
          <IconCaretDown
            className={`h-4 w-4 shrink-0 text-slate-500 transition-transform ${open ? '' : '-rotate-90'}`}
          />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[15px] font-semibold text-white">
              {debt.name || 'Deuda sin nombre'}
            </span>
            <span className="mt-1 flex min-w-0 items-center gap-2 sm:gap-3">
              <span className="h-1.5 w-14 shrink-0 overflow-hidden rounded-full bg-white/[0.06] sm:w-40">
                <span
                  className="block h-full rounded-full bg-emerald-400"
                  style={{ width: `${Math.min(paidShare, 100)}%` }}
                />
              </span>
              <span className="whitespace-nowrap text-[12px] tabular-nums text-slate-500">
                {formatPercent(paidShare)}
                <span className="hidden sm:inline"> pagado</span>
              </span>
            </span>
          </span>
          <span className="shrink-0 text-right">
            <span className="block text-[12px] text-slate-500">Restante</span>
            <span className="block text-[15px] font-semibold tabular-nums text-amber-300">
              {formatMoney(remaining)}
            </span>
          </span>
        </button>
        <button
          type="button"
          onClick={remove}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-slate-500 transition hover:bg-rose-400/10 hover:text-rose-300"
          aria-label={`Eliminar ${debt.name || 'deuda'}`}
        >
          <IconTrash />
        </button>
      </div>

      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
        onTransitionEnd={(event) => {
          if (open && event.target === event.currentTarget) showCard()
        }}
      >
        <div className="min-h-0 overflow-hidden" inert={!open}>
          <div className="space-y-5 border-t border-white/[0.06] p-4 sm:p-5">
          <div className="grid gap-5 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <h3 className="text-[14px] font-semibold text-white">Evolución del saldo</h3>
              <p className="mt-0.5 text-[12px] text-slate-500">
                {rows.length > 0
                  ? `Del ${formatDate(rows[0].date)} al ${formatDate(rows[rows.length - 1].date)}`
                  : 'Aún sin abonos'}
              </p>
              <div className="mt-8">
                <BalanceChart total={total} rows={rows} />
              </div>
            </div>

            <div className="space-y-4 self-start">
              <label className="block">
                <span className="text-[12px] text-slate-500">Nombre</span>
                <input
                  value={debt.name}
                  onChange={(event) => onChange({ name: event.target.value })}
                  placeholder="Ej. Préstamo del carro"
                  className="mt-1.5 w-full rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-base font-medium text-slate-100 outline-none placeholder:text-slate-600 focus:border-emerald-400/40 md:text-[13px]"
                />
              </label>
              <label className="block">
                <span className="text-[12px] text-slate-500">Valor total</span>
                <div className="mt-1.5 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 focus-within:border-emerald-400/40">
                  <MoneyInput
                    value={debt.total}
                    onChange={(next) => onChange({ total: next })}
                    ariaLabel={`Valor total de ${debt.name || 'la deuda'}`}
                    className="w-full bg-transparent text-base font-semibold tabular-nums text-white outline-none md:text-[15px]"
                  />
                </div>
              </label>
              <p className="text-[12px] text-slate-500">
                {paymentsLeft === null
                  ? remaining === 0 && total > 0
                    ? 'Deuda pagada por completo.'
                    : 'Marca un abono como pagado para estimar cuántos faltan.'
                  : `Faltan ≈ ${paymentsLeft} abonos al ritmo de ${formatMoney(pace)}.`}
              </p>
            </div>
          </div>

          <div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-[14px] font-semibold text-white">Tabla de amortización</h3>
                <p className="mt-0.5 text-[12px] text-slate-500">
                  El restante se calcula solo después de cada abono
                </p>
              </div>
              <button
                type="button"
                onClick={addPayment}
                className="inline-flex items-center gap-2 self-start rounded-xl bg-emerald-400 px-3.5 py-2 text-[13px] font-semibold text-[#06120d] transition hover:bg-emerald-300 sm:self-auto"
              >
                <IconPlus />
                Agregar abono
              </button>
            </div>

            <div className="mt-4">
              <DebtTable rows={rows} onUpdate={payments.update} onRemove={payments.remove} />
            </div>

            {scheduledTotal > total && total > 0 && (
              <p className="mt-4 rounded-xl border border-rose-400/20 bg-rose-400/[0.06] px-3.5 py-2.5 text-[12px] text-rose-200">
                Los abonos suman {formatMoney(scheduledTotal)}, más que la deuda total. Revisa los valores.
              </p>
            )}

            <div className="mt-4 grid gap-3 border-t border-white/[0.06] pt-4 sm:grid-cols-3">
              <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] px-3.5 py-3">
                <p className="text-[11px] text-slate-500">Deuda total</p>
                <p className="mt-1 text-[16px] font-semibold tabular-nums text-white">{formatMoney(total)}</p>
              </div>
              <div className="rounded-xl border border-emerald-400/15 bg-emerald-400/[0.05] px-3.5 py-3">
                <p className="text-[11px] text-emerald-200/60">Pagado</p>
                <p className="mt-1 text-[16px] font-semibold tabular-nums text-emerald-300">
                  {formatMoney(paidTotal)}
                </p>
              </div>
              <div className="rounded-xl border border-amber-400/15 bg-amber-400/[0.05] px-3.5 py-3">
                <p className="text-[11px] text-amber-200/60">Por pagar</p>
                <p className="mt-1 text-[16px] font-semibold tabular-nums text-amber-300">
                  {formatMoney(remaining)}
                </p>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </article>
  )
}
