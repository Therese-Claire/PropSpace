import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../services/api'
import useAuth from '../hooks/useAuth'
import Spinner from '../components/common/Spinner'

const FALLBACK = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&auto=format&fit=crop'

export default function PropertyDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    api.get(`/properties/${id}`, { signal: controller.signal })
      .then(({ data }) => setProperty(data))
      .catch(err => { if (err?.name !== 'CanceledError') setError('Property not found') })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [id])

  if (loading) return <Spinner />

  if (error || !property) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-on-surface-variant text-lg">{error || 'Property not found'}</p>
        <Link to="/" className="btn-secondary">Back to Listings</Link>
      </div>
    )
  }

  const { title, description, price, city, country, type, images, owner } = property
  const img = images?.[0] || FALLBACK
  const isOwner = user && owner && user._id === owner._id?.toString()

  return (
    <div className="min-h-screen bg-background">
      {/* Hero image */}
      <div className="relative overflow-hidden" style={{ height: '55vh' }}>
        <img
          src={img}
          alt={title}
          className="w-full h-full object-cover"
          onError={e => { e.target.src = FALLBACK }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 px-6 pb-8 md:px-16">
          <span className="chip mb-3 inline-block">{type}</span>
          <h1
            className="font-display font-bold text-on-surface leading-tight"
            style={{ fontSize: 'clamp(1.75rem, 4vw, 3.5rem)' }}
          >
            {title}
          </h1>
          <p className="text-on-surface-variant mt-2 text-lg">{city}, {country}</p>
        </div>
      </div>

      <div className="page-container">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content */}
          <div className="flex-1 space-y-6">
            <div className="glass-card p-6">
              <h2 className="section-title text-2xl mb-4">About This Estate</h2>
              <p className="text-on-surface-variant leading-relaxed text-base">{description}</p>
            </div>

            {owner && (
              <div className="glass-card p-6">
                <h2 className="section-title text-xl mb-4">Listed By</h2>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-bold uppercase text-lg flex-shrink-0">
                    {owner.username?.[0]}
                  </div>
                  <div>
                    <p className="text-on-surface font-semibold">{owner.username}</p>
                    <p className="text-on-surface-variant text-sm">PropSpace Agent</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:w-80 space-y-5">
            <div className="glass-card p-6">
              <p className="text-on-surface-variant text-xs font-mono uppercase tracking-wider mb-2">
                Listing Price
              </p>
              <p className="price-tag font-bold" style={{ fontSize: '2.25rem' }}>
                FCFA {Number(price).toLocaleString()}
              </p>

              <div className="mt-6 space-y-3">
                <button className="btn-primary w-full">Schedule a Tour</button>
                <button className="btn-secondary w-full">Send Inquiry</button>
              </div>
            </div>

            {isOwner && (
              <div className="glass-card p-6">
                <p className="text-on-surface-variant text-sm mb-3">You own this listing</p>
                <Link
                  to={`/listings/edit/${property._id}`}
                  className="btn-secondary block text-center w-full"
                >
                  Edit Listing
                </Link>
              </div>
            )}

            <Link to="/" className="block text-center text-on-surface-variant text-sm hover:text-on-surface transition-colors">
              ← Back to all estates
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
