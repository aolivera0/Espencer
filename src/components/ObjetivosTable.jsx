import { goalCategories } from '../data/mock'
import ItemsTable from './ItemsTable'

export default function ObjetivosTable({ goals, onUpdate, onRemove }) {
  return (
    <ItemsTable
      items={goals}
      categories={goalCategories}
      nameLabel="Objetivo"
      itemName="objetivo"
      valueKey="amount"
      statusKey="done"
      doneLabel="Cumplido"
      emptyText="Aún no hay objetivos este mes."
      onUpdate={onUpdate}
      onRemove={onRemove}
    />
  )
}
