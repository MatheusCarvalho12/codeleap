import { useState, useEffect } from 'react'
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  type User,
} from 'firebase/auth'
import { auth, googleProvider, isFirebaseConfigured } from '../lib/firebase'

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!auth) {
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const unavailable = () => Promise.reject(new Error('Firebase authentication is not configured'))

  const signInWithGoogle = () =>
    auth && googleProvider ? signInWithPopup(auth, googleProvider) : unavailable()

  const signInWithEmail = (email: string, password: string) =>
    auth ? signInWithEmailAndPassword(auth, email, password) : unavailable()

  const signUpWithEmail = (email: string, password: string) =>
    auth ? createUserWithEmailAndPassword(auth, email, password) : unavailable()

  const signOut = () => (auth ? firebaseSignOut(auth) : Promise.resolve())

  return {
    user,
    loading,
    isAvailable: isFirebaseConfigured,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signOut,
  }
}
