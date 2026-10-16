import { useState, useMemo } from 'react'
import { LabsToolbar } from '../components/LabsToolbar'
import { ProductCard } from '../components/ProductCard'
import { ProductModal } from '../components/ProductModal'
import { DropVault } from '../components/DropVault'
import { SquadShopping } from '../components/SquadShopping'
import { SellerStudio } from '../components/SellerStudio'
import { Toast } from '../components/Toast'
import { Tabs, type TabItem } from '../components/Tabs'
import { useSeo } from '../utils/seo'
import type { LabsTab } from '../utils/router'
import { CartDrawer } from '../components/CartDrawer'
import { DailyPerkModal } from '../components/DailyPerkModal'
import { mockProducts, mockDutchDrops, mockSquadRooms } from '../data/mockProducts'
import type { Product, Category, CartItem, DutchDropItem } from '../types'
import { playSound } from '../utils/audio'
import { Flame, Users, PlusCircle, LayoutGrid, SearchX, FlaskConical } from 'lucide-react'

const CATEGORIES: Category[] = ['All', 'Gaming Tech', 'Creator Drops', 'Digital Mods & UGC', 'Streetwear', 'Collectibles']

const MARKET_TABS: TabItem<LabsTab>[] = [
  { id: 'floor', label: 'Play Floor', icon: LayoutGrid },
  {
    id: 'vault',
    label: 'Dutch Vault',
    icon: Flame
  },
  { id: 'squad', label: 'Squad Co-Op', icon: Users },
  { id: 'studio', label: 'Sell preview', icon: PlusCircle }
]

export function LabsPage({ tab, onTabChange }: { tab: LabsTab; onTabChange: (t: LabsTab) => void }) {
  useSeo({
    title: 'Labs: shopping experiments with sample listings',
    description: 'Experimental shopping mechanics. All listings are samples and nothing here is for sale.',
    path: '/labs',
    noindex: true
  })
  // State management
  const [products, setProducts] = useState<Product[]>(mockProducts)
  const [selectedCategory, setSelectedCategory] = useState<Category>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured')
  const activeMarketTab = tab
  const setActiveMarketTab = onTabChange

  // Modals & Drawers
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [modalMode, setModalMode] = useState<'view' | 'game'>('view')
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isPerkModalOpen, setIsPerkModalOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  // Cart & Pricing
  const [cart, setCart] = useState<CartItem[]>([])
  const [gameDiscounts, setGameDiscounts] = useState<Record<string, number>>({})
  const [activeCoupon, setActiveCoupon] = useState<string | null>(null)
  const [globalDiscountPercent, setGlobalDiscountPercent] = useState(0)

  // Filtered Products for The Play Floor
  const filteredProducts = useMemo(() => {
    const list = products.filter((p) => {
      const matchesCat = selectedCategory === 'All' || p.category === selectedCategory
      const matchesSearch =
        searchQuery === '' ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCat && matchesSearch
    })
    if (sortBy === 'price-asc') list.sort((a, b) => a.price - b.price)
    else if (sortBy === 'price-desc') list.sort((a, b) => b.price - a.price)
    else if (sortBy === 'rating') list.sort((a, b) => b.rating - a.rating)
    return list
  }, [products, selectedCategory, searchQuery, sortBy])

  // Cart operations
  const handleAddToCart = (product: Product, discountWon: number = 0) => {
    setToast(`${product.title} added to cart`)
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
    const normalized = code.trim().toUpperCase()
    // Sample codes for Labs only. They are not real offers from any company.
    const validCodes: Record<string, number> = {
      ACE15: 15,
      ACE20: 20,
      ACE30: 30,
      MODS25: 25,
      MYTHIC50: 50,
      SQUAD20: 20,
      DAILYACE: 20
    }

    if (validCodes[normalized]) {
      setActiveCoupon(normalized)
      setGlobalDiscountPercent(validCodes[normalized])
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
      description: 'Sample item from the simulated Dutch Vault.',
      features: ['Simulated Dutch auction result', 'Sample listing, not for sale'],
      playFactor: 'Instant Win',
      seller: {
        name: drop.seller,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
        isVerified: false,
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
    <div className="flex flex-col">
      <div className="border-b border-reward/20 bg-reward/10">
        <div className="mx-auto flex max-w-7xl items-start gap-3 px-4 py-3 text-sm text-ink sm:px-6 lg:px-8">
          <FlaskConical className="mt-0.5 h-4 w-4 shrink-0 text-reward" aria-hidden />
          <div>
            <h1 className="inline font-bold text-white">Labs preview.</h1> These are sample listings to test shopping mechanics.
            Sellers, products, ratings and prices are illustrative, nothing is for sale, and no payment is taken.
          </div>
        </div>
      </div>

      <LabsToolbar
        cartCount={cart.reduce((a, b) => a + b.quantity, 0)}
        totalDiscountSaved={totalDiscountSaved}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenPerkModal={() => setIsPerkModalOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <main className="flex-1">
        {/* Marketplace Navigation Bar */}
        <section id="market-nav" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="border-b border-line">
            <Tabs
              label="Labs sections"
              tabs={MARKET_TABS}
              value={activeMarketTab}
              onChange={(id) => {
                playSound('click')
                setActiveMarketTab(id)
              }}
            />
          </div>
        </section>

        {/* Dynamic Tab Body */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16">
          {activeMarketTab === 'floor' && (
            <div className="space-y-6" role="tabpanel" aria-labelledby="tab-floor">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div
                  className="no-scrollbar flex items-center gap-2 overflow-x-auto"
                  role="group"
                  aria-label="Filter by category"
                >
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      aria-pressed={selectedCategory === cat}
                      onClick={() => {
                        playSound('click')
                        setSelectedCategory(cat)
                      }}
                      className={`shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                        selectedCategory === cat
                          ? 'border-accent bg-accent-soft text-white'
                          : 'border-line bg-surface-1 text-ink-muted hover:border-line-strong hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between gap-3 lg:justify-end">
                  <p className="text-sm text-ink-muted" aria-live="polite">
                    {filteredProducts.length} {filteredProducts.length === 1 ? 'drop' : 'drops'}
                  </p>
                  <label className="flex items-center gap-2 text-sm text-ink-muted">
                    <span className="sr-only sm:not-sr-only">Sort</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                      className="rounded-lg border border-line bg-surface-1 px-3 py-2 text-sm text-white focus:border-accent"
                    >
                      <option value="featured">Featured</option>
                      <option value="price-asc">Price: low to high</option>
                      <option value="price-desc">Price: high to low</option>
                      <option value="rating">Top rated</option>
                    </select>
                  </label>
                </div>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="surface-card flex flex-col items-center gap-3 px-6 py-16 text-center">
                  <SearchX className="h-10 w-10 text-ink-faint" aria-hidden />
                  <h3 className="text-lg font-bold text-white">No drops match your search</h3>
                  <p className="max-w-sm text-sm text-ink-muted">
                    Try a different keyword or clear your filters to see everything on the floor.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('')
                      setSelectedCategory('All')
                    }}
                    className="mt-1 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-strong"
                  >
                    Clear search and filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
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

      <Toast
        message={toast}
        onDismiss={() => setToast(null)}
        actionLabel="View cart"
        onAction={() => setIsCartOpen(true)}
      />

    </div>
  )
}

