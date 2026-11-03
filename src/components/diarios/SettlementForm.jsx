import { useState } from 'react'
import MoneyInput from '../MoneyInput'
import Chips from './Chips'

const input =
  'mt-1.5 w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 text-base text-slate-100 outline-none placeholder:text-slate-600 focus:border-emerald-400/40 [color-scheme:dark]'

export default function SettlementForm({ members, me, initial, nameOf, onSave, onDelete }) {
  const label = (id) => (id === me ? 'Yo' : nameOf(id))
  const others = members.filter((member) => member.id !== me)
  const [fromId, setFromId] = useState(initial?.fromId ?? others[0]?.id ?? me)
  const [toId, setToId] = useState(initial?.toId ?? me)
  const [amount, setAmount] = useState(initial?.amount ?? 0)
  const [date, setDate] = useState(initial?.date)
  const [note, setNote] = useState(initial?.note ?? '')
  const [error, setError] = useState('')

  const submit = (event) => {
    event.preventDefault()
    if (fromId === toId) return setError('Quien paga y quien recibe deben ser personas distintas.')
    if (amount <= 0) return setError('Escribe el valor del abono.')
    onSave({ fromId, toId, amount, date, note: note.trim() })
  }

  const options = members.map((member) => ({ value: member.id, label: label(member.id) }))

  return (
    <form onSubmit={submit} className="space-y-4">
      <Chips label="¿Quién paga?" value={fromId} onChange={setFromId} options={options} />
      <Chips label="¿Quién recibe?" value={toId} onChange={setToId} options={options} />

      <div className="grid gap-3 sm:grid-cols-[1fr_10rem]">
        <label className="block">
          <span className="text-[12px] text-slate-500">Valor</span>
          <MoneyInput
            value={amount}
            onChange={(next) => {
              setAmount(next)
              setError('')
            }}
            ariaLabel="Valor del abono"
            className={`${input} text-[18px] font-semibold tabular-nums`}
          />
        </label>
        <label className="block">
          <span className="text-[12px] text-slate-500">Fecha</span>
          <input type="date" value={date} onChange={(event) => setDate(event.target.value)} className={input} />
        </label>
      </div>

      <label className="block">
        <span className="text-[12px] text-slate-500">Nota</span>
        <input
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="Ej. Aporte quincenal"
          className={input}
        />
      </label>

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
            Eliminar abono
          </button>
        ) : (
          <span />
        )}
        <button
          type="submit"
          className="h-11 rounded-xl bg-emerald-400 px-5 text-[14px] font-semibold text-[#06120d] transition hover:bg-emerald-300"
        >
          {initial?.id ? 'Guardar cambios' : 'Registrar abono'}
        </button>
      </div>
    </form>
  )
}
