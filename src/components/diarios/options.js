export const paymentMethods = ['Nequi', 'Daviplata', 'Efectivo', 'Débito', 'Crédito', 'Transferencia']

export const dailyCategories = [
  'Mercado',
  'Comida',
  'Aseo',
  'Mascotas',
  'Hogar',
  'Transporte',
  'Salud',
  'Salidas',
  'Otros',
]

export const todayIso = () => {
  const now = new Date()
  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('-')
}
