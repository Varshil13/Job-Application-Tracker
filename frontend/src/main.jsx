import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AuthPages from './signup.jsx'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <AuthPages/>
  </StrictMode>,
)
