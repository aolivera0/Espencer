import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from 'firebase/firestore'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { db } from '../lib/firebase'

const WRITE_DELAY = 500

// Lista en tiempo real de una subcolección. Las ediciones se ven al instante
// y se agrupan en una sola escritura por documento para no escribir en cada tecla.
export default function useCollection(path) {
  const [snapshot, setSnapshot] = useState({ path: null, docs: [] })
  const [overlay, setOverlay] = useState({})
  const pending = useRef({})
  const timers = useRef({})

  const flush = useCallback(
    (target, id) => {
      const patch = pending.current[id]
      if (!patch) return
      delete pending.current[id]
      clearTimeout(timers.current[id])
      updateDoc(doc(db, target, id), patch)
        .catch((error) => console.error('No se pudo guardar el cambio', error))
        .finally(() => {
          if (pending.current[id]) return
          setOverlay((current) => {
            const next = { ...current }
            delete next[id]
            return next
          })
        })
    },
    [],
  )

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, path), orderBy('order')),
      (result) =>
        setSnapshot({
          path,
          docs: result.docs.map((item) => ({ id: item.id, ...item.data() })),
        }),
      (error) => console.error('No se pudo leer', path, error),
    )
    const queued = pending.current
    return () => {
      unsubscribe()
      Object.keys(queued).forEach((id) => flush(path, id))
    }
  }, [path, flush])

  const update = useCallback(
    (id, patch) => {
      pending.current[id] = { ...pending.current[id], ...patch }
      setOverlay((current) => ({ ...current, [id]: { ...current[id], ...patch } }))
      clearTimeout(timers.current[id])
      timers.current[id] = setTimeout(() => flush(path, id), WRITE_DELAY)
    },
    [path, flush],
  )

  const remove = useCallback(
    (id) => {
      delete pending.current[id]
      clearTimeout(timers.current[id])
      deleteDoc(doc(db, path, id)).catch((error) => console.error('No se pudo eliminar', error))
    },
    [path],
  )

  const add = useCallback(
    (data) =>
      addDoc(collection(db, path), { ...data, order: Date.now() }).catch((error) =>
        console.error('No se pudo agregar', error),
      ),
    [path],
  )

  const ready = snapshot.path === path
  const items = useMemo(
    () =>
      ready
        ? snapshot.docs.map((item) => (overlay[item.id] ? { ...item, ...overlay[item.id] } : item))
        : [],
    [ready, snapshot.docs, overlay],
  )

  return { items, ready, update, remove, add }
}
