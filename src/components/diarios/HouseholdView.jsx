import { doc, updateDoc } from 'firebase/firestore'
import { useState } from 'react'
import { useConfirm } from '../../context/confirm'
import { formatDate, formatMoney } from '../../data/mock'
import useCollection from '../../hooks/useCollection'
import { db } from '../../lib/firebase'
import { currentMonthId } from '../../lib/months'
import { pairDetail } from '../../lib/sharedBalance'
import { IconPlus } from '../Icons'
import Sheet from '../Sheet'
import { StatusBadge, StatusButton } from '../Status'
import Avatar from './Avatar'
import ExpenseForm from './ExpenseForm'
import MembersPanel from './MembersPanel'
import SettlementForm from './SettlementForm'
import { todayIso } from './options'

const card = 'rounded-2xl border border-white/[0.06] bg-[#0f1117] p-5'

const sum = (items, pick) => items.reduce((total, item) => total + (Number(pick(item)) || 0), 0)

function BalanceCard({ detail, me, other, nameOf, onSettle }) {
  const name = nameOf(other)
  const owed = Math.abs(detail.net)
  const headline =
    detail.net === 0
      ? `Tú y ${name} están a paz y salvo`
      : detail.net > 0
        ? `Le debes ${formatMoney(owed)} a ${name}`
        : `${name} te debe ${formatMoney(owed)}`

  const rows = [
    { label: `Tus partes pendientes con ${name}`, value: detail.iOwe },
    { label: `Partes de ${name} pendientes contigo`, value: detail.theyOwe },
    { label: `Abonos tuyos a ${name}`, value: detail.paidByMe },
    { label: `Abonos de ${name} a ti`, value: detail.paidByThem },
  ].filter((row) => row.value > 0)

  return (
    <section className={`${card} ${detail.net === 0 ? '' : detail.net > 0 ? 'border-amber-400/20' : 'border-emerald-400/20'}`}>
      <p className="text-[12px] text-slate-500">Balance acumulado</p>
      <p
        className={`mt-1 text-[22px] font-semibold tracking-tight sm:text-[26px] ${
          detail.net === 0 ? 'text-white' : detail.net > 0 ? 'text-amber-300' : 'text-emerald-300'
        }`}
      >
        {headline}
      </p>
      {rows.length > 0 && (
        <dl className="mt-4 space-y-1.5">
          {rows.map((row) => (
            <div key={row.label} className="flex items-center justify-between gap-3 text-[13px]">
              <dt className="text-slate-400">{row.label}</dt>
              <dd className="shrink-0 tabular-nums text-slate-200">{formatMoney(row.value)}</dd>
            </div>
          ))}
        </dl>
      )}
      {detail.net !== 0 && (
        <button
          type="button"
          onClick={() =>
            onSettle({
              fromId: detail.net > 0 ? me : other,
              toId: detail.net > 0 ? other : me,
              amount: owed,
              date: todayIso(),
              note: 'Saldo',
            })
          }
          className="mt-4 h-10 rounded-xl border border-white/[0.1] px-4 text-[13px] font-medium text-slate-200 transition hover:border-white/[0.2] hover:text-white"
        >
          Registrar pago para saldar
        </button>
      )}
    </section>
  )
}

export default function HouseholdView({ user, householdId, household, members, month }) {
  const me = user.uid
  const confirm = useConfirm()
  const expenses = useCollection(`households/${householdId}/expenses`)
  const settlements = useCollection(`households/${householdId}/settlements`)
  const [expenseSheet, setExpenseSheet] = useState(null)
  const [settlementSheet, setSettlementSheet] = useState(null)

  const byId = Object.fromEntries(members.map((member) => [member.id, member]))
  const nameOf = (id) => byId[id]?.nickname || 'Ex miembro'
  const shortName = (id) => (id === me ? 'Tú' : nameOf(id))
  const others = members.filter((member) => member.id !== me)
  const defaultDate = month.id === currentMonthId() ? todayIso() : `${month.id}-01`

  const monthExpenses = expenses.items
    .filter((item) => item.date?.startsWith(month.id))
    .sort((a, b) => b.date.localeCompare(a.date) || b.order - a.order)
  const monthSettlements = settlements.items
    .filter((item) => item.date?.startsWith(month.id))
    .sort((a, b) => b.date.localeCompare(a.date))
  const days = monthExpenses.reduce((groups, item) => {
    const last = groups.at(-1)
    if (last?.date === item.date) last.items.push(item)
    else groups.push({ date: item.date, items: [item] })
    return groups
  }, [])

  const total = sum(monthExpenses, (item) => item.amount)

  const toggleSettled = (expense, uid) =>
    updateDoc(doc(db, `households/${householdId}/expenses/${expense.id}`), {
      [`settled.${uid}`]: !expense.settled?.[uid],
    }).catch((error) => console.error('No se pudo actualizar el estado', error))

  const saveExpense = (data) => {
    if (expenseSheet?.id) expenses.update(expenseSheet.id, data)
    else expenses.add({ ...data, createdBy: me })
    setExpenseSheet(null)
  }

  const deleteExpense = async () => {
    const target = expenseSheet
    const accepted = await confirm({
      title: `¿Eliminar ${target.concept || 'este gasto'}?`,
      message: `Se eliminará el gasto de ${formatMoney(target.amount)} para todos los miembros del hogar. No se puede deshacer.`,
    })
    if (!accepted) return
    expenses.remove(target.id)
    setExpenseSheet(null)
  }

  const saveSettlement = (data) => {
    if (settlementSheet?.id) settlements.update(settlementSheet.id, data)
    else settlements.add({ ...data, createdBy: me })
    setSettlementSheet(null)
  }

  const deleteSettlement = async () => {
    const target = settlementSheet
    const accepted = await confirm({
      title: '¿Eliminar este abono?',
      message: `Se eliminará el abono de ${formatMoney(target.amount)} y el balance volverá a calcularse. No se puede deshacer.`,
    })
    if (!accepted) return
    settlements.remove(target.id)
    setSettlementSheet(null)
  }

  if (!expenses.ready || !settlements.ready) {
    return (
      <div className="grid h-64 place-items-center" role="status" aria-label="Cargando">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-emerald-400" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[13px] font-medium text-emerald-400/90">Gastos diarios · {household.name}</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-[28px]">
            Compras de {month.label.toLowerCase()}
          </h1>
          <div className="mt-2 flex items-center gap-2">
            <span className="flex -space-x-2">
              {members.map((member) => (
                <span key={member.id} className="rounded-full ring-2 ring-[#08090c]">
                  <Avatar member={member} size="h-7 w-7" />
                </span>
              ))}
            </span>
            <span className="text-[13px] text-slate-500">
              {others.length === 0
                ? 'Solo tú por ahora'
                : `Compartido con ${others.map((member) => member.nickname).join(', ')}`}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setExpenseSheet({})}
          className="hidden h-11 items-center gap-2 self-start rounded-xl bg-emerald-400 px-4 text-[14px] font-semibold text-[#06120d] transition hover:bg-emerald-300 sm:inline-flex sm:self-auto"
        >
          <IconPlus />
          Registrar gasto
        </button>
      </header>

      {others.length === 0 ? (
        <section className={card}>
          <p className="text-[15px] font-semibold text-white">Invita a alguien para dividir los gastos</p>
          <p className="mt-1 text-[13px] text-slate-500">
            Mientras estés solo, los gastos se registran como tuyos. Usa el botón Invitar en Miembros.
          </p>
        </section>
      ) : (
        <div className={`grid gap-4 ${others.length > 1 ? 'lg:grid-cols-2' : ''}`}>
          {others.map((other) => (
            <BalanceCard
              key={other.id}
              me={me}
              other={other.id}
              nameOf={nameOf}
              detail={pairDetail(expenses.items, settlements.items, me, other.id)}
              onSettle={(initial) => setSettlementSheet(initial)}
            />
          ))}
        </div>
      )}

      <section className="grid gap-3 sm:grid-cols-3 sm:gap-4">
        <div className={card}>
          <p className="text-[12px] text-slate-500">Total del mes</p>
          <p className="mt-1.5 text-[22px] font-semibold tabular-nums text-white">{formatMoney(total)}</p>
          <p className="mt-1 text-[12px] text-slate-500">
            {monthExpenses.length} {monthExpenses.length === 1 ? 'compra' : 'compras'}
          </p>
        </div>
        {members.map((member) => (
          <div key={member.id} className={card}>
            <p className="text-[12px] text-slate-500">{member.id === me ? 'Tu parte' : `Parte de ${member.nickname}`}</p>
            <p className="mt-1.5 text-[22px] font-semibold tabular-nums text-white">
              {formatMoney(sum(monthExpenses, (item) => item.shares?.[member.id]))}
            </p>
            <p className="mt-1 text-[12px] text-slate-500">
              Pagó {formatMoney(sum(monthExpenses.filter((item) => item.payerId === member.id), (item) => item.amount))}
            </p>
          </div>
        ))}
      </section>

      <section className={card}>
        <h2 className="text-[15px] font-semibold text-white">Compras del mes</h2>
        <p className="mt-0.5 text-[12px] text-slate-500">
          Marca la parte de cada uno cuando la devuelva. Toca una compra para editarla.
        </p>

        {days.length === 0 && (
          <div className="py-10 text-center">
            <p className="text-[13px] text-slate-500">Aún no hay compras en {month.label.toLowerCase()}.</p>
            <button
              type="button"
              onClick={() => setExpenseSheet({})}
              className="mt-4 inline-flex h-10 items-center gap-2 rounded-xl bg-emerald-400 px-4 text-[13px] font-semibold text-[#06120d] transition hover:bg-emerald-300"
            >
              <IconPlus />
              Registrar la primera
            </button>
          </div>
        )}

        <div className="mt-2 space-y-5">
          {days.map((day) => (
            <div key={day.date}>
              <h3 className="sticky top-14 z-10 -mx-1 bg-[#0f1117] px-1 py-2 text-[12px] font-medium text-slate-400 lg:top-0">
                {formatDate(day.date)} · {formatMoney(sum(day.items, (item) => item.amount))}
              </h3>
              <ul className="space-y-2">
                {day.items.map((item) => (
                  <li key={item.id} className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-3">
                    <button
                      type="button"
                      onClick={() => setExpenseSheet(item)}
                      className="flex w-full items-start justify-between gap-3 rounded-lg text-left"
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-[14px] font-medium text-slate-100">
                          {item.concept || 'Sin concepto'}
                        </span>
                        <span className="mt-0.5 block text-[12px] text-slate-500">
                          {item.category} · Pagó {item.payerId === me ? 'tú' : nameOf(item.payerId)} con {item.method}
                          {item.createdBy && item.createdBy !== item.payerId
                            ? ` · agregó ${item.createdBy === me ? 'tú' : nameOf(item.createdBy)}`
                            : ''}
                        </span>
                      </span>
                      <span className="shrink-0 text-[15px] font-semibold tabular-nums text-white">
                        {formatMoney(item.amount)}
                      </span>
                    </button>
                    {members.length > 1 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {Object.entries(item.shares || {})
                          .filter(([, share]) => share > 0)
                          .map(([uid, share]) => (
                            <div
                              key={uid}
                              className="flex items-center gap-2 rounded-full border border-white/[0.06] py-0.5 pl-3 pr-0.5"
                            >
                              <span className="text-[12px] text-slate-300">
                                {shortName(uid)} {formatMoney(share)}
                              </span>
                              {uid === item.payerId ? (
                                <StatusBadge done doneLabel="Pagó" />
                              ) : (
                                <StatusButton
                                  done={Boolean(item.settled?.[uid])}
                                  doneLabel="Pagado"
                                  onToggle={() => toggleSettled(item, uid)}
                                />
                              )}
                            </div>
                          ))}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {members.length > 1 && (
        <section className={card}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-[15px] font-semibold text-white">Abonos y aportes</h2>
              <p className="mt-0.5 text-[12px] text-slate-500">
                Pagos entre ustedes, como el aporte quincenal. Se descuentan del balance.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSettlementSheet({ date: defaultDate })}
              className="inline-flex h-10 items-center gap-2 self-start rounded-xl border border-white/[0.1] px-4 text-[13px] font-medium text-slate-200 transition hover:border-white/[0.2] hover:text-white"
            >
              <IconPlus />
              Registrar abono
            </button>
          </div>
          <ul className="mt-4 space-y-2">
            {monthSettlements.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => setSettlementSheet(item)}
                  className="flex w-full items-center justify-between gap-3 rounded-xl border border-white/[0.05] bg-white/[0.02] p-3 text-left"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-[14px] text-slate-100">
                      {shortName(item.fromId)} → {shortName(item.toId)}
                      {item.note ? ` · ${item.note}` : ''}
                    </span>
                    <span className="text-[12px] text-slate-500">{formatDate(item.date)}</span>
                  </span>
                  <span className="shrink-0 text-[14px] font-semibold tabular-nums text-emerald-300">
                    {formatMoney(item.amount)}
                  </span>
                </button>
              </li>
            ))}
            {monthSettlements.length === 0 && (
              <li className="py-4 text-center text-[13px] text-slate-500">Sin abonos en {month.label.toLowerCase()}.</li>
            )}
          </ul>
        </section>
      )}

      <MembersPanel
        user={user}
        householdId={householdId}
        household={household}
        members={members}
        nameOf={nameOf}
      />

      <button
        type="button"
        onClick={() => setExpenseSheet({})}
        className="fixed bottom-[calc(5rem+env(safe-area-inset-bottom))] right-4 z-20 grid h-14 w-14 place-items-center rounded-full bg-emerald-400 text-[#06120d] shadow-lg shadow-black/40 transition hover:bg-emerald-300 sm:hidden"
        aria-label="Registrar gasto"
      >
        <IconPlus className="h-6 w-6" />
      </button>

      <Sheet
        open={expenseSheet !== null}
        title={expenseSheet?.id ? 'Editar gasto' : 'Registrar gasto'}
        onClose={() => setExpenseSheet(null)}
      >
        <ExpenseForm
          key={expenseSheet?.id ?? 'nuevo'}
          members={members}
          me={me}
          nameOf={nameOf}
          defaultDate={defaultDate}
          initial={expenseSheet?.id ? expenseSheet : null}
          onSave={saveExpense}
          onDelete={expenseSheet?.id ? deleteExpense : null}
        />
      </Sheet>

      <Sheet
        open={settlementSheet !== null}
        title={settlementSheet?.id ? 'Editar abono' : 'Registrar abono'}
        onClose={() => setSettlementSheet(null)}
      >
        <SettlementForm
          key={settlementSheet?.id ?? 'nuevo'}
          members={members}
          me={me}
          nameOf={nameOf}
          initial={settlementSheet}
          onSave={saveSettlement}
          onDelete={settlementSheet?.id ? deleteSettlement : null}
        />
      </Sheet>
    </div>
  )
}
