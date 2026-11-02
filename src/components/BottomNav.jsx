import { IconCard, IconDashboard, IconReceipt, IconTarget } from './Icons'

const items = [
  { key: 'dashboard', label: 'Resumen', icon: IconDashboard },
  { key: 'presupuesto', label: 'Presupuesto', icon: IconReceipt },
  { key: 'objetivos', label: 'Objetivos', icon: IconTarget },
  { key: 'deudas', label: 'Deudas', icon: IconCard },
]

export default function BottomNav({ page, onNavigate }) {
  return (
    <nav
      aria-label="Navegación principal"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-white/[0.06] bg-[#0a0c11]/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden"
    >
      <ul className="grid grid-cols-4">
        {items.map(({ key, label, icon: Icon }) => {
          const active = page === key
          return (
            <li key={key}>
              <button
                type="button"
                onClick={() => onNavigate(key)}
                aria-current={active ? 'page' : undefined}
                className={`flex min-h-14 w-full flex-col items-center justify-center gap-1 text-[11px] font-medium transition ${
                  active ? 'text-emerald-300' : 'text-slate-500 active:text-slate-300'
                }`}
              >
                <Icon className="h-[22px] w-[22px]" />
                {label}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
