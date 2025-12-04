import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './APP'
import './APP.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
