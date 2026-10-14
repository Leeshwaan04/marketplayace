import type { Brand, BrandTier } from '../types/brand'

// Flagship real-world brands across primary categories
export const FLAGSHIP_BRANDS: Brand[] = [
  // --- QUICK COMMERCE ---
  {
    id: 'brand-qc-1',
    slug: 'zepto',
    name: 'Zepto',
    logo: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=200&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
    category: 'quick-commerce',
    subCategory: '10-Minute Groceries & Electronics',
    headquarters: 'Mumbai, India',
    founded: 2021,
    valuationOrMarketCap: '$5.0 Billion',
    aceScore: 97,
    tier: 'S-Tier',
    website: 'https://zepto.com',
    description: 'Pioneered 10-minute grocery delivery in India, operating an ultra-dense network of micro-fulfillment dark stores with sub-second picking robotics.',
    tags: ['Dark Store', 'Instant Delivery', 'Fresh Produce', 'Electronics'],
    trendingRank: 1,
    verified: true,
    socials: { twitter: '@ZeptoNow', linkedin: 'zepto' },
    playPerkDescription: 'Play the Reflex Bar to unlock flat 25% off your dark-store basket + free instant delivery token.',
    offers: [
      { id: 'off-z1', title: 'Flat ₹150 Off First 3 Orders', code: 'ZEPTOACE150', discount: '₹150 OFF', expiresIn: 'Today', isExclusive: true, playDiscountBonus: 25 },
      { id: 'off-z2', title: 'Free Cold Brew & Snack Drop', code: 'FREEZEPTO', discount: 'FREE ITEM', expiresIn: '3 Days', isExclusive: false, playDiscountBonus: 15 }
    ]
  },
  {
    id: 'brand-qc-2',
    slug: 'blinkit',
    name: 'Blinkit',
    logo: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=200&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=1200&q=80',
    category: 'quick-commerce',
    subCategory: 'Dark Store Everything Delivery',
    headquarters: 'Gurugram, India',
    founded: 2013,
    valuationOrMarketCap: '$12.0 Billion (Zomato Group)',
    aceScore: 98,
    tier: 'S-Tier',
    website: 'https://blinkit.com',
    description: 'Instant delivery platform delivering everything from iPhone releases and Playstation consoles to coriander and fresh dairy within 8-12 minutes.',
    tags: ['Zomato', 'Quick Retail', 'Tech Drops', '10-Min Delivery'],
    trendingRank: 2,
    verified: true,
    socials: { twitter: '@letsblinkit', linkedin: 'blinkit' },
    playPerkDescription: 'Unlock priority queue delivery + instant ₹200 wallet cashback upon scoring 90%+ in the Reflex Mini-game.',
    offers: [
      { id: 'off-b1', title: '15-Minute PlayStation 5 Access Drop', code: 'BLINKITPS5', discount: 'PRIORITY QUEUE', expiresIn: 'Active', isExclusive: true, playDiscountBonus: 30 }
    ]
  },
  {
    id: 'brand-qc-3',
    slug: 'instacart',
    name: 'Instacart',
    logo: 'https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?auto=format&fit=crop&w=200&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1579113800032-c38bd7635818?auto=format&fit=crop&w=1200&q=80',
    category: 'quick-commerce',
    subCategory: 'Grocery Technology & Fulfillment',
    headquarters: 'San Francisco, CA, USA',
    founded: 2012,
    valuationOrMarketCap: '$10.5 Billion (NASDAQ: CART)',
    aceScore: 94,
    tier: 'S-Tier',
    website: 'https://instacart.com',
    description: 'North America’s leading grocery technology company partnering with over 1,400 retail banners to fulfill on-demand grocery and household essentials.',
    tags: ['North America', 'Retail AI', 'Cart Delivery', 'Same-Day'],
    trendingRank: 5,
    verified: true,
    socials: { twitter: '@Instacart', linkedin: 'instacart' },
    playPerkDescription: 'Score 30% off your first Instacart+ annual membership through Marketplayace Squad Rooms.',
    offers: [
      { id: 'off-i1', title: '3 Free Months Instacart+ Access', code: 'ACEPLUS3M', discount: 'FREE VIP', expiresIn: '7 Days', isExclusive: true, playDiscountBonus: 20 }
    ]
  },
  {
    id: 'brand-qc-4',
    slug: 'gopuff',
    name: 'Gopuff',
    logo: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=200&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?auto=format&fit=crop&w=1200&q=80',
    category: 'quick-commerce',
    subCategory: 'Instant Needs & Beverages',
    headquarters: 'Philadelphia, PA, USA',
    founded: 2013,
    valuationOrMarketCap: '$8.9 Billion',
    aceScore: 92,
    tier: 'A-Tier',
    website: 'https://gopuff.com',
    description: 'Delivers late-night snacks, drinks, over-the-counter medicine, and pet food in minutes straight from vertically integrated fulfillment micro-warehouses.',
    tags: ['Late Night', 'Snacks', 'Micro-Fulfillment', 'BevTech'],
    trendingRank: 8,
    verified: true,
    socials: { twitter: '@gopuff' },
    playPerkDescription: 'Claim a free mystery snack pack on orders over $25 with any Marketplayace win.',
    offers: [
      { id: 'off-g1', title: 'Instant $15 Off First 2 Orders', code: 'GOPUFF15', discount: '$15 OFF', expiresIn: 'Active', isExclusive: false, playDiscountBonus: 15 }
    ]
  },

  // --- E-COMMERCE ---
  {
    id: 'brand-ec-1',
    slug: 'amazon',
    name: 'Amazon',
    logo: 'https://images.unsplash.com/photo-1523474255658-4af61b1684c2?auto=format&fit=crop&w=200&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
    category: 'e-commerce',
    subCategory: 'Global Marketplace & Cloud',
    headquarters: 'Seattle, WA, USA',
    founded: 1994,
    valuationOrMarketCap: '$2.1 Trillion (NASDAQ: AMZN)',
    aceScore: 99,
    tier: 'S-Tier',
    website: 'https://amazon.com',
    description: 'The world’s largest online retailer and cloud infrastructure provider, serving hundreds of millions of consumers with Prime 1-day fulfillment.',
    tags: ['Global Leader', 'Prime', 'Cloud', 'Logistics'],
    trendingRank: 1,
    verified: true,
    socials: { twitter: '@amazon' },
    playPerkDescription: 'Exclusive Prime Gaming loot drops & $20 Marketplayace gift voucher integration.',
    offers: [
      { id: 'off-am1', title: '$25 Gift Card on Prime Tech Bundles', code: 'AMZACE25', discount: '$25 BACK', expiresIn: 'Limited', isExclusive: true, playDiscountBonus: 20 }
    ]
  },
  {
    id: 'brand-ec-2',
    slug: 'shopify',
    name: 'Shopify',
    logo: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=200&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
    category: 'e-commerce',
    subCategory: 'Omnichannel Commerce Platform',
    headquarters: 'Ottawa, Canada',
    founded: 2006,
    valuationOrMarketCap: '$110 Billion (NYSE: SHOP)',
    aceScore: 98,
    tier: 'S-Tier',
    website: 'https://shopify.com',
    description: 'Powers millions of independent merchant brands worldwide, handling everything from payments and fulfillment to AI-assisted storefront creation.',
    tags: ['D2C', 'Merchant Cloud', 'Shop Pay', 'Commerce'],
    trendingRank: 3,
    verified: true,
    socials: { twitter: '@Shopify' },
    playPerkDescription: 'Shop Pay 1-click accelerated checkout with 10% gamified cashback tokens.',
    offers: [
      { id: 'off-sh1', title: 'Shop Pay 10% Instant Cashback', code: 'SHOPACE10', discount: '10% BACK', expiresIn: 'Ongoing', isExclusive: true, playDiscountBonus: 10 }
    ]
  },

  // --- PHARMACY & HEALTHTECH ---
  {
    id: 'brand-ph-1',
    slug: 'tata-1mg',
    name: 'Tata 1mg',
    logo: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=200&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=1200&q=80',
    category: 'pharmacy',
    subCategory: 'Digital Healthcare & Diagnostics',
    headquarters: 'Gurugram, India',
    founded: 2015,
    valuationOrMarketCap: '$1.4 Billion (Tata Digital)',
    aceScore: 96,
    tier: 'S-Tier',
    website: 'https://1mg.com',
    description: 'India’s leading consumer healthcare platform, providing genuine prescription medicines, certified lab tests at home, and verified doctor teleconsultations.',
    tags: ['Prescription', 'Lab Tests', 'Telehealth', 'Tata Group'],
    trendingRank: 1,
    verified: true,
    socials: { twitter: '@tata1mg' },
    playPerkDescription: 'Play the Reflex challenge to unlock 25% off prescription medicines + free home blood sample collection.',
    offers: [
      { id: 'off-1mg1', title: 'Flat 25% Off Medicines + Free Lab Pick', code: 'ACE1MG25', discount: '25% OFF', expiresIn: 'Active', isExclusive: true, playDiscountBonus: 25 }
    ]
  },
  {
    id: 'brand-ph-2',
    slug: 'cvs-health',
    name: 'CVS Health',
    logo: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=200&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?auto=format&fit=crop&w=1200&q=80',
    category: 'pharmacy',
    subCategory: 'Retail Pharmacy & Managed Care',
    headquarters: 'Woonsocket, RI, USA',
    founded: 1963,
    valuationOrMarketCap: '$80 Billion (NYSE: CVS)',
    aceScore: 95,
    tier: 'S-Tier',
    website: 'https://cvs.com',
    description: 'Operates over 9,000 retail locations, MinuteClinics, pharmacy benefits management, and digital wellness services across the United States.',
    tags: ['Prescriptions', 'Wellness', 'MinuteClinic', 'ExtraCare'],
    trendingRank: 4,
    verified: true,
    socials: { twitter: '@CVSHealth' },
    playPerkDescription: 'Double ExtraCare Rewards points on all wellness essentials via Marketplayace perks.',
    offers: [
      { id: 'off-cvs1', title: '$20 ExtraBucks Rewards Credit', code: 'CVSACE20', discount: '$20 REWARDS', expiresIn: 'Active', isExclusive: false, playDiscountBonus: 15 }
    ]
  },

  // --- GAMING & ESPORTS ---
  {
    id: 'brand-gm-1',
    slug: 'razer',
    name: 'Razer',
    logo: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=200&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
    category: 'gaming',
    subCategory: 'Gaming Hardware, Laptops & Chroma',
    headquarters: 'Irvine, CA & Singapore',
    founded: 2005,
    valuationOrMarketCap: '$3.2 Billion',
    aceScore: 99,
    tier: 'S-Tier',
    website: 'https://razer.com',
    description: 'The global leading lifestyle brand for gamers. Recognized worldwide for iconic triple-headed snake hardware, Chroma RGB lighting, and esports peripherals.',
    tags: ['For Gamers By Gamers', 'Chroma RGB', 'Esports Gear', 'Laptops'],
    trendingRank: 1,
    verified: true,
    socials: { twitter: '@Razer' },
    playPerkDescription: 'Win up to 30% discount on Razer DeathAdder mice and BlackWidow keyboards by completing the Bullseye Challenge.',
    offers: [
      { id: 'off-rz1', title: '30% Off Razer Blade & Peripherals Drop', code: 'RAZERACE30', discount: '30% OFF', expiresIn: '5 Days', isExclusive: true, playDiscountBonus: 30 }
    ]
  },
  {
    id: 'brand-gm-2',
    slug: 'valve-steam',
    name: 'Valve (Steam)',
    logo: 'https://images.unsplash.com/photo-1612287232230-67d7168c7e2b?auto=format&fit=crop&w=200&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80',
    category: 'gaming',
    subCategory: 'Digital Distribution & Steam Deck',
    headquarters: 'Bellevue, WA, USA',
    founded: 1996,
    valuationOrMarketCap: '$8.5 Billion (Private)',
    aceScore: 100,
    tier: 'S-Tier',
    website: 'https://steampowered.com',
    description: 'Creator of the legendary Steam platform, Steam Deck handheld console, and seminal franchises including Half-Life, Portal, Counter-Strike 2, and Dota 2.',
    tags: ['Steam', 'Counter-Strike', 'Steam Deck', 'PC Gaming'],
    trendingRank: 2,
    verified: true,
    socials: { twitter: '@valvesoftware' },
    playPerkDescription: 'Instant $10 Steam Wallet Code claimable through Marketplayace Squad Drops.',
    offers: [
      { id: 'off-st1', title: '$10 Steam Wallet Top-Up Code', code: 'STEAMACE10', discount: '$10 CODE', expiresIn: 'Active', isExclusive: true, playDiscountBonus: 20 }
    ]
  },

  // --- AVIATION & AIRLINES ---
  {
    id: 'brand-av-1',
    slug: 'emirates',
    name: 'Emirates',
    logo: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=200&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80',
    category: 'aviation',
    subCategory: 'Ultra-Luxury Long-Haul Airlines',
    headquarters: 'Dubai, United Arab Emirates',
    founded: 1985,
    valuationOrMarketCap: 'Government of Dubai ($35B+ Revenue)',
    aceScore: 99,
    tier: 'S-Tier',
    website: 'https://emirates.com',
    description: 'The world’s premier international airline operating the largest fleet of Airbus A380s and Boeing 777s, renowned for First Class private suites and onboard shower spas.',
    tags: ['A380', 'Luxury Travel', 'Skywards', 'Global Hub'],
    trendingRank: 1,
    verified: true,
    socials: { twitter: '@emirates' },
    playPerkDescription: 'Slash 15% off business class international bookings + earn 5,000 bonus Skywards miles via Marketplayace Dutch Drops.',
    offers: [
      { id: 'off-em1', title: '15% Off Flights + 5,000 Skywards Miles', code: 'EMIRATESACE15', discount: '15% OFF', expiresIn: '7 Days', isExclusive: true, playDiscountBonus: 20 }
    ]
  },
  {
    id: 'brand-av-2',
    slug: 'singapore-airlines',
    name: 'Singapore Airlines',
    logo: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=200&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1520437358207-323b43b50729?auto=format&fit=crop&w=1200&q=80',
    category: 'aviation',
    subCategory: '5-Star Hospitality Carrier',
    headquarters: 'Singapore',
    founded: 1947,
    valuationOrMarketCap: '$18.0 Billion (SGX: C6L)',
    aceScore: 99,
    tier: 'S-Tier',
    website: 'https://singaporeair.com',
    description: 'Consistently voted the World’s Best Airline by Skytrax, famous for exceptional KrisWorld inflight entertainment, haute cuisine, and Singapore Girl hospitality.',
    tags: ['Skytrax Best', 'KrisFlyer', 'Star Alliance', 'Singapore'],
    trendingRank: 2,
    verified: true,
    socials: { twitter: '@SingaporeAir' },
    playPerkDescription: 'Squad-book flights with 3 travelers to unlock complimentary lounge access pass.',
    offers: [
      { id: 'off-sq1', title: 'SilverKris Lounge Access Pass', code: 'SQACELOUNGE', discount: 'FREE PASS', expiresIn: 'Active', isExclusive: true, playDiscountBonus: 25 }
    ]
  },

  // --- FINTECH & PAYMENTS ---
  {
    id: 'brand-ft-1',
    slug: 'stripe',
    name: 'Stripe',
    logo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=200&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1559526324-593bc073d998?auto=format&fit=crop&w=1200&q=80',
    category: 'fintech',
    subCategory: 'Financial Infrastructure for the Internet',
    headquarters: 'San Francisco & Dublin',
    founded: 2010,
    valuationOrMarketCap: '$70.0 Billion',
    aceScore: 99,
    tier: 'S-Tier',
    website: 'https://stripe.com',
    description: 'Dual-headquartered payments infrastructure giant powering economic transactions for startups to Fortune 500 giants like Amazon, Google, and Uber.',
    tags: ['Payments API', 'Global Fintech', 'Stripe Connect', 'Issuing'],
    trendingRank: 1,
    verified: true,
    socials: { twitter: '@stripe' },
    playPerkDescription: 'Waived processing fees on your first $20,000 transaction volume for verified Marketplayace creators.',
    offers: [
      { id: 'off-str1', title: '$20,000 Fee-Free Processing Credit', code: 'STRIPEACE20K', discount: 'FEE-FREE', expiresIn: 'Ongoing', isExclusive: true, playDiscountBonus: 20 }
    ]
  },
  {
    id: 'brand-ft-2',
    slug: 'revolut',
    name: 'Revolut',
    logo: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=200&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1559526323-cb2f2fe05917?auto=format&fit=crop&w=1200&q=80',
    category: 'fintech',
    subCategory: 'Global Neobank & Multi-Currency',
    headquarters: 'London, United Kingdom',
    founded: 2015,
    valuationOrMarketCap: '$45.0 Billion',
    aceScore: 97,
    tier: 'S-Tier',
    website: 'https://revolut.com',
    description: 'Europe’s most valuable fintech app offering multi-currency accounts, international FX at interbank rates, crypto trading, and Metal cards to 45M+ users.',
    tags: ['Neobank', 'Zero FX', 'Metal Card', 'Crypto'],
    trendingRank: 2,
    verified: true,
    socials: { twitter: '@RevolutApp' },
    playPerkDescription: 'Receive a free customized Black Metal Card + 3 months Revolut Ultra subscription with your Ace Tier win.',
    offers: [
      { id: 'off-rev1', title: 'Free Metal Card + 3 Months Ultra Plan', code: 'REVACEMETAL', discount: 'FREE VIP', expiresIn: 'Active', isExclusive: true, playDiscountBonus: 25 }
    ]
  },

  // --- AI & ROBOTICS ---
  {
    id: 'brand-ai-1',
    slug: 'openai',
    name: 'OpenAI',
    logo: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=200&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    category: 'ai-robotics',
    subCategory: 'Frontier AI & Large Language Models',
    headquarters: 'San Francisco, CA, USA',
    founded: 2015,
    valuationOrMarketCap: '$157 Billion',
    aceScore: 100,
    tier: 'S-Tier',
    website: 'https://openai.com',
    description: 'Creator of ChatGPT, GPT-4o, DALL·E 3, and Sora, driving the global frontier in generative artificial intelligence and agentic workflows.',
    tags: ['AGI', 'ChatGPT', 'GPT-4o', 'Deep Learning'],
    trendingRank: 1,
    verified: true,
    socials: { twitter: '@OpenAI' },
    playPerkDescription: '$50 API credits for developers exploring Marketplayace AI agent integrations.',
    offers: [
      { id: 'off-oa1', title: '$50 Free API Developer Credit Token', code: 'OPENAIACE50', discount: '$50 CREDIT', expiresIn: 'Active', isExclusive: true, playDiscountBonus: 30 }
    ]
  },

  // --- ELECTRIC VEHICLES & AUTO ---
  {
    id: 'brand-ev-1',
    slug: 'tesla',
    name: 'Tesla',
    logo: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=200&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1536700503339-1e4b06520771?auto=format&fit=crop&w=1200&q=80',
    category: 'ev-auto',
    subCategory: 'Electric Vehicles & Clean Energy',
    headquarters: 'Austin, TX, USA',
    founded: 2003,
    valuationOrMarketCap: '$800+ Billion (NASDAQ: TSLA)',
    aceScore: 98,
    tier: 'S-Tier',
    website: 'https://tesla.com',
    description: 'Accelerating the world’s transition to sustainable energy with Cybertruck, Model S/3/X/Y, Full Self-Driving (FSD), Megapack storage, and Optimus humanoid robots.',
    tags: ['Cybertruck', 'FSD', 'Clean Energy', 'Supercharger'],
    trendingRank: 1,
    verified: true,
    socials: { twitter: '@Tesla' },
    playPerkDescription: 'Unlock 3 months of complimentary Full Self-Driving (FSD) + 1,000 Free Supercharging miles.',
    offers: [
      { id: 'off-ts1', title: '1,000 Free Supercharger Miles', code: 'TESLAACE1000', discount: 'FREE MILES', expiresIn: 'Active', isExclusive: true, playDiscountBonus: 20 }
    ]
  }
]

// Algorithmic Procedural Directory Generator:
// Allows instantly generating realistic, high-fidelity brands for any of the 52 categories
// so every category has 1,000+ searchable and viewable brands without huge static JSON bundle bloat!

const HQ_CITIES = [
  'San Francisco, CA', 'New York, NY', 'London, UK', 'Tokyo, Japan',
  'Bengaluru, India', 'Singapore', 'Berlin, Germany', 'Austin, TX',
  'Seoul, South Korea', 'Zurich, Switzerland', 'Toronto, Canada', 'Stockholm, Sweden'
]

const BRAND_PREFIXES: Record<string, string[]> = {
  'quick-commerce': ['Dash', 'Hyper', 'Swift', 'Flash', 'Volt', 'Nano', 'Minute', 'Breeze', 'Omni', 'Orbit'],
  'e-commerce': ['Prime', 'Cart', 'Bazaar', 'Market', 'Shop', 'Nova', 'Apex', 'Store', 'Hub', 'Plaza'],
  'pharmacy': ['Medi', 'Pharma', 'Cure', 'Bio', 'Health', 'Pulse', 'Rx', 'Vital', 'Wellness', 'ApexRx'],
  'gaming': ['Cyber', 'Pixel', 'Vortex', 'Nexus', 'Gamer', 'Titan', 'Apex', 'Chrono', 'Hyper', 'Shadow'],
  'aviation': ['Aero', 'Sky', 'Wing', 'Jet', 'Flight', 'Cloud', 'Horizon', 'Air', 'Stratosphere', 'Zephyr'],
  'fintech': ['Pay', 'Vault', 'Ledger', 'Coin', 'Capital', 'Mint', 'Stash', 'Block', 'Liquid', 'FinEdge'],
  'ai-robotics': ['Neural', 'Cognitive', 'Synapse', 'Cortex', 'Matrix', 'Agentic', 'Auto', 'Tensor', 'Bot', 'QuantumAI']
}

const BRAND_SUFFIXES = ['Works', 'Labs', 'Global', 'Technologies', 'Systems', 'Networks', 'Dynamics', 'Direct', 'Hub', 'Club', 'Connect', 'One']

export function generateCategoryBrands(categorySlug: string, count: number = 60): Brand[] {
  // First check if we have hand-crafted flagship brands for this category
  const flagships = FLAGSHIP_BRANDS.filter((b) => b.category === categorySlug)

  const prefixes = BRAND_PREFIXES[categorySlug] || ['Nova', 'Apex', 'Hyper', 'Quantum', 'Vanguard', 'Omni', 'Titan', 'Aura']
  const generated: Brand[] = []

  for (let i = 1; i <= count; i++) {
    const prefix = prefixes[i % prefixes.length]
    const suffix = BRAND_SUFFIXES[(i * 3) % BRAND_SUFFIXES.length]
    const brandName = `${prefix}${suffix} ${i > prefixes.length ? `#${i}` : ''}`.trim()
    const id = `gen-${categorySlug}-${i}`
    const aceScore = 80 + ((i * 7) % 20)
    const tier: BrandTier = aceScore >= 95 ? 'S-Tier' : aceScore >= 88 ? 'A-Tier' : 'B-Tier'

    generated.push({
      id,
      slug: `${categorySlug}-${i}`,
      name: brandName,
      logo: `https://images.unsplash.com/photo-${1500000000000 + (i * 12345) % 1000000}?auto=format&fit=crop&w=200&q=80`,
      bannerImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
      category: categorySlug,
      subCategory: `${categorySlug.replace('-', ' ').toUpperCase()} Verified Provider`,
      headquarters: HQ_CITIES[i % HQ_CITIES.length],
      founded: 2010 + (i % 14),
      valuationOrMarketCap: `$${(100 + (i * 35) % 900)} Million`,
      aceScore,
      tier,
      website: `https://${brandName.toLowerCase().replace(/[^a-z0-9]/g, '')}.marketplayace.com`,
      description: `Verified enterprise brand in ${categorySlug.replace('-', ' ')} operating high-efficiency services with native Marketplayace smart-contract discounts and game perks.`,
      tags: ['Verified Brand', 'Play Perk Ready', 'Instant Voucher', 'Ace Escrow'],
      trendingRank: i + 10,
      verified: i % 2 === 0,
      socials: { twitter: `@${brandName.replace(/\s+/g, '')}` },
      playPerkDescription: `Play the Reflex Mini-game to unlock an exclusive ${10 + (i % 25)}% discount voucher redeemable on official store.`,
      offers: [
        {
          id: `off-${id}-1`,
          title: `Exclusive ${15 + (i % 20)}% Off Welcome Perk`,
          code: `ACE${prefix.toUpperCase()}${15 + (i % 20)}`,
          discount: `${15 + (i % 20)}% OFF`,
          expiresIn: '7 Days',
          isExclusive: true,
          playDiscountBonus: 20
        }
      ]
    })
  }

  return [...flagships, ...generated]
}
