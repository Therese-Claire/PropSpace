import { Link } from 'react-router-dom'

const FALLBACK = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop'

export default function PropertyCard({ property }) {
  const { _id, title, city, country, price, type, images } = property
  const img = images?.[0] || FALLBACK

  return (
    <Link
      to={`/properties/${_id}`}
      className="glass-card group block overflow-hidden hover:-translate-y-1 transition-transform duration-200"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={img}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={e => { e.target.src = FALLBACK }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute top-3 right-3">
          <span className="chip">{type}</span>
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-display font-semibold text-on-surface text-lg leading-snug line-clamp-1">
          {title}
        </h3>
        <p className="text-on-surface-variant text-sm mt-1 mb-3">{city}, {country}</p>
        <p className="price-tag text-2xl">FCFA {Number(price).toLocaleString()}</p>
      </div>
    </Link>
  )
}
