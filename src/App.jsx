import { useState } from 'react'
import BottomNav from './components/BottomNav'
import Sidebar from './components/Sidebar'
import { IconMenu } from './components/Icons'
import { initialDebt, initialExpenses, initialGoals, month } from './data/mock'
import Dashboard from './pages/Dashboard'
import Deudas from './pages/Deudas'
import Objetivos from './pages/Objetivos'
import Presupuesto from './pages/Presupuesto'

export default function App() {
  const [page, setPage] = useState('dashboard')
  const [menuOpen, setMenuOpen] = useState(false)
  const [expenses, setExpenses] = useState(initialExpenses)
  const [goals, setGoals] = useState(initialGoals)
  const [income, setIncome] = useState(month.income)
  const [debt, setDebt] = useState(initialDebt)

  const updateExpense = (id, patch) =>
    setExpenses((current) =>
      current.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    )

  const removeExpense = (id) =>
    setExpenses((current) => current.filter((item) => item.id !== id))

  const addExpense = () =>
    setExpenses((current) => [
      ...current,
      {
        id: Date.now(),
        concept: '',
        budget: 0,
        paid: false,
        category: 'Otros',
      },
    ])

  const updateGoal = (id, patch) =>
    setGoals((current) =>
      current.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    )

  const removeGoal = (id) => setGoals((current) => current.filter((item) => item.id !== id))

  const addGoal = () =>
    setGoals((current) => [
      ...current,
      {
        id: Date.now(),
        concept: '',
        amount: 0,
        category: 'Ahorro',
        done: false,
      },
    ])

  const updateDebt = (patch) => setDebt((current) => ({ ...current, ...patch }))

  const updatePayment = (id, patch) =>
    setDebt((current) => ({
      ...current,
      payments: current.payments.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    }))

  const removePayment = (id) =>
    setDebt((current) => ({
      ...current,
      payments: current.payments.filter((item) => item.id !== id),
    }))

  const addPayment = () =>
    setDebt((current) => {
      const last = current.payments.map((item) => item.date).sort().pop()
      const next = last ? new Date(`${last}T00:00:00`) : new Date()
      if (last) next.setDate(next.getDate() + 15)
      const date = [
        next.getFullYear(),
        String(next.getMonth() + 1).padStart(2, '0'),
        String(next.getDate()).padStart(2, '0'),
      ].join('-')
      const amount = current.payments.at(-1)?.amount ?? 0
      return {
        ...current,
        payments: [...current.payments, { id: Date.now(), date, amount, paid: false }],
      }
    })

  const reset = () => {
    setExpenses(initialExpenses)
    setGoals(initialGoals)
    setIncome(month.income)
    setDebt(initialDebt)
  }

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
          <div key={page}>
            {page === 'dashboard' && (
              <Dashboard expenses={expenses} goals={goals} onNavigate={setPage} />
            )}
            {page === 'presupuesto' && (
              <Presupuesto
                expenses={expenses}
                goals={goals}
                income={income}
                onIncomeChange={setIncome}
                onUpdate={updateExpense}
                onRemove={removeExpense}
                onAdd={addExpense}
                onReset={reset}
                onNavigate={setPage}
              />
            )}
            {page === 'deudas' && (
              <Deudas
                debt={debt}
                onDebtChange={updateDebt}
                onUpdatePayment={updatePayment}
                onRemovePayment={removePayment}
                onAddPayment={addPayment}
                onReset={reset}
              />
            )}
            {page === 'objetivos' && (
              <Objetivos
                goals={goals}
                onUpdate={updateGoal}
                onRemove={removeGoal}
                onAdd={addGoal}
                onReset={reset}
              />
            )}
          </div>
        </main>
      </div>

      <BottomNav page={page} onNavigate={setPage} />
    </div>
  )
}
