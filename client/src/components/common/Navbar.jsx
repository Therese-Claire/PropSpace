import { useRef, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import { useLang } from '../../hooks/useLang'

const LANGS = [
  { code: 'en', label: 'ENG' },
  { code: 'fr', label: 'FREN' },
]

export default function Navbar() {
  const { user, logout } = useAuth()
  const { lang, setLanguage, t } = useLang()
  const navigate = useNavigate()

  const [open, setOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const current = LANGS.find(l => l.code === lang)

  return (
    <header className="glass-nav fixed top-0 w-full z-50 h-16 flex items-center justify-between px-gutter">
      {/* Logo */}
      <Link to="/" className="font-display italic text-secondary text-xl tracking-wider hover:opacity-80 transition-opacity">
        PropSpace
      </Link>

      {/* Nav links */}
      <nav className="hidden md:flex items-center gap-md text-sm font-semibold">
        <Link to="/" className="text-primary hover:opacity-80 transition-opacity">
          {t('browse')}
        </Link>
        {user && (
          <Link to="/dashboard" className="text-on-surface-variant hover:text-on-surface transition-colors">
            {t('my_listings')}
          </Link>
        )}
      </nav>

      {/* Right: auth + language dropdown */}
      <div className="flex items-center gap-sm">
        {user ? (
          <>
            <Link to="/profile" className="text-on-surface-variant hover:text-on-surface text-sm transition-colors">
              {user.username}
            </Link>
            <button onClick={handleLogout} className="btn-secondary text-sm py-2 px-4">
              {t('logout')}
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-on-surface-variant hover:text-on-surface text-sm transition-colors">
              {t('login')}
            </Link>
            <Link to="/register" className="btn-primary text-sm py-2 px-4">
              {t('sign_up')}
            </Link>
          </>
        )}

        {/* Language dropdown */}
        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setOpen(o => !o)}
            className="flex items-center gap-1.5 text-xs font-bold tracking-widest text-on-surface-variant hover:text-on-surface transition-colors px-2 py-1.5 rounded-lg hover:bg-white/5"
          >
            {current.label}
            <svg
              className={`w-3 h-3 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>

          {open && (
            <div className="absolute right-0 top-full mt-2 w-24 glass-card rounded-xl overflow-hidden shadow-xl border border-outline-variant/40 py-1">
              {LANGS.map(({ code, label }) => (
                <button
                  key={code}
                  onClick={() => { setLanguage(code); setOpen(false) }}
                  className={`w-full text-left px-4 py-2 text-xs font-bold tracking-widest transition-colors ${
                    lang === code
                      ? 'text-secondary bg-secondary/10'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-white/5'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
