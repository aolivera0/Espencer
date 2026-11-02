import { onAuthStateChanged, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth'
import { useEffect, useMemo, useState } from 'react'
import { auth, googleProvider } from '../lib/firebase'
import { AuthContext } from './auth'

const ignoredErrors = ['auth/popup-closed-by-user', 'auth/cancelled-popup-request']

const messages = {
  'auth/popup-blocked': 'El navegador bloqueó la ventana de Google. Permite las ventanas emergentes e inténtalo de nuevo.',
  'auth/network-request-failed': 'No hay conexión. Revisa tu internet e inténtalo de nuevo.',
  'auth/unauthorized-domain': 'Este dominio no está autorizado en Firebase.',
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(
    () =>
      onAuthStateChanged(auth, (next) => {
        setUser(next)
        setLoading(false)
      }),
    [],
  )

  const value = useMemo(
    () => ({
      user,
      loading,
      error,
      signIn: async () => {
        setError('')
        try {
          await signInWithPopup(auth, googleProvider)
        } catch (cause) {
          if (ignoredErrors.includes(cause.code)) return
          setError(messages[cause.code] || 'No pudimos iniciar sesión con Google. Inténtalo de nuevo.')
        }
      },
      signOut: () => firebaseSignOut(auth),
    }),
    [user, loading, error],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
