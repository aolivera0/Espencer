import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { db } from '../lib/firebase'
import { describeMonth, shiftMonth } from '../lib/months'

const sumBy = (items, key, field) =>
  items.reduce((acc, item) => {
    acc[item[key]] = (acc[item[key]] || 0) + Number(item[field] || 0)
    return acc
  }, {})

// Suma de los abonos de todas las deudas con fecha dentro del mes.
async function loadDebtPayments(uid, id) {
  const debts = await getDocs(collection(db, `users/${uid}/debts`))
  const start = `${id}-01`
  const end = `${shiftMonth(id, 1)}-01`
  const lists = await Promise.all(
    debts.docs.map((debt) =>
      getDocs(
        query(
          collection(db, `users/${uid}/debts/${debt.id}/payments`),
          where('date', '>=', start),
          where('date', '<', end),
        ),
      ),
    ),
  )
  return lists.reduce(
    (total, list) => total + list.docs.reduce((sum, item) => sum + (Number(item.data().amount) || 0), 0),
    0,
  )
}

async function loadMonth(uid, id) {
  const base = `users/${uid}/months/${id}`
  const [month, expenses, goals] = await Promise.all([
    getDoc(doc(db, base)),
    getDocs(collection(db, `${base}/expenses`)),
    getDocs(collection(db, `${base}/goals`)),
  ])
  const income = Number(month.data()?.income) || 0
  const debtPayments = await loadDebtPayments(uid, id)
  if (income === 0 && expenses.empty && goals.empty && debtPayments === 0) return null
  const goalTotals = sumBy(goals.docs.map((item) => item.data()), 'category', 'amount')
  if (debtPayments > 0) goalTotals.Deudas = (goalTotals.Deudas || 0) + debtPayments
  return {
    id,
    label: describeMonth(id).short,
    income,
    byCategory: sumBy(expenses.docs.map((item) => item.data()), 'category', 'budget'),
    goals: goalTotals,
  }
}

// Resumen de los meses anteriores que tienen datos (se omiten los vacíos).
export default function useHistory(uid, monthId, count = 5) {
  const [state, setState] = useState({ key: null, months: [] })
  const key = `${uid}/${monthId}`

  useEffect(() => {
    let cancelled = false
    const ids = Array.from({ length: count }, (_, index) => shiftMonth(monthId, index - count))
    Promise.all(ids.map((id) => loadMonth(uid, id)))
      .then((months) => {
        if (!cancelled) setState({ key, months: months.filter(Boolean) })
      })
      .catch((error) => {
        console.error('No se pudo cargar el historial', error)
        if (!cancelled) setState({ key, months: [] })
      })
    return () => {
      cancelled = true
    }
  }, [uid, monthId, count, key])

  return { loading: state.key !== key, months: state.key === key ? state.months : [] }
}
