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

export const formatDate = (iso) => {
  const [year, monthNumber, day] = String(iso).split('-').map(Number)
  if (!year) return ''
  return new Date(year, monthNumber - 1, day).toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

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
