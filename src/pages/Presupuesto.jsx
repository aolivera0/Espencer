import GastosTable from '../components/GastosTable'
import MoneyInput from '../components/MoneyInput'
import StatCard from '../components/StatCard'
import {
  IconCaretDown,
  IconPiggy,
  IconPlus,
  IconReset,
  IconTarget,
  IconTrend,
  IconWallet,
} from '../components/Icons'
import { formatMoney, formatPercent, month } from '../data/mock'

export default function Presupuesto({
  expenses,
  goals,
  income,
  onIncomeChange,
  onUpdate,
  onRemove,
  onAdd,
  onReset,
  onNavigate,
}) {
  const totalExpenses = expenses.reduce((sum, item) => sum + Number(item.budget || 0), 0)
  const totalGoals = goals.reduce((sum, item) => sum + Number(item.amount || 0), 0)
  const doneGoals = goals.filter((item) => item.done).length
  const free = income - totalExpenses - totalGoals
  const paidTotal = expenses
    .filter((item) => item.paid)
    .reduce((sum, item) => sum + Number(item.budget || 0), 0)
  const pendingTotal = totalExpenses - paidTotal
  const pct = (value) => (income > 0 ? (value / income) * 100 : 0)
  const byCategory = (category) =>
    goals
      .filter((item) => item.category === category)
      .reduce((sum, item) => sum + Number(item.amount || 0), 0)

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[13px] font-medium text-emerald-400/90">
            Presupuesto mensual
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-[28px]">
            Presupuesto de {month.label.toLowerCase()}
          </h1>
          <p className="mt-1 text-[13px] text-slate-500">
            Ajusta tus gastos y mira cómo cambia tu disponible al instante.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={`${month.label} ${month.year}`}
              onChange={() => {}}
              className="appearance-none rounded-xl border border-white/[0.08] bg-[#0f1117] py-2.5 pl-3.5 pr-9 text-[13px] font-medium text-slate-200 outline-none transition hover:border-white/[0.14] focus:border-emerald-400/40"
            >
              <option>
                {month.label} {month.year}
              </option>
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
              <IconCaretDown className="h-3.5 w-3.5" />
            </span>
          </div>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] px-3.5 py-2.5 text-[13px] font-medium text-slate-300 transition hover:border-white/[0.16] hover:text-white"
          >
            <IconReset />
            <span className="hidden sm:inline">Restablecer</span>
          </button>
        </div>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
        <div className="animate-rise rounded-2xl border border-white/[0.06] bg-[#0f1117] p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-medium text-slate-400">Ingresos del mes</p>
              <div className="mt-2 flex w-full items-center gap-1 rounded-lg border border-white/[0.06] bg-white/[0.02] px-2.5 py-1.5 focus-within:border-emerald-400/40">
                <MoneyInput
                  value={income}
                  onChange={onIncomeChange}
                  ariaLabel="Ingresos del mes"
                  className="w-full bg-transparent text-[18px] font-semibold tracking-tight text-white outline-none"
                />
              </div>
            </div>
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-emerald-400/10 text-emerald-300">
              <IconWallet className="h-[18px] w-[18px]" />
            </span>
          </div>
          <p className="relative mt-4 text-[11px] text-slate-500">
            {formatMoney(income)} · editable
          </p>
        </div>

        <StatCard
          label="Gastos fijos"
          value={formatMoney(totalExpenses)}
          hint={`${expenses.filter((item) => item.paid).length} de ${expenses.length} pagados`}
          percent={pct(totalExpenses)}
          percentLabel={formatPercent(pct(totalExpenses))}
          icon={IconTrend}
          tone="rose"
          delay={60}
        />
        <StatCard
          label="Objetivos financieros"
          value={formatMoney(totalGoals)}
          hint={`${doneGoals} de ${goals.length} objetivos cumplidos`}
          percent={pct(totalGoals)}
          percentLabel={formatPercent(pct(totalGoals))}
          icon={IconTarget}
          tone="violet"
          delay={120}
        />
        <StatCard
          label="Libre"
          value={formatMoney(free)}
          hint={free < 0 ? 'Superaste tu presupuesto' : 'Sin asignar este mes'}
          percent={pct(free)}
          percentLabel={formatPercent(pct(free))}
          icon={IconPiggy}
          tone="sky"
          delay={180}
        />
      </section>

      <section className="animate-rise rounded-2xl border border-white/[0.06] bg-[#0f1117] p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-[15px] font-semibold text-white">Gastos del mes</h2>
            <p className="mt-0.5 text-[11px] text-slate-500">
              {expenses.length} conceptos · edita el valor o marca lo pagado
            </p>
          </div>
          <button
            type="button"
            onClick={onAdd}
            className="inline-flex items-center gap-2 self-start rounded-xl bg-emerald-400 px-3.5 py-2 text-[13px] font-semibold text-[#06120d] transition hover:bg-emerald-300 sm:self-auto"
          >
            <IconPlus />
            Agregar gasto
          </button>
        </div>

        <div className="mt-4">
          <GastosTable expenses={expenses} onUpdate={onUpdate} onRemove={onRemove} />
        </div>

        <div className="mt-4 grid gap-3 border-t border-white/[0.06] pt-4 sm:grid-cols-3">
          <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] px-3.5 py-3">
            <p className="text-[11px] text-slate-500">Total presupuestado</p>
            <p className="mt-1 text-[16px] font-semibold tabular-nums text-white">
              {formatMoney(totalExpenses)}
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
              {formatMoney(pendingTotal)}
            </p>
          </div>
        </div>
      </section>

      <section className="animate-rise rounded-2xl border border-white/[0.06] bg-[#0f1117] p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-[15px] font-semibold text-white">Objetivos financieros</h2>
            <p className="mt-0.5 text-[11px] text-slate-500">
              Lo que separas cada mes antes de gastar
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('objetivos')}
            className="shrink-0 rounded-lg px-2 py-1 text-[11px] font-medium text-emerald-300 transition hover:bg-emerald-400/10 hover:text-emerald-200"
          >
            Gestionar
          </button>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] px-3.5 py-3">
            <p className="text-[11px] text-slate-500">Ahorro</p>
            <p className="mt-1 text-[16px] font-semibold tabular-nums text-white">
              {formatMoney(byCategory('Ahorro'))}
            </p>
          </div>
          <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] px-3.5 py-3">
            <p className="text-[11px] text-slate-500">Inversión</p>
            <p className="mt-1 text-[16px] font-semibold tabular-nums text-white">
              {formatMoney(byCategory('Inversión'))}
            </p>
          </div>
          <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] px-3.5 py-3">
            <p className="text-[11px] text-slate-500">Pago de deudas</p>
            <p className="mt-1 text-[16px] font-semibold tabular-nums text-white">
              {formatMoney(byCategory('Deudas'))}
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
