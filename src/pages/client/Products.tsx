import { useState } from 'react';
import { ShoppingBag, Star, MessageCircle, Filter, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSalon } from '@/contexts/SalonContext';

type ProductCategory = 'all' | 'bundles' | 'wigs' | 'closures' | 'frontals' | 'accessories';

interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  originalPrice?: number;
  description: string;
  features: string[];
  textures?: string[];
  lengths?: string[];
  image: string;
  badge?: string;
  rating: number;
  reviews: number;
}

const products: Product[] = [
  // Hair Bundles
  {
    id: 'bundle-1',
    name: 'Brazilian Straight Bundles',
    category: 'bundles',
    price: 85,
    originalPrice: 120,
    description: '100% virgin human hair bundles. Silky straight texture that can be colored and styled.',
    features: ['Double weft', 'No shedding', 'Tangle-free', 'Cuticle aligned'],
    textures: ['Straight'],
    lengths: ['12"', '14"', '16"', '18"', '20"', '22"', '24"', '26"', '28"', '30"'],
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=400&fit=crop&crop=center',
    badge: 'Best Seller',
    rating: 4.9,
    reviews: 127
  },
  {
    id: 'bundle-2',
    name: 'Brazilian Body Wave Bundles',
    category: 'bundles',
    price: 95,
    originalPrice: 130,
    description: 'Premium body wave bundles with natural bounce and movement. Perfect for glamorous looks.',
    features: ['Soft texture', 'Natural luster', 'Heat safe', 'Long lasting'],
    textures: ['Body Wave'],
    lengths: ['12"', '14"', '16"', '18"', '20"', '22"', '24"', '26"'],
    image: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=400&h=400&fit=crop&crop=center',
    badge: 'Hot',
    rating: 4.8,
    reviews: 98
  },
  {
    id: 'bundle-3',
    name: 'Deep Wave Bundles',
    category: 'bundles',
    price: 110,
    description: 'Luxurious deep wave pattern that holds curl beautifully even in humid weather.',
    features: ['Defined curls', 'Humidity resistant', 'Minimal maintenance', 'Full & voluminous'],
    textures: ['Deep Wave'],
    lengths: ['12"', '14"', '16"', '18"', '20"', '22"', '24"'],
    image: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=400&h=400&fit=crop&crop=center',
    rating: 4.7,
    reviews: 76
  },
  {
    id: 'bundle-4',
    name: 'Kinky Curly Bundles',
    category: 'bundles',
    price: 120,
    description: 'Natural kinky curly texture that blends seamlessly with 4A-4C hair types.',
    features: ['Natural texture', 'Blends with natural hair', 'Coily pattern', 'Protective style'],
    textures: ['Kinky Curly'],
    lengths: ['10"', '12"', '14"', '16"', '18"', '20"', '22"'],
    image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=400&h=400&fit=crop&crop=center',
    badge: 'New',
    rating: 4.9,
    reviews: 54
  },
  
  // HD Lace Wigs
  {
    id: 'wig-1',
    name: 'HD Lace Front Wig - Straight',
    category: 'wigs',
    price: 185,
    originalPrice: 250,
    description: 'Invisible HD lace that melts into your skin. Pre-plucked hairline with baby hairs.',
    features: ['13x4 lace front', 'Pre-plucked', 'Baby hairs', 'Adjustable straps'],
    lengths: ['16"', '18"', '20"', '22"', '24"', '26"'],
    image: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=400&h=400&fit=crop&crop=center',
    badge: 'Premium',
    rating: 4.9,
    reviews: 203
  },
  {
    id: 'wig-2',
    name: 'HD Lace Closure Wig - Body Wave',
    category: 'wigs',
    price: 165,
    description: '5x5 HD lace closure wig with glueless design. Easy to wear and remove.',
    features: ['5x5 closure', 'Glueless', 'Bleached knots', '150% density'],
    lengths: ['14"', '16"', '18"', '20"', '22"'],
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=400&fit=crop&crop=center',
    rating: 4.8,
    reviews: 156
  },
  {
    id: 'wig-3',
    name: '360 Lace Wig - Deep Wave',
    category: 'wigs',
    price: 275,
    originalPrice: 350,
    description: 'Full 360 lace coverage allows for high ponytails and versatile styling.',
    features: ['360 lace', 'High ponytail ready', '180% density', 'Natural hairline'],
    lengths: ['18"', '20"', '22"', '24"', '26"'],
    image: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=400&h=400&fit=crop&crop=center',
    badge: 'Luxury',
    rating: 5.0,
    reviews: 89
  },
  
  // Closures
  {
    id: 'closure-1',
    name: '4x4 HD Lace Closure',
    category: 'closures',
    price: 65,
    description: 'Seamless 4x4 HD lace closure that disappears on all skin tones.',
    features: ['HD lace', 'Free part', 'Bleached knots', 'Pre-plucked'],
    textures: ['Straight', 'Body Wave', 'Deep Wave'],
    lengths: ['10"', '12"', '14"', '16"', '18"', '20"'],
    image: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=400&h=400&fit=crop&crop=center',
    rating: 4.8,
    reviews: 234
  },
  {
    id: 'closure-2',
    name: '5x5 HD Lace Closure',
    category: 'closures',
    price: 75,
    description: 'Extra coverage with 5x5 HD lace. Perfect for deeper parts.',
    features: ['Larger coverage', 'HD transparent lace', 'Natural density', 'Cuticle aligned'],
    textures: ['Straight', 'Body Wave', 'Deep Wave'],
    lengths: ['12"', '14"', '16"', '18"', '20"'],
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=400&fit=crop&crop=center',
    badge: 'Popular',
    rating: 4.9,
    reviews: 178
  },
  {
    id: 'closure-3',
    name: '6x6 HD Lace Closure',
    category: 'closures',
    price: 85,
    description: 'Maximum coverage with 6x6 HD lace. Allows for various parting options.',
    features: ['Maximum coverage', 'Versatile parting', 'Swiss lace', 'Natural look'],
    textures: ['Straight', 'Body Wave'],
    lengths: ['14"', '16"', '18"', '20"'],
    image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=400&h=400&fit=crop&crop=center',
    rating: 4.7,
    reviews: 92
  },
  
  // Frontals
  {
    id: 'frontal-1',
    name: '13x4 HD Lace Frontal',
    category: 'frontals',
    price: 95,
    originalPrice: 130,
    description: 'Ear to ear coverage with 13x4 HD lace frontal. Creates the most natural hairline.',
    features: ['Ear to ear', 'HD Swiss lace', 'Pre-plucked', 'Baby hairs'],
    textures: ['Straight', 'Body Wave', 'Deep Wave'],
    lengths: ['12"', '14"', '16"', '18"', '20"', '22"'],
    image: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=400&h=400&fit=crop&crop=center',
    badge: 'Best Seller',
    rating: 4.9,
    reviews: 312
  },
  {
    id: 'frontal-2',
    name: '13x6 HD Lace Frontal',
    category: 'frontals',
    price: 115,
    description: 'Deep parting frontal with 6 inches of lace space. Perfect for side parts.',
    features: ['Deep parting', '6" lace depth', 'Transparent HD', 'Bleached knots'],
    textures: ['Straight', 'Body Wave'],
    lengths: ['14"', '16"', '18"', '20"', '22"'],
    image: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=400&h=400&fit=crop&crop=center',
    rating: 4.8,
    reviews: 145
  },
  
  // Accessories
  {
    id: 'acc-1',
    name: 'Edge Control Gel',
    category: 'accessories',
    price: 15,
    description: 'Strong hold edge control that lays baby hairs flat without flaking.',
    features: ['Extra strong hold', 'No flaking', 'Humidity resistant', 'Natural ingredients'],
    image: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=400&h=400&fit=crop&crop=center',
    rating: 4.6,
    reviews: 89
  },
  {
    id: 'acc-2',
    name: 'Lace Glue Adhesive',
    category: 'accessories',
    price: 18,
    description: 'Waterproof lace glue for secure wig application. Lasts up to 2 weeks.',
    features: ['Waterproof', '2 week hold', 'Sweat resistant', 'Easy removal'],
    image: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=400&h=400&fit=crop&crop=center',
    rating: 4.7,
    reviews: 156
  },
  {
    id: 'acc-3',
    name: 'Wig Cap Set (3 Pack)',
    category: 'accessories',
    price: 12,
    description: 'Breathable wig caps that protect your natural hair. Includes 3 caps.',
    features: ['Breathable mesh', 'Comfortable fit', 'Secures braids', '3 pack'],
    image: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=400&h=400&fit=crop&crop=center',
    rating: 4.5,
    reviews: 234
  },
  {
    id: 'acc-4',
    name: 'Silk Press Serum',
    category: 'accessories',
    price: 22,
    description: 'Heat protectant serum that adds shine and protects hair up to 450°F.',
    features: ['450°F protection', 'Adds shine', 'Lightweight', 'Frizz control'],
    image: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=400&h=400&fit=crop&crop=center',
    badge: 'Staff Pick',
    rating: 4.8,
    reviews: 167
  },
  {
    id: 'acc-5',
    name: 'Styling Comb Set',
    category: 'accessories',
    price: 25,
    description: 'Professional styling comb set including rat tail, wide tooth, and edge brush.',
    features: ['3 piece set', 'Heat resistant', 'Anti-static', 'Professional grade'],
    image: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=400&h=400&fit=crop&crop=center',
    rating: 4.6,
    reviews: 98
  }
];

const categories: { id: ProductCategory; label: string }[] = [
  { id: 'all', label: 'All Products' },
  { id: 'bundles', label: 'Hair Bundles' },
  { id: 'wigs', label: 'HD Lace Wigs' },
  { id: 'closures', label: 'Closures' },
  { id: 'frontals', label: 'Frontals' },
  { id: 'accessories', label: 'Accessories' }
];

function ProductCard({ product, onInquire }: { product: Product; onInquire: (product: Product) => void }) {
  return (
    <div className="group relative rounded-2xl overflow-hidden bg-card border border-border hover:border-primary/50 transition-colors duration-300">
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover"
        />
        
        {/* Badge */}
        {product.badge && (
          <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground font-semibold text-xs">
            {product.badge}
          </Badge>
        )}
        
        {/* Sale Badge */}
        {product.originalPrice && (
          <Badge className="absolute top-3 right-3 bg-accent text-accent-foreground font-semibold text-xs">
            Save ${product.originalPrice - product.price}
          </Badge>
        )}
      </div>
      
      {/* Product Info */}
      <div className="p-4">
        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <Star className="w-3.5 h-3.5 fill-primary text-primary" />
          <span className="text-xs font-medium text-foreground">{product.rating}</span>
          <span className="text-xs text-muted-foreground">({product.reviews} reviews)</span>
        </div>
        
        {/* Name */}
        <h3 className="font-display text-lg font-semibold text-foreground mb-1 line-clamp-1">
          {product.name}
        </h3>
        
        {/* Description */}
        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
          {product.description}
        </p>
        
        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-primary">${product.price}</span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">${product.originalPrice}</span>
          )}
        </div>
        
        {/* Lengths/Textures */}
        {(product.lengths || product.textures) && (
          <div className="mt-3 flex flex-wrap gap-1">
            {product.textures?.slice(0, 2).map(texture => (
              <span key={texture} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                {texture}
              </span>
            ))}
            {product.lengths && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                {product.lengths[0]} - {product.lengths[product.lengths.length - 1]}
              </span>
            )}
          </div>
        )}
        
        {/* Inquire Button */}
        <Button 
          onClick={() => onInquire(product)}
          className="w-full btn-premium rounded-full text-sm mt-4"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Inquire Now
        </Button>
      </div>
    </div>
  );
}

function ProductModal({ product, onClose, whatsappNumber }: { product: Product; onClose: () => void; whatsappNumber: string }) {
  const handleInquire = () => {
    const message = `Hi! I'm interested in the ${product.name} ($${product.price}). Can you please provide more details?`;
    const phone = whatsappNumber.replace(/\D/g, '');
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };
  
  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/80 backdrop-blur-sm p-0 md:p-4"
      onClick={onClose}
    >
      <div
        className="w-full md:max-w-lg bg-card rounded-t-3xl md:rounded-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Swipe Handle */}
        <div className="md:hidden py-3 flex justify-center">
          <div className="swipe-handle" />
        </div>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-background/80 flex items-center justify-center z-10"
        >
          <X className="w-4 h-4" />
        </button>
        
        {/* Product Image */}
        <div className="relative aspect-square md:rounded-t-2xl overflow-hidden">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {product.badge && (
            <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
              {product.badge}
            </Badge>
          )}
        </div>
        
        {/* Content */}
        <div className="p-6">
          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-primary text-primary' : 'text-muted'}`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
          </div>
          
          {/* Name & Price */}
          <h2 className="font-display text-2xl font-bold mb-2">{product.name}</h2>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl font-bold text-primary">${product.price}</span>
            {product.originalPrice && (
              <span className="text-lg text-muted-foreground line-through">${product.originalPrice}</span>
            )}
            {product.originalPrice && (
              <Badge variant="secondary" className="bg-accent/20 text-accent">
                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
              </Badge>
            )}
          </div>
          
          {/* Description */}
          <p className="text-muted-foreground mb-6">{product.description}</p>
          
          {/* Features */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-primary mb-3">Features</h3>
            <div className="grid grid-cols-2 gap-2">
              {product.features.map((feature, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <Sparkles className="w-3 h-3 text-primary" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Available Options */}
          {product.textures && product.textures.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-primary mb-2">Available Textures</h3>
              <div className="flex flex-wrap gap-2">
                {product.textures.map(texture => (
                  <Badge key={texture} variant="outline" className="border-primary/50">
                    {texture}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {product.lengths && product.lengths.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-primary mb-2">Available Lengths</h3>
              <div className="flex flex-wrap gap-2">
                {product.lengths.map(length => (
                  <Badge key={length} variant="outline" className="border-primary/50">
                    {length}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {/* CTA */}
          <Button onClick={handleInquire} className="w-full btn-premium rounded-full h-12 text-base">
            <MessageCircle className="w-5 h-5 mr-2" />
            Inquire via WhatsApp
          </Button>
          
          <p className="text-center text-xs text-muted-foreground mt-3">
            Get personalized recommendations and pricing
          </p>
        </div>
      </div>
    </div>
  );
}

export function Products() {
  const { settings } = useSalon();
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  
  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory);
  
  const handleInquire = (product: Product) => {
    setSelectedProduct(product);
  };
  
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
        <div className="absolute top-20 right-10 w-64 h-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-10 left-10 w-48 h-48 rounded-full bg-accent/10 blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="bg-primary/20 text-primary border-primary/30 mb-4">
              <ShoppingBag className="w-3 h-3 mr-1" />
              Premium Products
            </Badge>
            
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-4">
              Hair Shop
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Premium 100% virgin human hair bundles, HD lace wigs, closures, frontals, and styling accessories.
            </p>
          </div>
        </div>
      </section>
      
      {/* Category Filter */}
      <section className="sticky top-14 md:top-16 z-40 bg-background/95 backdrop-blur-lg border-b border-border py-4">
        <div className="container mx-auto px-4">
          {/* Mobile Filter Button */}
          <div className="md:hidden flex items-center justify-between mb-3">
            <span className="text-sm font-medium">{filteredProducts.length} products</span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="border-primary/50"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
          
          {/* Categories */}
          <div className={`${showFilters ? 'block' : 'hidden'} md:block`}>
            <div className="flex flex-wrap md:flex-nowrap gap-2 md:justify-center overflow-x-auto scrollbar-hide pb-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => {
                    setSelectedCategory(category.id);
                    setShowFilters(false);
                  }}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === category.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Products Grid */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onInquire={handleInquire}
              />
            ))}
          </div>
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground">No products found in this category.</p>
            </div>
          )}
        </div>
      </section>
      
      {/* Info Section */}
      <section className="py-12 md:py-16 bg-card border-t border-border">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">100% Virgin Hair</h3>
              <p className="text-sm text-muted-foreground">Premium quality human hair that can be colored, bleached, and heat styled.</p>
            </div>
            
            <div className="p-6">
              <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">Bundle Deals</h3>
              <p className="text-sm text-muted-foreground">Save more when you buy bundles + closure or frontal combos.</p>
            </div>
            
            <div className="p-6">
              <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">Expert Guidance</h3>
              <p className="text-sm text-muted-foreground">Chat with us for personalized product recommendations.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)}
          whatsappNumber={settings.whatsappNumber || '14045551234'}
        />
      )}
    </div>
  );
}