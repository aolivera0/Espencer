import ObjetivosTable from '../components/ObjetivosTable'
import StatCard from '../components/StatCard'
import {
  IconCard,
  IconPiggy,
  IconPlus,
  IconReset,
  IconTarget,
  IconTrend,
} from '../components/Icons'
import { formatMoney, formatPercent, month } from '../data/mock'

export default function Objetivos({ goals, onUpdate, onRemove, onAdd, onReset }) {
  const totalGoals = goals.reduce((sum, goal) => sum + Number(goal.amount || 0), 0)
  const doneTotal = goals
    .filter((goal) => goal.done)
    .reduce((sum, goal) => sum + Number(goal.amount || 0), 0)
  const pendingTotal = totalGoals - doneTotal
  const doneCount = goals.filter((goal) => goal.done).length
  const share = (value) => (totalGoals > 0 ? (value / totalGoals) * 100 : 0)
  const byCategory = (category) =>
    goals
      .filter((goal) => goal.category === category)
      .reduce((sum, goal) => sum + Number(goal.amount || 0), 0)

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[13px] font-medium text-emerald-400/90">
            Objetivos financieros
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-[28px]">
            Objetivos de {month.label.toLowerCase()}
          </h1>
          <p className="mt-1 text-[13px] text-slate-500">
            Define cuánto destinas a ahorro, inversión y deudas, y marca tu avance.
          </p>
        </div>
        <div className="flex items-center gap-2">
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

      <section className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard
          label="Total objetivos"
          value={formatMoney(totalGoals)}
          hint={`${doneCount} de ${goals.length} objetivos cumplidos`}
          percent={totalGoals > 0 ? (doneTotal / totalGoals) * 100 : 0}
          percentLabel={formatPercent(totalGoals > 0 ? (doneTotal / totalGoals) * 100 : 0)}
          icon={IconTarget}
          tone="violet"
          delay={0}
        />
        <StatCard
          label="Ahorro"
          value={formatMoney(byCategory('Ahorro'))}
          hint="Lo que guardas cada mes"
          percent={share(byCategory('Ahorro'))}
          percentLabel={formatPercent(share(byCategory('Ahorro')))}
          icon={IconPiggy}
          tone="emerald"
          delay={60}
        />
        <StatCard
          label="Inversión"
          value={formatMoney(byCategory('Inversión'))}
          hint="Capital que pones a trabajar"
          percent={share(byCategory('Inversión'))}
          percentLabel={formatPercent(share(byCategory('Inversión')))}
          icon={IconTrend}
          tone="sky"
          delay={120}
        />
        <StatCard
          label="Deudas"
          value={formatMoney(byCategory('Deudas'))}
          hint="Abonos a tus obligaciones"
          percent={share(byCategory('Deudas'))}
          percentLabel={formatPercent(share(byCategory('Deudas')))}
          icon={IconCard}
          tone="rose"
          delay={180}
        />
      </section>

      <section className="animate-rise rounded-2xl border border-white/[0.06] bg-[#0f1117] p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-[15px] font-semibold text-white">Objetivos del mes</h2>
            <p className="mt-0.5 text-[11px] text-slate-500">
              {goals.length} objetivos · edita el valor o marca lo cumplido
            </p>
          </div>
          <button
            type="button"
            onClick={onAdd}
            className="inline-flex items-center gap-2 self-start rounded-xl bg-emerald-400 px-3.5 py-2 text-[13px] font-semibold text-[#06120d] transition hover:bg-emerald-300 sm:self-auto"
          >
            <IconPlus />
            Agregar objetivo
          </button>
        </div>

        <div className="mt-4">
          <ObjetivosTable goals={goals} onUpdate={onUpdate} onRemove={onRemove} />
        </div>

        <div className="mt-4 grid gap-3 border-t border-white/[0.06] pt-4 sm:grid-cols-3">
          <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] px-3.5 py-3">
            <p className="text-[11px] text-slate-500">Total objetivos</p>
            <p className="mt-1 text-[16px] font-semibold tabular-nums text-white">
              {formatMoney(totalGoals)}
            </p>
          </div>
          <div className="rounded-xl border border-emerald-400/15 bg-emerald-400/[0.05] px-3.5 py-3">
            <p className="text-[11px] text-emerald-200/60">Cumplido</p>
            <p className="mt-1 text-[16px] font-semibold tabular-nums text-emerald-300">
              {formatMoney(doneTotal)}
            </p>
          </div>
          <div className="rounded-xl border border-amber-400/15 bg-amber-400/[0.05] px-3.5 py-3">
            <p className="text-[11px] text-amber-200/60">Pendiente</p>
            <p className="mt-1 text-[16px] font-semibold tabular-nums text-amber-300">
              {formatMoney(pendingTotal)}
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
