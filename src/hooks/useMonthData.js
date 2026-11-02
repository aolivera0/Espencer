import { doc, onSnapshot, setDoc } from 'firebase/firestore'
import { useCallback, useEffect, useRef, useState } from 'react'
import { db } from '../lib/firebase'
import useCollection from './useCollection'

const WRITE_DELAY = 500

function useIncome(path) {
  const [server, setServer] = useState({ path: null, value: 0 })
  const [draft, setDraft] = useState(null)
  const timer = useRef(null)
  const latest = useRef(null)

  useEffect(
    () =>
      onSnapshot(
        doc(db, path),
        (result) => setServer({ path, value: Number(result.data()?.income) || 0 }),
        (error) => console.error('No se pudo leer el ingreso', error),
      ),
    [path],
  )

  const save = useCallback(
    (value) => {
      setDraft({ path, value })
      latest.current = value
      clearTimeout(timer.current)
      timer.current = setTimeout(() => {
        setDoc(doc(db, path), { income: value }, { merge: true })
          .catch((error) => console.error('No se pudo guardar el ingreso', error))
          .finally(() => {
            if (latest.current === value) setDraft(null)
          })
      }, WRITE_DELAY)
    },
    [path],
  )

  const ready = server.path === path
  const value = draft && draft.path === path ? draft.value : server.value
  return { income: value, ready, setIncome: save }
}

// Datos de un mes: ingreso, gastos y objetivos de users/{uid}/months/{YYYY-MM}.
export default function useMonthData(uid, monthId) {
  const base = `users/${uid}/months/${monthId}`
  const expenses = useCollection(`${base}/expenses`)
  const goals = useCollection(`${base}/goals`)
  const { income, ready: incomeReady, setIncome } = useIncome(base)

  const loading = !(expenses.ready && goals.ready && incomeReady)
  const isEmpty = !loading && expenses.items.length === 0 && goals.items.length === 0 && income === 0

  return {
    loading,
    isEmpty,
    income,
    setIncome,
    expenses: expenses.items,
    updateExpense: expenses.update,
    removeExpense: expenses.remove,
    addExpense: () =>
      expenses.add({ concept: '', budget: 0, paid: false, category: 'Otros' }),
    goals: goals.items,
    updateGoal: goals.update,
    removeGoal: goals.remove,
    addGoal: () => goals.add({ concept: '', amount: 0, category: 'Ahorro', done: false }),
  }
}
