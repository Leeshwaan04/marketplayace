// Security & Sanitization Utilities for Marketplayace (VAPT Hardening)

/**
 * Validates and sanitizes external URLs to prevent javascript:, data:, or vbscript: XSS vectors.
 */
export function sanitizeUrl(url: string, fallback: string = 'https://marketplayace.com'): string {
  if (!url || typeof url !== 'string') return fallback
  const trimmed = url.trim()
  
  // Whitelist safe protocols
  try {
    const parsed = new URL(trimmed, window.location.origin)
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return trimmed
    }
  } catch {
    // Relative safe URL
    if (trimmed.startsWith('/') && !trimmed.startsWith('//')) {
      return trimmed
    }
  }
  return fallback
}

/**
 * Strips HTML tags and potential script injections from user-supplied text.
 */
export function sanitizeText(input: string, maxLength: number = 200): string {
  if (!input || typeof input !== 'string') return ''
  const sanitized = input
    .replace(/[<>]/g, '') // strip tag delimiters
    .trim()
    .slice(0, maxLength)
  return sanitized
}

/**
 * Validates price bounds to prevent negative prices or arithmetic overflow.
 */
export function validatePrice(price: number, min: number = 1, max: number = 100000): number {
  if (isNaN(price) || !isFinite(price)) return min
  return Math.min(Math.max(price, min), max)
}

/**
 * Validates discount percentage to ensure no platform exploitation (0% - 40%).
 */
export function validateDiscountPercent(discount: number, maxAllowed: number = 40): number {
  if (isNaN(discount) || !isFinite(discount)) return 0
  return Math.min(Math.max(Math.floor(discount), 0), maxAllowed)
}

/**
 * Safe clipboard copy with fallback and error absorption.
 */
export async function safeCopyText(text: string): Promise<boolean> {
  if (!navigator?.clipboard?.writeText) {
    return false
  }
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    console.warn('Clipboard write failed or permission denied:', err)
    return false
  }
}
