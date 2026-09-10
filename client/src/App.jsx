import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes'
import { AuthProvider } from './context/AuthContext'
import { LangProvider } from './context/LangContext'
import Navbar from './components/common/Navbar'

function App() {
  return (
    <LangProvider>
      <AuthProvider>
        <BrowserRouter>
          <Navbar />
          <main className="pt-16">
            <AppRoutes />
          </main>
        </BrowserRouter>
      </AuthProvider>
    </LangProvider>
  )
}

export default App