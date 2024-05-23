import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './pages/Transcribe/index.tsx'
// import './global-components/_index.css'
import "./build.css"

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
