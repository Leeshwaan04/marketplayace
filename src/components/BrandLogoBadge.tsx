import React from 'react'
import type { Brand } from '../types/brand'

interface BrandLogoBadgeProps {
  brand: Brand
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export const BrandLogoBadge: React.FC<BrandLogoBadgeProps> = ({ brand, className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-base',
    xl: 'w-20 h-20 sm:w-24 sm:h-24 text-xl'
  }[size]

  // Render authentic vector brand marks for flagship brands
  switch (brand.slug) {
    case 'amazon':
      return (
        <div
          className={`${sizeClasses} rounded-2xl flex items-center justify-center p-2 shadow-lg shrink-0 ${className}`}
          style={{ backgroundColor: '#131921', border: '1px solid #37475A' }}
          title="Amazon Official Logo"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden="true">
            <rect width="100" height="100" rx="22" fill="#131921" />
            <text
              x="50"
              y="52"
              textAnchor="middle"
              fontFamily="system-ui, sans-serif"
              fontWeight="900"
              fontSize="24"
              fill="#FFFFFF"
              letterSpacing="-1"
            >
              amazon
            </text>
            {/* Amazon orange smile arrow */}
            <path
              d="M26 62 C38 72 62 72 74 62"
              fill="none"
              stroke="#FF9900"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d="M70 60 L76 62 L73 68 Z"
              fill="#FF9900"
            />
          </svg>
        </div>
      )

    case 'openai':
      return (
        <div
          className={`${sizeClasses} rounded-2xl flex items-center justify-center p-2 shadow-lg shrink-0 ${className}`}
          style={{ backgroundColor: '#000000', border: '1px solid #222222' }}
          title="OpenAI Official Logo"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden="true">
            <rect width="100" height="100" rx="22" fill="#000000" />
            {/* OpenAI spiral flower */}
            <g fill="none" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M50 24 L68 34 V54 L50 64 L32 54 V34 Z" />
              <path d="M50 24 V64" />
              <path d="M68 34 L32 54" />
              <path d="M32 34 L68 54" />
            </g>
          </svg>
        </div>
      )

    case 'zepto':
      return (
        <div
          className={`${sizeClasses} rounded-2xl flex items-center justify-center p-2 shadow-lg transition-transform duration-200 shrink-0 ${className}`}
          style={{ backgroundColor: '#57007B', border: '1px solid #8808CC' }}
          title="Zepto Official Logo"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full fill-current text-white" aria-hidden="true">
            <rect width="100" height="100" rx="22" fill="#57007B" />
            <path
              d="M22 28 H78 L42 66 H78 V76 H22 L58 38 H22 Z"
              fill="#FF007A"
            />
            <path
              d="M30 24 H74 L46 58 H74 V66 H30 L58 32 H30 Z"
              fill="#FFFFFF"
            />
            <circle cx="75" cy="25" r="7" fill="#FFB800" />
          </svg>
        </div>
      )

    case 'blinkit':
      return (
        <div
          className={`${sizeClasses} rounded-2xl flex items-center justify-center p-1.5 shadow-lg shrink-0 ${className}`}
          style={{ backgroundColor: '#F8CB46', border: '1px solid #E5B830' }}
          title="Blinkit Official Logo"
        >
          <svg viewBox="0 0 120 120" className="w-full h-full" aria-hidden="true">
            <rect width="120" height="120" rx="26" fill="#F8CB46" />
            <g transform="translate(14, 38)">
              <text
                x="0"
                y="36"
                fontFamily="system-ui, -apple-system, sans-serif"
                fontWeight="900"
                fontSize="38"
                letterSpacing="-2"
                fill="#0C831F"
              >
                blink
              </text>
              <text
                x="76"
                y="36"
                fontFamily="system-ui, -apple-system, sans-serif"
                fontWeight="900"
                fontSize="38"
                letterSpacing="-2"
                fill="#E23744"
              >
                it
              </text>
            </g>
          </svg>
        </div>
      )

    case 'instacart':
      return (
        <div
          className={`${sizeClasses} rounded-2xl flex items-center justify-center p-2 shadow-lg shrink-0 ${className}`}
          style={{ backgroundColor: '#003D29', border: '1px solid #005A3C' }}
          title="Instacart Official Logo"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden="true">
            <rect width="100" height="100" rx="22" fill="#003D29" />
            {/* Carrot Top Greens */}
            <path
              d="M62 24 C62 18 54 18 52 24 C50 18 42 18 42 24 C42 30 52 34 52 34 C52 34 62 30 62 24 Z"
              fill="#00B140"
            />
            {/* Orange Carrot Body */}
            <path
              d="M38 34 C36 34 32 38 34 44 L48 76 C50 80 54 80 56 76 L70 44 C72 38 68 34 66 34 Z"
              fill="#FF7700"
            />
          </svg>
        </div>
      )

    case 'gopuff':
      return (
        <div
          className={`${sizeClasses} rounded-2xl flex items-center justify-center p-2 shadow-lg shrink-0 ${className}`}
          style={{ backgroundColor: '#0A1128', border: '1px solid #00A3FF' }}
          title="Gopuff Official Logo"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden="true">
            <rect width="100" height="100" rx="22" fill="#0A1128" />
            <circle cx="50" cy="50" r="32" fill="#00A3FF" opacity="0.2" />
            <path
              d="M34 30 H66 C72 30 76 34 76 40 V50 C76 62 64 72 50 72 C36 72 26 60 26 48 C26 38 32 30 34 30 Z"
              fill="none"
              stroke="#00A3FF"
              strokeWidth="7"
              strokeLinecap="round"
            />
            <path
              d="M50 48 H72"
              stroke="#00A3FF"
              strokeWidth="7"
              strokeLinecap="round"
            />
          </svg>
        </div>
      )

    case 'zomato':
      return (
        <div
          className={`${sizeClasses} rounded-2xl flex items-center justify-center p-2 shadow-lg shrink-0 ${className}`}
          style={{ backgroundColor: '#E23744', border: '1px solid #FF5261' }}
          title="Zomato Official Logo"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden="true">
            <rect width="100" height="100" rx="22" fill="#E23744" />
            <text
              x="50"
              y="62"
              textAnchor="middle"
              fontFamily="system-ui, -apple-system, sans-serif"
              fontWeight="900"
              fontStyle="italic"
              fontSize="28"
              fill="#FFFFFF"
              letterSpacing="-1"
            >
              zomato
            </text>
          </svg>
        </div>
      )

    case 'swiggy':
      return (
        <div
          className={`${sizeClasses} rounded-2xl flex items-center justify-center p-2 shadow-lg shrink-0 ${className}`}
          style={{ backgroundColor: '#FC8019', border: '1px solid #FF9838' }}
          title="Swiggy Official Logo"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden="true">
            <rect width="100" height="100" rx="22" fill="#FC8019" />
            {/* Swiggy Locator Map Pin S mark */}
            <path
              d="M50 20 C38 20 28 30 28 42 C28 54 44 72 50 80 C56 72 72 54 72 42 C72 30 62 20 50 20 Z"
              fill="#FFFFFF"
            />
            <path
              d="M54 34 C50 34 46 36 46 40 C46 44 56 46 56 50 C56 54 50 56 46 54"
              fill="none"
              stroke="#FC8019"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>
        </div>
      )

    case 'stripe':
      return (
        <div
          className={`${sizeClasses} rounded-2xl flex items-center justify-center p-2 shadow-lg shrink-0 ${className}`}
          style={{ backgroundColor: '#635BFF', border: '1px solid #7D75FF' }}
          title="Stripe Official Logo"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden="true">
            <rect width="100" height="100" rx="22" fill="#635BFF" />
            <text
              x="50"
              y="60"
              textAnchor="middle"
              fontFamily="system-ui, -apple-system, sans-serif"
              fontWeight="800"
              fontSize="34"
              fill="#FFFFFF"
              letterSpacing="-2"
            >
              stripe
            </text>
          </svg>
        </div>
      )

    case 'razorpay':
      return (
        <div
          className={`${sizeClasses} rounded-2xl flex items-center justify-center p-2 shadow-lg shrink-0 ${className}`}
          style={{ backgroundColor: '#0C2340', border: '1px solid #3395FF' }}
          title="Razorpay Official Logo"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden="true">
            <rect width="100" height="100" rx="22" fill="#0C2340" />
            {/* Razorpay sharp blade glyph */}
            <path
              d="M32 24 L56 24 L42 50 L64 50 L38 76 L48 54 L32 54 Z"
              fill="#3395FF"
            />
          </svg>
        </div>
      )

    case 'razer':
      return (
        <div
          className={`${sizeClasses} rounded-2xl flex items-center justify-center p-2 shadow-lg shrink-0 ${className}`}
          style={{ backgroundColor: '#050505', border: '1px solid #00FF00' }}
          title="Razer Official Logo"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden="true">
            <rect width="100" height="100" rx="22" fill="#050505" />
            {/* Triple green serpent emblem */}
            <g fill="none" stroke="#00FF00" strokeWidth="5" strokeLinecap="round">
              <path d="M50 22 V78" />
              <path d="M30 36 C34 50 48 54 50 78" />
              <path d="M70 36 C66 50 52 54 50 78" />
            </g>
            <circle cx="50" cy="22" r="4" fill="#00FF00" />
            <circle cx="30" cy="36" r="4" fill="#00FF00" />
            <circle cx="70" cy="36" r="4" fill="#00FF00" />
          </svg>
        </div>
      )

    case 'emirates':
      return (
        <div
          className={`${sizeClasses} rounded-2xl flex items-center justify-center p-2 shadow-lg shrink-0 ${className}`}
          style={{ backgroundColor: '#D71921', border: '1px solid #F1434B' }}
          title="Emirates Official Logo"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden="true">
            <rect width="100" height="100" rx="22" fill="#D71921" />
            {/* Arabic calligraphy callout & English logotype */}
            <path
              d="M26 40 C32 30 44 28 50 36 C56 28 68 30 74 40 C68 50 56 52 50 44 C44 52 32 50 26 40 Z"
              fill="#D4AF37"
            />
            <text
              x="50"
              y="68"
              textAnchor="middle"
              fontFamily="Georgia, serif"
              fontWeight="bold"
              fontSize="16"
              fill="#FFFFFF"
              letterSpacing="1"
            >
              Emirates
            </text>
          </svg>
        </div>
      )

    case 'tesla':
      return (
        <div
          className={`${sizeClasses} rounded-2xl flex items-center justify-center p-2 shadow-lg shrink-0 ${className}`}
          style={{ backgroundColor: '#111111', border: '1px solid #E82127' }}
          title="Tesla Official Logo"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden="true">
            <rect width="100" height="100" rx="22" fill="#111111" />
            {/* Tesla T shield */}
            <path
              d="M50 32 L30 26 C40 22 60 22 70 26 L50 32 Z"
              fill="#E82127"
            />
            <path
              d="M47 38 H53 V76 H47 Z"
              fill="#E82127"
            />
            <path
              d="M32 35 C42 34 58 34 68 35 L64 42 C56 40 44 40 36 42 Z"
              fill="#E82127"
            />
          </svg>
        </div>
      )

    case 'tata-1mg':
    case '1mg':
      return (
        <div
          className={`${sizeClasses} rounded-2xl flex items-center justify-center p-1.5 shadow-lg shrink-0 ${className}`}
          style={{ backgroundColor: '#FFFFFF', border: '1px solid #FF6F61' }}
          title="Tata 1mg Official Logo"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden="true">
            <rect width="100" height="100" rx="22" fill="#FFFFFF" />
            <rect x="18" y="22" width="64" height="24" rx="6" fill="#1A243B" />
            <text
              x="50"
              y="38"
              textAnchor="middle"
              fontFamily="system-ui, sans-serif"
              fontWeight="900"
              fontSize="14"
              fill="#FFFFFF"
              letterSpacing="2"
            >
              TATA
            </text>
            <text
              x="50"
              y="74"
              textAnchor="middle"
              fontFamily="system-ui, sans-serif"
              fontWeight="900"
              fontSize="28"
              fill="#FF6F61"
            >
              1mg
            </text>
          </svg>
        </div>
      )

    case 'apple':
      return (
        <div
          className={`${sizeClasses} rounded-2xl flex items-center justify-center p-2 shadow-lg shrink-0 ${className}`}
          style={{ backgroundColor: '#1A1A1E', border: '1px solid #33333A' }}
          title="Apple Official Logo"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden="true">
            <rect width="100" height="100" rx="22" fill="#1A1A1E" />
            {/* Apple Silhouette */}
            <path
              d="M56 22 C59 18 63 16 68 16 C68 21 65 25 61 27 C58 29 55 27 56 22 Z"
              fill="#F5F5F7"
            />
            <path
              d="M66 48 C66 40 72 36 73 35 C69 30 63 29 59 29 C52 29 48 33 44 33 C40 33 36 29 30 29 C22 29 15 36 15 48 C15 59 22 75 30 75 C34 75 37 72 42 72 C47 72 50 75 55 75 C63 75 69 62 72 57 C67 55 66 51 66 48 Z"
              fill="#F5F5F7"
              transform="translate(8, 0)"
            />
          </svg>
        </div>
      )

    case 'spotify':
      return (
        <div
          className={`${sizeClasses} rounded-2xl flex items-center justify-center p-2 shadow-lg shrink-0 ${className}`}
          style={{ backgroundColor: '#121212', border: '1px solid #1ED760' }}
          title="Spotify Official Logo"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden="true">
            <rect width="100" height="100" rx="22" fill="#121212" />
            <circle cx="50" cy="50" r="32" fill="#1ED760" />
            <g fill="none" stroke="#121212" strokeWidth="4.5" strokeLinecap="round">
              <path d="M34 40 C44 36 56 36 66 41" />
              <path d="M36 49 C45 46 55 46 64 50" />
              <path d="M38 58 C45 55 53 55 60 59" />
            </g>
          </svg>
        </div>
      )

    case 'airbnb':
      return (
        <div
          className={`${sizeClasses} rounded-2xl flex items-center justify-center p-2 shadow-lg shrink-0 ${className}`}
          style={{ backgroundColor: '#FFFFFF', border: '1px solid #FF385C' }}
          title="Airbnb Official Logo"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden="true">
            <rect width="100" height="100" rx="22" fill="#FFFFFF" />
            {/* Airbnb Bélo symbol */}
            <path
              d="M50 20 C42 20 32 34 32 50 C32 64 42 76 50 76 C58 76 68 64 68 50 C68 34 58 20 50 20 Z M50 62 C46 62 42 56 42 50 C42 44 46 38 50 38 C54 38 58 44 58 50 C58 56 54 62 50 62 Z"
              fill="#FF385C"
            />
          </svg>
        </div>
      )

    case 'uber':
      return (
        <div
          className={`${sizeClasses} rounded-2xl flex items-center justify-center p-2 shadow-lg shrink-0 ${className}`}
          style={{ backgroundColor: '#000000', border: '1px solid #333333' }}
          title="Uber Official Logo"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden="true">
            <rect width="100" height="100" rx="22" fill="#000000" />
            <text
              x="50"
              y="60"
              textAnchor="middle"
              fontFamily="system-ui, -apple-system, sans-serif"
              fontWeight="900"
              fontSize="28"
              fill="#FFFFFF"
              letterSpacing="0"
            >
              Uber
            </text>
          </svg>
        </div>
      )

    case 'grab':
      return (
        <div
          className={`${sizeClasses} rounded-2xl flex items-center justify-center p-1.5 shadow-lg shrink-0 ${className}`}
          style={{ backgroundColor: '#00B14F', border: '1px solid #00D65F' }}
          title="Grab Official Logo"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden="true">
            <rect width="100" height="100" rx="22" fill="#00B14F" />
            <g fill="none" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round">
              <path d="M30 38 C42 38 48 50 48 64" />
              <path d="M52 38 C64 38 70 50 70 64" />
            </g>
            <text
              x="50"
              y="74"
              textAnchor="middle"
              fontFamily="system-ui, -apple-system, sans-serif"
              fontWeight="900"
              fontSize="16"
              fill="#FFFFFF"
            >
              Grab
            </text>
          </svg>
        </div>
      )

    case 'careem':
      return (
        <div
          className={`${sizeClasses} rounded-2xl flex items-center justify-center p-2 shadow-lg shrink-0 ${className}`}
          style={{ backgroundColor: '#16222F', border: '1px solid #00EC5F' }}
          title="Careem Official Logo"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden="true">
            <rect width="100" height="100" rx="22" fill="#16222F" />
            <circle cx="50" cy="50" r="28" fill="none" stroke="#00EC5F" strokeWidth="7" />
            <circle cx="62" cy="42" r="5" fill="#00EC5F" />
          </svg>
        </div>
      )

    default: {
      // Procedural SVG badge with brand colors, country flag watermark, and sleek typography
      const initials = brand.name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0])
        .join('')
        .toUpperCase() || brand.name.slice(0, 2).toUpperCase()

      const brandBg = brand.brandColor || '#3B82F6'

      return (
        <div
          className={`${sizeClasses} rounded-2xl flex items-center justify-center relative overflow-hidden shadow-lg shrink-0 ${className}`}
          style={{
            backgroundColor: brandBg,
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}
          title={`${brand.name} Logo`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/40 pointer-events-none" />
          <span className="font-black text-white tracking-wider font-mono drop-shadow-md select-none z-10">
            {initials}
          </span>
          {/* Subtle country flag micro badge */}
          {brand.countryFlag && (
            <span className="absolute bottom-0.5 right-1 text-[10px] opacity-80 pointer-events-none z-10">
              {brand.countryFlag}
            </span>
          )}
        </div>
      )
    }
  }
}
