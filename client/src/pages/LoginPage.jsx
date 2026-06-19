import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import api from '../services/api'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', form)
      login(data)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <p className="text-primary uppercase tracking-[0.3em] text-xs font-mono mb-4">PropSpace</p>
          <h1 className="font-display text-4xl font-bold text-on-surface">Welcome Back</h1>
          <p className="text-on-surface-variant mt-2">Access your exclusive portfolio</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card p-8 space-y-5">
          {error && (
            <div className="border border-error/40 bg-error/10 rounded-lg px-4 py-3 text-error text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="input-label">Email Address</label>
            <input
              type="email"
              className="input-field"
              placeholder="you@example.com"
              value={form.email}
              onChange={set('email')}
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label className="input-label">Password</label>
            <input
              type="password"
              className="input-field"
              placeholder="••••••••"
              value={form.password}
              onChange={set('password')}
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="btn-primary w-full"
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>

          <p className="text-center text-on-surface-variant text-sm">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-secondary hover:opacity-80 font-semibold transition-opacity">
              Register
            </Link>
          </p>
        </form>

        <p className="text-center text-on-surface-variant/40 text-xs mt-6">
          © 2026 PropSpace. All Rights Reserved.
        </p>
      </div>
    </div>
  )
}
