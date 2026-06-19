import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/common/Navbar'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <main className="pt-16">
          <AppRoutes />
        </main>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App