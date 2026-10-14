export interface BrandCategoryMeta {
  id: string
  name: string
  slug: string
  icon: string
  totalBrandsCount: number
  description: string
  color: string
}

export type BrandTier = 'S-Tier' | 'A-Tier' | 'B-Tier' | 'Emerging'

export interface BrandOffer {
  id: string
  title: string
  code: string
  discount: string
  expiresIn: string
  isExclusive: boolean
  playDiscountBonus: number
}

export interface Brand {
  id: string
  slug: string
  name: string
  logo: string
  bannerImage: string
  category: string
  subCategory: string
  headquarters: string
  founded: number
  valuationOrMarketCap: string
  aceScore: number // 0 - 100
  tier: BrandTier
  website: string
  description: string
  tags: string[]
  trendingRank: number
  verified: boolean
  offers: BrandOffer[]
  playPerkDescription: string
  socials: {
    twitter?: string
    linkedin?: string
    instagram?: string
  }
}
