import React, { useState } from 'react'
import type { Company } from '../data/companies'

const SIZES = { sm: 'h-9 w-9 text-sm', md: 'h-12 w-12 text-base', lg: 'h-16 w-16 text-xl', xl: 'h-20 w-20 text-2xl' }

/**
 * Shows a free-licence logo we host ourselves, or a neutral monogram.
 * We never recreate or approximate a brand's mark.
 */
export const CompanyLogo: React.FC<{ company: Pick<Company, 'name' | 'logo'>; size?: keyof typeof SIZES; className?: string }> = ({
  company,
  size = 'md',
  className = ''
}) => {
  const [failed, setFailed] = useState(false)
  const box = `${SIZES[size]} shrink-0 rounded-xl ${className}`
  if (company.logo?.usable && company.logo.path && !failed) {
    return (
      <span className={`${box} flex items-center justify-center bg-white p-1.5`}>
        <img
          src={company.logo.path}
          alt={`${company.name} logo`}
          className="h-full w-full object-contain"
          loading="lazy"
          onError={() => setFailed(true)}
        />
      </span>
    )
  }
  return (
    <span
      className={`${box} flex items-center justify-center border border-line-strong bg-surface-2 font-bold text-ink-muted`}
      aria-hidden
    >
      {company.name.replace(/[^A-Za-z0-9]/g, '').slice(0, 2).toUpperCase()}
    </span>
  )
}
