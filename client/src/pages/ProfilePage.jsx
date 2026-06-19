import { useState } from 'react'
import useAuth from '../hooks/useAuth'
import api from '../services/api'

export default function ProfilePage() {
  const { user, login } = useAuth()

  const [profile, setProfile] = useState({
    username: user?.username || '',
    phone:    user?.phone    || '',
    avatar:   user?.avatar   || '',
  })
  const [profileMsg, setProfileMsg] = useState('')
  const [profileError, setProfileError] = useState('')
  const [profileLoading, setProfileLoading] = useState(false)

  const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '', confirm: '' })
  const [pwMsg, setPwMsg] = useState('')
  const [pwError, setPwError] = useState('')
  const [pwLoading, setPwLoading] = useState(false)

  const setP = (key) => (e) => setProfile({ ...profile, [key]: e.target.value })
  const setPw = (key) => (e) => setPasswords({ ...passwords, [key]: e.target.value })

  const saveProfile = async (e) => {
    e.preventDefault()
    setProfileMsg(''); setProfileError('')
    setProfileLoading(true)
    try {
      const { data } = await api.put('/auth/profile', {
        username: profile.username,
        phone:    profile.phone,
        avatar:   profile.avatar,
      })
      login({ ...user, ...data })
      setProfileMsg('Profile updated successfully')
    } catch (err) {
      setProfileError(err.response?.data?.message || 'Update failed')
    } finally {
      setProfileLoading(false)
    }
  }

  const changePassword = async (e) => {
    e.preventDefault()
    setPwMsg(''); setPwError('')
    if (passwords.newPassword !== passwords.confirm) return setPwError('Passwords do not match')
    setPwLoading(true)
    try {
      await api.put('/auth/password', {
        oldPassword: passwords.oldPassword,
        newPassword: passwords.newPassword,
      })
      setPwMsg('Password updated successfully')
      setPasswords({ oldPassword: '', newPassword: '', confirm: '' })
    } catch (err) {
      setPwError(err.response?.data?.message || 'Password change failed')
    } finally {
      setPwLoading(false)
    }
  }

  const avatarInitial = profile.username?.[0] || user?.username?.[0] || '?'

  return (
    <div className="min-h-screen bg-background py-12 px-6">
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <p className="text-primary uppercase tracking-[0.3em] text-xs font-mono mb-2">Account</p>
          <h1 className="section-title text-3xl">Account Architecture</h1>
          <p className="text-on-surface-variant mt-2">
            Configure your identity and security protocols within the PropSpace ecosystem.
          </p>
        </div>

        {/* Identity card */}
        <div className="glass-card p-8">
          <div className="flex items-center gap-5 mb-8">
            <div className="w-16 h-16 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container text-2xl font-bold uppercase flex-shrink-0 overflow-hidden">
              {profile.avatar ? (
                <img src={profile.avatar} alt="avatar" className="w-full h-full object-cover" onError={e => { e.target.style.display = 'none' }} />
              ) : avatarInitial}
            </div>
            <div>
              <p className="font-display text-on-surface font-semibold text-xl">{profile.username || user?.username}</p>
              <p className="text-on-surface-variant text-sm">{user?.email}</p>
              <span className="chip mt-2 inline-block">Premium Member</span>
            </div>
          </div>

          <form onSubmit={saveProfile} className="space-y-5">
            <h2 className="text-on-surface font-semibold text-lg border-b border-outline-variant pb-3">
              Personal Information
            </h2>

            <div>
              <label className="input-label">Username</label>
              <input
                type="text"
                className="input-field"
                placeholder="Your handle"
                value={profile.username}
                onChange={setP('username')}
                required
                autoComplete="username"
              />
            </div>

            <div>
              <label className="input-label">Email Address</label>
              <input
                type="email"
                className="input-field opacity-50 cursor-not-allowed"
                value={user?.email || ''}
                disabled
              />
            </div>

            <div>
              <label className="input-label">Phone Number</label>
              <input
                type="tel"
                className="input-field"
                placeholder="+1 (555) 000-0000"
                value={profile.phone}
                onChange={setP('phone')}
              />
            </div>

            <div>
              <label className="input-label">Avatar URL</label>
              <input
                type="url"
                className="input-field"
                placeholder="https://example.com/your-photo.jpg"
                value={profile.avatar}
                onChange={setP('avatar')}
              />
            </div>

            {profileMsg && <p className="text-success text-sm font-medium">{profileMsg}</p>}
            {profileError && <p className="text-error text-sm">{profileError}</p>}

            <button type="submit" className="btn-primary" disabled={profileLoading}>
              {profileLoading ? 'Saving...' : 'Save Personal Info'}
            </button>
          </form>
        </div>

        {/* Security card */}
        <div className="glass-card p-8">
          <h2 className="text-on-surface font-semibold text-lg border-b border-outline-variant pb-3 mb-5">
            Security Protocols
          </h2>

          <p className="text-on-surface-variant text-sm mb-6">
            <span className="text-success font-mono">●</span>&nbsp; Two-factor authentication active
          </p>

          <form onSubmit={changePassword} className="space-y-5">
            <div>
              <label className="input-label">Current Password</label>
              <input
                type="password"
                className="input-field"
                placeholder="••••••••"
                value={passwords.oldPassword}
                onChange={setPw('oldPassword')}
                required
                autoComplete="current-password"
              />
            </div>

            <div>
              <label className="input-label">New Password</label>
              <input
                type="password"
                className="input-field"
                placeholder="••••••••"
                value={passwords.newPassword}
                onChange={setPw('newPassword')}
                required
                autoComplete="new-password"
              />
            </div>

            <div>
              <label className="input-label">Confirm New Password</label>
              <input
                type="password"
                className="input-field"
                placeholder="••••••••"
                value={passwords.confirm}
                onChange={setPw('confirm')}
                required
                autoComplete="new-password"
              />
            </div>

            {pwMsg && <p className="text-success text-sm font-medium">{pwMsg}</p>}
            {pwError && <p className="text-error text-sm">{pwError}</p>}

            <button type="submit" className="btn-secondary" disabled={pwLoading}>
              {pwLoading ? 'Updating...' : 'Update Security'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
