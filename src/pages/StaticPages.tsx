import React from 'react'
import { Container, Breadcrumbs } from '../components/ui'
import { Link } from '../utils/nav'
import { useSeo } from '../utils/seo'
import { COMPANIES, DATA_GENERATED_AT } from '../data/companies'
import { CATEGORIES } from '../data/taxonomy'
import { SITE } from '../config/site'

const Doc: React.FC<{ title: string; intro: string; children: React.ReactNode }> = ({ title, intro, children }) => (
  <Container className="pb-20 pt-8">
    <Breadcrumbs items={[{ label: 'Home', to: { page: 'home' } }, { label: title }]} />
    <article className="max-w-3xl">
      <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">{title}</h1>
      <p className="mt-3 text-lg leading-relaxed text-ink-muted">{intro}</p>
      <div className="mt-8 space-y-8 leading-relaxed text-ink-muted [&_h2]:mb-2 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-white [&_a]:text-accent [&_a:hover]:underline [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5 [&_strong]:text-white">
        {children}
      </div>
    </article>
  </Container>
)

export const MethodologyPage: React.FC = () => {
  useSeo({
    title: 'Methodology: how we source and verify company data',
    description: 'Where our company facts come from, how we choose and review them, how we handle gaps and logos, and what we do not publish.',
    path: '/methodology'
  })
  return (
    <Doc title="Methodology" intro="How a fact gets onto Marketplayace, and what we deliberately leave out.">
      <section>
        <h2>What we publish</h2>
        <p>
          Company profiles built from named public sources: founding year, headquarters, founders, listings, headcount and
          reported financials. Next to each value you can see where it came from and when we retrieved it.
        </p>
      </section>
      <section>
        <h2>Where the data comes from</h2>
        <ul>
          <li>
            <strong>Wikidata</strong>, the open knowledge base behind Wikipedia (CC0). It is our baseline for basic facts and
            for linking to a company&apos;s Wikipedia article.
          </li>
          <li><strong>Companies&apos; own websites</strong>, linked from each profile.</li>
          <li>
            <strong>Regulatory filings and annual reports</strong> are the target source for financials. Until a filing is
            linked, figures come from open data and are labelled with their period.
          </li>
        </ul>
      </section>
      <section>
        <h2>How a company is added</h2>
        <p>
          A person matches each company to its Wikidata entry by hand, because names are ambiguous (for example, several
          things are called &ldquo;Zepto&rdquo;). A script then fetches the facts. A company with no reliable match is not
          published. Right now {COMPANIES.length} companies across {new Set(COMPANIES.flatMap((c) => c.categories)).size} of{' '}
          {CATEGORIES.length} industries are profiled. Data was last synced on {DATA_GENERATED_AT}.
        </p>
      </section>
      <section>
        <h2>Gaps and stale data</h2>
        <ul>
          <li>If we have no verified value, the profile says so. We do not estimate, round up or infer.</li>
          <li>Figures dated three or more years ago are flagged as possibly out of date.</li>
          <li>Open data can be wrong or lag behind events. Financial figures are not live and are not investment advice.</li>
        </ul>
      </section>
      <section>
        <h2>Logos and trademarks</h2>
        <p>
          We show a logo only when Wikimedia Commons lists it under a free licence, and we host the file ourselves with
          its licence and author recorded. Otherwise you see a plain monogram. We never redraw or approximate a brand&apos;s
          mark. All names and marks belong to their owners, and we are not affiliated with the companies profiled.
        </p>
      </section>
      <section>
        <h2>What we do not do</h2>
        <ul>
          <li>We do not accept payment for listing, ranking or editing a profile.</li>
          <li>We do not publish scores, ranks or &ldquo;best of&rdquo; lists that we cannot explain from data.</li>
          <li>We do not publish promo codes unless a brand or an official partner programme has supplied them.</li>
          <li>The company lists under &ldquo;Planned coverage&rdquo; are coverage targets, not recommendations.</li>
        </ul>
      </section>
      <section>
        <h2>Corrections</h2>
        <p>
          {SITE.contactEmail ? (
            <>
              Found an error? Email <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a> with the company, the
              value and a source, and we will review it.
            </>
          ) : (
            <>Each profile links to its sources so errors can be traced and fixed upstream. A dedicated corrections contact is coming.</>
          )}
        </p>
      </section>
      <section>
        <h2>Labs</h2>
        <p>
          <Link to={{ page: 'labs', tab: 'floor' }}>Labs</Link> holds experimental shopping mechanics. Everything there uses
          sample listings, and nothing is for sale. It is kept separate from company data.
        </p>
      </section>
    </Doc>
  )
}

export const AboutPage: React.FC = () => {
  useSeo({
    title: 'About Marketplayace',
    description: 'What Marketplayace is, who it is for, and the standards we hold our data to.',
    path: '/about'
  })
  return (
    <Doc title="About Marketplayace" intro="A company and industry reference that shows its sources.">
      <section>
        <h2>What it is</h2>
        <p>
          Marketplayace helps you discover companies by industry, with a focus on both Indian and global brands. It started
          in {SITE.foundedYear} and is early: coverage is small and growing, and we show exactly what we cover.
        </p>
      </section>
      <section>
        <h2>Our standards</h2>
        <ul>
          <li>Every fact is traceable to a source and a retrieval date.</li>
          <li>Missing data is shown as missing, not guessed.</li>
          <li>Editorial independence: no company can pay for placement, ranking or changes.</li>
        </ul>
        <p>
          The full process is on the <Link to={{ page: 'methodology' }}>methodology page</Link>.
        </p>
      </section>
      {SITE.legalEntity && (
        <section>
          <h2>Who runs it</h2>
          <p>{SITE.legalEntity}</p>
        </section>
      )}
      {SITE.contactEmail && (
        <section>
          <h2>Contact</h2>
          <p><a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a></p>
        </section>
      )}
    </Doc>
  )
}

export const PrivacyPage: React.FC = () => {
  useSeo({
    title: 'Privacy',
    description: 'What data Marketplayace collects. Currently none beyond standard hosting logs.',
    path: '/privacy'
  })
  return (
    <Doc title="Privacy" intro="Short version: we do not track you.">
      <section>
        <h2>What we collect</h2>
        <ul>
          <li>No accounts, no sign-up and no forms that send data to us.</li>
          <li>No analytics, advertising or tracking scripts.</li>
          <li>No cookies and no data stored in your browser.</li>
          <li>Fonts and logos are served from our own domain, so your visit does not contact other companies&apos; servers.</li>
        </ul>
      </section>
      <section>
        <h2>Hosting</h2>
        <p>
          The site is hosted on Cloudflare, which processes standard request data such as IP address and user agent to
          deliver pages and protect against abuse, under its own privacy policy.
        </p>
      </section>
      <section>
        <h2>External links</h2>
        <p>Source links and company websites are third-party sites with their own policies.</p>
      </section>
      <section>
        <h2>Changes</h2>
        <p>If we add analytics or accounts, we will update this page before we do and say what changes.</p>
      </section>
    </Doc>
  )
}
