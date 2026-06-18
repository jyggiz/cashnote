import { createContext, useContext, useEffect, useState } from 'react'

const TOKEN_KEY = 'cashnote_token'
const USERNAME_KEY = 'cashnote_username'

interface AuthContextValue {
  username: string | null
  isAdmin: boolean
  isLoading: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  getToken: () => string | null
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [username, setUsername] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem(USERNAME_KEY)
    const token = localStorage.getItem(TOKEN_KEY)
    if (stored && token) setUsername(stored)
    setIsLoading(false)
  }, [])

  async function login(user: string, password: string): Promise<void> {
    const res = await fetch('/.netlify/functions/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: user, password }),
    })
    if (!res.ok) {
      const data = (await res.json()) as { error?: string }
      throw new Error(data.error ?? 'Login failed')
    }
    const data = (await res.json()) as { token: string; username: string }
    localStorage.setItem(TOKEN_KEY, data.token)
    localStorage.setItem(USERNAME_KEY, data.username)
    setUsername(data.username)
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USERNAME_KEY)
    setUsername(null)
  }

  function getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY)
  }

  // Single shared account — logged in = admin
  const isAdmin = username !== null

  return (
    <AuthContext.Provider value={{ username, isAdmin, isLoading, login, logout, getToken }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
