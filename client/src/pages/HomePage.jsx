import { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import PropertyCard from '../components/properties/PropertyCard'

const HERO_BG = 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&auto=format&fit=crop'
const FALLBACK = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop'
const TYPES = ['', 'Apartment', 'House', 'Studio']

export default function HomePage() {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [heroSearch, setHeroSearch] = useState('')
  const [filters, setFilters] = useState({ city: '', minPrice: '', maxPrice: '', type: '' })
  const abortRef = useRef(null)
  const allEstatesRef = useRef(null)

  const fetchProperties = useCallback(async (f = {}) => {
    if (abortRef.current) abortRef.current.abort()
    const controller = new AbortController()
    abortRef.current = controller
    setLoading(true)
    try {
      const params = {}
      if (f.city)     params.city     = f.city
      if (f.minPrice) params.minPrice = f.minPrice
      if (f.maxPrice) params.maxPrice = f.maxPrice
      if (f.type)     params.type     = f.type
      const { data } = await api.get('/properties', { params, signal: controller.signal })
      setProperties(data)
    } catch (err) {
      if (err?.name !== 'CanceledError') console.error(err)
    } finally {
      if (!controller.signal.aborted) setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProperties({})
    return () => { abortRef.current?.abort() }
  }, [fetchProperties])

  const handleHeroExplore = () => {
    const updated = { ...filters, city: heroSearch }
    setFilters(updated)
    fetchProperties(updated)
    allEstatesRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleFilterChange = (key, value) => {
    const updated = { ...filters, [key]: value }
    setFilters(updated)
    fetchProperties(updated)
  }

  const handleClearFilters = () => {
    setFilters({ city: '', minPrice: '', maxPrice: '', type: '' })
    setHeroSearch('')
    fetchProperties({})
  }

  const featured = properties.slice(0, 4)

  return (
    <div className="min-h-screen bg-background">

      {/* ── Hero ────────────────────────────────────────────── */}
      <section className="relative h-screen w-full flex flex-col justify-end items-center pb-20">
        <div className="absolute inset-0 z-0">
          <img
            src={HERO_BG}
            alt="Luxury estate"
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to bottom, rgba(19,19,19,0) 0%, rgba(19,19,19,0.5) 50%, rgba(19,19,19,1) 100%)' }}
          />
        </div>

        <div className="relative z-10 w-full max-w-5xl px-6 text-center space-y-6">
          <h2
            className="font-display font-bold text-on-surface"
            style={{ fontSize: 'clamp(2.25rem, 6vw, 4rem)', lineHeight: 1.1 }}
          >
            Find Your Next <span className="text-secondary italic">Space</span>
          </h2>
          <p className="text-on-surface-variant text-lg max-w-2xl mx-auto leading-relaxed">
            Exclusive architectural masterpieces for those who demand precision, luxury, and serenity.
          </p>

          {/* Search bar */}
          <div className="glass-card p-2 rounded-xl flex flex-col md:flex-row items-center gap-1 max-w-3xl mx-auto">
            <div className="flex items-center px-4 gap-3 w-full py-2">
              <svg className="w-5 h-5 text-secondary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                className="bg-transparent border-none focus:ring-0 focus:outline-none text-on-surface w-full placeholder:text-on-surface-variant/50 text-base"
                placeholder="Search by city — e.g. Douala, Kribi, Buea…"
                type="text"
                value={heroSearch}
                onChange={e => setHeroSearch(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleHeroExplore()}
              />
            </div>
            <button
              onClick={handleHeroExplore}
              className="w-full md:w-auto px-10 py-3 bg-secondary text-on-secondary font-semibold text-xs tracking-widest rounded-lg hover:opacity-90 active:scale-95 transition-all uppercase flex-shrink-0"
            >
              Explore
            </button>
          </div>
        </div>
      </section>

      {/* ── Featured Bento Grid ─────────────────────────────── */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="text-secondary font-mono text-xs tracking-widest uppercase">Curated Selection</span>
            <h3 className="font-display font-semibold text-on-surface text-3xl mt-1">Featured Estates</h3>
          </div>
          <button
            onClick={() => allEstatesRef.current?.scrollIntoView({ behavior: 'smooth' })}
            className="text-primary text-xs font-semibold tracking-wider uppercase flex items-center gap-1 hover:gap-2 transition-all"
          >
            View All
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>

        {/* Skeleton */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:h-[800px]">
            <div className="md:col-span-8 glass-card rounded-xl animate-pulse min-h-[360px]" />
            <div className="md:col-span-4 glass-card rounded-xl animate-pulse min-h-[200px]" />
            <div className="md:col-span-4 glass-card rounded-xl animate-pulse h-64" />
            <div className="md:col-span-8 glass-card rounded-xl animate-pulse h-64" />
          </div>
        ) : featured.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:h-[800px]">

            {/* Large card */}
            {featured[0] && (
              <Link
                to={`/properties/${featured[0]._id}`}
                className="md:col-span-8 group relative rounded-xl overflow-hidden glass-card min-h-[360px]"
              >
                <div className="absolute inset-0">
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    src={featured[0].images?.[0] || FALLBACK}
                    alt={featured[0].title}
                    onError={e => { e.target.src = FALLBACK }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                </div>
                <div className="relative z-10 p-6 h-full flex flex-col justify-end">
                  <div className="flex items-center gap-1 text-secondary mb-1">
                    <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                    <span className="text-xs font-semibold tracking-widest uppercase">{featured[0].city}, {featured[0].country}</span>
                  </div>
                  <h4 className="font-display font-semibold text-on-surface text-2xl leading-snug">{featured[0].title}</h4>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <span className="chip">{featured[0].type}</span>
                    <span className="price-tag text-lg">FCFA {Number(featured[0].price).toLocaleString()}</span>
                  </div>
                </div>
              </Link>
            )}

            {/* Side card */}
            {featured[1] && (
              <Link
                to={`/properties/${featured[1]._id}`}
                className="md:col-span-4 group relative rounded-xl overflow-hidden glass-card min-h-[200px]"
              >
                <div className="absolute inset-0">
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    src={featured[1].images?.[0] || FALLBACK}
                    alt={featured[1].title}
                    onError={e => { e.target.src = FALLBACK }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                </div>
                <div className="relative z-10 p-6 h-full flex flex-col justify-end">
                  <span className="text-secondary text-xs font-semibold tracking-widest uppercase">{featured[1].city}, {featured[1].country}</span>
                  <h4 className="font-display font-semibold text-on-surface text-xl mt-1 leading-snug">{featured[1].title}</h4>
                </div>
              </Link>
            )}

            {/* Bottom-left */}
            {featured[2] && (
              <Link
                to={`/properties/${featured[2]._id}`}
                className="md:col-span-4 group relative rounded-xl overflow-hidden glass-card h-64 md:h-auto"
              >
                <div className="absolute inset-0">
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    src={featured[2].images?.[0] || FALLBACK}
                    alt={featured[2].title}
                    onError={e => { e.target.src = FALLBACK }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                </div>
                <div className="relative z-10 p-6 h-full flex flex-col justify-end">
                  <span className="text-secondary text-xs font-semibold tracking-widest uppercase">{featured[2].city}, {featured[2].country}</span>
                  <h4 className="font-display font-semibold text-on-surface text-xl mt-1 leading-snug">{featured[2].title}</h4>
                </div>
              </Link>
            )}

            {/* Bottom-right */}
            {featured[3] && (
              <Link
                to={`/properties/${featured[3]._id}`}
                className="md:col-span-8 group relative rounded-xl overflow-hidden glass-card h-64 md:h-auto"
              >
                <div className="absolute inset-0">
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    src={featured[3].images?.[0] || FALLBACK}
                    alt={featured[3].title}
                    onError={e => { e.target.src = FALLBACK }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                </div>
                <div className="relative z-10 p-6 h-full flex flex-col justify-end">
                  <span className="text-secondary text-xs font-semibold tracking-widest uppercase">{featured[3].city}, {featured[3].country}</span>
                  <h4 className="font-display font-semibold text-on-surface text-xl mt-1 leading-snug">{featured[3].title}</h4>
                </div>
              </Link>
            )}
          </div>
        ) : null}
      </section>

      {/* ── All Estates ─────────────────────────────────────── */}
      <div ref={allEstatesRef} className="page-container">
        {/* Filter bar */}
        <div className="glass-card p-4 rounded-xl flex flex-col sm:flex-row flex-wrap gap-3 mb-8 items-end">
          <div className="flex-1 min-w-[160px]">
            <label className="input-label">City</label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. Douala"
              value={filters.city}
              onChange={e => handleFilterChange('city', e.target.value)}
            />
          </div>
          <div className="w-full sm:w-36">
            <label className="input-label">Min Price (FCFA)</label>
            <input
              type="number"
              className="input-field font-mono"
              placeholder="0"
              value={filters.minPrice}
              onChange={e => handleFilterChange('minPrice', e.target.value)}
            />
          </div>
          <div className="w-full sm:w-36">
            <label className="input-label">Max Price (FCFA)</label>
            <input
              type="number"
              className="input-field font-mono"
              placeholder="No limit"
              value={filters.maxPrice}
              onChange={e => handleFilterChange('maxPrice', e.target.value)}
            />
          </div>
          <div className="w-full sm:w-36">
            <label className="input-label">Type</label>
            <select
              className="input-field"
              value={filters.type}
              onChange={e => handleFilterChange('type', e.target.value)}
            >
              {TYPES.map(t => <option key={t} value={t}>{t || 'All Types'}</option>)}
            </select>
          </div>
          <button
            onClick={handleClearFilters}
            className="btn-secondary text-sm py-2 px-4 flex-shrink-0"
          >
            Clear
          </button>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="section-title">
            {loading
              ? 'Searching…'
              : `${properties.length} Estate${properties.length !== 1 ? 's' : ''} Found`}
          </h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <div key={i} className="glass-card h-72 animate-pulse" />)}
          </div>
        ) : properties.length === 0 ? (
          <div className="glass-card p-16 text-center">
            <p className="font-display text-on-surface text-2xl mb-2">No estates found</p>
            <p className="text-on-surface-variant text-sm">Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {properties.map(p => <PropertyCard key={p._id} property={p} />)}
          </div>
        )}
      </div>

      {/* ── Services ────────────────────────────────────────── */}
      <section className="mt-24 py-20 px-6 bg-surface-container-low">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            {
              icon: (
                <svg className="w-8 h-8 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              ),
              title: 'Verified Ownership',
              body: 'Every listing on PropSpace undergoes rigorous title and deed verification to ensure absolute security for our clients.',
            },
            {
              icon: (
                <svg className="w-8 h-8 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 2.625c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
                </svg>
              ),
              title: 'Digital Portfolio',
              body: 'Seamlessly manage your property portfolio through our secure platform, providing real-time equity tracking and market valuation.',
            },
            {
              icon: (
                <svg className="w-8 h-8 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              ),
              title: 'Private Concierge',
              body: 'Access dedicated assistance for viewing arrangements, architectural consultations, and relocation logistics across Cameroon.',
            },
          ].map(({ icon, title, body }) => (
            <div key={title} className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-primary-container/40 flex items-center justify-center">
                {icon}
              </div>
              <h4 className="font-display font-semibold text-on-surface text-xl">{title}</h4>
              <p className="text-on-surface-variant text-sm leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer className="w-full py-12 px-8 flex flex-col md:flex-row justify-between items-center gap-6 bg-surface-container-lowest border-t border-primary/20">
        <div className="flex flex-col items-center md:items-start">
          <h2 className="font-display text-secondary italic text-2xl font-bold tracking-wide">PropSpace</h2>
          <p className="text-on-surface-variant text-xs mt-1">© 2026 PropSpace. All Rights Reserved.</p>
        </div>
        <div className="flex gap-6 text-sm text-on-surface-variant">
          <Link to="/" className="hover:text-primary transition-colors">Estates</Link>
          <Link to="/login" className="hover:text-primary transition-colors">Sign In</Link>
          <Link to="/register" className="hover:text-primary transition-colors">Register</Link>
          <Link to="/dashboard" className="hover:text-primary transition-colors">Portfolio</Link>
        </div>
        <div className="flex gap-3">
          <svg className="w-5 h-5 text-on-surface-variant hover:text-primary transition-colors cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253M3 12c0-.778.099-1.533.284-2.253" />
          </svg>
          <svg className="w-5 h-5 text-on-surface-variant hover:text-primary transition-colors cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
          </svg>
        </div>
      </footer>

    </div>
  )
}
