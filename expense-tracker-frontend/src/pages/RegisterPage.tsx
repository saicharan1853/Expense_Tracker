import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuth()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      await register({ name, email, password })
      navigate('/login')
    } catch (err) {
      console.error(err)
      setError('Registration failed. Try a new email.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-md animate-slide-up">
      <form onSubmit={handleRegister} className="glass-panel">
        <div className="mb-8">
          <h2 className="text-4xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-blue-300">
            Create account
          </h2>
          <p className="text-white/70 mt-3 text-sm leading-relaxed">
            Start capturing expenses and insights instantly. Build better financial habits today.
          </p>
        </div>

        <div className="space-y-5">
          <label className="flex flex-col gap-2 text-sm">
            <span className="text-white/80 font-medium">Full name</span>
            <input
              type="text"
              placeholder="John Doe"
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
            />
          </label>

          <label className="flex flex-col gap-2 text-sm">
            <span className="text-white/80 font-medium">Email address</span>
            <input
              type="email"
              placeholder="you@email.com"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
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
            <span className="text-xs text-white/50 mt-1">
              Minimum 6 characters
            </span>
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
              Creating account...
            </span>
          ) : (
            'Register'
          )}
        </button>

        <p className="mt-7 text-center text-sm text-white/70 border-t border-white/10 pt-6">
          Already have an account?
          <Link
            to="/login"
            className="text-cyan-300 ml-2 underline hover:text-cyan-200 transition-colors"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  )
}