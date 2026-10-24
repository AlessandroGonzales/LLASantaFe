import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { captureAccountCode } from './lib/accountLinks.js'

captureAccountCode(window.location, window.history)

createRoot(document.getElementById('root')).render(
    <App />
)
