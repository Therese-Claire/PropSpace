import { useState, useEffect, useCallback, useRef } from 'react'
import api from '../services/api'
import PropertyCard from '../components/properties/PropertyCard'
import FilterSidebar from '../components/properties/FilterSidebar'

const EMPTY_FILTERS = { city: '', minPrice: '', maxPrice: '', type: '' }

export default function HomePage() {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState(EMPTY_FILTERS)
  const abortRef = useRef(null)

  const fetchProperties = useCallback(async (f = filters) => {
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
    fetchProperties(EMPTY_FILTERS)
    return () => { abortRef.current?.abort() }
  }, [fetchProperties])

  const handleSearch = () => fetchProperties(filters)

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
    if (!newFilters.city && !newFilters.minPrice && !newFilters.maxPrice && !newFilters.type) {
      fetchProperties(newFilters)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative flex items-center justify-center overflow-hidden" style={{ minHeight: '55vh' }}>
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, #0e1a14 0%, #131313 50%, rgba(6,78,59,0.25) 100%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(ellipse at 20% 50%, rgba(149,211,186,0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(249,241,208,0.1) 0%, transparent 50%)',
          }}
        />

        <div className="relative z-10 text-center px-6 py-24">
          <p className="text-primary uppercase tracking-[0.35em] text-xs font-mono mb-5">
            Exclusive Portfolio
          </p>
          <h1 className="font-display font-bold text-on-surface leading-[1.1] mb-6" style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}>
            The Pinnacle of<br />
            <span className="text-secondary italic">Digital Real Estate</span>
          </h1>
          <p className="text-on-surface-variant text-lg max-w-lg mx-auto leading-relaxed">
            Curated collections of the world's most exclusive properties, available only through PropSpace.
          </p>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Listings */}
      <div className="page-container">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-72 flex-shrink-0">
            <FilterSidebar
              filters={filters}
              onChange={handleFilterChange}
              onSearch={handleSearch}
            />
          </aside>

          {/* Grid */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6">
              <h2 className="section-title">
                {loading
                  ? 'Searching...'
                  : `${properties.length} Estate${properties.length !== 1 ? 's' : ''} Found`}
              </h2>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="glass-card h-72 animate-pulse" />
                ))}
              </div>
            ) : properties.length === 0 ? (
              <div className="glass-card p-16 text-center">
                <p className="font-display text-on-surface text-2xl mb-2">No estates found</p>
                <p className="text-on-surface-variant text-sm">Try adjusting your filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {properties.map(p => (
                  <PropertyCard key={p._id} property={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
