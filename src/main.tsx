import '@fontsource-variable/plus-jakarta-sans'
import '@fontsource-variable/jetbrains-mono'
import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const root = document.getElementById('root')!
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

// Pages are prerendered at build time. Hydrate only when the markup was rendered for exactly this URL;
// otherwise (shell pages, query strings, unknown routes) render fresh so there is never a mismatch.
const prerendered = root.hasChildNodes() && root.dataset.route === window.location.pathname && window.location.search === ''
if (prerendered) hydrateRoot(root, app)
else createRoot(root).render(app)
