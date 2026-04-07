import { useState, useEffect } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { Star, Minus, Plus, Check, Truck, Shield, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { getProductBySlug, getRelatedProducts } from '@/services/productService';
import { useCart } from '@/context/CartContext';
import ProductCard from '@/components/ui-custom/ProductCard';
import type { Product } from '@/lib/supabase';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [addedToCart, setAddedToCart] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'reviews'>('description');

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    if (!id) return;
    setIsLoading(true);
    
    const productData = await getProductBySlug(id);
    if (productData) {
      setProduct(productData);
      
      // Set default selections
      const colorVariants = productData.variants?.filter(v => v.variant_type === 'color') || [];
      const sizeVariants = productData.variants?.filter(v => v.variant_type === 'size') || [];
      
      if (colorVariants.length > 0) {
        setSelectedColor(colorVariants[0].variant_value);
      }
      if (sizeVariants.length > 0) {
        setSelectedSize(sizeVariants[0].variant_value);
      }
      
      // Load related products
      const related = await getRelatedProducts(productData.id, productData.category_id || '', 4);
      setRelatedProducts(related);
    }
    
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <main className="pt-24 min-h-screen flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-[#005EE9] border-t-transparent rounded-full" />
      </main>
    );
  }

  if (!product) {
    return <Navigate to="/shop" />;
  }

  const formatPrice = (price: number) => `R${price?.toLocaleString() || 0}`;

  const handleAddToCart = () => {
    addToCart(product as any, quantity, selectedColor, selectedSize);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < Math.round(rating || 0) ? 'fill-[#FDA256] text-[#FDA256]' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  // Get images
  const images = (product.images && product.images.length > 0)
    ? product.images.map(img => img.image_url)
    : [product.primary_image || 'https://via.placeholder.com/600'];

  // Get variants
  const colorVariants = product.variants?.filter(v => v.variant_type === 'color') || [];
  const sizeVariants = product.variants?.filter(v => v.variant_type === 'size') || [];

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <main className="pt-24 min-h-screen">
      <div className="container-custom py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-[#005EE9]">Home</Link>
          <span>/</span>
          {product.category_slug && (
            <>
              <Link to={`/category/${product.category_slug}`} className="hover:text-[#005EE9]">
                {product.category_name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-[#0F172A] truncate max-w-[200px]">{product.name}</span>
        </nav>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              
              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
              
              {/* Image Counter */}
              {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {selectedImage + 1} / {images.length}
                </div>
              )}
            </div>
            
            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index ? 'border-[#005EE9]' : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            {/* Categories */}
            <div className="flex flex-wrap gap-2 mb-3">
              {product.category_name && (
                <Link 
                  to={`/category/${product.category_slug}`}
                  className="text-sm text-[#005EE9] hover:underline"
                >
                  {product.category_name}
                </Link>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl lg:text-3xl font-serif text-[#0F172A] mb-3">
              {product.name}
            </h1>

            {/* Rating */}
            {product.rating > 0 && (
              <div className="flex items-center gap-2 mb-4">
                {renderStars(product.rating)}
                <span className="text-sm text-gray-500">
                  ({product.review_count} customer review{product.review_count !== 1 ? 's' : ''})
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-center gap-3 mb-6">
              {product.original_price && (
                <span className="text-xl text-gray-400 line-through">
                  {formatPrice(product.original_price)}
                </span>
              )}
              <span className="text-2xl font-semibold text-[#0F172A]">
                {formatPrice(product.price)}
              </span>
              <span className="text-sm text-green-600">+ Free Delivery</span>
            </div>

            {/* Description */}
            <p className="text-[#364151] leading-relaxed mb-6">
              {product.short_description || product.description}
            </p>

            {/* Color Variants */}
            {colorVariants.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-[#0F172A] mb-2">
                  Color
                </label>
                <div className="flex gap-2">
                  {colorVariants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedColor(variant.variant_value)}
                      className={`w-10 h-10 rounded border-2 transition-all ${
                        selectedColor === variant.variant_value
                          ? 'border-[#0F172A] ring-2 ring-[#005EE9] ring-offset-2'
                          : 'border-gray-200 hover:border-gray-400'
                      }`}
                      style={{ backgroundColor: variant.variant_value }}
                      title={variant.variant_name}
                    />
                  ))}
                </div>
                {selectedColor && (
                  <p className="text-sm text-gray-500 mt-2">
                    Selected: {colorVariants.find(v => v.variant_value === selectedColor)?.variant_name}
                  </p>
                )}
              </div>
            )}

            {/* Size Variants */}
            {sizeVariants.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-[#0F172A] mb-2">
                  Size
                </label>
                <div className="flex flex-wrap gap-2">
                  {sizeVariants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedSize(variant.variant_value)}
                      className={`px-4 py-2 border rounded text-sm transition-all ${
                        selectedSize === variant.variant_value
                          ? 'border-[#005EE9] bg-[#005EE9] text-white'
                          : 'border-gray-200 hover:border-[#005EE9]'
                      }`}
                    >
                      {variant.variant_name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity and Add to Cart */}
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <div className="flex items-center border rounded">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-gray-100 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 hover:bg-gray-100 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              
              <button
                onClick={handleAddToCart}
                className={`flex-1 min-w-[200px] py-3 px-6 font-medium transition-all ${
                  addedToCart
                    ? 'bg-green-600 text-white'
                    : 'bg-[#005EE9] text-white hover:bg-[#0F172A]'
                }`}
              >
                {addedToCart ? (
                  <span className="flex items-center justify-center gap-2">
                    <Check className="w-5 h-5" />
                    Added to Cart
                  </span>
                ) : (
                  'Add to Cart'
                )}
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 py-6 border-t border-b">
              <div className="text-center">
                <Truck className="w-6 h-6 mx-auto mb-2 text-[#005EE9]" />
                <p className="text-xs text-gray-600">Free Delivery</p>
              </div>
              <div className="text-center">
                <Shield className="w-6 h-6 mx-auto mb-2 text-[#005EE9]" />
                <p className="text-xs text-gray-600">2 Year Warranty</p>
              </div>
              <div className="text-center">
                <RotateCcw className="w-6 h-6 mx-auto mb-2 text-[#005EE9]" />
                <p className="text-xs text-gray-600">30 Day Returns</p>
              </div>
            </div>

            {/* Categories */}
            <div className="mt-6">
              <p className="text-sm text-gray-500">
                Categories:{' '}
                {product.category_name && (
                  <Link to={`/category/${product.category_slug}`} className="text-[#005EE9] hover:underline">
                    {product.category_name}
                  </Link>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-16">
          <div className="flex border-b mb-6">
            <button
              onClick={() => setActiveTab('description')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'description'
                  ? 'border-[#005EE9] text-[#005EE9]'
                  : 'border-transparent text-gray-500 hover:text-[#0F172A]'
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'reviews'
                  ? 'border-[#005EE9] text-[#005EE9]'
                  : 'border-transparent text-gray-500 hover:text-[#0F172A]'
              }`}
            >
              Reviews ({product.review_count || 0})
            </button>
          </div>

          <div className="prose max-w-none">
            {activeTab === 'description' ? (
              <div className="text-[#364151] leading-relaxed">
                <p className="mb-4">{product.description}</p>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No reviews yet</p>
                <p className="text-sm text-gray-400">Be the first to review this product!</p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="section-title mb-8">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
