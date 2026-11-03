import { collection, doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { useConfirm } from '../../context/confirm'
import { db } from '../../lib/firebase'
import {
  createInvite,
  inviteLink,
  leaveHousehold,
  removeMember,
  revokeInvite,
} from '../../lib/household'
import { IconShare, IconTrash } from '../Icons'
import Avatar from './Avatar'

const expiry = (timestamp) =>
  timestamp?.toDate().toLocaleDateString('es-CO', { day: 'numeric', month: 'short' }) ?? ''

export default function MembersPanel({ user, householdId, household, members, nameOf }) {
  const me = user.uid
  const confirm = useConfirm()
  const [invites, setInvites] = useState({ id: null, items: [] })
  const [link, setLink] = useState('')
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState(false)
  const [nickname, setNickname] = useState(nameOf(me))
  const isOwner = household.createdBy === me

  useEffect(
    () =>
      onSnapshot(
        collection(db, `households/${householdId}/invites`),
        (snap) =>
          setInvites({
            id: householdId,
            items: snap.docs
              .map((item) => ({ id: item.id, ...item.data() }))
              .filter((item) => item.expiresAt && item.expiresAt.toMillis() > Date.now()),
          }),
        () => setInvites({ id: householdId, items: [] }),
      ),
    [householdId],
  )

  const saveNickname = () => {
    const next = nickname.trim()
    if (!next || next === nameOf(me)) return setNickname(nameOf(me))
    updateDoc(doc(db, `households/${householdId}/members/${me}`), { nickname: next }).catch((error) =>
      console.error('No se pudo guardar el apodo', error),
    )
  }

  const share = async (url) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Únete a mi hogar en Espencer',
          text: `${nameOf(me)} te invitó a ${household.name} para compartir los gastos diarios.`,
          url,
        })
        return
      } catch {
        // Si se cancela el menú de compartir, se puede copiar el enlace.
      }
    }
    await navigator.clipboard?.writeText(url)
    setNotice('Enlace copiado. Envíalo por WhatsApp o donde prefieras.')
  }

  const invite = async () => {
    setBusy(true)
    setNotice('')
    try {
      const url = await createInvite(user, householdId, household.name, nameOf(me))
      setLink(url)
      await share(url)
    } catch (error) {
      console.error(error)
      setNotice('No se pudo crear la invitación. Inténtalo de nuevo.')
    } finally {
      setBusy(false)
    }
  }

  const askRevoke = async (token) => {
    const accepted = await confirm({
      title: '¿Revocar esta invitación?',
      message: 'El enlace dejará de funcionar. Quien ya se unió seguirá en el hogar.',
      confirmLabel: 'Revocar',
    })
    if (!accepted) return
    if (link.endsWith(token)) setLink('')
    revokeInvite(householdId, token).catch((error) => console.error(error))
  }

  const askRemove = async (member) => {
    const accepted = await confirm({
      title: `¿Sacar a ${member.nickname} del hogar?`,
      message: 'Dejará de ver los gastos compartidos. Los gastos y abonos registrados se conservan.',
      confirmLabel: 'Sacar del hogar',
    })
    if (accepted) removeMember(householdId, member.id).catch((error) => console.error(error))
  }

  const askLeave = async () => {
    const accepted = await confirm({
      title: `¿Salir de ${household.name}?`,
      message:
        'Dejarás de ver los gastos compartidos. Para volver necesitarás una nueva invitación. Los registros se conservan para los demás.',
      confirmLabel: 'Salir del hogar',
    })
    if (accepted) leaveHousehold(me, householdId).catch((error) => console.error(error))
  }

  return (
    <section className="rounded-2xl border border-white/[0.06] bg-[#0f1117] p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-[15px] font-semibold text-white">Miembros de {household.name}</h2>
          <p className="mt-0.5 text-[12px] text-slate-500">Todos ven y editan los mismos gastos en tiempo real</p>
        </div>
        <button
          type="button"
          onClick={invite}
          disabled={busy}
          className="inline-flex h-10 items-center gap-2 self-start rounded-xl bg-emerald-400 px-4 text-[13px] font-semibold text-[#06120d] transition hover:bg-emerald-300 disabled:opacity-60"
        >
          <IconShare className="h-4 w-4" />
          Invitar
        </button>
      </div>

      <ul className="mt-4 divide-y divide-white/[0.05]">
        {members.map((member) => (
          <li key={member.id} className="flex items-center gap-3 py-3">
            <Avatar member={member} />
            <div className="min-w-0 flex-1">
              {member.id === me ? (
                <label className="block">
                  <span className="sr-only">Tu apodo</span>
                  <input
                    value={nickname}
                    onChange={(event) => setNickname(event.target.value)}
                    onBlur={saveNickname}
                    onKeyDown={(event) => event.key === 'Enter' && event.currentTarget.blur()}
                    className="w-full rounded-lg border border-transparent bg-transparent px-2 py-1.5 text-base font-medium text-slate-100 outline-none hover:border-white/[0.08] focus:border-emerald-400/40 md:text-[14px]"
                  />
                </label>
              ) : (
                <p className="truncate px-2 text-[14px] font-medium text-slate-100">{member.nickname}</p>
              )}
              <p className="px-2 text-[12px] text-slate-500">
                {member.id === me ? 'Tú · toca tu nombre para cambiar el apodo' : member.googleName}
                {member.role === 'owner' ? ' · Creador' : ''}
              </p>
            </div>
            {isOwner && member.id !== me && (
              <button
                type="button"
                onClick={() => askRemove(member)}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-slate-500 transition hover:bg-rose-400/10 hover:text-rose-300"
                aria-label={`Sacar a ${member.nickname} del hogar`}
              >
                <IconTrash />
              </button>
            )}
          </li>
        ))}
      </ul>

      {link && (
        <div className="mt-3 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.05] p-3">
          <p className="text-[12px] text-emerald-200/80">Enlace de invitación (vence en 7 días)</p>
          <div className="mt-2 flex gap-2">
            <input
              readOnly
              value={link}
              onFocus={(event) => event.target.select()}
              aria-label="Enlace de invitación"
              className="min-w-0 flex-1 rounded-lg border border-white/[0.08] bg-black/20 px-3 py-2 text-[13px] text-slate-200 outline-none"
            />
            <button
              type="button"
              onClick={() => share(link)}
              className="h-10 shrink-0 rounded-lg border border-white/[0.1] px-3 text-[13px] font-medium text-slate-200 transition hover:text-white"
            >
              Compartir
            </button>
          </div>
        </div>
      )}
      {notice && (
        <p role="status" className="mt-3 text-[13px] text-emerald-300">
          {notice}
        </p>
      )}

      {invites.items.length > 0 && (
        <div className="mt-4">
          <h3 className="text-[13px] font-medium text-slate-300">Invitaciones activas</h3>
          <ul className="mt-2 space-y-2">
            {invites.items.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.05] bg-white/[0.02] px-3 py-2"
              >
                <span className="text-[13px] text-slate-400">
                  Creada por {nameOf(item.createdBy)} · vence el {expiry(item.expiresAt)}
                </span>
                <span className="flex shrink-0 gap-1">
                  <button
                    type="button"
                    onClick={() => share(inviteLink(householdId, item.id))}
                    className="h-8 rounded-lg px-2.5 text-[12px] font-medium text-emerald-300 transition hover:bg-emerald-400/10"
                  >
                    Compartir
                  </button>
                  <button
                    type="button"
                    onClick={() => askRevoke(item.id)}
                    className="h-8 rounded-lg px-2.5 text-[12px] font-medium text-rose-300 transition hover:bg-rose-400/10"
                  >
                    Revocar
                  </button>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        type="button"
        onClick={askLeave}
        className="mt-5 text-[13px] font-medium text-slate-500 transition hover:text-rose-300"
      >
        Salir del hogar
      </button>
    </section>
  )
}
