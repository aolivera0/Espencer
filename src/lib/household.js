import {
  Timestamp,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore'
import { db } from './firebase'

const INVITE_DAYS = 7

const profile = (user) => ({
  nickname: user.displayName || user.email || 'Sin nombre',
  googleName: user.displayName || '',
  photoURL: user.photoURL || '',
})

export async function createHousehold(user, name) {
  const household = doc(collection(db, 'households'))
  const batch = writeBatch(db)
  batch.set(household, { name, createdBy: user.uid, createdAt: serverTimestamp() })
  batch.set(doc(db, `households/${household.id}/members/${user.uid}`), {
    ...profile(user),
    role: 'owner',
    joinedAt: serverTimestamp(),
  })
  batch.set(doc(db, `users/${user.uid}`), { householdId: household.id }, { merge: true })
  await batch.commit()
  return household.id
}

export async function createInvite(user, householdId, householdName, inviterName) {
  const invite = doc(collection(db, `households/${householdId}/invites`))
  const batch = writeBatch(db)
  batch.set(invite, {
    householdName,
    inviterName,
    createdBy: user.uid,
    createdAt: serverTimestamp(),
    expiresAt: Timestamp.fromMillis(Date.now() + INVITE_DAYS * 24 * 60 * 60 * 1000),
  })
  await batch.commit()
  return inviteLink(householdId, invite.id)
}

export const inviteLink = (householdId, token) =>
  `${window.location.origin}/?hogar=${householdId}&invitacion=${token}`

export const readInviteFromUrl = () => {
  const params = new URLSearchParams(window.location.search)
  const householdId = params.get('hogar')
  const token = params.get('invitacion')
  return householdId && token ? { householdId, token } : null
}

export const clearInviteFromUrl = () => {
  const url = new URL(window.location.href)
  url.searchParams.delete('hogar')
  url.searchParams.delete('invitacion')
  window.history.replaceState(null, '', url.pathname + url.search + url.hash)
}

// Devuelve los datos de la invitación o un motivo por el que no sirve.
export async function loadInvite({ householdId, token }) {
  const snap = await getDoc(doc(db, `households/${householdId}/invites/${token}`)).catch(() => null)
  if (!snap?.exists()) return { status: 'missing' }
  const data = snap.data()
  if (data.expiresAt.toMillis() < Date.now()) return { status: 'expired', ...data }
  return { status: 'valid', ...data }
}

export async function joinHousehold(user, { householdId, token }) {
  const batch = writeBatch(db)
  batch.set(doc(db, `households/${householdId}/members/${user.uid}`), {
    ...profile(user),
    role: 'member',
    invite: token,
    joinedAt: serverTimestamp(),
  })
  batch.set(doc(db, `users/${user.uid}`), { householdId }, { merge: true })
  await batch.commit()
}

export async function leaveHousehold(uid, householdId) {
  const batch = writeBatch(db)
  batch.delete(doc(db, `households/${householdId}/members/${uid}`))
  batch.set(doc(db, `users/${uid}`), { householdId: null }, { merge: true })
  await batch.commit()
}

export async function forgetHousehold(uid) {
  const batch = writeBatch(db)
  batch.set(doc(db, `users/${uid}`), { householdId: null }, { merge: true })
  await batch.commit()
}

export async function removeMember(householdId, uid) {
  const batch = writeBatch(db)
  batch.delete(doc(db, `households/${householdId}/members/${uid}`))
  await batch.commit()
}

export async function revokeInvite(householdId, token) {
  const batch = writeBatch(db)
  batch.delete(doc(db, `households/${householdId}/invites/${token}`))
  await batch.commit()
}
