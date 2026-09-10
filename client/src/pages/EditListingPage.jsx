import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import api from '../services/api'
import { useLang } from '../hooks/useLang'
import Spinner from '../components/common/Spinner'

const TYPES = ['Apartment', 'House', 'Studio']

export default function EditListingPage() {
  const { id } = useParams()
  const { t } = useLang()
  const navigate = useNavigate()
  const [form, setForm] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    api.get(`/properties/${id}`, { signal: controller.signal })
      .then(({ data }) => setForm({
        title:       data.title,
        description: data.description,
        price:       String(data.price),
        city:        data.city,
        country:     data.country,
        type:        data.type,
        imageUrl:    data.images?.[0] || '',
      }))
      .catch(err => { if (err?.name !== 'CanceledError') navigate('/dashboard') })
    return () => controller.abort()
  }, [id, navigate])

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api.put(`/properties/${id}`, {
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
      setError(err.response?.data?.message || 'Update failed')
    } finally {
      setLoading(false)
    }
  }

  if (!form) return <Spinner />

  return (
    <div className="min-h-screen bg-background py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <p className="text-primary uppercase tracking-[0.3em] text-xs font-mono mb-2">{t('edit_estate')}</p>
          <h1 className="section-title text-3xl">{t('update_listing')}</h1>
          <p className="text-on-surface-variant mt-2">{t('edit_subtitle')}</p>
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
              placeholder="https://..."
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
              {loading ? t('saving') : t('save_changes')}
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
