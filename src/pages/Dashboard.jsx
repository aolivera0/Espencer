import CategoryBars from '../components/CategoryBars'
import MonthlyChart from '../components/MonthlyChart'
import ProgressBar from '../components/ProgressBar'
import StatCard from '../components/StatCard'
import SummaryPanel from '../components/SummaryPanel'
import TrendLine from '../components/TrendLine'
import {
  IconArrowUp,
  IconClock,
  IconPiggy,
  IconTarget,
  IconTrend,
  IconWallet,
} from '../components/Icons'
import { formatMoney, formatPercent, summarizeMonth } from '../data/mock'
import { StatusBadge } from '../components/Status'

const card = 'rounded-2xl border border-white/[0.06] bg-[#0f1117] p-5'

const sumBy = (items, key, field) =>
  items.reduce((acc, item) => {
    acc[item[key]] = (acc[item[key]] || 0) + Number(item[field] || 0)
    return acc
  }, {})

export default function Dashboard({ month, income, expenses, goals, history, onNavigate }) {
  const totalExpenses = expenses.reduce((sum, item) => sum + Number(item.budget || 0), 0)
  const totalGoals = goals.reduce((sum, item) => sum + Number(item.amount || 0), 0)
  const doneGoals = goals.filter((item) => item.done).length
  const free = income - totalExpenses - totalGoals
  const pct = (value) => (income > 0 ? (value / income) * 100 : 0)
  const paidCount = expenses.filter((item) => item.paid).length

  const paidTotal = expenses
    .filter((item) => item.paid)
    .reduce((sum, item) => sum + Number(item.budget || 0), 0)

  const byCategory = Object.entries(
    expenses.reduce((acc, item) => {
      const entry = (acc[item.category] ||= { paid: 0, pending: 0 })
      entry[item.paid ? 'paid' : 'pending'] += Number(item.budget || 0)
      return acc
    }, {}),
  )
    .map(([name, value]) => ({
      name,
      ...value,
      total: value.paid + value.pending,
      average:
        history.months.length > 0
          ? history.months.reduce((acc, item) => acc + (item.byCategory[name] || 0), 0) /
            history.months.length
          : 0,
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 6)

  const currentMonth = summarizeMonth({
    id: month.id,
    label: month.short,
    income,
    byCategory: sumBy(expenses, 'category', 'budget'),
    goals: sumBy(goals, 'category', 'amount'),
  })
  const past = history.months.map(summarizeMonth)
  const months = [...past, currentMonth]
  const mean = (key) =>
    past.length > 0 ? past.reduce((acc, item) => acc + item[key], 0) / past.length : 0
  const goalsShare = (item) => (item.income > 0 ? (item.goals / item.income) * 100 : 0)
  const goalsAverage =
    past.length > 0 ? past.reduce((acc, item) => acc + goalsShare(item), 0) / past.length : 0

  const comparisons = [
    { label: 'Gastos fijos', average: mean('expenses'), current: currentMonth.expenses, upIsGood: false },
    { label: 'Objetivos', average: mean('goals'), current: currentMonth.goals, upIsGood: true },
    { label: 'Libre', average: mean('free'), current: currentMonth.free, upIsGood: true },
  ]

  const unpaid = expenses
    .filter((item) => !item.paid)
    .sort((a, b) => Number(b.budget || 0) - Number(a.budget || 0))
  const unpaidTotal = unpaid.reduce((sum, item) => sum + Number(item.budget || 0), 0)

  const goalRows = [
    {
      label: 'Ahorro',
      value: goals
        .filter((item) => item.category === 'Ahorro')
        .reduce((sum, item) => sum + Number(item.amount || 0), 0),
      tone: 'emerald',
    },
    {
      label: 'Inversión',
      value: goals
        .filter((item) => item.category === 'Inversión')
        .reduce((sum, item) => sum + Number(item.amount || 0), 0),
      tone: 'sky',
    },
    {
      label: 'Deudas',
      value: goals
        .filter((item) => item.category === 'Deudas')
        .reduce((sum, item) => sum + Number(item.amount || 0), 0),
      tone: 'violet',
    },
  ]

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[13px] font-medium text-emerald-400/90">
            {month.label} {month.year}
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-[28px]">
            Tu mes en orden
          </h1>
          <p className="mt-1 text-[13px] text-slate-500">
            Un vistazo rápido a tus ingresos, gastos y objetivos.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('presupuesto')}
          className="inline-flex items-center gap-2 self-start rounded-xl bg-white px-4 py-2.5 text-[13px] font-semibold text-[#08090c] transition hover:bg-slate-200 sm:self-auto"
        >
          Editar presupuesto
          <IconArrowUp className="h-3.5 w-3.5" />
        </button>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
        <StatCard
          label="Ingresos del mes"
          value={formatMoney(income)}
          hint="Ingreso total estimado"
          icon={IconWallet}
          tone="emerald"
          delay={0}
        />
        <StatCard
          label="Gastos fijos"
          value={formatMoney(totalExpenses)}
          hint={`${paidCount} de ${expenses.length} conceptos pagados`}
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

      <div className="grid gap-4 lg:grid-cols-3">
        <section className={`${card} order-2 lg:order-1 lg:col-span-2`}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-[15px] font-semibold text-white">Gastos por categoría</h2>
              <p className="mt-0.5 text-[12px] text-slate-500">
                {formatMoney(paidTotal)} pagados de {formatMoney(totalExpenses)}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-3 text-[12px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Pagado
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-400/80" />
                Pendiente
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-0.5 rounded bg-slate-200/80" />
                Promedio
              </span>
            </div>
          </div>
          <div className="mt-5">
            <CategoryBars rows={byCategory} />
            {byCategory.length === 0 && (
              <p className="py-8 text-center text-[13px] text-slate-500">
                Agrega gastos para ver la distribución.
              </p>
            )}
          </div>
        </section>

        <div className="order-1 lg:order-2">
          <SummaryPanel
            monthLabel={month.label}
            income={income}
          totalExpenses={totalExpenses}
          totalGoals={totalGoals}
          />
        </div>
      </div>

      <section className="space-y-4">
        <div>
          <h2 className="text-[17px] font-semibold text-white">Últimos meses</h2>
          <p className="mt-0.5 text-[13px] text-slate-500">
            {past.length > 0
              ? `Cómo te has movido de ${past[0].label} a ${past[past.length - 1].label}, comparado con este mes.`
              : 'Tu comportamiento frente a los meses anteriores.'}
          </p>
        </div>

        {history.loading ? null : past.length === 0 ? (
          <p className={`${card} text-[13px] text-slate-500`}>
            Cuando tengas datos de meses anteriores verás aquí tus promedios y cómo cambian mes a mes.
          </p>
        ) : (
          <>
        <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
          {comparisons.map(({ label, average, current, upIsGood }) => {
            const delta = average !== 0 ? ((current - average) / Math.abs(average)) * 100 : 0
            const good = Math.abs(delta) < 0.5 ? null : delta > 0 === upIsGood
            return (
              <div key={label} className={card}>
                <p className="text-[12px] font-medium text-slate-400">Promedio de {label.toLowerCase()}</p>
                <p className="mt-1.5 text-[20px] font-semibold tracking-tight text-white">
                  {formatMoney(average)}
                </p>
                <p
                  className={`mt-2 text-[12px] ${
                    good === null ? 'text-slate-500' : good ? 'text-emerald-300' : 'text-rose-300'
                  }`}
                >
                  {good === null
                    ? 'Este mes va igual al promedio'
                    : `Este mes ${delta > 0 ? '+' : '−'}${formatPercent(Math.abs(delta))} frente al promedio`}
                </p>
              </div>
            )
          })}
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <section className={`${card} lg:col-span-2`}>
            <h3 className="text-[15px] font-semibold text-white">Cómo se reparte cada mes</h3>
            <p className="mt-0.5 text-[12px] text-slate-500">Ingreso dividido entre gastos, objetivos y libre</p>
            <div className="mt-5">
              <MonthlyChart months={months} currentId={currentMonth.id} />
            </div>
          </section>
          <section className={card}>
            <h3 className="text-[15px] font-semibold text-white">Ingreso que va a objetivos</h3>
            <p className="mt-0.5 text-[12px] text-slate-500">Porcentaje de cada mes</p>
            <div className="mt-5">
              <TrendLine
                months={months}
                currentId={currentMonth.id}
                values={months.map(goalsShare)}
                average={goalsAverage}
              />
            </div>
          </section>
        </div>
          </>
        )}
      </section>

      <div className="grid gap-4 lg:grid-cols-3">
        <section className={`${card} lg:col-span-2`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[15px] font-semibold text-white">Por pagar este mes</h2>
              <p className="mt-0.5 text-[12px] text-slate-500">Gastos que aún no marcas como pagados</p>
            </div>
            <span className="rounded-md bg-white/[0.04] px-2 py-1 text-[12px] font-medium text-slate-400">
              {unpaid.length} {unpaid.length === 1 ? 'pendiente' : 'pendientes'}
            </span>
          </div>
          <ul className="mt-4 divide-y divide-white/[0.05]">
            {unpaid.map((item) => (
              <li key={item.id} className="flex items-center gap-3 py-3 first:pt-1">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-amber-400/10 text-amber-300">
                  <IconClock className="h-[18px] w-[18px]" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-medium text-slate-200">
                    {item.concept || 'Sin nombre'}
                  </p>
                  <p className="text-[12px] text-slate-500">{item.category}</p>
                </div>
                <span className="text-[13px] font-semibold tabular-nums text-slate-200">
                  {formatMoney(item.budget)}
                </span>
                <StatusBadge done={false} doneLabel="Pagado" className="hidden sm:inline-flex" />
              </li>
            ))}
            {unpaid.length === 0 && (
              <li className="py-8 text-center text-[13px] text-slate-500">
                {expenses.length === 0
                  ? 'Agrega gastos en Presupuesto para verlos aquí.'
                  : 'Todo está pagado este mes.'}
              </li>
            )}
          </ul>
          <div className="mt-3 flex items-center justify-between rounded-xl border border-white/[0.05] bg-white/[0.02] px-3 py-2.5">
            <span className="text-[12px] text-slate-500">Total por pagar</span>
            <span className="text-[13px] font-semibold tabular-nums text-amber-300">
              {formatMoney(unpaidTotal)}
            </span>
          </div>
        </section>

        <section className={`${card} self-start`}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-[15px] font-semibold text-white">Objetivos del mes</h2>
              <p className="mt-0.5 text-[11px] text-slate-500">Lo que estás construyendo</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('objetivos')}
              className="shrink-0 rounded-lg px-2 py-1 text-[11px] font-medium text-emerald-300 transition hover:bg-emerald-400/10 hover:text-emerald-200"
            >
              Ver todos
            </button>
          </div>
          <div className="mt-5 space-y-4">
            {goalRows.map((goal) => (
              <ProgressBar
                key={goal.label}
                label={goal.label}
                value={goal.value}
                max={totalGoals || 1}
                right={formatMoney(goal.value)}
                tone={goal.tone}
              />
            ))}
          </div>
          <div className="mt-5 flex items-center justify-between rounded-xl border border-violet-400/15 bg-violet-400/[0.06] px-3 py-2.5">
            <span className="text-[11px] text-violet-200/70">Total objetivos</span>
            <span className="text-[13px] font-semibold tabular-nums text-violet-200">
              {formatMoney(totalGoals)}
            </span>
          </div>
        </section>
      </div>
    </div>
  )
}
