import { expenseCategories } from '../data/mock'
import ItemsTable from './ItemsTable'

export default function GastosTable({ expenses, onUpdate, onRemove }) {
  return (
    <ItemsTable
      items={expenses}
      categories={expenseCategories}
      nameLabel="Concepto"
      itemName="gasto"
      valueKey="budget"
      statusKey="paid"
      doneLabel="Pagado"
      emptyText="Aún no hay gastos este mes."
      onUpdate={onUpdate}
      onRemove={onRemove}
    />
  )
}
