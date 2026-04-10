import { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Star, Minus, Plus, Check, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';
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
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [addedToCart, setAddedToCart] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'additional' | 'reviews'>('description');

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    if (!id) return;
    setIsLoading(true);
    const productData = await getProductBySlug(id);
    if (productData) {
      setProduct(productData);

      const colorVariants = productData.variants?.filter(v => v.variant_type === 'color') || [];
      const sizeVariants = productData.variants?.filter(v => v.variant_type === 'size') || [];

      if (colorVariants.length > 0) setSelectedColor(colorVariants[0].variant_value);
      if (sizeVariants.length > 0) setSelectedSize(sizeVariants[0].variant_value);

      const related = await getRelatedProducts(productData.id, productData.category_id || '', 3);
      setRelatedProducts(related);
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#005EE9] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!product) return <Navigate to="/shop" replace />;

  const formatPrice = (price: number) => `R${price?.toLocaleString() || 0}`;

  const getPriceDisplay = () => {
    const sizeVariants = product.variants?.filter(v => v.variant_type === 'size') || [];
    if (sizeVariants.length > 0) {
      const adjustments = sizeVariants.map(v => v.price_adjustment || 0);
      const minAdj = Math.min(...adjustments);
      const maxAdj = Math.max(...adjustments);
      const basePrice = product.price || 0;
      if (minAdj !== maxAdj) {
        const low = basePrice + minAdj;
        const high = basePrice + maxAdj;
        return `R${low.toLocaleString()} – R${high.toLocaleString()}`;
      }
    }
    if (product.original_price) {
      return null;
    }
    return formatPrice(product.price);
  };

  const handleAddToCart = () => {
    addToCart(product as any, quantity, selectedColor, selectedSize);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleEnquire = () => {
    const phone = '27000000000';
    const msg = encodeURIComponent(`Hi, I'd like more info about: ${product.name}`);
    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
  };

  const renderStars = (rating: number) => (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < Math.round(rating || 0) ? 'fill-[#FDA256] text-[#FDA256]' : 'text-gray-300'}`}
        />
      ))}
    </div>
  );

  const galleryImages = (product.images && product.images.length > 0)
    ? product.images.filter(img => !img.show_in_description).map(img => img.image_url)
    : [];
  const images = galleryImages.length > 0
    ? galleryImages
    : [product.primary_image || 'https://via.placeholder.com/600'];

  const descriptionImages = (product.images && product.images.length > 0)
    ? product.images.filter(img => img.show_in_description)
    : [];

  const colorVariants = product.variants?.filter(v => v.variant_type === 'color') || [];
  const sizeVariants = product.variants?.filter(v => v.variant_type === 'size') || [];

  const nextImage = () => setSelectedImage((prev) => (prev + 1) % images.length);
  const prevImage = () => setSelectedImage((prev) => (prev - 1 + images.length) % images.length);

  const priceDisplay = getPriceDisplay();

  // Render description with proper formatting (supports HTML, paragraphs, lists, line breaks)
  const renderDescription = () => {
    const desc = product.description || product.short_description || '';
    // Check if content contains HTML tags
    if (/<[a-z][\s\S]*>/i.test(desc)) {
      return <div className="description-content" dangerouslySetInnerHTML={{ __html: desc }} />;
    }
    // Fallback: preserve newlines and render as paragraphs
    return desc.split('\n').filter(Boolean).map((paragraph, idx) => (
      <p key={idx} className="mb-4 last:mb-0">{paragraph}</p>
    ));
  };

  return (
    <main className="pt-8 pb-20 px-4 md:px-0">
      <div className="container-custom">
        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-white overflow-hidden">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-contain"
              />

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
            </div>

            {/* Thumbnail Strip - NO borders */}
            {images.length > 1 && (
              <div className="flex flex-wrap gap-3">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-[80px] h-[80px] overflow-hidden transition-all ${
                      selectedImage === index ? 'ring-2 ring-[#0F172A]' : 'opacity-70 hover:opacity-100'
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
            {/* Category label */}
            {product.category_name && (
              <p className="text-sm uppercase tracking-widest text-gray-500 mb-2">
                {product.category_name}
              </p>
            )}

            <h1 className="text-2xl lg:text-3xl font-serif text-[#0F172A] mb-3">
              {product.name}
            </h1>

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
              <span className="text-2xl font-semibold text-[#0F172A]">{priceDisplay}</span>
              <span className="text-sm text-green-600 font-medium">+ Free Delivery</span>
            </div>

            <p className="text-[#364151] leading-relaxed mb-6">
              {product.short_description || product.description}
            </p>

            {/* Size Variants */}
            {sizeVariants.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-[#0F172A] mb-3">Size</label>
                <div className="flex flex-wrap gap-2">
                  {sizeVariants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedSize(variant.variant_value)}
                      className={`px-4 py-2 border rounded text-sm transition-all ${
                        selectedSize === variant.variant_value
                          ? 'border-[#0F172A] bg-white text-[#0F172A] font-medium'
                          : 'border-gray-300 hover:border-[#0F172A] text-gray-600'
                      }`}
                    >
                      {variant.variant_name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Variants - SQUARE */}
            {colorVariants.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-[#0F172A] mb-3">Color</label>
                <div className="flex gap-3">
                  {colorVariants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedColor(variant.variant_value)}
                      className={`w-10 h-10 border-2 transition-all ${
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

            {/* Quantity + Add to Cart - BLUE button */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className="flex items-center border border-gray-300 rounded">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2.5 hover:bg-gray-100 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-5 font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2.5 hover:bg-gray-100 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* FIXED: Blue Add to Cart button */}
              <button
                onClick={handleAddToCart}
                className={`px-6 py-2.5 font-medium transition-all ${
                  addedToCart
                    ? 'bg-green-600 text-white'
                    : 'bg-[#005EE9] text-white hover:bg-[#0047c0]'
                }`}
              >
                {addedToCart ? (
                  <span className="flex items-center justify-center gap-2">
                    <Check className="w-4 h-4" /> Added
                  </span>
                ) : 'Add To Cart'}
              </button>
            </div>

            {/* SKU & Category row */}
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4 pt-4 border-t border-gray-200">
              <span>SKU: {product.sku || 'N/A'}</span>
              {product.category_name && (
                <span>Category: <span className="text-[#0F172A] uppercase font-medium">{product.category_name}</span></span>
              )}
            </div>

            {/* Enquire Now - FIXED: Two lines of text */}
            <button
              onClick={handleEnquire}
              className="flex items-center gap-2 bg-[#005EE9] text-white px-5 py-2.5 text-sm font-medium hover:bg-[#0047c0] transition-colors"
            >
              <MessageCircle className="w-4 h-4 flex-shrink-0" />
              <div className="text-left leading-tight">
                <span className="block">Need More Info?</span>
                <span className="block">Enquire Now</span>
              </div>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-16">
          <div className="flex border-b border-gray-200 mb-8">
            {(['description', 'additional', 'reviews'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors capitalize ${
                  activeTab === tab
                    ? 'border-[#0F172A] text-[#0F172A]'
                    : 'border-transparent text-gray-500 hover:text-[#0F172A]'
                }`}
              >
                {tab === 'reviews'
                  ? `Reviews (${product.review_count || 0})`
                  : tab === 'additional'
                  ? 'Additional Information'
                  : 'Description'}
              </button>
            ))}
          </div>

          <div>
            {activeTab === 'description' && (
              <div className="text-[#364151] leading-relaxed max-w-4xl">
                {/* FIXED: Description now renders paragraphs, lists, and HTML properly */}
                {renderDescription()}

                {/* Description images */}
                {descriptionImages.length > 0 && (
                  <div className={`grid gap-4 mt-8 ${
                    descriptionImages.length === 1
                      ? 'grid-cols-1 max-w-2xl'
                      : descriptionImages.length === 2
                      ? 'grid-cols-2'
                      : descriptionImages.length === 3
                      ? 'grid-cols-3'
                      : 'grid-cols-2 sm:grid-cols-4'
                  }`}>
                    {descriptionImages.map((img, index) => (
                      <div
                        key={img.id}
                        className={`overflow-hidden bg-gray-100 ${
                          descriptionImages.length === 1 ? 'aspect-video' : 'aspect-square'
                        }`}
                      >
                        <img
                          src={img.image_url}
                          alt={img.alt_text || `${product.name} detail ${index + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'additional' && (
              <div className="text-[#364151] max-w-2xl">
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-gray-100">
                    {sizeVariants.length > 0 && (
                      <tr>
                        <td className="py-3 pr-6 font-medium text-[#0F172A] w-40">Available Sizes</td>
                        <td className="py-3 text-gray-600">{sizeVariants.map(v => v.variant_name).join(', ')}</td>
                      </tr>
                    )}
                    {colorVariants.length > 0 && (
                      <tr>
                        <td className="py-3 pr-6 font-medium text-[#0F172A] w-40">Available Colors</td>
                        <td className="py-3 text-gray-600">{colorVariants.map(v => v.variant_name).join(', ')}</td>
                      </tr>
                    )}
                    {product.sku && (
                      <tr>
                        <td className="py-3 pr-6 font-medium text-[#0F172A]">SKU</td>
                        <td className="py-3 text-gray-600">{product.sku}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-2">No reviews yet</p>
                <p className="text-sm text-gray-400">Be the first to review this product!</p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="section-title mb-8">Related products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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