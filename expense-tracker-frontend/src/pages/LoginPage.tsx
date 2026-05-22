import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      await login({ email, password })
      navigate('/dashboard')
    } catch (err) {
      console.error(err)
      setError('Invalid credentials. Try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-md animate-slide-up">
      <form onSubmit={handleSubmit} className="glass-panel">
        <div className="mb-8">
          <h2 className="text-4xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-blue-300">
            Welcome back
          </h2>
          <p className="text-white/70 mt-3 text-sm leading-relaxed">
            Sign in to access your expense dashboard and manage your finances.
          </p>
        </div>

        <div className="space-y-5">
          <label className="flex flex-col gap-2 text-sm">
            <span className="text-white/80 font-medium">Email address</span>
            <input
              type="email"
              placeholder="you@email.com"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </label>

          <label className="flex flex-col gap-2 text-sm">
            <span className="text-white/80 font-medium">Password</span>
            <input
              type="password"
              placeholder="••••••••"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </label>
        </div>

        {error ? (
          <p className="mt-5 text-sm text-rose-200 bg-rose-500/10 border border-rose-500/20 rounded-lg p-3 animate-pulse">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          className="mt-7 w-full btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin">⟳</span>
              Signing in...
            </span>
          ) : (
            'Login'
          )}
        </button>

        <p className="mt-7 text-center text-sm text-white/70 border-t border-white/10 pt-6">
          New here?
          <Link
            to="/register"
            className="text-cyan-300 ml-2 underline hover:text-cyan-200 transition-colors"
          >
            Create an account
          </Link>
        </p>
      </form>
    </div>
  )
}