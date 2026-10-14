import { useState, useMemo } from 'react'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { ProductCard } from './components/ProductCard'
import { ProductModal } from './components/ProductModal'
import { DropVault } from './components/DropVault'
import { SquadShopping } from './components/SquadShopping'
import { SellerStudio } from './components/SellerStudio'
import { CartDrawer } from './components/CartDrawer'
import { DailyPerkModal } from './components/DailyPerkModal'
import { Footer } from './components/Footer'
import { mockProducts, mockDutchDrops, mockSquadRooms } from './data/mockProducts'
import type { Product, Category, CartItem, DutchDropItem } from './types'
import { playSound } from './utils/audio'
import { Flame, Users, PlusCircle, LayoutGrid, Sparkles } from 'lucide-react'

export function App() {
  // State management
  const [products, setProducts] = useState<Product[]>(mockProducts)
  const [selectedCategory, setSelectedCategory] = useState<Category>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeMarketTab, setActiveMarketTab] = useState<'floor' | 'vault' | 'squad' | 'studio'>('floor')

  // Modals & Drawers
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [modalMode, setModalMode] = useState<'view' | 'game'>('view')
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isPerkModalOpen, setIsPerkModalOpen] = useState(false)

  // Cart & Pricing
  const [cart, setCart] = useState<CartItem[]>([])
  const [gameDiscounts, setGameDiscounts] = useState<Record<string, number>>({})
  const [activeCoupon, setActiveCoupon] = useState<string | null>(null)
  const [globalDiscountPercent, setGlobalDiscountPercent] = useState(0)

  // Filtered Products for The Play Floor
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCat = selectedCategory === 'All' || p.category === selectedCategory
      const matchesSearch =
        searchQuery === '' ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCat && matchesSearch
    })
  }, [products, selectedCategory, searchQuery])

  // Cart operations
  const handleAddToCart = (product: Product, discountWon: number = 0) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id)
      const appliedDiscount = Math.max(discountWon, gameDiscounts[product.id] || 0)
      const finalPrice = product.price * (1 - appliedDiscount / 100)

      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
                discountPercent: Math.max(item.discountPercent, appliedDiscount),
                finalPrice: Math.min(item.finalPrice, finalPrice)
              }
            : item
        )
      } else {
        return [
          ...prev,
          {
            product,
            quantity: 1,
            discountPercent: appliedDiscount,
            finalPrice
          }
        ]
      }
    })

    if (discountWon > 0) {
      setGameDiscounts((prev) => ({ ...prev, [product.id]: discountWon }))
    }
  }

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId))
  }

  const handleUpdateQuantity = (productId: string, qty: number) => {
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity: qty } : item))
    )
  }

  const handleApplyCoupon = (code: string): boolean => {
    const validCodes: Record<string, number> = {
      ACE30: 30,
      ACE15: 15,
      ACE20: 20,
      FREESHIP: 15,
      MODS25: 25,
      MYTHIC50: 50,
      SQUAD20: 20
    }

    if (validCodes[code]) {
      setActiveCoupon(code)
      setGlobalDiscountPercent(validCodes[code])
      return true
    }
    return false
  }

  // Handle claiming a Dutch reverse auction drop
  const handleSnagDutchDrop = (drop: DutchDropItem, pricePaid: number) => {
    const convertedProduct: Product = {
      id: drop.id,
      title: drop.title,
      category: 'Gaming Tech',
      tagline: `Dutch Vault Drop snagged at $${pricePaid}`,
      originalPrice: drop.startingPrice,
      price: pricePaid,
      image: drop.image,
      rarity: drop.rarity,
      rating: 5.0,
      reviewsCount: 1,
      inStock: 1,
      spectators: 40,
      maxDiscountPercent: 0,
      description: 'Exclusive Dutch Vault drop won during live reverse price tick.',
      features: ['Live Dutch Auction verified win', 'Vault Escrow secured'],
      playFactor: 'Instant Win',
      seller: {
        name: drop.seller,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
        isVerified: true,
        salesCount: 120
      }
    }

    handleAddToCart(convertedProduct, 0)
    setIsCartOpen(true)
  }

  // Handle joining squad and buying
  const handleSquadBuy = (product: Product, squadDiscount: number) => {
    handleAddToCart(product, squadDiscount)
    setIsCartOpen(true)
  }

  // Handle adding new product from Seller Studio
  const handleAddProduct = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev])
    setActiveMarketTab('floor')
  }

  // Total discounts calculated for live ticker
  const totalDiscountSaved = useMemo(() => {
    return cart.reduce((acc, item) => {
      const orig = item.product.price * item.quantity
      const current = item.finalPrice * item.quantity
      return acc + (orig - current)
    }, 0) + (activeCoupon ? 25 : 0)
  }, [cart, activeCoupon])

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col selection:bg-purple-500 selection:text-white">
      {/* Top Navbar */}
      <Header
        cartCount={cart.reduce((a, b) => a + b.quantity, 0)}
        totalDiscountSaved={totalDiscountSaved}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenPerkModal={() => setIsPerkModalOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <main className="flex-1">
        {/* Interactive Hero with Ace Drop Spinner */}
        <Hero
          onSpinReward={(code, val) => {
            setActiveCoupon(code)
            setGlobalDiscountPercent(val)
          }}
          onExploreDrops={() => {
            const el = document.getElementById('market-nav')
            el?.scrollIntoView({ behavior: 'smooth' })
          }}
        />

        {/* Marketplace Navigation Bar */}
        <section id="market-nav" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-gray-800 pb-4">
            {/* Mode Switcher Tabs */}
            <div className="flex items-center p-1 bg-gray-900 rounded-2xl border border-gray-800 w-full sm:w-auto overflow-x-auto">
              <button
                onClick={() => {
                  playSound('click')
                  setActiveMarketTab('floor')
                }}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeMarketTab === 'floor'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                <span>The Play Floor</span>
              </button>

              <button
                onClick={() => {
                  playSound('click')
                  setActiveMarketTab('vault')
                }}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeMarketTab === 'vault'
                    ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Flame className="w-4 h-4 text-orange-400" />
                <span>Dutch Vault Arena</span>
                <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
              </button>

              <button
                onClick={() => {
                  playSound('click')
                  setActiveMarketTab('squad')
                }}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeMarketTab === 'squad'
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Users className="w-4 h-4 text-cyan-400" />
                <span>Squad Co-Op</span>
              </button>

              <button
                onClick={() => {
                  playSound('click')
                  setActiveMarketTab('studio')
                }}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeMarketTab === 'studio'
                    ? 'bg-gradient-to-r from-purple-700 to-fuchsia-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <PlusCircle className="w-4 h-4 text-purple-300" />
                <span>Become an Ace (Mint)</span>
              </button>
            </div>

            {/* Category Filter Pills (when on The Play Floor) */}
            {activeMarketTab === 'floor' && (
              <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                {(['All', 'Gaming Tech', 'Creator Drops', 'Digital Mods & UGC', 'Streetwear', 'Collectibles'] as Category[]).map(
                  (cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        playSound('click')
                        setSelectedCategory(cat)
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                        selectedCategory === cat
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                          : 'bg-gray-900/60 text-gray-400 hover:text-white border border-gray-800'
                      }`}
                    >
                      {cat}
                    </button>
                  )
                )}
              </div>
            )}
          </div>
        </section>

        {/* Dynamic Tab Body */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          {activeMarketTab === 'floor' && (
            <div className="space-y-6">
              {filteredProducts.length === 0 ? (
                <div className="py-20 text-center space-y-3">
                  <Sparkles className="w-12 h-12 text-gray-600 mx-auto" />
                  <h3 className="text-lg font-bold text-gray-300">No drops match your query</h3>
                  <p className="text-xs text-gray-500">Try adjusting your search terms or category filter</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      appliedDiscount={gameDiscounts[product.id] || 0}
                      onSelect={(p) => {
                        setSelectedProduct(p)
                        setModalMode('view')
                      }}
                      onQuickAdd={(p) => handleAddToCart(p, 0)}
                      onPlayDiscount={(p) => {
                        setSelectedProduct(p)
                        setModalMode('game')
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeMarketTab === 'vault' && (
            <DropVault
              drops={mockDutchDrops}
              onSnagDrop={handleSnagDutchDrop}
            />
          )}

          {activeMarketTab === 'squad' && (
            <SquadShopping
              squadRooms={mockSquadRooms}
              onJoinAndBuy={handleSquadBuy}
            />
          )}

          {activeMarketTab === 'studio' && (
            <SellerStudio
              onAddProduct={handleAddProduct}
            />
          )}
        </div>
      </main>

      {/* Product Quick-View & Reflex Mini-Game Modal */}
      <ProductModal
        product={selectedProduct}
        initialMode={modalMode}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Slide-out Cart Drawer with Simulated Checkout */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onRemoveItem={handleRemoveFromCart}
        onUpdateQuantity={handleUpdateQuantity}
        onApplyGlobalCoupon={handleApplyCoupon}
        activeCoupon={activeCoupon}
        globalDiscountPercent={globalDiscountPercent}
        onClearCart={() => setCart([])}
      />

      {/* Daily Perk Modal */}
      <DailyPerkModal
        isOpen={isPerkModalOpen}
        onClose={() => setIsPerkModalOpen(false)}
        onClaimPerk={(_perkName, perkDiscount) => {
          setActiveCoupon('DAILYACE')
          setGlobalDiscountPercent(perkDiscount)
        }}
      />

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default App
