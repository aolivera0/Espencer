import { useConfirm } from '../context/confirm'
import { formatDate, formatMoney } from '../data/mock'
import { IconTrash } from './Icons'
import MoneyInput from './MoneyInput'
import { StatusButton } from './Status'

const columns = 'md:grid-cols-[11rem_minmax(0,1fr)_minmax(0,1fr)_8.5rem_2.5rem]'

const field =
  'w-full rounded-lg border border-transparent bg-transparent px-2 py-2 text-base font-medium text-slate-100 outline-none transition hover:border-white/[0.06] focus:border-emerald-400/40 focus:bg-white/[0.03] md:py-1.5 md:text-[13px]'

export default function DebtTable({ rows, onUpdate, onRemove }) {
  const confirm = useConfirm()

  const askRemove = async (row) => {
    const accepted = await confirm({
      title: '¿Eliminar este abono?',
      message: `Se eliminará el abono del ${formatDate(row.date)} por ${formatMoney(row.amount)}. También desaparecerá de Objetivos. No se puede deshacer.`,
    })
    if (accepted) onRemove(row.id)
  }

  return (
    <div>
      <div
        className={`hidden gap-4 px-2 pb-3 text-[12px] font-medium text-slate-500 md:grid ${columns}`}
      >
        <span>Fecha</span>
        <span className="text-right">Valor abono</span>
        <span className="text-right">Restante</span>
        <span>Estado</span>
        <span />
      </div>

      <ul className="space-y-3 md:space-y-0">
        {rows.map((row) => (
          <li
            key={row.id}
            className={`group relative grid grid-cols-2 items-center gap-x-3 gap-y-2.5 rounded-xl border border-white/[0.05] bg-white/[0.02] p-3 transition md:gap-4 md:rounded-none md:border-0 md:border-t md:bg-transparent md:px-2 md:py-3 md:hover:bg-white/[0.02] ${columns}`}
          >
            <input
              type="date"
              value={row.date}
              onChange={(event) => onUpdate(row.id, { date: event.target.value })}
              aria-label="Fecha del abono"
              className={`${field} col-span-2 pr-11 [color-scheme:dark] md:col-span-1 md:pr-2`}
            />

            <div>
              <span className="px-2 text-[12px] text-slate-500 md:hidden">Abono</span>
              <div className="flex items-center justify-end rounded-lg border border-transparent px-2 py-1 transition hover:border-white/[0.06] focus-within:border-emerald-400/40 focus-within:bg-white/[0.03] md:py-1.5">
                <MoneyInput
                  value={row.amount}
                  onChange={(next) => onUpdate(row.id, { amount: next })}
                  ariaLabel="Valor del abono"
                  className="w-full min-w-0 bg-transparent py-1 text-right text-base font-semibold tabular-nums text-white outline-none md:py-0 md:text-[13px]"
                />
              </div>
            </div>

            <div className="min-w-0 px-2 text-right">
              <span className="block text-[12px] text-slate-500 md:hidden">Restante</span>
              <p
                className={`py-1 text-base font-semibold tabular-nums md:py-0 md:text-[13px] ${
                  row.balance <= 0 ? 'text-emerald-300' : 'text-slate-300'
                }`}
              >
                {formatMoney(row.balance)}
              </p>
            </div>

            <div className="col-span-2 md:col-span-1">
              <StatusButton
                done={row.paid}
                doneLabel="Pagado"
                onToggle={() => onUpdate(row.id, { paid: !row.paid })}
                className="w-full justify-center md:w-auto md:justify-start"
              />
            </div>

            <button
              type="button"
              onClick={() => askRemove(row)}
              className="absolute right-2 top-2 grid h-9 w-9 place-items-center rounded-lg text-slate-500 transition hover:bg-rose-400/10 hover:text-rose-300 focus:opacity-100 md:static md:h-8 md:w-8 md:justify-self-end md:text-slate-600 md:opacity-0 md:group-hover:opacity-100"
              aria-label="Eliminar abono"
            >
              <IconTrash />
            </button>
          </li>
        ))}
      </ul>

      {rows.length === 0 && (
        <p className="py-10 text-center text-[13px] text-slate-500">
          Aún no hay abonos. Agrega el primero para ver cómo baja la deuda.
        </p>
      )}
    </div>
  )
}
