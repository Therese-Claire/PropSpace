import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import useAuth from '../hooks/useAuth'
import Spinner from '../components/common/Spinner'

const FALLBACK = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&auto=format&fit=crop'

export default function DashboardPage() {
  const { user } = useAuth()
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    api.get('/properties/my', { signal: controller.signal })
      .then(({ data }) => setProperties(data))
      .catch(err => { if (err?.name !== 'CanceledError') console.error(err) })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this listing permanently?')) return
    setDeletingId(id)
    try {
      await api.delete(`/properties/${id}`)
      setProperties(prev => prev.filter(p => p._id !== id))
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed')
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) return <Spinner />

  return (
    <div className="min-h-screen bg-background">
      <div className="page-container">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-primary uppercase tracking-[0.3em] text-xs font-mono mb-2">Portfolio</p>
            <h1 className="section-title text-3xl">My Listings</h1>
            <p className="text-on-surface-variant mt-1">
              Welcome back, <span className="text-on-surface font-semibold">{user?.username}</span>
            </p>
          </div>
          <Link to="/listings/create" className="btn-primary flex-shrink-0">
            + New Listing
          </Link>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          <div className="glass-card p-5 text-center">
            <p className="price-tag text-3xl font-bold">{properties.length}</p>
            <p className="text-on-surface-variant text-sm mt-1">Total Listings</p>
          </div>
          <div className="glass-card p-5 text-center">
            <p className="price-tag text-3xl font-bold">
              {properties.length > 0
                ? `FCFA ${(properties.reduce((s, p) => s + p.price, 0) / 1e6).toFixed(1)}M`
                : 'FCFA 0'}
            </p>
            <p className="text-on-surface-variant text-sm mt-1">Portfolio Value</p>
          </div>
          <div className="glass-card p-5 text-center sm:col-span-1 col-span-2">
            <p className="price-tag text-3xl font-bold">{properties.length > 0 ? 'Active' : '—'}</p>
            <p className="text-on-surface-variant text-sm mt-1">Status</p>
          </div>
        </div>

        {/* Listings */}
        {properties.length === 0 ? (
          <div className="glass-card p-16 text-center">
            <p className="font-display text-on-surface text-2xl mb-2">No listings yet</p>
            <p className="text-on-surface-variant mb-6">Start building your portfolio today.</p>
            <Link to="/listings/create" className="btn-primary inline-block">
              Create Your First Listing
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {properties.map(p => (
              <div
                key={p._id}
                className="glass-card p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:border-primary/20 transition-colors"
              >
                {/* Image */}
                <div className="w-full sm:w-28 h-24 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={p.images?.[0] || FALLBACK}
                    alt={p.title}
                    className="w-full h-full object-cover"
                    onError={e => { e.target.src = FALLBACK }}
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/properties/${p._id}`}
                    className="font-display font-semibold text-on-surface text-lg line-clamp-1 hover:text-primary transition-colors"
                  >
                    {p.title}
                  </Link>
                  <p className="text-on-surface-variant text-sm mt-0.5">
                    {p.city}, {p.country}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    <span className="price-tag text-lg">FCFA {Number(p.price).toLocaleString()}</span>
                    <span className="chip">{p.type}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <Link
                    to={`/listings/edit/${p._id}`}
                    className="btn-secondary text-sm py-2 px-4"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(p._id)}
                    disabled={deletingId === p._id}
                    className="btn-danger text-sm py-2 px-4"
                  >
                    {deletingId === p._id ? '...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
