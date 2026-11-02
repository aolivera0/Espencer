const pad = (value) => String(value).padStart(2, '0')

const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1)

export const currentMonthId = () => {
  const now = new Date()
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}`
}

export const shiftMonth = (id, delta) => {
  const [year, month] = id.split('-').map(Number)
  const date = new Date(year, month - 1 + delta, 1)
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}`
}

export const describeMonth = (id) => {
  const [year, month] = id.split('-').map(Number)
  const date = new Date(year, month - 1, 1)
  return {
    id,
    year,
    label: capitalize(date.toLocaleDateString('es-CO', { month: 'long' })),
    short: capitalize(date.toLocaleDateString('es-CO', { month: 'short' }).replace('.', '')),
  }
}
