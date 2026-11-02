import {
  IconCard,
  IconClock,
  IconClose,
  IconDashboard,
  IconGift,
  IconReceipt,
  IconTarget,
} from './Icons'

const navItems = [
  { key: 'dashboard', label: 'Dashboard', icon: IconDashboard, enabled: true },
  { key: 'presupuesto', label: 'Presupuesto', icon: IconReceipt, enabled: true },
  { key: 'objetivos', label: 'Objetivos', icon: IconTarget, enabled: true },
  { key: 'deudas', label: 'Deudas', icon: IconCard, enabled: true },
  { key: 'pendientes', label: 'Pendientes', icon: IconClock, enabled: false },
  { key: 'prima', label: 'Prima', icon: IconGift, enabled: false },
]

function Brand() {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-400 text-sm font-extrabold text-[#06120d] shadow-lg shadow-emerald-500/10">
        E
      </div>
      <div className="leading-tight">
        <p className="text-[15px] font-semibold tracking-tight text-white">Espencer</p>
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
          Finanzas
        </p>
      </div>
    </div>
  )
}

export default function Sidebar({ page, onNavigate, open, onClose }) {
  const content = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-5 py-6">
        <Brand />
        <button
          type="button"
          onClick={onClose}
          className="grid h-9 w-9 place-items-center rounded-lg text-slate-400 transition hover:bg-white/5 hover:text-white lg:hidden"
          aria-label="Cerrar menú"
        >
          <IconClose />
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        <p className="px-3 pb-2 pt-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600">
          Menú
        </p>
        {navItems.map(({ key, label, icon: Icon, enabled }) => {
          const active = page === key
          return (
            <button
              key={key}
              type="button"
              disabled={!enabled}
              onClick={() => {
                if (!enabled) return
                onNavigate(key)
                onClose()
              }}
              className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                active
                  ? 'bg-white/[0.06] text-white shadow-inner shadow-white/[0.03]'
                  : enabled
                    ? 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-100'
                    : 'cursor-not-allowed text-slate-600'
              }`}
            >
              <span
                className={`grid h-8 w-8 place-items-center rounded-lg transition ${
                  active
                    ? 'bg-emerald-400/15 text-emerald-300'
                    : 'bg-white/[0.03] text-slate-500 group-hover:text-slate-300'
                }`}
              >
                <Icon className="h-[18px] w-[18px]" />
              </span>
              <span className="flex-1 text-left">{label}</span>
              {!enabled && (
                <span className="rounded-md border border-white/5 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-slate-600">
                  Pronto
                </span>
              )}
            </button>
          )
        })}
      </nav>

      <div className="px-3 pb-5">
        <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4">
          <p className="text-xs font-semibold text-slate-200">Modo maqueta</p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
            Los datos son de ejemplo y los cambios se pierden al recargar.
          </p>
        </div>
        <div className="mt-4 flex items-center gap-3 px-1">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-white/[0.06] text-xs font-semibold text-slate-200">
            AP
          </div>
          <div className="leading-tight">
            <p className="text-[13px] font-medium text-slate-200">Mi cuenta</p>
            <p className="text-[11px] text-slate-500">Plan personal</p>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-white/[0.06] bg-[#0a0c11]/90 backdrop-blur-xl lg:block">
        {content}
      </aside>

      <div
        className={`fixed inset-0 z-40 lg:hidden ${open ? '' : 'pointer-events-none'}`}
        aria-hidden={!open}
      >
        <div
          onClick={onClose}
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity ${
            open ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <aside
          className={`absolute inset-y-0 left-0 w-72 border-r border-white/[0.06] bg-[#0a0c11] transition-transform duration-300 ${
            open ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {content}
        </aside>
      </div>
    </>
  )
}
