import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Analysis from './pages/Analysis'
import DashBoard from './pages/DashBoard'
import ResetPassword from './pages/ResetPassword'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ContactUs from './pages/ContactUs'
import VideoDetails from './pages/VideoDetails'
import { useAuth } from './context/Context'

// Redirects authenticated users to /dashboard, guests to /home
function RootRedirect() {
  const { isAuthenticated, isLoading } = useAuth()
  if (isLoading) return null  // wait for auth check — ServerWakeLoader already covers initial load
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Home />
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        {/* Spinning texture background */}
        <div className="absolute inset-0 opacity-5 spin-texture"
          style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(34,211,238,0.8) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(168,85,247,0.8) 0%, transparent 50%)',
            backgroundSize: '200% 200%',
          }}
        />
        
        <Navbar />
        <main className="flex-grow relative z-10">
          <Routes>
            <Route path="/" element={<RootRedirect />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/dashboard" element={<DashBoard />} />
            <Route path="/video/:videoId" element={<VideoDetails />} />
            <Route path="/analysis" element={<Analysis />} />
            <Route path="/contact" element={<ContactUs />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
