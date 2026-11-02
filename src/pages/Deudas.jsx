import BalanceChart from '../components/BalanceChart'
import DebtTable from '../components/DebtTable'
import {
  IconCard,
  IconCheck,
  IconClock,
  IconPlus,
  IconReset,
  IconWallet,
} from '../components/Icons'
import MoneyInput from '../components/MoneyInput'
import StatCard from '../components/StatCard'
import { formatDate, formatMoney, formatPercent } from '../data/mock'

export default function Deudas({
  debt,
  onDebtChange,
  onUpdatePayment,
  onRemovePayment,
  onAddPayment,
  onReset,
}) {
  const sorted = [...debt.payments].sort((a, b) => a.date.localeCompare(b.date))
  const rows = sorted.map((payment, index) => ({
    ...payment,
    balance:
      debt.total - sorted.slice(0, index + 1).reduce((sum, item) => sum + Number(item.amount || 0), 0),
  }))

  const paidTotal = debt.payments
    .filter((payment) => payment.paid)
    .reduce((sum, payment) => sum + Number(payment.amount || 0), 0)
  const scheduledTotal = debt.payments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0)
  const remaining = Math.max(debt.total - paidTotal, 0)
  const pct = (value) => (debt.total > 0 ? (value / debt.total) * 100 : 0)

  const lastPaid = [...rows].reverse().find((row) => row.paid)
  const pace = lastPaid ? Number(lastPaid.amount) : 0
  const paymentsLeft = pace > 0 ? Math.ceil(remaining / pace) : null
  const overScheduled = scheduledTotal > debt.total

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[13px] font-medium text-emerald-400/90">Deudas</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-[28px]">
            Cuánto te falta por pagar
          </h1>
          <p className="mt-1 text-[13px] text-slate-500">
            Registra cada abono y mira cómo baja el saldo de tu deuda.
          </p>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 self-start rounded-xl border border-white/[0.08] px-3.5 py-2.5 text-[13px] font-medium text-slate-300 transition hover:border-white/[0.16] hover:text-white sm:self-auto"
        >
          <IconReset />
          <span className="hidden sm:inline">Restablecer</span>
        </button>
      </header>

      <section className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard
          label="Deuda total"
          value={formatMoney(debt.total)}
          hint={`${debt.payments.length} abonos en la tabla`}
          icon={IconCard}
          tone="rose"
          delay={0}
        />
        <StatCard
          label="Abonado"
          value={formatMoney(paidTotal)}
          hint={`${debt.payments.filter((payment) => payment.paid).length} abonos pagados`}
          percent={pct(paidTotal)}
          percentLabel={formatPercent(pct(paidTotal))}
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
          label="Abonos por pagar"
          value={paymentsLeft === null ? 'Sin ritmo' : `≈ ${paymentsLeft}`}
          hint={
            paymentsLeft === null
              ? 'Marca un abono como pagado'
              : `Al ritmo de ${formatMoney(pace)}`
          }
          icon={IconClock}
          tone="violet"
          delay={180}
        />
      </section>

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="rounded-2xl border border-white/[0.06] bg-[#0f1117] p-5 lg:col-span-2">
          <h2 className="text-[15px] font-semibold text-white">Evolución del saldo</h2>
          <p className="mt-0.5 text-[12px] text-slate-500">
            {rows.length > 0
              ? `Del ${formatDate(rows[0].date)} al ${formatDate(rows[rows.length - 1].date)}`
              : 'Aún sin abonos'}
          </p>
          <div className="mt-8">
            <BalanceChart total={debt.total} rows={rows} />
          </div>
        </section>

        <section className="self-start rounded-2xl border border-white/[0.06] bg-[#0f1117] p-5">
          <h2 className="text-[15px] font-semibold text-white">Tu deuda</h2>
          <label className="mt-4 block">
            <span className="text-[12px] text-slate-500">Nombre</span>
            <input
              value={debt.name}
              onChange={(event) => onDebtChange({ name: event.target.value })}
              placeholder="Ej. Préstamo del carro"
              className="mt-1.5 w-full rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-base font-medium text-slate-100 outline-none placeholder:text-slate-600 focus:border-emerald-400/40 md:text-[13px]"
            />
          </label>
          <label className="mt-4 block">
            <span className="text-[12px] text-slate-500">Valor total</span>
            <div className="mt-1.5 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 focus-within:border-emerald-400/40">
              <MoneyInput
                value={debt.total}
                onChange={(next) => onDebtChange({ total: next })}
                ariaLabel="Valor total de la deuda"
                className="w-full bg-transparent text-base font-semibold tabular-nums text-white outline-none md:text-[15px]"
              />
            </div>
          </label>
        </section>
      </div>

      <section className="rounded-2xl border border-white/[0.06] bg-[#0f1117] p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-[15px] font-semibold text-white">
              Tabla de amortización{debt.name ? ` · ${debt.name}` : ''}
            </h2>
            <p className="mt-0.5 text-[12px] text-slate-500">
              El restante se calcula solo después de cada abono
            </p>
          </div>
          <button
            type="button"
            onClick={onAddPayment}
            className="inline-flex items-center gap-2 self-start rounded-xl bg-emerald-400 px-3.5 py-2 text-[13px] font-semibold text-[#06120d] transition hover:bg-emerald-300 sm:self-auto"
          >
            <IconPlus />
            Agregar abono
          </button>
        </div>

        <div className="mt-4">
          <DebtTable rows={rows} onUpdate={onUpdatePayment} onRemove={onRemovePayment} />
        </div>

        {overScheduled && (
          <p className="mt-4 rounded-xl border border-rose-400/20 bg-rose-400/[0.06] px-3.5 py-2.5 text-[12px] text-rose-200">
            Los abonos suman {formatMoney(scheduledTotal)}, más que la deuda total. Revisa los valores.
          </p>
        )}

        <div className="mt-4 grid gap-3 border-t border-white/[0.06] pt-4 sm:grid-cols-3">
          <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] px-3.5 py-3">
            <p className="text-[11px] text-slate-500">Deuda total</p>
            <p className="mt-1 text-[16px] font-semibold tabular-nums text-white">
              {formatMoney(debt.total)}
            </p>
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
      </section>
    </div>
  )
}
