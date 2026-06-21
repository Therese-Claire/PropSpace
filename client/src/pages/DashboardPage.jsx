import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import useAuth from '../hooks/useAuth'
import Spinner from '../components/common/Spinner'

const FALLBACK = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop'

const TrendUpIcon = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>
  </svg>
)
const EyeIcon = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
)
const CheckIcon = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)
const LocationIcon = () => (
  <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
  </svg>
)
const EditIcon = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
)
const TrashIcon = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
)

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

  const totalValue = properties.reduce((s, p) => s + p.price, 0)
  const cities = [...new Set(properties.map(p => p.city))].length

  const stats = [
    {
      label: 'Portfolio Value',
      value: totalValue > 0 ? `FCFA ${(totalValue / 1e6).toFixed(1)}M` : 'FCFA 0',
      sub: 'Total estate worth',
      icon: <TrendUpIcon />,
      color: 'text-secondary',
    },
    {
      label: 'Total Listings',
      value: properties.length,
      sub: 'Managed properties',
      icon: <EyeIcon />,
      color: 'text-primary',
    },
    {
      label: 'Cities',
      value: cities || '—',
      sub: 'Across Cameroon',
      icon: <LocationIcon />,
      color: 'text-primary',
    },
    {
      label: 'Status',
      value: properties.length > 0 ? 'Active' : '—',
      sub: 'Portfolio standing',
      icon: <CheckIcon />,
      color: 'text-secondary',
    },
  ]

  return (
    <div className="min-h-screen bg-surface-container-lowest">
      <main className="pt-24 pb-32 px-4 md:px-16 max-w-[1440px] mx-auto">

        {/* ── Welcome Header ──────────────────────────────── */}
        <section className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="text-primary font-mono text-xs tracking-[0.2em] uppercase mb-1">
                Dashboard Portfolio
              </p>
              <h2 className="font-display font-bold text-on-surface mb-2"
                style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', lineHeight: 1.1 }}>
                Welcome back, {user?.username}
              </h2>
              <p className="text-on-surface-variant text-lg max-w-2xl leading-relaxed">
                Manage your estate listings and monitor your exclusive property portfolio.
              </p>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <Link
                to="/listings/create"
                className="bg-primary-container text-primary px-6 py-3 rounded-lg font-semibold text-xs uppercase tracking-wider flex items-center gap-2 hover:opacity-90 transition-all active:scale-95"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
                </svg>
                New Listing
              </Link>
              <Link
                to="/profile"
                className="border border-secondary/40 text-secondary px-6 py-3 rounded-lg font-semibold text-xs uppercase tracking-wider hover:bg-secondary/10 transition-all"
              >
                Profile
              </Link>
            </div>
          </div>
        </section>

        {/* ── Stats Bento ─────────────────────────────────── */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {stats.map(({ label, value, sub, icon, color }) => (
            <div key={label} className="glass-card p-6 rounded-xl">
              <p className="text-on-surface-variant text-xs font-semibold uppercase tracking-wider mb-2">
                {label}
              </p>
              <p className={`font-display font-bold text-2xl ${color}`}>{value}</p>
              <div className={`mt-2 flex items-center gap-1 ${color} text-xs font-semibold opacity-80`}>
                {icon}
                <span>{sub}</span>
              </div>
            </div>
          ))}
        </section>

        {/* ── Active Listings ─────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display font-semibold text-on-surface text-2xl">Active Listings</h3>
            <span className="text-on-surface-variant text-xs font-mono uppercase tracking-widest">
              {properties.length} {properties.length === 1 ? 'property' : 'properties'}
            </span>
          </div>

          {properties.length === 0 ? (
            <div className="glass-card p-16 rounded-xl text-center">
              <p className="font-display text-on-surface text-2xl mb-2">No listings yet</p>
              <p className="text-on-surface-variant mb-6">Start building your portfolio today.</p>
              <Link to="/listings/create" className="btn-primary inline-block">
                Create Your First Listing
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {properties.map(p => (
                <div key={p._id} className="glass-card rounded-xl overflow-hidden flex flex-col group hover:-translate-y-1 transition-transform duration-300">
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden flex-shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent z-10" />
                    <img
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      src={p.images?.[0] || FALLBACK}
                      alt={p.title}
                      onError={e => { e.target.src = FALLBACK }}
                    />
                    {/* Status badge */}
                    <div className="absolute top-4 left-4 z-20">
                      <span className="bg-primary/10 text-primary border border-primary/30 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest backdrop-blur-md">
                        Active
                      </span>
                    </div>
                    {/* Price overlay */}
                    <div className="absolute bottom-4 right-4 z-20">
                      <p className="font-display font-semibold text-secondary text-lg">
                        FCFA {Number(p.price).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-6 flex flex-col flex-grow">
                    <h4 className="font-display font-semibold text-on-surface text-lg leading-snug line-clamp-1 mb-1">
                      {p.title}
                    </h4>
                    <p className="text-on-surface-variant text-sm flex items-center gap-1 mb-4">
                      <LocationIcon />
                      {p.city}, {p.country}
                    </p>

                    <div className="flex items-center gap-2 mb-4">
                      <span className="chip">{p.type}</span>
                    </div>

                    {/* Action buttons */}
                    <div className="mt-auto pt-4 border-t border-white/5 flex gap-3">
                      <Link
                        to={`/listings/edit/${p._id}`}
                        className="flex-1 border border-secondary/40 text-secondary py-2 rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-secondary/10 transition-all flex items-center justify-center gap-1.5"
                      >
                        <EditIcon /> Edit
                      </Link>
                      <Link
                        to={`/properties/${p._id}`}
                        className="flex-1 bg-surface-container-highest text-on-surface py-2 rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-white/10 transition-all flex items-center justify-center gap-1.5"
                      >
                        <EyeIcon /> View
                      </Link>
                      <button
                        onClick={() => handleDelete(p._id)}
                        disabled={deletingId === p._id}
                        className="px-3 py-2 rounded-lg bg-error/10 text-error hover:bg-error/20 transition-all flex items-center justify-center disabled:opacity-50"
                        title="Delete listing"
                      >
                        {deletingId === p._id
                          ? <span className="text-xs">…</span>
                          : <TrashIcon />}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── Performance + Activity ──────────────────────── */}
        <section className="mt-20 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chart placeholder */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <svg className="w-5 h-5 text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
              <h3 className="font-display font-semibold text-on-surface text-xl">Listing Performance</h3>
            </div>
            <div className="glass-card h-72 rounded-xl p-6 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-10 pointer-events-none"
                style={{ background: 'radial-gradient(circle at center, #95d3ba 0%, transparent 70%)' }} />
              <div className="text-center">
                <svg className="w-12 h-12 text-primary mx-auto mb-3 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6.75v6.75" />
                </svg>
                <p className="text-on-surface-variant text-sm">Analytics dashboard coming soon</p>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <svg className="w-5 h-5 text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="font-display font-semibold text-on-surface text-xl">Recent Activity</h3>
            </div>
            <div className="flex flex-col gap-3">
              {properties.length === 0 ? (
                <p className="text-on-surface-variant text-sm">No activity yet.</p>
              ) : (
                properties.slice(0, 4).map((p, i) => (
                  <div key={p._id}
                    className={`glass-card p-3 rounded-xl border-l-2 ${i % 2 === 0 ? 'border-l-primary' : 'border-l-secondary'} flex gap-3 items-start`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${i % 2 === 0 ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'}`}>
                      <EyeIcon />
                    </div>
                    <div className="min-w-0">
                      <p className="text-on-surface text-xs font-medium line-clamp-1">
                        Listed: <strong>{p.title}</strong>
                      </p>
                      <p className="text-on-surface-variant text-xs mt-0.5">
                        {p.city} · FCFA {Number(p.price).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

      </main>
    </div>
  )
}
