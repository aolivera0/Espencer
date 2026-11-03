// Grupo de opciones de una sola elección, cómodo para tocar en el celular.
export default function Chips({ label, options, value, onChange }) {
  return (
    <fieldset>
      <legend className="text-[12px] text-slate-500">{label}</legend>
      <div className="mt-1.5 flex flex-wrap gap-2" role="radiogroup" aria-label={label}>
        {options.map((option) => {
          const active = option.value === value
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(option.value)}
              className={`h-9 rounded-full border px-3.5 text-[13px] font-medium transition ${
                active
                  ? 'border-emerald-400/40 bg-emerald-400/15 text-emerald-200'
                  : 'border-white/[0.08] text-slate-300 hover:border-white/[0.16] hover:text-white'
              }`}
            >
              {option.label}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}
