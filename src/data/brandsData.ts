import type { Brand, BrandTier } from '../types/brand'
import { MASTER_COUNTRIES } from './countriesData'

// Flagship real-world brands across primary global categories with realistic pre-login site content and visual assets
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
    headquarters: 'Mumbai, Maharashtra, India',
    city: 'Mumbai',
    country: 'India',
    countryCode: 'IN',
    countryFlag: '🇮🇳',
    brandColor: '#57007B',
    brandTextColor: '#FFFFFF',
    heroTagline: '10-Minute Grocery Delivery across India',
    heroSubhead: 'Groceries, fresh farm produce, cosmetics, and electronics delivered in 10 minutes from your neighborhood dark store.',
    preLoginHighlights: [
      'Sub-10 Minute Delivery Guarantee',
      'Zero Surge Pricing with Zepto Pass',
      'Sub-second Dark Store Robotics',
      '10,000+ Fresh SKU Product Drops'
    ],
    appRating: {
      ios: 4.8,
      android: 4.7,
      downloads: '50M+'
    },
    officialLoginUrl: 'https://www.zeptonow.com',
    founded: 2021,
    valuationOrMarketCap: '$5.0 Billion',
    aceScore: 97,
    tier: 'S-Tier',
    website: 'https://zepto.com',
    description: 'Pioneered 10-minute grocery delivery in India, operating an ultra-dense network of micro-fulfillment dark stores with sub-second picking robotics.',
    tags: ['Dark Store', 'Instant Delivery', 'Fresh Produce', 'Electronics', 'Mumbai Tech'],
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
    headquarters: 'Gurugram, Haryana, India',
    city: 'Gurugram',
    country: 'India',
    countryCode: 'IN',
    countryFlag: '🇮🇳',
    brandColor: '#F8CB46',
    brandTextColor: '#0C831F',
    heroTagline: "India's Last Minute App - Delivered in 10 Minutes",
    heroSubhead: 'Everything from fresh coriander and cold dairy to Apple iPhone 16 Pro, PS5 consoles, and emergency chargers at your doorstep in 10 minutes.',
    preLoginHighlights: [
      '8 to 12 Min Express Dark Stores',
      'Zomato Gold Linked Benefits',
      'Instant Electronics & Tech Drops',
      'Document Print Store & Gift Wrapping'
    ],
    appRating: {
      ios: 4.8,
      android: 4.6,
      downloads: '100M+'
    },
    officialLoginUrl: 'https://blinkit.com',
    founded: 2013,
    valuationOrMarketCap: '$12.0 Billion (Zomato Group)',
    aceScore: 98,
    tier: 'S-Tier',
    website: 'https://blinkit.com',
    description: 'Instant delivery platform delivering everything from iPhone releases and Playstation consoles to coriander and fresh dairy within 8 to 12 minutes.',
    tags: ['Zomato', 'Quick Retail', 'Tech Drops', '10-Min Delivery', 'NCR Hub'],
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
    city: 'San Francisco',
    country: 'United States',
    countryCode: 'US',
    countryFlag: '🇺🇸',
    brandColor: '#003D29',
    brandTextColor: '#FFFFFF',
    heroTagline: 'Groceries and more delivered fast from local stores',
    heroSubhead: 'Get fresh produce, pantry staples, and same-day delivery or pickup from 1,400+ national and regional retailers across North America.',
    preLoginHighlights: [
      '1,400+ Retail Banners Connected',
      'Same-Day Delivery in 1 Hour',
      'Instacart+ Free Delivery Perks',
      'In-Store Prices Guaranteed'
    ],
    appRating: {
      ios: 4.8,
      android: 4.4,
      downloads: '50M+'
    },
    officialLoginUrl: 'https://www.instacart.com',
    founded: 2012,
    valuationOrMarketCap: '$10.5 Billion (NASDAQ: CART)',
    aceScore: 94,
    tier: 'S-Tier',
    website: 'https://instacart.com',
    description: 'North America leading grocery technology company partnering with over 1,400 retail banners to fulfill on-demand grocery and household essentials.',
    tags: ['North America', 'Retail AI', 'Cart Delivery', 'Same-Day', 'Bay Area'],
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
    city: 'New York',
    country: 'United States',
    countryCode: 'US',
    countryFlag: '🇺🇸',
    brandColor: '#00A3FF',
    brandTextColor: '#FFFFFF',
    heroTagline: 'Instant Needs Delivered in Minutes',
    heroSubhead: 'Snacks, drinks, over-the-counter medicine, electronics, and late-night ice cream delivered directly from local micro-fulfillment centers.',
    preLoginHighlights: [
      '24/7 Late Night Micro-Warehouses',
      'Gopuff FAM Member Free Delivery',
      'Direct-to-Consumer Vertically Integrated',
      'Alcohol and Cold Drinks in Minutes'
    ],
    appRating: {
      ios: 4.8,
      android: 4.5,
      downloads: '10M+'
    },
    officialLoginUrl: 'https://www.gopuff.com',
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

  // --- E-COMMERCE & FOOD DELIVERY ---
  {
    id: 'brand-ec-1',
    slug: 'amazon',
    name: 'Amazon',
    logo: 'https://images.unsplash.com/photo-1523474255658-4af61b1684c2?auto=format&fit=crop&w=200&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
    category: 'e-commerce',
    subCategory: 'Global Marketplace & Cloud Logistics',
    headquarters: 'Seattle, WA, USA',
    city: 'Seattle',
    country: 'United States',
    countryCode: 'US',
    countryFlag: '🇺🇸',
    brandColor: '#131921',
    brandTextColor: '#FF9900',
    heroTagline: 'Low prices, fast delivery, and millions of items',
    heroSubhead: 'Discover Prime 1-day free delivery, deals of the day, Amazon Fresh groceries, and Kindle books with guaranteed A-to-z protection.',
    preLoginHighlights: [
      'Prime 1-Day & Same-Day Free Fulfillment',
      'A-to-z Safe Purchase Guarantee',
      '100 Million+ Global Active Catalogs',
      'Amazon Alexa Voice Ordering'
    ],
    appRating: {
      ios: 4.9,
      android: 4.7,
      downloads: '500M+'
    },
    officialLoginUrl: 'https://www.amazon.com/ap/signin',
    founded: 1994,
    valuationOrMarketCap: '$2.1 Trillion (NASDAQ: AMZN)',
    aceScore: 99,
    tier: 'S-Tier',
    website: 'https://amazon.com',
    description: 'The world largest online retailer and cloud infrastructure provider, serving hundreds of millions of consumers with Prime fulfillment.',
    tags: ['Global Leader', 'Prime', 'Cloud', 'Logistics', 'Seattle Hub'],
    trendingRank: 1,
    verified: true,
    socials: { twitter: '@amazon' },
    playPerkDescription: 'Exclusive Prime Gaming loot drops & $25 Marketplayace gift voucher integration.',
    offers: [
      { id: 'off-am1', title: '$25 Gift Card on Prime Tech Bundles', code: 'AMZACE25', discount: '$25 BACK', expiresIn: 'Limited', isExclusive: true, playDiscountBonus: 20 }
    ]
  },
  {
    id: 'brand-fd-1',
    slug: 'zomato',
    name: 'Zomato',
    logo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=200&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80',
    category: 'e-commerce',
    subCategory: 'Food Delivery & Dining Out Discovery',
    headquarters: 'Gurugram, Haryana, India',
    city: 'Delhi NCR',
    country: 'India',
    countryCode: 'IN',
    countryFlag: '🇮🇳',
    brandColor: '#E23744',
    brandTextColor: '#FFFFFF',
    heroTagline: 'Discover the best food and drinks in your city',
    heroSubhead: 'Explore curated menus, verified diner reviews, instant table booking, and lightning fast hot meal delivery to your doorstep.',
    preLoginHighlights: [
      '350,000+ Verified Restaurant Partners',
      'Zomato Gold VIP Dining and Delivery',
      'Live Order Real-Time GPS Tracking',
      'Hygienic Kitchen Inspections and Audits'
    ],
    appRating: {
      ios: 4.8,
      android: 4.6,
      downloads: '100M+'
    },
    officialLoginUrl: 'https://www.zomato.com',
    founded: 2008,
    valuationOrMarketCap: '$24.0 Billion (NSE: ZOMATO)',
    aceScore: 98,
    tier: 'S-Tier',
    website: 'https://zomato.com',
    description: 'India premier food ordering and dining discovery platform connecting millions of diners with hundreds of thousands of restaurants and cloud kitchens.',
    tags: ['Zomato Gold', 'Food Tech', 'Cloud Kitchen', 'Dine-In'],
    trendingRank: 1,
    verified: true,
    socials: { twitter: '@zomato' },
    playPerkDescription: 'Play the Bullseye challenge to unlock 50% off dining bills + free Zomato Gold edition pass.',
    offers: [
      { id: 'off-zom1', title: 'Flat ₹200 Off Gourmet Orders', code: 'ZOMATOACE200', discount: '₹200 OFF', expiresIn: 'Today', isExclusive: true, playDiscountBonus: 25 }
    ]
  },
  {
    id: 'brand-fd-2',
    slug: 'swiggy',
    name: 'Swiggy',
    logo: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=200&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1200&q=80',
    category: 'e-commerce',
    subCategory: 'On-Demand Food, Instamart & Dineout',
    headquarters: 'Bengaluru, Karnataka, India',
    city: 'Bengaluru',
    country: 'India',
    countryCode: 'IN',
    countryFlag: '🇮🇳',
    brandColor: '#FC8019',
    brandTextColor: '#FFFFFF',
    heroTagline: 'Order food and groceries. Discover best restaurants.',
    heroSubhead: 'Swiggy Food, Instamart 10-minute grocery, and Dineout gourmet table reservations all in one integrated super app.',
    preLoginHighlights: [
      'Swiggy One Unlimited Free Delivery',
      'Instamart 10-Minute Dark Stores',
      'Swiggy Genie Instant Pick and Drop',
      '24/7 Late-Night Gourmet Delivery'
    ],
    appRating: {
      ios: 4.7,
      android: 4.5,
      downloads: '100M+'
    },
    officialLoginUrl: 'https://www.swiggy.com',
    founded: 2014,
    valuationOrMarketCap: '$12.5 Billion (NSE: SWIGGY)',
    aceScore: 97,
    tier: 'S-Tier',
    website: 'https://swiggy.com',
    description: 'Convenience platform delivering food, 10-minute groceries via Instamart, and package courier services across 500+ Indian cities.',
    tags: ['Swiggy One', 'Instamart', 'Bengaluru Hub', 'Superapp'],
    trendingRank: 2,
    verified: true,
    socials: { twitter: '@Swiggy' },
    playPerkDescription: 'Claim 3 months of free Swiggy One membership with any Squad Room victory.',
    offers: [
      { id: 'off-sw1', title: 'Free Swiggy One VIP Access', code: 'SWIGGYACELITE', discount: 'FREE VIP', expiresIn: 'Active', isExclusive: true, playDiscountBonus: 20 }
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
    headquarters: 'Gurugram, Haryana, India',
    city: 'Gurugram',
    country: 'India',
    countryCode: 'IN',
    countryFlag: '🇮🇳',
    brandColor: '#FF6F61',
    brandTextColor: '#1A243B',
    heroTagline: "India's Leading Online Healthcare & Pharmacy Platform",
    heroSubhead: 'Order verified prescription medicines, schedule lab health tests at home, and consult certified doctors online 24/7.',
    preLoginHighlights: [
      '100% Genuine Certified Medicines',
      'NABL-Accredited Lab Diagnostic Tests',
      'Safe Doorstep Delivery in 1,000+ Cities',
      'Free Online Doctor Consultation'
    ],
    appRating: {
      ios: 4.8,
      android: 4.5,
      downloads: '50M+'
    },
    officialLoginUrl: 'https://www.1mg.com',
    founded: 2015,
    valuationOrMarketCap: '$1.4 Billion (Tata Digital)',
    aceScore: 96,
    tier: 'S-Tier',
    website: 'https://1mg.com',
    description: 'India leading consumer healthcare platform, providing genuine prescription medicines, certified lab tests at home, and verified doctor teleconsultations.',
    tags: ['Prescription', 'Lab Tests', 'Telehealth', 'Tata Group'],
    trendingRank: 1,
    verified: true,
    socials: { twitter: '@tata1mg' },
    playPerkDescription: 'Play the Reflex challenge to unlock 25% off prescription medicines + free home blood sample collection.',
    offers: [
      { id: 'off-1mg1', title: 'Flat 25% Off Medicines + Free Lab Pick', code: 'ACE1MG25', discount: '25% OFF', expiresIn: 'Active', isExclusive: true, playDiscountBonus: 25 }
    ]
  },

  // --- GAMING & HARDWARE ---
  {
    id: 'brand-gm-1',
    slug: 'razer',
    name: 'Razer',
    logo: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=200&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
    category: 'gaming',
    subCategory: 'Gaming Hardware, Laptops & Chroma',
    headquarters: 'Singapore and Irvine, CA',
    city: 'Singapore',
    country: 'Singapore',
    countryCode: 'SG',
    countryFlag: '🇸🇬',
    brandColor: '#050505',
    brandTextColor: '#00FF00',
    heroTagline: 'For Gamers. By Gamers.',
    heroSubhead: 'High-performance gaming laptops, Chroma RGB mechanical keyboards, esports tournament mice, and spatial audio headsets.',
    preLoginHighlights: [
      'Razer Chroma RGB Lighting Ecosystem',
      'Optical Mechanical Switches & Gen-3 Sensors',
      'THX Spatial Audio Immersion',
      'Global Team Razer Esports Roster'
    ],
    appRating: {
      ios: 4.6,
      android: 4.5,
      downloads: '10M+'
    },
    officialLoginUrl: 'https://www.razer.com',
    founded: 2005,
    valuationOrMarketCap: '$3.2 Billion',
    aceScore: 99,
    tier: 'S-Tier',
    website: 'https://razer.com',
    description: 'The global leading lifestyle brand for gamers. Recognized worldwide for iconic triple-headed snake hardware, Chroma RGB lighting, and esports peripherals.',
    tags: ['For Gamers By Gamers', 'Chroma RGB', 'Esports Gear', 'Laptops', 'Singapore Tech'],
    trendingRank: 1,
    verified: true,
    socials: { twitter: '@Razer' },
    playPerkDescription: 'Win up to 30% discount on Razer DeathAdder mice and BlackWidow keyboards by completing the Bullseye Challenge.',
    offers: [
      { id: 'off-rz1', title: '30% Off Razer Blade & Peripherals Drop', code: 'RAZERACE30', discount: '30% OFF', expiresIn: '5 Days', isExclusive: true, playDiscountBonus: 30 }
    ]
  },

  // --- AVIATION & TRAVEL ---
  {
    id: 'brand-av-1',
    slug: 'emirates',
    name: 'Emirates',
    logo: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=200&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80',
    category: 'aviation',
    subCategory: 'Ultra-Luxury Long-Haul Airlines',
    headquarters: 'Dubai, United Arab Emirates',
    city: 'Dubai',
    country: 'United Arab Emirates',
    countryCode: 'AE',
    countryFlag: '🇦🇪',
    brandColor: '#D71921',
    brandTextColor: '#FFFFFF',
    heroTagline: 'Fly Better - World-Class Luxury Aviation',
    heroSubhead: 'Experience luxury aboard the A380 and Boeing 777 with First Class private suites, onboard shower spas, and award-winning ice inflight entertainment.',
    preLoginHighlights: [
      'ice Award-Winning Inflight Entertainment',
      'A380 Onboard Shower Spa & Lounge Bar',
      'Global Mega-Hub Connecting 150+ Cities',
      'Emirates Skywards Tiered Perks'
    ],
    appRating: {
      ios: 4.8,
      android: 4.6,
      downloads: '50M+'
    },
    officialLoginUrl: 'https://www.emirates.com',
    founded: 1985,
    valuationOrMarketCap: 'Government of Dubai ($35B+ Revenue)',
    aceScore: 99,
    tier: 'S-Tier',
    website: 'https://emirates.com',
    description: 'The world premier international airline operating the largest fleet of Airbus A380s and Boeing 777s, renowned for First Class private suites and onboard shower spas.',
    tags: ['A380', 'Luxury Travel', 'Skywards', 'Dubai Hub'],
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
    slug: 'airbnb',
    name: 'Airbnb',
    logo: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=200&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    category: 'aviation',
    subCategory: 'Vacation Rentals & Unique Stays',
    headquarters: 'San Francisco, CA, USA',
    city: 'San Francisco',
    country: 'United States',
    countryCode: 'US',
    countryFlag: '🇺🇸',
    brandColor: '#FF385C',
    brandTextColor: '#FFFFFF',
    heroTagline: 'Belong Anywhere - Unique Stays & Experiences Worldwide',
    heroSubhead: 'Book extraordinary homes, beachfront villas, treehouses, and local experiences hosted by passionate locals in 220+ countries.',
    preLoginHighlights: [
      'AirCover Comprehensive Guest Protection',
      '8 Million+ Curated Unique Homes',
      'Verified Host & Guest Reviews',
      '24/7 Global Customer Support'
    ],
    appRating: {
      ios: 4.8,
      android: 4.7,
      downloads: '100M+'
    },
    officialLoginUrl: 'https://www.airbnb.com',
    founded: 2008,
    valuationOrMarketCap: '$92.0 Billion (NASDAQ: ABNB)',
    aceScore: 98,
    tier: 'S-Tier',
    website: 'https://airbnb.com',
    description: 'Global marketplace for vacation rentals and tourism experiences, transforming how people travel and discover destinations across the globe.',
    tags: ['Travel', 'Unique Stays', 'AirCover', 'Bay Area'],
    trendingRank: 3,
    verified: true,
    socials: { twitter: '@Airbnb' },
    playPerkDescription: 'Win $100 off your next beach villa or chalet getaway in the Marketplayace Dutch Auction.',
    offers: [
      { id: 'off-ab1', title: '$100 Off International Villa Stays', code: 'AIRBNBACE100', discount: '$100 OFF', expiresIn: 'Active', isExclusive: true, playDiscountBonus: 25 }
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
    headquarters: 'San Francisco, CA, USA',
    city: 'San Francisco',
    country: 'United States',
    countryCode: 'US',
    countryFlag: '🇺🇸',
    brandColor: '#635BFF',
    brandTextColor: '#FFFFFF',
    heroTagline: 'Financial infrastructure for the internet',
    heroSubhead: 'Millions of companies of all sizes, from growing startups to large enterprises, use Stripe software and APIs to accept payments and manage businesses online.',
    preLoginHighlights: [
      '99.999% Historical API Uptime',
      'Payment Methods in 135+ Currencies',
      'Radar Machine Learning Fraud Prevention',
      'Instant Payouts & Global Treasury'
    ],
    appRating: {
      ios: 4.7,
      android: 4.4,
      downloads: '10M+'
    },
    officialLoginUrl: 'https://dashboard.stripe.com/login',
    founded: 2010,
    valuationOrMarketCap: '$70.0 Billion',
    aceScore: 99,
    tier: 'S-Tier',
    website: 'https://stripe.com',
    description: 'Payments infrastructure giant powering economic transactions for startups to Fortune 500 giants like Amazon, Google, and Uber.',
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
    slug: 'razorpay',
    name: 'Razorpay',
    logo: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=200&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1559526323-cb2f2fe05917?auto=format&fit=crop&w=1200&q=80',
    category: 'fintech',
    subCategory: 'Full-Stack Business Banking & Payments',
    headquarters: 'Bengaluru, Karnataka, India',
    city: 'Bengaluru',
    country: 'India',
    countryCode: 'IN',
    countryFlag: '🇮🇳',
    brandColor: '#0C2340',
    brandTextColor: '#3395FF',
    heroTagline: 'The Future of Business Banking & Payments',
    heroSubhead: 'Accept payments from Indian and global customers seamlessly with cards, UPI, netbanking, and automated payroll payouts.',
    preLoginHighlights: [
      'Powering 10M+ Indian Businesses',
      'Instant UPI AutoPay and Subscriptions',
      'RazorpayX Smart Neobanking Engine',
      '99.9% Route Payment Success Rate'
    ],
    appRating: {
      ios: 4.7,
      android: 4.6,
      downloads: '10M+'
    },
    officialLoginUrl: 'https://dashboard.razorpay.com',
    founded: 2014,
    valuationOrMarketCap: '$7.5 Billion',
    aceScore: 98,
    tier: 'S-Tier',
    website: 'https://razorpay.com',
    description: 'India leading payments and business banking platform, enabling millions of businesses to accept UPI payments, automate vendor payouts, and issue corporate cards.',
    tags: ['UPI', 'Bengaluru Fintech', 'Payment Gateway', 'Neobanking'],
    trendingRank: 2,
    verified: true,
    socials: { twitter: '@razorpay' },
    playPerkDescription: 'Flat 50% discount on first-year RazorpayX corporate card subscriptions.',
    offers: [
      { id: 'off-rzp1', title: '50% Off RazorpayX Neobanking Suite', code: 'RAZORPAYACE50', discount: '50% OFF', expiresIn: 'Active', isExclusive: true, playDiscountBonus: 25 }
    ]
  },

  // --- ELECTRIC VEHICLES & SUSTAINABILITY ---
  {
    id: 'brand-ev-1',
    slug: 'tesla',
    name: 'Tesla',
    logo: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=200&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1536700503339-1e4b06520771?auto=format&fit=crop&w=1200&q=80',
    category: 'ev-auto',
    subCategory: 'Electric Vehicles & Clean Energy',
    headquarters: 'Austin, TX, USA',
    city: 'Austin',
    country: 'United States',
    countryCode: 'US',
    countryFlag: '🇺🇸',
    brandColor: '#111111',
    brandTextColor: '#E82127',
    heroTagline: 'Accelerating Sustainable Energy & Autonomous Mobility',
    heroSubhead: 'Order Model 3, Model Y, Cybertruck, Solar Roof, and experience Full Self-Driving Supervised technology.',
    preLoginHighlights: [
      'Full Self-Driving (Supervised) AI',
      '60,000+ Supercharger Global Stalls',
      '0 to 60 mph in 1.99s (Model S Plaid)',
      'Optimus Humanoid General Robotics'
    ],
    appRating: {
      ios: 4.8,
      android: 4.6,
      downloads: '50M+'
    },
    officialLoginUrl: 'https://auth.tesla.com',
    founded: 2003,
    valuationOrMarketCap: '$800+ Billion (NASDAQ: TSLA)',
    aceScore: 98,
    tier: 'S-Tier',
    website: 'https://tesla.com',
    description: 'Accelerating the world transition to sustainable energy with Cybertruck, Model S/3/X/Y, Full Self-Driving (FSD), Megapack storage, and Optimus humanoid robots.',
    tags: ['Cybertruck', 'FSD', 'Clean Energy', 'Supercharger', 'Austin Hub'],
    trendingRank: 1,
    verified: true,
    socials: { twitter: '@Tesla' },
    playPerkDescription: 'Unlock 3 months of complimentary Full Self-Driving (FSD) + 1,000 Free Supercharging miles.',
    offers: [
      { id: 'off-ts1', title: '1,000 Free Supercharger Miles', code: 'TESLAACE1000', discount: 'FREE MILES', expiresIn: 'Active', isExclusive: true, playDiscountBonus: 20 }
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
    subCategory: 'Frontier AI & Autonomous Intelligence',
    headquarters: 'San Francisco, CA, USA',
    city: 'San Francisco',
    country: 'United States',
    countryCode: 'US',
    countryFlag: '🇺🇸',
    brandColor: '#000000',
    brandTextColor: '#FFFFFF',
    heroTagline: 'Creating safe AGI that benefits all of humanity',
    heroSubhead: 'Explore ChatGPT, GPT-4o multimodal intelligence, DALL-E image generation, and Sora video AI with enterprise security.',
    preLoginHighlights: [
      'ChatGPT Plus & Team Advanced Voice',
      'GPT-4o Multimodal Vision & Reasoning',
      'Enterprise SOC2 Data Privacy Compliance',
      'Custom GPT Agent Ecosystem'
    ],
    appRating: {
      ios: 4.9,
      android: 4.8,
      downloads: '100M+'
    },
    officialLoginUrl: 'https://chatgpt.com/auth/login',
    founded: 2015,
    valuationOrMarketCap: '$157 Billion',
    aceScore: 100,
    tier: 'S-Tier',
    website: 'https://openai.com',
    description: 'Creator of ChatGPT, GPT-4o, and Sora, leading the global frontier in artificial general intelligence and agentic workflows.',
    tags: ['AGI', 'ChatGPT', 'GPT-4o', 'Deep Learning', 'Silicon Valley'],
    trendingRank: 1,
    verified: true,
    socials: { twitter: '@OpenAI' },
    playPerkDescription: '$50 API credits for developers exploring Marketplayace AI agent integrations.',
    offers: [
      { id: 'off-oa1', title: '$50 Free API Developer Credit Token', code: 'OPENAIACE50', discount: '$50 CREDIT', expiresIn: 'Active', isExclusive: true, playDiscountBonus: 30 }
    ]
  },

  // --- MOBILITY & SUPERAPPS ---
  {
    id: 'brand-mb-1',
    slug: 'uber',
    name: 'Uber',
    logo: 'https://images.unsplash.com/photo-1510519138195-068d82f8d515?auto=format&fit=crop&w=200&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1200&q=80',
    category: 'ev-auto',
    subCategory: 'Rideshare, Delivery & Urban Mobility',
    headquarters: 'San Francisco, CA, USA',
    city: 'San Francisco',
    country: 'United States',
    countryCode: 'US',
    countryFlag: '🇺🇸',
    brandColor: '#000000',
    brandTextColor: '#FFFFFF',
    heroTagline: 'Go anywhere, get anything',
    heroSubhead: 'Request a ride, order delivery with Uber Eats, or send packages across town on-demand with 24/7 safety features.',
    preLoginHighlights: [
      'Real-Time GPS Driver Tracking',
      '24/7 In-App Safety Toolkit & RideCheck',
      'Uber One Cashback & Zero Delivery Fees',
      'Available in 10,000+ Cities Worldwide'
    ],
    appRating: {
      ios: 4.8,
      android: 4.6,
      downloads: '500M+'
    },
    officialLoginUrl: 'https://auth.uber.com',
    founded: 2009,
    valuationOrMarketCap: '$160 Billion (NYSE: UBER)',
    aceScore: 99,
    tier: 'S-Tier',
    website: 'https://uber.com',
    description: 'Global mobility platform providing ridesharing, meal delivery through Uber Eats, and freight logistics across 70+ nations.',
    tags: ['Rideshare', 'Uber Eats', 'Urban Mobility', 'Global Scale'],
    trendingRank: 2,
    verified: true,
    socials: { twitter: '@Uber' },
    playPerkDescription: 'Claim $30 in Uber rideshare and dining credits upon winning any Reflex challenge.',
    offers: [
      { id: 'off-ub1', title: '$30 Uber Credits Voucher', code: 'UBERACE30', discount: '$30 CREDITS', expiresIn: 'Active', isExclusive: true, playDiscountBonus: 20 }
    ]
  },
  {
    id: 'brand-mb-2',
    slug: 'grab',
    name: 'Grab',
    logo: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=200&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=1200&q=80',
    category: 'quick-commerce',
    subCategory: 'Southeast Asia Everyday Superapp',
    headquarters: 'Singapore',
    city: 'Singapore',
    country: 'Singapore',
    countryCode: 'SG',
    countryFlag: '🇸🇬',
    brandColor: '#00B14F',
    brandTextColor: '#FFFFFF',
    heroTagline: "Southeast Asia's Leading Everyday Superapp",
    heroSubhead: 'On-demand food delivery, ride-hailing transport, cashless GrabPay digital payments, and express parcel courier.',
    preLoginHighlights: [
      'Trusted by 180M+ Users across 8 SEA Nations',
      'GrabUnlimited Monthly Subscription Savings',
      'GrabPay & PayLater Financial Freedom',
      '5-Star Safety Rated Drivers and Riders'
    ],
    appRating: {
      ios: 4.8,
      android: 4.7,
      downloads: '100M+'
    },
    officialLoginUrl: 'https://www.grab.com/login',
    founded: 2012,
    valuationOrMarketCap: '$15.0 Billion (NASDAQ: GRAB)',
    aceScore: 97,
    tier: 'S-Tier',
    website: 'https://grab.com',
    description: 'Southeast Asia superapp offering food delivery, transport, digital financial services, and enterprise logistics across 8 countries.',
    tags: ['Superapp', 'Southeast Asia', 'GrabPay', 'Transport'],
    trendingRank: 3,
    verified: true,
    socials: { twitter: '@grabsg' },
    playPerkDescription: 'Unlock flat 25% off GrabFood orders + GrabUnlimited 30-day VIP pass.',
    offers: [
      { id: 'off-gr1', title: '25% Off GrabFood Feast', code: 'GRABACE25', discount: '25% OFF', expiresIn: '7 Days', isExclusive: true, playDiscountBonus: 25 }
    ]
  },
  {
    id: 'brand-mb-3',
    slug: 'careem',
    name: 'Careem',
    logo: 'https://images.unsplash.com/photo-1508873696983-2df5293cb395?auto=format&fit=crop&w=200&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
    category: 'quick-commerce',
    subCategory: 'The Everything App for the Middle East',
    headquarters: 'Dubai, United Arab Emirates',
    city: 'Dubai',
    country: 'United Arab Emirates',
    countryCode: 'AE',
    countryFlag: '🇦🇪',
    brandColor: '#16222F',
    brandTextColor: '#00EC5F',
    heroTagline: 'The Everything App for the Middle East',
    heroSubhead: 'Book rides, order food, pay bills, clean your home, and transfer money instantly across Dubai, Abu Dhabi, and the MENA region.',
    preLoginHighlights: [
      'Careem Plus Unlimited Free Delivery & Discounts',
      'Hala Taxi & Luxury Chauffeur Fleet',
      'Careem Pay Instant Peer-to-Peer Transfers',
      'Licensed by Dubai Roads & Transport Authority'
    ],
    appRating: {
      ios: 4.7,
      android: 4.5,
      downloads: '50M+'
    },
    officialLoginUrl: 'https://www.careem.com',
    founded: 2012,
    valuationOrMarketCap: '$3.1 Billion (Uber Subsidiary)',
    aceScore: 96,
    tier: 'S-Tier',
    website: 'https://careem.com',
    description: 'The premier multi-service platform for the greater Middle East, offering ride-hailing, food and grocery delivery, digital wallets, and home services.',
    tags: ['Middle East', 'Dubai Tech', 'Careem Pay', 'Superapp'],
    trendingRank: 4,
    verified: true,
    socials: { twitter: '@careem' },
    playPerkDescription: 'Claim 3 months of Careem Plus free delivery pass with any Marketplayace win.',
    offers: [
      { id: 'off-cr1', title: 'Free Careem Plus 3-Month Pass', code: 'CAREEMACEPLUS', discount: 'FREE VIP', expiresIn: 'Active', isExclusive: true, playDiscountBonus: 20 }
    ]
  }
]

// Procedural brand name prefixes and colors for diverse categories
const BRAND_PREFIXES: Record<string, string[]> = {
  'quick-commerce': ['Dash', 'Hyper', 'Swift', 'Flash', 'Volt', 'Nano', 'Minute', 'Breeze', 'Omni', 'Orbit'],
  'e-commerce': ['Prime', 'Cart', 'Bazaar', 'Market', 'Shop', 'Nova', 'Apex', 'Store', 'Hub', 'Plaza'],
  'pharmacy': ['Medi', 'Pharma', 'Cure', 'Bio', 'Health', 'Pulse', 'Rx', 'Vital', 'Wellness', 'ApexRx'],
  'gaming': ['Cyber', 'Pixel', 'Vortex', 'Nexus', 'Gamer', 'Titan', 'Apex', 'Chrono', 'Hyper', 'Shadow'],
  'aviation': ['Aero', 'Sky', 'Wing', 'Jet', 'Flight', 'Cloud', 'Horizon', 'Air', 'Stratosphere', 'Zephyr'],
  'fintech': ['Pay', 'Vault', 'Ledger', 'Coin', 'Capital', 'Mint', 'Stash', 'Block', 'Liquid', 'FinEdge'],
  'ai-robotics': ['Neural', 'Cognitive', 'Synapse', 'Cortex', 'Matrix', 'Agentic', 'Auto', 'Tensor', 'Bot', 'QuantumAI'],
  'ev-auto': ['Electra', 'Volt', 'Ampere', 'Kinetic', 'ApexDrive', 'NeoDrive', 'Flux', 'HyperEV', 'PureDrive']
}

const BRAND_SUFFIXES = ['Works', 'Labs', 'Global', 'Technologies', 'Systems', 'Networks', 'Dynamics', 'Direct', 'Hub', 'Club', 'Connect', 'One']

const BRAND_PALETTES = [
  '#2563EB', '#7C3AED', '#DB2777', '#059669', '#D97706',
  '#4F46E5', '#0891B2', '#0D9488', '#DC2626', '#1E293B'
]

// Helper to deterministically pick a realistic city and country from MASTER_COUNTRIES
function getCountryAndCityByIndex(index: number) {
  const country = MASTER_COUNTRIES[index % MASTER_COUNTRIES.length]
  const city = country.cities[(index * 3) % country.cities.length]
  return { country, city }
}

// Procedural brand directory generator for any category
export function generateCategoryBrands(categorySlug: string, count: number = 60): Brand[] {
  // First pick flagship brands belonging to this category
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
    const { country, city } = getCountryAndCityByIndex(i)
    const brandColor = BRAND_PALETTES[i % BRAND_PALETTES.length]

    generated.push({
      id,
      slug: `${categorySlug}-${i}`,
      name: brandName,
      logo: `https://images.unsplash.com/photo-${1500000000000 + (i * 12345) % 1000000}?auto=format&fit=crop&w=200&q=80`,
      bannerImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
      category: categorySlug,
      subCategory: `${categorySlug.replace('-', ' ').toUpperCase()} Verified Provider`,
      headquarters: `${city.name}, ${country.name}`,
      city: city.name,
      country: country.name,
      countryCode: country.code,
      countryFlag: country.flag,
      brandColor,
      brandTextColor: '#FFFFFF',
      heroTagline: `Official Enterprise Platform for ${brandName}`,
      heroSubhead: `Next-generation verified services in ${categorySlug.replace('-', ' ')} with real-time smart-contract voucher escrows and instant game perks.`,
      preLoginHighlights: [
        `Direct ${city.name} Regional Fulfillment`,
        'Encrypted Marketplayace Escrow Checkout',
        'Verified ISO-Certified Enterprise Partner',
        '24/7 Dedicated Client VIP Desk'
      ],
      appRating: {
        ios: Number((4.3 + (i % 7) * 0.1).toFixed(1)),
        android: Number((4.2 + (i % 7) * 0.1).toFixed(1)),
        downloads: `${1 + (i % 15)}M+`
      },
      officialLoginUrl: `https://${brandName.toLowerCase().replace(/[^a-z0-9]/g, '')}.marketplayace.com`,
      founded: 2012 + (i % 12),
      valuationOrMarketCap: `$${100 + ((i * 35) % 900)} Million`,
      aceScore,
      tier,
      website: `https://${brandName.toLowerCase().replace(/[^a-z0-9]/g, '')}.marketplayace.com`,
      description: `Verified enterprise brand in ${categorySlug.replace('-', ' ')} operating high-efficiency services with native Marketplayace smart-contract discounts and game perks.`,
      tags: ['Verified Brand', 'Play Perk Ready', 'Instant Voucher', 'Ace Escrow', city.name],
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

// Procedural brand directory generator for any country and optional city
export function generateCountryBrands(countrySlug: string, citySlug?: string, count: number = 60): Brand[] {
  const targetCountry = MASTER_COUNTRIES.find((c) => c.slug === countrySlug) || MASTER_COUNTRIES[0]
  const targetCity = citySlug ? targetCountry.cities.find((ct) => ct.slug === citySlug) : undefined

  // Filter flagships matching this country
  const flagships = FLAGSHIP_BRANDS.filter((b) => {
    const matchesCountry = b.countryCode === targetCountry.code || b.country.toLowerCase() === targetCountry.name.toLowerCase()
    if (!matchesCountry) return false
    if (targetCity) {
      return b.city.toLowerCase() === targetCity.name.toLowerCase()
    }
    return true
  })

  const generated: Brand[] = []
  const availableCities = targetCity ? [targetCity] : targetCountry.cities
  const categoriesPool = ['quick-commerce', 'e-commerce', 'pharmacy', 'gaming', 'aviation', 'fintech', 'ai-robotics', 'ev-auto']

  for (let i = 1; i <= count; i++) {
    const city = availableCities[i % availableCities.length]
    const categorySlug = categoriesPool[i % categoriesPool.length]
    const prefixes = BRAND_PREFIXES[categorySlug] || ['Nova', 'Apex', 'Hyper', 'Orbit']
    const prefix = prefixes[i % prefixes.length]
    const suffix = BRAND_SUFFIXES[(i * 2) % BRAND_SUFFIXES.length]
    const brandName = `${prefix}${suffix} ${city.name}`.trim()
    const id = `gen-country-${targetCountry.code.toLowerCase()}-${i}`
    const aceScore = 82 + ((i * 5) % 18)
    const tier: BrandTier = aceScore >= 95 ? 'S-Tier' : aceScore >= 88 ? 'A-Tier' : 'B-Tier'
    const brandColor = BRAND_PALETTES[i % BRAND_PALETTES.length]

    generated.push({
      id,
      slug: `${targetCountry.slug}-${city.slug}-${i}`,
      name: brandName,
      logo: `https://images.unsplash.com/photo-${1510000000000 + (i * 14321) % 1000000}?auto=format&fit=crop&w=200&q=80`,
      bannerImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
      category: categorySlug,
      subCategory: `${city.name} ${city.hubType} Leader`,
      headquarters: `${city.name}, ${targetCountry.name}`,
      city: city.name,
      country: targetCountry.name,
      countryCode: targetCountry.code,
      countryFlag: targetCountry.flag,
      brandColor,
      brandTextColor: '#FFFFFF',
      heroTagline: `Premier ${categorySlug.replace('-', ' ')} Service in ${city.name}`,
      heroSubhead: `Serving millions of customers across ${city.name} and ${targetCountry.name} with verified quality, zero surge fees, and instant delivery tokens.`,
      preLoginHighlights: [
        `Local ${city.name} Regional Headquarters`,
        `${targetCountry.currency} Native Billing Support`,
        'Verified National Business Certification',
        '24/7 Priority Helpline'
      ],
      appRating: {
        ios: Number((4.4 + (i % 6) * 0.1).toFixed(1)),
        android: Number((4.3 + (i % 6) * 0.1).toFixed(1)),
        downloads: `${2 + (i % 20)}M+`
      },
      officialLoginUrl: `https://${brandName.toLowerCase().replace(/[^a-z0-9]/g, '')}.marketplayace.com`,
      founded: 2014 + (i % 10),
      valuationOrMarketCap: `$${120 + ((i * 45) % 850)} Million`,
      aceScore,
      tier,
      website: `https://${brandName.toLowerCase().replace(/[^a-z0-9]/g, '')}.marketplayace.com`,
      description: `Locally verified enterprise leader located in ${city.name}, ${targetCountry.name}. Integrated directly with Marketplayace token vaults for instant cashback.`,
      tags: [city.name, targetCountry.name, 'Regional Leader', 'Play Perk Ready'],
      trendingRank: i + 5,
      verified: true,
      socials: { twitter: `@${brandName.replace(/\s+/g, '')}` },
      playPerkDescription: `Play the Reflex Mini-game to unlock an exclusive ${12 + (i % 20)}% discount coupon.`,
      offers: [
        {
          id: `off-${id}-1`,
          title: `Exclusive ${city.name} Resident Welcome Offer`,
          code: `${city.name.slice(0, 3).toUpperCase()}ACE${15 + (i % 15)}`,
          discount: `${15 + (i % 15)}% OFF`,
          expiresIn: '5 Days',
          isExclusive: true,
          playDiscountBonus: 20
        }
      ]
    })
  }

  return [...flagships, ...generated]
}
