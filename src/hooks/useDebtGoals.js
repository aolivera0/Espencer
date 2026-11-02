import { collection, doc, onSnapshot, query, updateDoc, where } from 'firebase/firestore'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { db } from '../lib/firebase'
import { shiftMonth } from '../lib/months'

// Los abonos de las deudas con fecha en el mes aparecen como objetivos de categoría "Deudas".
// El abono es la única fuente de verdad: marcarlo en cualquiera de los dos lados cambia el mismo dato.
export default function useDebtGoals(uid, monthId) {
  const [debts, setDebts] = useState({ uid: null, items: [] })
  const [payments, setPayments] = useState({})

  useEffect(
    () =>
      onSnapshot(
        collection(db, `users/${uid}/debts`),
        (snap) =>
          setDebts({
            uid,
            items: snap.docs.map((item) => ({ id: item.id, name: item.data().name || '' })),
          }),
        (error) => console.error('No se pudieron leer las deudas', error),
      ),
    [uid],
  )

  const ids = debts.items.map((debt) => debt.id).join(',')

  useEffect(() => {
    const start = `${monthId}-01`
    const end = `${shiftMonth(monthId, 1)}-01`
    const unsubscribes = (ids ? ids.split(',') : []).map((debtId) =>
      onSnapshot(
        query(
          collection(db, `users/${uid}/debts/${debtId}/payments`),
          where('date', '>=', start),
          where('date', '<', end),
        ),
        (snap) =>
          setPayments((current) => ({
            ...current,
            [`${monthId}/${debtId}`]: snap.docs.map((item) => ({ id: item.id, ...item.data() })),
          })),
        (error) => console.error('No se pudieron leer los abonos', error),
      ),
    )
    return () => unsubscribes.forEach((unsubscribe) => unsubscribe())
  }, [uid, monthId, ids])

  const goals = useMemo(
    () =>
      debts.items
        .flatMap((debt) =>
          (payments[`${monthId}/${debt.id}`] ?? []).map((payment) => ({
            id: `debt-${debt.id}-${payment.id}`,
            concept: `Abono · ${debt.name || 'Deuda sin nombre'}`,
            amount: Number(payment.amount) || 0,
            category: 'Deudas',
            done: Boolean(payment.paid),
            date: payment.date,
            linked: { debtId: debt.id, paymentId: payment.id },
          })),
        )
        .sort((a, b) => a.date.localeCompare(b.date)),
    [debts.items, payments, monthId],
  )

  const setDone = useCallback(
    (goal, done) =>
      updateDoc(doc(db, `users/${uid}/debts/${goal.linked.debtId}/payments/${goal.linked.paymentId}`), {
        paid: done,
      }).catch((error) => console.error('No se pudo actualizar el abono', error)),
    [uid],
  )

  return { goals, setDone }
}
