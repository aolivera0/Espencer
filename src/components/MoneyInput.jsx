import { useState } from 'react'
import { formatMoney } from '../data/mock'

export default function MoneyInput({ value, onChange, className = '', ariaLabel }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')

  const handleFocus = (event) => {
    setEditing(true)
    setDraft(String(value || ''))
    const input = event.target
    requestAnimationFrame(() => input.select())
  }

  const handleChange = (event) => {
    const digits = event.target.value.replace(/\D/g, '')
    setDraft(digits)
    onChange(Number(digits || 0))
  }

  return (
    <input
      type="text"
      inputMode="numeric"
      aria-label={ariaLabel}
      value={editing ? draft : formatMoney(value)}
      onFocus={handleFocus}
      onChange={handleChange}
      onBlur={() => setEditing(false)}
      className={className}
    />
  )
}
