// Reparto de un gasto entre miembros, en pesos enteros.
// mode: 'equal' (partes iguales), 'one' (todo para target) o 'custom' (montos a mano).
export function computeShares({ amount, memberIds, mode, target, payerId, custom = {} }) {
  if (mode === 'one') return { [target]: amount }
  if (mode === 'custom') {
    return Object.fromEntries(memberIds.map((id) => [id, Number(custom[id]) || 0]))
  }
  const base = Math.floor(amount / memberIds.length)
  const remainder = amount - base * memberIds.length
  const shares = Object.fromEntries(memberIds.map((id) => [id, base]))
  const extra = memberIds.includes(payerId) ? payerId : memberIds[0]
  shares[extra] += remainder
  return shares
}

// owes[a][b] = lo que a le debe a b, sumando partes pendientes y restando abonos.
export function computeOwes(expenses, settlements) {
  const owes = {}
  const add = (from, to, value) => {
    owes[from] ??= {}
    owes[from][to] = (owes[from][to] || 0) + value
  }
  expenses.forEach((expense) => {
    Object.entries(expense.shares || {}).forEach(([uid, share]) => {
      if (uid !== expense.payerId && !expense.settled?.[uid]) add(uid, expense.payerId, Number(share) || 0)
    })
  })
  settlements.forEach((item) => add(item.fromId, item.toId, -(Number(item.amount) || 0)))
  return owes
}

// Positivo: a le debe a b. Negativo: b le debe a a.
export const netBetween = (owes, a, b) => (owes[a]?.[b] || 0) - (owes[b]?.[a] || 0)

// Desglose como en la hoja: partes pendientes en cada sentido y abonos entre los dos.
export function pairDetail(expenses, settlements, me, other) {
  let iOwe = 0
  let theyOwe = 0
  expenses.forEach((expense) => {
    if (expense.payerId === other && !expense.settled?.[me]) iOwe += Number(expense.shares?.[me]) || 0
    if (expense.payerId === me && !expense.settled?.[other]) theyOwe += Number(expense.shares?.[other]) || 0
  })
  let paidByMe = 0
  let paidByThem = 0
  settlements.forEach((item) => {
    if (item.fromId === me && item.toId === other) paidByMe += Number(item.amount) || 0
    if (item.fromId === other && item.toId === me) paidByThem += Number(item.amount) || 0
  })
  return { iOwe, theyOwe, paidByMe, paidByThem, net: iOwe - paidByMe - (theyOwe - paidByThem) }
}
