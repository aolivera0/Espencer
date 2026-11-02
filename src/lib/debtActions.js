import { collection, doc, getDocs, writeBatch } from 'firebase/firestore'
import { db } from './firebase'

// Borra la deuda junto con todos sus abonos (Firestore no borra subcolecciones solo).
export async function deleteDebt(uid, debtId) {
  const base = `users/${uid}/debts/${debtId}`
  const payments = await getDocs(collection(db, `${base}/payments`))
  const batch = writeBatch(db)
  payments.docs.forEach((payment) => batch.delete(payment.ref))
  batch.delete(doc(db, base))
  await batch.commit()
}
