import type { Product, DutchDropItem, SquadRoom } from '../types'

export const mockProducts: Product[] = [
  {
    id: 'prod-1',
    title: 'CyberDeck X-1 Mechanical Split Keyboard',
    category: 'Gaming Tech',
    tagline: 'OLED hot-swappable tactile switches with carbon chassis',
    originalPrice: 249,
    price: 199,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
    rarity: 'Legendary',
    rating: 4.9,
    reviewsCount: 312,
    inStock: 14,
    spectators: 38,
    maxDiscountPercent: 25,
    description: 'Engineered for competitive aces and terminal hackers. The CyberDeck X-1 features bespoke magnetic hall-effect switches with 0.1mm actuation precision, programmable OLED displays, and aircraft-grade aluminum CNC body.',
    features: [
      'Rapid Trigger Hall-effect magnetic switches',
      'Dual 1.2" OLED status displays',
      'Hot-swappable per-key RGB backlighting',
      'Aircraft-grade machined anodized chassis',
      'Includes custom braided coiled Aviator cable'
    ],
    playFactor: 'High Skill',
    seller: {
      name: 'Vortex Labs',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      isVerified: true,
      salesCount: 4290
    }
  },
  {
    id: 'prod-2',
    title: 'AeroPulse Wireless Studio Monitors',
    category: 'Gaming Tech',
    tagline: 'Ultra-low latency planar magnetic drivers with spatial soundstage',
    originalPrice: 389,
    price: 320,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    rarity: 'Mythic',
    rating: 5.0,
    reviewsCount: 84,
    inStock: 6,
    spectators: 62,
    maxDiscountPercent: 20,
    description: 'Bespoke acoustic engineering tuned for directional gaming clarity and pristine music mastering. Zero lag 2.4GHz RF wireless + lossless Bluetooth 5.4 LDAC.',
    features: [
      '50mm Planar Magnetic custom drivers',
      '< 12ms ultra-low latency wireless protocol',
      'Memory foam cooling gel earcups with sheepskin finish',
      'Active environmental noise cancellation with dual MEMS mics',
      '60-hour continuous play battery life'
    ],
    playFactor: 'High Skill',
    seller: {
      name: 'AcousticAce Audio',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      isVerified: true,
      salesCount: 1820
    }
  },
  {
    id: 'prod-3',
    title: 'Neon Tokyo Oversized Cyber Kimono',
    category: 'Streetwear',
    tagline: 'Weatherproof ripstop technical shell with reflective graphics',
    originalPrice: 180,
    price: 145,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80',
    rarity: 'Rare',
    rating: 4.8,
    reviewsCount: 194,
    inStock: 22,
    spectators: 29,
    maxDiscountPercent: 30,
    description: 'Designed in Harajuku, built for all-weather urban exploration. Features fidlock magnetic buckles, waterproof taped seams, and hidden interior holster pockets.',
    features: [
      '3-layer breathable Japanese ripstop nylon',
      'Fidlock V-buckle magnetic closure systems',
      '3M Scotchlite reflective kanji calligraphy print',
      'Modular removable hood & utility sling strap'
    ],
    playFactor: 'Squad Boost',
    seller: {
      name: 'NeoDistrict Apparel',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
      isVerified: true,
      salesCount: 8750
    }
  },
  {
    id: 'prod-4',
    title: 'OmniRealm: Unreal 5 Sci-Fi World Mod Pack',
    category: 'Digital Mods & UGC',
    tagline: '350+ photorealistic procedural assets, shaders & physics rigs',
    originalPrice: 120,
    price: 89,
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    rarity: 'Legendary',
    rating: 4.9,
    reviewsCount: 521,
    inStock: 999,
    spectators: 45,
    maxDiscountPercent: 35,
    description: 'Instant commercial license for game developers and 3D filmmakers. Includes Nanite-ready environments, customizable Niagara particle FX, and atmospheric volumetric presets.',
    features: [
      'Full UE5.4 & UE5.5 project integration files',
      'Modular space station & alien biosphere kit',
      '8K PBR master materials with parallax occlusion',
      'Lifetime updates and Discord creator room access'
    ],
    playFactor: 'Instant Win',
    seller: {
      name: 'PolygonAce Studio',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      isVerified: true,
      salesCount: 14200
    }
  },
  {
    id: 'prod-5',
    title: 'HoloCard: Cyber Samurai #001 (1-of-100 Physical NFC)',
    category: 'Collectibles',
    tagline: 'Lenticular physical card with tap-to-authenticate digital twin',
    originalPrice: 150,
    price: 110,
    image: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=800&q=80',
    rarity: 'Mythic',
    rating: 5.0,
    reviewsCount: 42,
    inStock: 3,
    spectators: 91,
    maxDiscountPercent: 15,
    description: 'Encased in magnetic UV-resistant acrylic with embedded cryptographic chip. Tap card with any smartphone to verify ownership certificate and unlock secret Discord channel.',
    features: [
      'Gold cold-foil stamped 1200 GSM cardstock',
      'NTAG424 DNA cryptographic NFC tamper chip',
      'Signed and hand-numbered by digital artist K4ZE',
      'Includes custom weighted display pedestal'
    ],
    playFactor: 'Mystery Drop',
    seller: {
      name: 'Vault9 Collectibles',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
      isVerified: true,
      salesCount: 640
    }
  },
  {
    id: 'prod-6',
    title: 'ApexStreamer 4K Pro Capture & Macro Deck',
    category: 'Creator Drops',
    tagline: '15 tactile LCD keys + 4K 120FPS HDR zero-passthrough capture',
    originalPrice: 299,
    price: 249,
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
    rarity: 'Rare',
    rating: 4.7,
    reviewsCount: 156,
    inStock: 18,
    spectators: 24,
    maxDiscountPercent: 20,
    description: 'The all-in-one broadcast cockpit for Twitch, YouTube, and Discord streamers. Control scenes, audio routing, voice changers, and lighting with a single fingertip tap.',
    features: [
      '15 customizable dynamic LCD key switches',
      'Integrated HDMI 2.1 4K120 pass-through hardware encoder',
      'Dual rotary continuous rotary knobs for sound channels',
      'One-click OBS, Streamlabs, and Spotify profiles'
    ],
    playFactor: 'High Skill',
    seller: {
      name: 'StreamGrid Tech',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      isVerified: true,
      salesCount: 3910
    }
  }
]

export const mockDutchDrops: DutchDropItem[] = [
  {
    id: 'dutch-1',
    title: 'Limited Edition TitanMech Titan-GPU Armor Plate',
    image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=800&q=80',
    rarity: 'Mythic',
    startingPrice: 350,
    floorPrice: 190,
    currentPrice: 275,
    priceDropPerTick: 2,
    tickIntervalSec: 3,
    totalAvailable: 5,
    claimed: 2,
    seller: 'Foundry51 Mods'
  },
  {
    id: 'dutch-2',
    title: 'SonicBloom Hi-Res Open-Back Reference Cans',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
    rarity: 'Legendary',
    startingPrice: 280,
    floorPrice: 160,
    currentPrice: 215,
    priceDropPerTick: 1.5,
    tickIntervalSec: 2,
    totalAvailable: 8,
    claimed: 5,
    seller: 'Audiophile Labs'
  },
  {
    id: 'dutch-3',
    title: 'CyberPunk Tactical Sling Bag with Solar Array',
    image: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=800&q=80',
    rarity: 'Rare',
    startingPrice: 160,
    floorPrice: 95,
    currentPrice: 120,
    priceDropPerTick: 1,
    tickIntervalSec: 2,
    totalAvailable: 15,
    claimed: 11,
    seller: 'ZeroGravity Gear'
  }
]

export const mockSquadRooms: SquadRoom[] = [
  {
    id: 'squad-1',
    product: mockProducts[0],
    targetMembers: 3,
    currentMembers: [
      {
        id: 'u-1',
        name: 'Alex "Ghost" Rivera',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
        joinedAt: '3m ago'
      },
      {
        id: 'u-2',
        name: 'Maya "Cipher" Lin',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
        joinedAt: '1m ago'
      }
    ],
    expiresInSeconds: 420,
    squadDiscountPercent: 25
  },
  {
    id: 'squad-2',
    product: mockProducts[2],
    targetMembers: 3,
    currentMembers: [
      {
        id: 'u-3',
        name: 'Jordan "Ace" Vance',
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=100&q=80',
        joinedAt: '4m ago'
      }
    ],
    expiresInSeconds: 680,
    squadDiscountPercent: 30
  }
]
