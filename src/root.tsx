import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './pages/Transcribe/index.tsx'
import './global-components/_index.css'
import "./build.css"
import * as serviceWorkerRegistration from "./scripts/serviceWorkerRegistration.ts"

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

const config : serviceWorkerRegistration.ConfigType = {
  onUpdate: ()=>{},
  onSuccess: ()=>{}
}
serviceWorkerRegistration.register(config)