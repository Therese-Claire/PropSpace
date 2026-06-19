import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="glass-nav fixed top-0 w-full z-50 h-16 flex items-center justify-between px-gutter">
      {/* Logo */}
      <Link to="/" className="font-display italic text-secondary text-xl tracking-wider hover:opacity-80 transition-opacity">
        PropSpace
      </Link>

      {/* Nav links */}
      <nav className="hidden md:flex items-center gap-md text-sm font-semibold">
        <Link to="/" className="text-primary hover:opacity-80 transition-opacity">
          Browse
        </Link>
        {user && (
          <Link to="/dashboard" className="text-on-surface-variant hover:text-on-surface transition-colors">
            My Listings
          </Link>
        )}
      </nav>

      {/* Auth buttons */}
      <div className="flex items-center gap-sm">
        {user ? (
          <>
            <Link to="/profile" className="text-on-surface-variant hover:text-on-surface text-sm transition-colors">
              {user.username}
            </Link>
            <button onClick={handleLogout} className="btn-secondary text-sm py-2 px-4">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-on-surface-variant hover:text-on-surface text-sm transition-colors">
              Login
            </Link>
            <Link to="/register" className="btn-primary text-sm py-2 px-4">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </header>
  )
}
