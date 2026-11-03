import { collection, doc, onSnapshot } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { db } from '../lib/firebase'

// Hogar compartido del usuario: users/{uid}.householdId -> households/{hid} y sus miembros.
export default function useHousehold(uid) {
  const [link, setLink] = useState({ uid: null, householdId: null })
  const [household, setHousehold] = useState({ id: null, data: null, error: null })
  const [members, setMembers] = useState({ id: null, items: [] })

  // Solo se usa el householdId confirmado por el servidor: si se escucha el hogar mientras
  // la creación o la unión aún están pendientes, Firestore niega la lectura (todavía no es miembro).
  useEffect(
    () =>
      onSnapshot(
        doc(db, `users/${uid}`),
        { includeMetadataChanges: true },
        (snap) => {
          if (snap.metadata.hasPendingWrites) return
          setLink({ uid, householdId: snap.data()?.householdId || null })
        },
        (error) => {
          console.error('No se pudo leer el usuario', error)
          setLink({ uid, householdId: null })
        },
      ),
    [uid],
  )

  const householdId = link.uid === uid ? link.householdId : undefined

  useEffect(() => {
    if (!householdId) return undefined
    const stopHousehold = onSnapshot(
      doc(db, `households/${householdId}`),
      (snap) => setHousehold({ id: householdId, data: snap.data() || null, error: null }),
      (error) => setHousehold({ id: householdId, data: null, error: error.code }),
    )
    const stopMembers = onSnapshot(
      collection(db, `households/${householdId}/members`),
      (snap) =>
        setMembers({
          id: householdId,
          items: snap.docs
            .map((item) => ({ id: item.id, ...item.data() }))
            .sort((a, b) => (a.role === 'owner' ? -1 : b.role === 'owner' ? 1 : 0)),
        }),
      () => setMembers({ id: householdId, items: [] }),
    )
    return () => {
      stopHousehold()
      stopMembers()
    }
  }, [householdId])

  if (householdId === undefined) return { loading: true }
  if (householdId === null) return { loading: false, householdId: null }
  const ready = household.id === householdId && members.id === householdId
  if (!ready) return { loading: true }
  // Si ya no es miembro, Firestore niega la lectura: lo tratamos como "sacado del hogar".
  if (household.error) return { loading: false, householdId, removed: true }
  return {
    loading: false,
    householdId,
    household: household.data,
    members: members.items,
  }
}
