import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/amiri/arabic-400.css'
import '@fontsource/amiri/arabic-700.css'
import '@fontsource/scheherazade-new/arabic-400.css'
import './styles.css'
import { lazy, Suspense, useEffect, useState } from 'react'
import App from './App'
const Admin = lazy(() => import('./admin/Admin'))
const PruefView = lazy(() => import('./components/PruefView'))

function Root() {
  const [hash, setHash] = useState(location.hash)
  useEffect(() => { const f = () => setHash(location.hash); addEventListener('hashchange', f); return () => removeEventListener('hashchange', f) }, [])
  if (hash.startsWith('#/admin')) return <Suspense fallback={null}><Admin /></Suspense>
  if (hash.startsWith('#/pruefen')) return <Suspense fallback={null}><PruefView /></Suspense>
  return <App />
}

// Neue App-Version sofort übernehmen: wenn ein neuer Service Worker die Kontrolle übernimmt, einmal neu laden
if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
  let neu = false
  navigator.serviceWorker.addEventListener('controllerchange', () => { if (!neu) { neu = true; location.reload() } })
}
createRoot(document.getElementById('root')!).render(<StrictMode><Root /></StrictMode>)
