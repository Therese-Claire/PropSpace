const TYPES = ['', 'Apartment', 'House', 'Studio']

export default function FilterSidebar({ filters, onChange, onSearch }) {
  const set = (key) => (e) => onChange({ ...filters, [key]: e.target.value })

  return (
    <div className="glass-card p-6 space-y-5 sticky top-20">
      <h3 className="font-display text-on-surface font-semibold text-xl">Filter Estates</h3>

      <div>
        <label className="input-label">City</label>
        <input
          type="text"
          className="input-field"
          placeholder="Search by city..."
          value={filters.city}
          onChange={set('city')}
        />
      </div>

      <div>
        <label className="input-label">Min Price (USD)</label>
        <input
          type="number"
          className="input-field font-mono"
          placeholder="0"
          value={filters.minPrice}
          onChange={set('minPrice')}
        />
      </div>

      <div>
        <label className="input-label">Max Price (USD)</label>
        <input
          type="number"
          className="input-field font-mono"
          placeholder="No limit"
          value={filters.maxPrice}
          onChange={set('maxPrice')}
        />
      </div>

      <div>
        <label className="input-label">Property Type</label>
        <select className="input-field" value={filters.type} onChange={set('type')}>
          {TYPES.map(t => (
            <option key={t} value={t}>{t || 'All Types'}</option>
          ))}
        </select>
      </div>

      <button className="btn-primary w-full" onClick={onSearch}>
        Search
      </button>

      <button
        className="w-full text-on-surface-variant text-sm hover:text-on-surface transition-colors"
        onClick={() => {
          onChange({ city: '', minPrice: '', maxPrice: '', type: '' })
          onSearch()
        }}
      >
        Clear Filters
      </button>
    </div>
  )
}
