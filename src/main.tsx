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

createRoot(document.getElementById('root')!).render(<StrictMode><Root /></StrictMode>)
