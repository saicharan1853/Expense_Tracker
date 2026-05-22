import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  getProfile,
  loginUser,
  registerUser,
  type LoginPayload,
  type RegisterPayload,
} from '../services/auth.service'

type AuthUser = {
  id: number
  name: string
  email: string
}

type AuthContextValue = {
  user: AuthUser | null
  token: string | null
  isLoading: boolean
  login: (payload: LoginPayload) => Promise<void>
  register: (payload: RegisterPayload) => Promise<void>
  logout: () => void
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
)

const TOKEN_KEY = 'token'

export const AuthProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const [user, setUser] = useState<AuthUser | null>(
    null,
  )
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem(TOKEN_KEY),
  )
  const [isLoading, setIsLoading] = useState(true)

  const refreshProfile = async () => {
    if (!token) {
      setUser(null)
      return
    }

    try {
      const profile = await getProfile()
      setUser(profile)
    } catch (error) {
      console.error(error)
      localStorage.removeItem(TOKEN_KEY)
      setToken(null)
      setUser(null)
    }
  }

  useEffect(() => {
    const init = async () => {
      await refreshProfile()
      setIsLoading(false)
    }

    init()
  }, [token])

  const login = async (payload: LoginPayload) => {
    const result = await loginUser(payload)
    localStorage.setItem(TOKEN_KEY, result.accessToken)
    setToken(result.accessToken)
    await refreshProfile()
  }

  const register = async (payload: RegisterPayload) => {
    await registerUser(payload)
  }

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
    setUser(null)
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isLoading,
      login,
      register,
      logout,
      refreshProfile,
    }),
    [user, token, isLoading],
  )

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
