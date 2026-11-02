import { useMemo, useState } from 'react'
import BottomNav from './components/BottomNav'
import EmptyMonth from './components/EmptyMonth'
import { IconMenu } from './components/Icons'
import MonthSwitcher from './components/MonthSwitcher'
import Sidebar from './components/Sidebar'
import { useAuth } from './context/auth'
import useDebtGoals from './hooks/useDebtGoals'
import useHistory from './hooks/useHistory'
import useMonthData from './hooks/useMonthData'
import { copyMonth, seedMonth } from './lib/monthActions'
import { currentMonthId, describeMonth, shiftMonth } from './lib/months'
import Dashboard from './pages/Dashboard'
import Deudas from './pages/Deudas'
import Objetivos from './pages/Objetivos'
import Presupuesto from './pages/Presupuesto'

export default function Workspace() {
  const { user } = useAuth()
  const [page, setPage] = useState('dashboard')
  const [menuOpen, setMenuOpen] = useState(false)
  const [monthId, setMonthId] = useState(currentMonthId)

  const month = useMemo(() => describeMonth(monthId), [monthId])
  const previous = useMemo(() => describeMonth(shiftMonth(monthId, -1)), [monthId])
  const data = useMonthData(user.uid, monthId)
  const history = useHistory(user.uid, monthId)
  const debtGoals = useDebtGoals(user.uid, monthId)

  // Objetivos del mes: los propios más los abonos de deudas con fecha en el mes.
  const goals = useMemo(() => [...data.goals, ...debtGoals.goals], [data.goals, debtGoals.goals])

  const updateGoal = (id, patch) => {
    const linked = debtGoals.goals.find((goal) => goal.id === id)
    if (linked) debtGoals.setDone(linked, Boolean(patch.done))
    else data.updateGoal(id, patch)
  }

  const showMonth = page !== 'deudas'

  return (
    <div className="min-h-screen text-slate-200">
      <Sidebar
        page={page}
        onNavigate={setPage}
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
      />

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-white/[0.06] bg-[#08090c]/80 px-4 py-3 backdrop-blur-xl lg:hidden">
          <div className="flex items-center gap-2.5">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-400 text-xs font-extrabold text-[#06120d]">
              E
            </div>
            <span className="text-sm font-semibold text-white">Espencer</span>
          </div>
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="grid h-9 w-9 place-items-center rounded-lg text-slate-300 transition hover:bg-white/5"
            aria-label="Abrir menú"
          >
            <IconMenu />
          </button>
        </header>

        <main className="mx-auto w-full max-w-6xl px-4 pb-24 pt-6 sm:px-6 lg:px-10 lg:py-9">
          {showMonth && (
            <div className="mb-5 -ml-2">
              <MonthSwitcher
                month={month}
                isCurrent={monthId === currentMonthId()}
                onToday={() => setMonthId(currentMonthId())}
                onPrevious={() => setMonthId((id) => shiftMonth(id, -1))}
                onNext={() => setMonthId((id) => shiftMonth(id, 1))}
              />
            </div>
          )}

          {showMonth && data.loading && (
            <div className="grid h-64 place-items-center" role="status" aria-label="Cargando">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-emerald-400" />
            </div>
          )}

          {showMonth && data.isEmpty && (
            <EmptyMonth
              month={month}
              previous={previous}
              onCopy={() => copyMonth(user.uid, previous.id, monthId)}
              onSeed={() => seedMonth(user.uid, monthId)}
            />
          )}

          <div key={`${page}-${monthId}`}>
            {showMonth && !data.loading && page === 'dashboard' && (
              <Dashboard
                month={month}
                income={data.income}
                expenses={data.expenses}
                goals={goals}
                history={history}
                onNavigate={setPage}
              />
            )}
            {showMonth && !data.loading && page === 'presupuesto' && (
              <Presupuesto
                month={month}
                expenses={data.expenses}
                goals={goals}
                income={data.income}
                onIncomeChange={data.setIncome}
                onUpdate={data.updateExpense}
                onRemove={data.removeExpense}
                onAdd={data.addExpense}
                onNavigate={setPage}
              />
            )}
            {showMonth && !data.loading && page === 'objetivos' && (
              <Objetivos
                month={month}
                goals={goals}
                onUpdate={updateGoal}
                onRemove={data.removeGoal}
                onAdd={data.addGoal}
              />
            )}
            {page === 'deudas' && <Deudas />}
          </div>
        </main>
      </div>

      <BottomNav page={page} onNavigate={setPage} />
    </div>
  )
}
