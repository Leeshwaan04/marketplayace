import React from 'react'
import { Container } from '../components/ui'
import { Link } from '../utils/nav'
import { SearchBox } from '../components/SearchBox'
import { useSeo } from '../utils/seo'

export const NotFoundPage: React.FC = () => {
  useSeo({ title: 'Page not found', description: 'This page does not exist.', path: null, noindex: true })
  return (
    <Container className="py-24 text-center">
      <p className="text-sm font-semibold text-accent">404</p>
      <h1 className="mt-2 text-3xl font-extrabold text-white">We could not find that page</h1>
      <p className="mx-auto mt-3 max-w-md text-ink-muted">Try searching for a company or an industry.</p>
      <div className="mx-auto mt-6 max-w-md text-left"><SearchBox /></div>
      <Link to={{ page: 'categories' }} className="mt-6 inline-block text-sm font-semibold text-accent hover:underline">Browse all industries</Link>
    </Container>
  )
}
