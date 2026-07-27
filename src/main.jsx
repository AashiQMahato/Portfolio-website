import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import '@fontsource-variable/space-grotesk'
import '@fontsource-variable/jetbrains-mono'
import './index.css'
createRoot(document.getElementById('root')).render(
  <StrictMode>
  <App/>
  </StrictMode>,
)
