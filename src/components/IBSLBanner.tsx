import React from 'react'

export interface IBSLBannerProps {
  className?: string
  variant?: 'leaderboard' | 'medium' | 'card' | 'responsive'
}

export const IBSL_LINK = 'https://indiabullssecurities.onelink.me/Kaqz/marketplayace'

export const IBSLBanner: React.FC<IBSLBannerProps> = ({ className = '', variant = 'responsive' }) => {
  return (
    <aside aria-label="Sponsored" className={`w-full overflow-hidden rounded-xl border border-line bg-surface-1 shadow-sm transition-all hover:border-line-strong ${className}`}>
      <a
        href={IBSL_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="group block w-full focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-surface-0"
        aria-label="Indiabulls Securities - Zero Account Opening Charges, 11 Rupees Per Executed Order Across All Segments, 20 Years Of Trust - Open Your Free Account Now"
      >
        {variant === 'leaderboard' ? (
          <img
            src="/banners/ibsl-banner-leaderboard.jpg"
            alt="Indiabulls Securities - Zero Account Opening Charges, 11 Rupees Per Executed Order Across All Segments, 20 Years Of Trust"
            className="w-full h-auto object-cover transition-opacity duration-200 group-hover:opacity-95"
            loading="lazy"
            width={1024}
            height={136}
          />
        ) : variant === 'card' ? (
          <img
            src="/banners/ibsl-banner-card.jpg"
            alt="Indiabulls Securities - Zero Account Opening Charges, 11 Rupees Per Executed Order Across All Segments, 20 Years Of Trust"
            className="w-full h-auto object-cover transition-opacity duration-200 group-hover:opacity-95"
            loading="lazy"
            width={1000}
            height={400}
          />
        ) : variant === 'medium' ? (
          <img
            src="/banners/ibsl-banner-medium.jpg"
            alt="Indiabulls Securities - Zero Account Opening Charges, 11 Rupees Per Executed Order Across All Segments, 20 Years Of Trust"
            className="w-full h-auto object-cover transition-opacity duration-200 group-hover:opacity-95"
            loading="lazy"
            width={1024}
            height={256}
          />
        ) : (
          <picture>
            <source media="(min-width: 1024px)" srcSet="/banners/ibsl-banner-leaderboard.jpg" width={1024} height={136} />
            <source media="(min-width: 640px)" srcSet="/banners/ibsl-banner-medium.jpg" width={1024} height={256} />
            <img
              src="/banners/ibsl-banner-card.jpg"
              alt="Indiabulls Securities - Zero Account Opening Charges, 11 Rupees Per Executed Order Across All Segments, 20 Years Of Trust"
              className="w-full h-auto object-cover transition-opacity duration-200 group-hover:opacity-95"
              loading="lazy"
              width={1000}
              height={400}
            />
          </picture>
        )}
      </a>
    </aside>
  )
}
