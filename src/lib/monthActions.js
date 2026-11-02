import { collection, doc, getDoc, getDocs, orderBy, query, writeBatch } from 'firebase/firestore'
import { initialExpenses, initialGoals } from '../data/mock'
import { db } from './firebase'

const monthPath = (uid, id) => `users/${uid}/months/${id}`

export async function seedMonth(uid, monthId) {
  const base = monthPath(uid, monthId)
  const stamp = Date.now()
  const batch = writeBatch(db)
  batch.set(doc(db, base), { income: 3750000 }, { merge: true })
  initialExpenses.forEach(({ id: _id, ...item }, index) => {
    batch.set(doc(collection(db, `${base}/expenses`)), { ...item, order: stamp + index })
  })
  initialGoals.forEach(({ id: _id, ...item }, index) => {
    batch.set(doc(collection(db, `${base}/goals`)), { ...item, order: stamp + index })
  })
  await batch.commit()
}

// Copia ingreso, gastos y objetivos de otro mes, con todo marcado como pendiente.
export async function copyMonth(uid, fromId, toId) {
  const from = monthPath(uid, fromId)
  const to = monthPath(uid, toId)
  const [month, expenses, goals] = await Promise.all([
    getDoc(doc(db, from)),
    getDocs(query(collection(db, `${from}/expenses`), orderBy('order'))),
    getDocs(query(collection(db, `${from}/goals`), orderBy('order'))),
  ])
  const income = Number(month.data()?.income) || 0
  const copied = expenses.size + goals.size
  if (income === 0 && copied === 0) return 0

  const stamp = Date.now()
  const batch = writeBatch(db)
  batch.set(doc(db, to), { income }, { merge: true })
  expenses.docs.forEach((item, index) => {
    batch.set(doc(collection(db, `${to}/expenses`)), {
      ...item.data(),
      paid: false,
      order: stamp + index,
    })
  })
  goals.docs.forEach((item, index) => {
    batch.set(doc(collection(db, `${to}/goals`)), {
      ...item.data(),
      done: false,
      order: stamp + index,
    })
  })
  await batch.commit()
  return copied
}
