import { SiteHeader } from './components/SiteHeader'
import { Footer } from './components/Footer'
import { NavProvider } from './utils/navContext'
import { useRoute } from './utils/router'
import { HomePage } from './pages/HomePage'
import { CategoriesPage } from './pages/CategoriesPage'
import { CategoryPage } from './pages/CategoryPage'
import { CompanyPage } from './pages/CompanyPage'
import { MethodologyPage, AboutPage, PrivacyPage } from './pages/StaticPages'
import { NotFoundPage } from './pages/NotFoundPage'
import { LabsPage } from './pages/LabsPage'

export function App() {
  const { route, navigate } = useRoute()

  const page = (() => {
    switch (route.page) {
      case 'home': return <HomePage />
      case 'categories': return <CategoriesPage />
      case 'category': return <CategoryPage key={route.slug} slug={route.slug} />
      case 'company': return <CompanyPage key={route.slug} slug={route.slug} />
      case 'methodology': return <MethodologyPage />
      case 'about': return <AboutPage />
      case 'privacy': return <PrivacyPage />
      case 'labs': return <LabsPage tab={route.tab} onTabChange={(tab) => navigate({ page: 'labs', tab })} />
      default: return <NotFoundPage />
    }
  })()

  return (
    <NavProvider value={navigate}>
      <div className="flex min-h-screen flex-col bg-surface-0 text-ink">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <SiteHeader current={route.page} />
        <main id="main" className="flex-1">{page}</main>
        <Footer />
      </div>
    </NavProvider>
  )
}

export default App
