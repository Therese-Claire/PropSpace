import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import PropertyDetailPage from './pages/PropertyDetailPage'
import DashboardPage from './pages/DashboardPage'
import CreateListingPage from './pages/CreateListingPage'
import EditListingPage from './pages/EditListingPage'
import ProfilePage from './pages/ProfilePage'
import ProtectedRoute from './components/common/ProtectedRoute'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/"           element={<HomePage />} />
      <Route path="/login"      element={<LoginPage />} />
      <Route path="/register"   element={<RegisterPage />} />
      <Route path="/properties/:id" element={<PropertyDetailPage />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard"        element={<DashboardPage />} />
        <Route path="/listings/create"  element={<CreateListingPage />} />
        <Route path="/listings/edit/:id" element={<EditListingPage />} />
        <Route path="/profile"          element={<ProfilePage />} />
      </Route>
    </Routes>
  )
}