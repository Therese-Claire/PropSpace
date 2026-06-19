import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import api from '../services/api'

export default function RegisterPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) return setError('Passwords do not match')
    setLoading(true)
    try {
      const { data } = await api.post('/auth/register', {
        username: form.username,
        email:    form.email,
        password: form.password,
      })
      login(data)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <p className="text-primary uppercase tracking-[0.3em] text-xs font-mono mb-4">PropSpace</p>
          <h1 className="font-display text-4xl font-bold text-on-surface">Join the Elite</h1>
          <p className="text-on-surface-variant mt-2">Bespoke infrastructure for digital estates</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card p-8 space-y-5">
          {error && (
            <div className="border border-error/40 bg-error/10 rounded-lg px-4 py-3 text-error text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="input-label">Username</label>
            <input
              type="text"
              className="input-field"
              placeholder="Your handle"
              value={form.username}
              onChange={set('username')}
              required
              autoComplete="username"
            />
          </div>

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
              autoComplete="new-password"
            />
          </div>

          <div>
            <label className="input-label">Confirm Password</label>
            <input
              type="password"
              className="input-field"
              placeholder="••••••••"
              value={form.confirm}
              onChange={set('confirm')}
              required
              autoComplete="new-password"
            />
          </div>

          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>

          <p className="text-center text-on-surface-variant text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-secondary hover:opacity-80 font-semibold transition-opacity">
              Sign In
            </Link>
          </p>
        </form>

        <div className="flex justify-center gap-4 mt-6">
          <span className="chip">Network Active</span>
          <span className="chip">Secure Encryption v4.2</span>
        </div>
      </div>
    </div>
  )
}
