import { createContext, useContext } from 'react'

export const ConfirmContext = createContext(null)

// confirm({ title, message, confirmLabel }) devuelve una promesa con true o false.
export function useConfirm() {
  const value = useContext(ConfirmContext)
  if (!value) throw new Error('useConfirm debe usarse dentro de ConfirmProvider')
  return value
}
