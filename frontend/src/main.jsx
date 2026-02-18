import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/Context.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1e293b',
            color: '#e2e8f0',
            border: '1px solid rgba(34,211,238,0.2)',
            borderRadius: '12px',
          },
          success: { iconTheme: { primary: '#22d3ee', secondary: '#0f172a' } },
          error: { iconTheme: { primary: '#f472b6', secondary: '#0f172a' } },
        }}
      />
    </AuthProvider>
  </StrictMode>,
)
