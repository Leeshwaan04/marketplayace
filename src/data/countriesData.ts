export interface CityMeta {
  name: string
  slug: string
  hubType: 'Major Tech Hub' | 'Financial Center' | 'E-Commerce Capital' | 'Innovation District'
  brandCount: number
}

export interface CountryMeta {
  id: string
  name: string
  slug: string
  code: string
  flag: string
  continent: string
  totalBrandsCount: number
  primaryTechHub: string
  currency: string
  cities: CityMeta[]
}

export const MASTER_COUNTRIES: CountryMeta[] = [
  {
    id: 'country-in',
    name: 'India',
    slug: 'india',
    code: 'IN',
    flag: '🇮🇳',
    continent: 'Asia',
    totalBrandsCount: 18450,
    primaryTechHub: 'Bengaluru',
    currency: 'INR (₹)',
    cities: [
      { name: 'Mumbai', slug: 'mumbai', hubType: 'Financial Center', brandCount: 4620 },
      { name: 'Bengaluru', slug: 'bengaluru', hubType: 'Major Tech Hub', brandCount: 5890 },
      { name: 'Gurugram', slug: 'gurugram', hubType: 'E-Commerce Capital', brandCount: 2940 },
      { name: 'Delhi NCR', slug: 'delhi-ncr', hubType: 'Innovation District', brandCount: 2310 },
      { name: 'Hyderabad', slug: 'hyderabad', hubType: 'Major Tech Hub', brandCount: 1680 },
      { name: 'Pune', slug: 'pune', hubType: 'Innovation District', brandCount: 1010 }
    ]
  },
  {
    id: 'country-us',
    name: 'United States',
    slug: 'united-states',
    code: 'US',
    flag: '🇺🇸',
    continent: 'North America',
    totalBrandsCount: 22100,
    primaryTechHub: 'San Francisco',
    currency: 'USD ($)',
    cities: [
      { name: 'San Francisco', slug: 'san-francisco', hubType: 'Major Tech Hub', brandCount: 7850 },
      { name: 'New York', slug: 'new-york', hubType: 'Financial Center', brandCount: 6420 },
      { name: 'Austin', slug: 'austin', hubType: 'Innovation District', brandCount: 2780 },
      { name: 'Seattle', slug: 'seattle', hubType: 'E-Commerce Capital', brandCount: 2950 },
      { name: 'Boston', slug: 'boston', hubType: 'Major Tech Hub', brandCount: 2100 }
    ]
  },
  {
    id: 'country-gb',
    name: 'United Kingdom',
    slug: 'united-kingdom',
    code: 'GB',
    flag: '🇬🇧',
    continent: 'Europe',
    totalBrandsCount: 7600,
    primaryTechHub: 'London',
    currency: 'GBP (£)',
    cities: [
      { name: 'London', slug: 'london', hubType: 'Financial Center', brandCount: 5210 },
      { name: 'Manchester', slug: 'manchester', hubType: 'Innovation District', brandCount: 1240 },
      { name: 'Edinburgh', slug: 'edinburgh', hubType: 'Major Tech Hub', brandCount: 680 },
      { name: 'Cambridge', slug: 'cambridge', hubType: 'Major Tech Hub', brandCount: 470 }
    ]
  },
  {
    id: 'country-ae',
    name: 'United Arab Emirates',
    slug: 'uae',
    code: 'AE',
    flag: '🇦🇪',
    continent: 'Middle East',
    totalBrandsCount: 3420,
    primaryTechHub: 'Dubai',
    currency: 'AED (د.إ)',
    cities: [
      { name: 'Dubai', slug: 'dubai', hubType: 'Financial Center', brandCount: 2640 },
      { name: 'Abu Dhabi', slug: 'abu-dhabi', hubType: 'Innovation District', brandCount: 780 }
    ]
  },
  {
    id: 'country-sg',
    name: 'Singapore',
    slug: 'singapore',
    code: 'SG',
    flag: '🇸🇬',
    continent: 'Asia',
    totalBrandsCount: 2950,
    primaryTechHub: 'Singapore',
    currency: 'SGD (S$)',
    cities: [
      { name: 'Singapore', slug: 'singapore', hubType: 'Major Tech Hub', brandCount: 2950 }
    ]
  },
  {
    id: 'country-jp',
    name: 'Japan',
    slug: 'japan',
    code: 'JP',
    flag: '🇯🇵',
    continent: 'Asia',
    totalBrandsCount: 4180,
    primaryTechHub: 'Tokyo',
    currency: 'JPY (¥)',
    cities: [
      { name: 'Tokyo', slug: 'tokyo', hubType: 'Major Tech Hub', brandCount: 3120 },
      { name: 'Osaka', slug: 'osaka', hubType: 'Innovation District', brandCount: 1060 }
    ]
  },
  {
    id: 'country-de',
    name: 'Germany',
    slug: 'germany',
    code: 'DE',
    flag: '🇩🇪',
    continent: 'Europe',
    totalBrandsCount: 3890,
    primaryTechHub: 'Berlin',
    currency: 'EUR (€)',
    cities: [
      { name: 'Berlin', slug: 'berlin', hubType: 'Innovation District', brandCount: 2150 },
      { name: 'Munich', slug: 'munich', hubType: 'Major Tech Hub', brandCount: 1140 },
      { name: 'Frankfurt', slug: 'frankfurt', hubType: 'Financial Center', brandCount: 600 }
    ]
  },
  {
    id: 'country-fr',
    name: 'France',
    slug: 'france',
    code: 'FR',
    flag: '🇫🇷',
    continent: 'Europe',
    totalBrandsCount: 2840,
    primaryTechHub: 'Paris',
    currency: 'EUR (€)',
    cities: [
      { name: 'Paris', slug: 'paris', hubType: 'Major Tech Hub', brandCount: 2340 },
      { name: 'Lyon', slug: 'lyon', hubType: 'Innovation District', brandCount: 500 }
    ]
  },
  {
    id: 'country-ca',
    name: 'Canada',
    slug: 'canada',
    code: 'CA',
    flag: '🇨🇦',
    continent: 'North America',
    totalBrandsCount: 3150,
    primaryTechHub: 'Toronto',
    currency: 'CAD (C$)',
    cities: [
      { name: 'Toronto', slug: 'toronto', hubType: 'Financial Center', brandCount: 1890 },
      { name: 'Vancouver', slug: 'vancouver', hubType: 'Major Tech Hub', brandCount: 1260 }
    ]
  },
  {
    id: 'country-au',
    name: 'Australia',
    slug: 'australia',
    code: 'AU',
    flag: '🇦🇺',
    continent: 'Oceania',
    totalBrandsCount: 2470,
    primaryTechHub: 'Sydney',
    currency: 'AUD (A$)',
    cities: [
      { name: 'Sydney', slug: 'sydney', hubType: 'Financial Center', brandCount: 1580 },
      { name: 'Melbourne', slug: 'melbourne', hubType: 'Innovation District', brandCount: 890 }
    ]
  }
]

