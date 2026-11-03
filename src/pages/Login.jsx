import DonutChart from '../components/DonutChart'
import { useAuth } from '../context/auth'
import { readInviteFromUrl } from '../lib/household'

const sample = [
  { name: 'Gastos', value: 49, stroke: 'stroke-rose-400' },
  { name: 'Objetivos', value: 41, stroke: 'stroke-violet-400' },
  { name: 'Libre', value: 10, stroke: 'stroke-sky-400' },
]

function GoogleMark() {
  return (
    <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.9 2.4 30.4 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.1 24.6c0-1.6-.1-3.1-.4-4.6H24v9.1h12.4c-.5 2.9-2.2 5.3-4.6 7l7.1 5.5c4.3-4 6.8-9.9 6.8-17z" />
      <path fill="#FBBC05" d="M10.5 28.7c-.5-1.4-.8-3-.8-4.7s.3-3.2.8-4.7l-7.9-6.1C.9 16.4 0 20.1 0 24s.9 7.6 2.6 10.8l7.9-6.1z" />
      <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.1-5.5c-2 1.4-4.9 2.3-8.8 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z" />
    </svg>
  )
}

export default function Login() {
  const { signIn, error } = useAuth()

  return (
    <main className="mx-auto grid min-h-svh w-full max-w-5xl items-center gap-12 px-6 py-12 lg:grid-cols-2 lg:px-10">
      <div className="max-w-md">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-400 text-sm font-extrabold text-[#06120d]">
            E
          </div>
          <p className="text-[15px] font-semibold tracking-tight text-white">Espencer</p>
        </div>

        <h1 className="mt-10 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Sabe a dónde se va tu plata cada mes
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-slate-400">
          Registra tus gastos, objetivos y deudas, y compara cómo te va frente a los meses anteriores.
        </p>

        {readInviteFromUrl() && (
          <p className="mt-6 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.06] px-3.5 py-2.5 text-[13px] text-emerald-200">
            Te invitaron a compartir gastos. Inicia sesión para unirte al hogar.
          </p>
        )}

        <button
          type="button"
          onClick={signIn}
          className="mt-8 inline-flex h-12 w-full items-center justify-center gap-3 rounded-xl bg-white px-5 text-[15px] font-semibold text-[#1f1f1f] transition hover:bg-slate-200 sm:w-auto"
        >
          <GoogleMark />
          Continuar con Google
        </button>

        {error && (
          <p role="alert" className="mt-4 rounded-xl border border-rose-400/20 bg-rose-400/[0.06] px-3.5 py-2.5 text-[13px] text-rose-200">
            {error}
          </p>
        )}

        <p className="mt-6 text-[12px] leading-relaxed text-slate-500">
          Usamos tu cuenta de Google solo para identificarte y guardar tus datos. Nadie más puede verlos.
        </p>
      </div>

      <div className="hidden lg:block" aria-hidden="true">
        <div className="mx-auto w-fit rounded-3xl border border-white/[0.06] bg-[#0f1117] p-8">
          <DonutChart segments={sample} label="Ejemplo de reparto del ingreso">
            <div>
              <p className="text-[12px] text-slate-500">Libre</p>
              <p className="mt-0.5 text-[19px] font-semibold tabular-nums text-white">10%</p>
            </div>
          </DonutChart>
        </div>
      </div>
    </main>
  )
}
