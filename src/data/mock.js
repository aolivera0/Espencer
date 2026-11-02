export const money = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
})

export const formatMoney = (value) => money.format(Number(value) || 0)

export const formatPercent = (value) =>
  `${(Number(value) || 0).toFixed(2).replace('.', ',')}%`

export const month = {
  label: 'Agosto',
  year: 2026,
  income: 3750000,
}

export const expenseCategories = [
  'Vivienda',
  'Alimentación',
  'Movilidad',
  'Hogar',
  'Salud',
  'Conectividad',
  'Educación',
  'Entretenimiento',
  'Otros',
]

export const initialExpenses = [
  { id: 1, concept: 'Arriendo', budget: 900000, paid: true, category: 'Vivienda' },
  { id: 2, concept: 'Mercado', budget: 600000, paid: true, category: 'Alimentación' },
  { id: 3, concept: 'Transportes', budget: 120000, paid: false, category: 'Movilidad' },
  { id: 4, concept: 'Servicios', budget: 100000, paid: true, category: 'Hogar' },
  { id: 5, concept: 'Suplementos', budget: 60000, paid: false, category: 'Salud' },
  { id: 6, concept: 'Plan WOM', budget: 50000, paid: false, category: 'Conectividad' },
]

export const goalCategories = ['Ahorro', 'Inversión', 'Deudas']

export const initialGoals = [
  { id: 1, concept: 'Ahorro mensual', amount: 1550000, category: 'Ahorro', done: false },
  { id: 2, concept: 'Inversión mensual', amount: 0, category: 'Inversión', done: false },
  { id: 3, concept: 'Pago de deudas', amount: 0, category: 'Deudas', done: false },
]

export const pending = [
  { id: 1, concept: 'Creatina mayo', amount: 170000, due: 'Mayo' },
  { id: 2, concept: 'Entrega 2', amount: 200000, due: 'Próxima' },
  { id: 3, concept: 'Entrega 3', amount: 208000, due: 'Próxima' },
  { id: 4, concept: 'Matrícula 2026-2', amount: 2890000, due: '2026-2' },
]

export const initialDebt = {
  name: 'Deuda amortizada',
  total: 6678000,
  payments: [
    { id: 1, date: '2026-03-30', amount: 250000, paid: true },
    { id: 2, date: '2026-04-17', amount: 250000, paid: true },
  ],
}

export const formatDate = (iso) => {
  const [year, monthNumber, day] = String(iso).split('-').map(Number)
  if (!year) return ''
  return new Date(year, monthNumber - 1, day).toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

// Resumen de meses anteriores. Misma forma que tendrán los documentos mensuales en Firestore.
export const history = [
  {
    id: '2026-03',
    label: 'Mar',
    income: 3600000,
    byCategory: { Vivienda: 900000, Alimentación: 560000, Movilidad: 110000, Hogar: 95000, Salud: 50000, Conectividad: 50000 },
    goals: { Ahorro: 1200000, Inversión: 0, Deudas: 250000 },
  },
  {
    id: '2026-04',
    label: 'Abr',
    income: 3650000,
    byCategory: { Vivienda: 900000, Alimentación: 590000, Movilidad: 115000, Hogar: 100000, Salud: 60000, Conectividad: 50000 },
    goals: { Ahorro: 1300000, Inversión: 0, Deudas: 250000 },
  },
  {
    id: '2026-05',
    label: 'May',
    income: 3650000,
    byCategory: { Vivienda: 900000, Alimentación: 640000, Movilidad: 130000, Hogar: 105000, Conectividad: 50000, Educación: 200000 },
    goals: { Ahorro: 1300000, Inversión: 0, Deudas: 250000 },
  },
  {
    id: '2026-06',
    label: 'Jun',
    income: 3700000,
    byCategory: { Vivienda: 900000, Alimentación: 610000, Movilidad: 120000, Hogar: 98000, Salud: 60000, Conectividad: 50000 },
    goals: { Ahorro: 1450000, Inversión: 0, Deudas: 250000 },
  },
  {
    id: '2026-07',
    label: 'Jul',
    income: 3750000,
    byCategory: { Vivienda: 900000, Alimentación: 620000, Movilidad: 125000, Hogar: 102000, Salud: 60000, Conectividad: 50000 },
    goals: { Ahorro: 1500000, Inversión: 0, Deudas: 0 },
  },
]

const sum = (values) => Object.values(values).reduce((total, value) => total + value, 0)

export const summarizeMonth = ({ id, label, income, byCategory, goals }) => {
  const expenses = sum(byCategory)
  const goalsTotal = sum(goals)
  return {
    id,
    label,
    income,
    expenses,
    goals: goalsTotal,
    free: income - expenses - goalsTotal,
    byCategory,
  }
}
