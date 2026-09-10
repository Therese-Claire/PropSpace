import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../services/api'
import { useLang } from '../hooks/useLang'

const TYPES = ['Apartment', 'House', 'Studio']

export default function CreateListingPage() {
  const { t } = useLang()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: '', description: '', price: '', city: '', country: '', type: 'Apartment', imageUrl: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api.post('/properties', {
        title:       form.title,
        description: form.description,
        price:       Number(form.price),
        city:        form.city,
        country:     form.country,
        type:        form.type,
        images:      form.imageUrl ? [form.imageUrl] : [],
      })
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create listing')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <p className="text-primary uppercase tracking-[0.3em] text-xs font-mono mb-2">{t('new_estate')}</p>
          <h1 className="section-title text-3xl">{t('list_your_property')}</h1>
          <p className="text-on-surface-variant mt-2">{t('list_subtitle')}</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card p-8 space-y-5">
          {error && (
            <div className="border border-error/40 bg-error/10 rounded-lg px-4 py-3 text-error text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="input-label">{t('property_title')}</label>
            <input
              type="text"
              className="input-field"
              placeholder={t('title_placeholder')}
              value={form.title}
              onChange={set('title')}
              required
            />
          </div>

          <div>
            <label className="input-label">{t('description')}</label>
            <textarea
              rows={4}
              className="input-field resize-none"
              placeholder={t('description_placeholder')}
              value={form.description}
              onChange={set('description')}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="input-label">{t('price_fcfa')}</label>
              <input
                type="number"
                min="0"
                className="input-field font-mono"
                placeholder="0"
                value={form.price}
                onChange={set('price')}
                required
              />
            </div>
            <div>
              <label className="input-label">{t('property_type')}</label>
              <select className="input-field" value={form.type} onChange={set('type')}>
                {TYPES.map(type => (
                  <option key={type} value={type}>{t('type_' + type)}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="input-label">{t('city_label')}</label>
              <input
                type="text"
                className="input-field"
                placeholder={t('city_create_placeholder')}
                value={form.city}
                onChange={set('city')}
                required
              />
            </div>
            <div>
              <label className="input-label">{t('country')}</label>
              <input
                type="text"
                className="input-field"
                placeholder={t('country_placeholder')}
                value={form.country}
                onChange={set('country')}
                required
              />
            </div>
          </div>

          <div>
            <label className="input-label">{t('primary_image_url')}</label>
            <input
              type="url"
              className="input-field"
              placeholder="https://images.unsplash.com/..."
              value={form.imageUrl}
              onChange={set('imageUrl')}
            />
          </div>

          {form.imageUrl && (
            <div className="rounded-lg overflow-hidden h-40 border border-outline-variant">
              <img
                src={form.imageUrl}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={e => { e.target.style.display = 'none' }}
              />
            </div>
          )}

          <div className="flex gap-4 pt-2">
            <button type="submit" className="btn-primary flex-1" disabled={loading}>
              {loading ? t('listing_btn') : t('list_property')}
            </button>
            <Link to="/dashboard" className="btn-secondary flex-1 text-center leading-[2.75rem]">
              {t('cancel')}
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
