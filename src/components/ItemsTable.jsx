import { useConfirm } from '../context/confirm'
import { formatDate, formatMoney } from '../data/mock'
import { IconCard, IconTrash } from './Icons'
import MoneyInput from './MoneyInput'
import Select from './Select'
import { StatusButton } from './Status'

const columns = 'md:grid-cols-[minmax(0,1.6fr)_9.5rem_11rem_8.5rem_2.5rem]'

const field =
  'rounded-lg border border-transparent bg-transparent px-2 py-2 text-base font-medium text-slate-100 outline-none transition placeholder:text-slate-600 hover:border-white/[0.06] focus:border-emerald-400/40 focus:bg-white/[0.03] md:py-1.5 md:text-[13px]'

const row =
  'group relative grid grid-cols-2 items-center gap-x-3 gap-y-2.5 rounded-xl border border-white/[0.05] bg-white/[0.02] p-3 transition md:gap-4 md:rounded-none md:border-0 md:border-t md:bg-transparent md:px-2 md:py-3 md:hover:bg-white/[0.02]'

export default function ItemsTable({
  items,
  categories,
  nameLabel,
  itemName,
  valueKey,
  statusKey,
  doneLabel,
  emptyText,
  onUpdate,
  onRemove,
}) {
  const confirm = useConfirm()

  const askRemove = async (item) => {
    const accepted = await confirm({
      title: `¿Eliminar ${item.concept || itemName}?`,
      message: `Se eliminará este ${itemName} del mes. No se puede deshacer.`,
    })
    if (accepted) onRemove(item.id)
  }

  return (
    <div>
      <div
        className={`hidden gap-4 px-2 pb-3 text-[12px] font-medium text-slate-500 md:grid ${columns}`}
      >
        <span>{nameLabel}</span>
        <span>Categoría</span>
        <span className="text-right">Valor</span>
        <span>Estado</span>
        <span />
      </div>

      <ul className="space-y-3 md:space-y-0">
        {items.map((item) =>
          item.linked ? (
            <li key={item.id} className={`${row} ${columns}`}>
              <div className="col-span-2 min-w-0 px-2 md:col-span-1">
                <p className="flex items-center gap-2 text-[14px] font-medium text-slate-100 md:text-[13px]">
                  <IconCard className="h-4 w-4 shrink-0 text-violet-300" />
                  <span className="truncate">{item.concept}</span>
                </p>
                <p className="mt-0.5 pl-6 text-[12px] text-slate-500">
                  Desde Deudas · {formatDate(item.date)}
                </p>
              </div>
              <p className="px-1 text-[14px] text-slate-300 md:px-2.5 md:text-[12px]">{item.category}</p>
              <p className="px-2 text-right text-[14px] font-semibold tabular-nums text-white md:text-[13px]">
                {formatMoney(item[valueKey])}
              </p>
              <div className="col-span-2 md:col-span-1">
                <StatusButton
                  done={item[statusKey]}
                  doneLabel={doneLabel}
                  onToggle={() => onUpdate(item.id, { [statusKey]: !item[statusKey] })}
                  className="w-full justify-center md:w-auto md:justify-start"
                />
              </div>
              <span className="hidden md:block" />
            </li>
          ) : (
            <li key={item.id} className={`${row} ${columns}`}>
              <input
                value={item.concept}
                onChange={(event) => onUpdate(item.id, { concept: event.target.value })}
                placeholder={`Nuevo ${itemName}`}
                aria-label={nameLabel}
                className={`${field} col-span-2 w-full pr-11 md:col-span-1 md:pr-2`}
              />

              <Select
                value={item.category}
                options={categories}
                label="Categoría"
                onChange={(category) => onUpdate(item.id, { category })}
              />

              <div className="flex items-center justify-end rounded-lg border border-transparent px-2 py-1 transition hover:border-white/[0.06] focus-within:border-emerald-400/40 focus-within:bg-white/[0.03] md:py-1.5">
                <MoneyInput
                  value={item[valueKey]}
                  onChange={(next) => onUpdate(item.id, { [valueKey]: next })}
                  ariaLabel={`Valor de ${item.concept || itemName}`}
                  className="w-full bg-transparent py-1 text-right text-base font-semibold tabular-nums text-white outline-none md:w-28 md:py-0 md:text-[13px]"
                />
              </div>

              <div className="col-span-2 md:col-span-1">
                <StatusButton
                  done={item[statusKey]}
                  doneLabel={doneLabel}
                  onToggle={() => onUpdate(item.id, { [statusKey]: !item[statusKey] })}
                  className="w-full justify-center md:w-auto md:justify-start"
                />
              </div>

              <button
                type="button"
                onClick={() => askRemove(item)}
                className="absolute right-2 top-2 grid h-9 w-9 place-items-center rounded-lg text-slate-500 transition hover:bg-rose-400/10 hover:text-rose-300 focus:opacity-100 md:static md:h-8 md:w-8 md:justify-self-end md:text-slate-600 md:opacity-0 md:group-hover:opacity-100"
                aria-label={`Eliminar ${item.concept || itemName}`}
              >
                <IconTrash />
              </button>
            </li>
          ),
        )}
      </ul>

      {items.length === 0 && (
        <p className="py-10 text-center text-[13px] text-slate-500">{emptyText}</p>
      )}
    </div>
  )
}
