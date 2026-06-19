import PropertyCard from './PropertyCard'

export default function PropertyGrid({ properties = [] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {properties.map(p => (
        <PropertyCard key={p._id} property={p} />
      ))}
    </div>
  )
}
