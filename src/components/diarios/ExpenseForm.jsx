import { useState } from 'react'
import { formatMoney } from '../../data/mock'
import { computeShares } from '../../lib/sharedBalance'
import MoneyInput from '../MoneyInput'
import Chips from './Chips'
import { dailyCategories, paymentMethods } from './options'

const input =
  'mt-1.5 w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 text-base text-slate-100 outline-none placeholder:text-slate-600 focus:border-emerald-400/40 [color-scheme:dark]'

export default function ExpenseForm({ members, me, defaultDate, initial, nameOf, onSave, onDelete }) {
  const memberIds = members.map((member) => member.id)
  const [date, setDate] = useState(initial?.date ?? defaultDate)
  const [concept, setConcept] = useState(initial?.concept ?? '')
  const [amount, setAmount] = useState(initial?.amount ?? 0)
  const [payerId, setPayerId] = useState(initial?.payerId ?? me)
  const [method, setMethod] = useState(initial?.method ?? 'Nequi')
  const [category, setCategory] = useState(initial?.category ?? 'Mercado')
  const [mode, setMode] = useState(initial?.splitMode ?? (memberIds.length > 1 ? 'equal' : 'one'))
  const [target, setTarget] = useState(initial?.splitTarget ?? me)
  const [custom, setCustom] = useState(initial?.splitMode === 'custom' ? initial.shares : {})
  const [error, setError] = useState('')

  const splitOptions = [
    ...(memberIds.length > 1
      ? [{ value: 'equal', label: memberIds.length === 2 ? 'Mitad y mitad' : 'Partes iguales' }]
      : []),
    ...members.map((member) => ({
      value: `one:${member.id}`,
      label: member.id === me ? 'Solo mío' : `Solo de ${nameOf(member.id)}`,
    })),
    ...(memberIds.length > 1 ? [{ value: 'custom', label: 'Personalizado' }] : []),
  ]
  const splitValue = mode === 'one' ? `one:${target}` : mode

  const customTotal = memberIds.reduce((sum, id) => sum + (Number(custom[id]) || 0), 0)

  const submit = (event) => {
    event.preventDefault()
    if (amount <= 0) return setError('Escribe el valor del gasto.')
    if (mode === 'custom' && customTotal !== amount) {
      return setError(`Las partes suman ${formatMoney(customTotal)} y deben sumar ${formatMoney(amount)}.`)
    }
    const shares = computeShares({ amount, memberIds, mode, target, payerId, custom })
    const settled = Object.fromEntries(
      Object.entries(initial?.settled ?? {}).filter(([id]) => id in shares && id !== payerId),
    )
    onSave({
      date,
      concept: concept.trim(),
      amount,
      payerId,
      method,
      category,
      splitMode: mode,
      splitTarget: mode === 'one' ? target : null,
      shares,
      settled,
    })
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-[1fr_10rem]">
        <label className="block">
          <span className="text-[12px] text-slate-500">Concepto</span>
          <input
            value={concept}
            onChange={(event) => setConcept(event.target.value)}
            placeholder="Ej. Compra Ara"
            className={input}
          />
        </label>
        <label className="block">
          <span className="text-[12px] text-slate-500">Fecha</span>
          <input type="date" value={date} onChange={(event) => setDate(event.target.value)} className={input} />
        </label>
      </div>

      <label className="block">
        <span className="text-[12px] text-slate-500">Valor</span>
        <MoneyInput
          value={amount}
          onChange={(next) => {
            setAmount(next)
            setError('')
          }}
          ariaLabel="Valor del gasto"
          className={`${input} text-[18px] font-semibold tabular-nums`}
        />
      </label>

      {members.length > 1 && (
        <Chips
          label="¿Quién pagó?"
          value={payerId}
          onChange={setPayerId}
          options={members.map((member) => ({
            value: member.id,
            label: member.id === me ? 'Yo' : nameOf(member.id),
          }))}
        />
      )}

      <Chips
        label="Método de pago"
        value={method}
        onChange={setMethod}
        options={paymentMethods.map((value) => ({ value, label: value }))}
      />

      <Chips
        label="¿De quién es el gasto?"
        value={splitValue}
        onChange={(value) => {
          setError('')
          if (value.startsWith('one:')) {
            setMode('one')
            setTarget(value.slice(4))
          } else {
            setMode(value)
          }
        }}
        options={splitOptions}
      />

      {mode === 'custom' && (
        <div className="space-y-2 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
          {members.map((member) => (
            <label key={member.id} className="flex items-center justify-between gap-3">
              <span className="text-[13px] text-slate-300">
                {member.id === me ? 'Mi parte' : `Parte de ${nameOf(member.id)}`}
              </span>
              <MoneyInput
                value={custom[member.id] || 0}
                onChange={(next) => {
                  setCustom((current) => ({ ...current, [member.id]: next }))
                  setError('')
                }}
                ariaLabel={`Parte de ${nameOf(member.id)}`}
                className="w-36 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-right text-base tabular-nums text-white outline-none focus:border-emerald-400/40"
              />
            </label>
          ))}
          <p className={`text-right text-[12px] ${customTotal === amount ? 'text-slate-500' : 'text-amber-300'}`}>
            Suman {formatMoney(customTotal)} de {formatMoney(amount)}
          </p>
        </div>
      )}

      <Chips
        label="Categoría"
        value={category}
        onChange={setCategory}
        options={dailyCategories.map((value) => ({ value, label: value }))}
      />

      {error && (
        <p role="alert" className="rounded-xl border border-rose-400/20 bg-rose-400/[0.06] px-3.5 py-2.5 text-[13px] text-rose-200">
          {error}
        </p>
      )}

      <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:items-center sm:justify-between">
        {onDelete ? (
          <button
            type="button"
            onClick={onDelete}
            className="h-11 rounded-xl px-4 text-[13px] font-medium text-rose-300 transition hover:bg-rose-400/10"
          >
            Eliminar gasto
          </button>
        ) : (
          <span />
        )}
        <button
          type="submit"
          className="h-11 rounded-xl bg-emerald-400 px-5 text-[14px] font-semibold text-[#06120d] transition hover:bg-emerald-300"
        >
          {initial ? 'Guardar cambios' : 'Registrar gasto'}
        </button>
      </div>
    </form>
  )
}
