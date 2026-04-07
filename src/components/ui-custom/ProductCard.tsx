import { Link } from 'react-router-dom';
import { ShoppingBag, Star } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import type { Product } from '@/lib/supabase';

interface ProductCardProps {
  product: Product;
  showSwatches?: boolean;
}

export default function ProductCard({ product, showSwatches = true }: ProductCardProps) {
  const { addToCart } = useCart();
  const [addedToCart, setAddedToCart] = useState(false);
  
  // Get color variants if available
  const colorVariants = product.variants?.filter(v => v.variant_type === 'color') || [];
  const [selectedColor, setSelectedColor] = useState(colorVariants[0]?.variant_value);

  const formatPrice = (price: number) => `R${price?.toLocaleString() || 0}`;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product as any, 1, selectedColor);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1500);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-3.5 h-3.5 ${
              i < Math.round(rating || 0) ? 'fill-[#FDA256] text-[#FDA256]' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const productImage = product.primary_image || product.images?.[0]?.image_url || 'https://via.placeholder.com/400';
  const productName = product.name || 'Product';
  const productCategory = product.category_name || product.category_slug || 'Uncategorized';

  return (
    <div className="product-card bg-white group">
      {/* Image Container */}
      <div className="relative overflow-hidden aspect-square bg-gray-100">
        <Link to={`/product/${product.slug || product.id}`}>
          <img
            src={productImage}
            alt={productName}
            className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-105"
            loading="lazy"
          />
        </Link>
        
        {/* Sale Badge */}
        {product.is_on_sale && product.original_price && (
          <span className="absolute top-3.5 left-3.5 bg-white text-[#0F172A] text-xs font-medium px-2.5 py-1 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.12)] z-10">
            Sale!
          </span>
        )}
        
        {/* New Badge */}
        {product.is_new && !product.is_on_sale && (
          <span className="absolute top-3.5 left-3.5 bg-[#005EE9] text-white text-xs font-medium px-2.5 py-1 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.12)] z-10">
            New
          </span>
        )}
        
        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className={`absolute bottom-3.5 right-3.5 w-10 h-10 rounded-full flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-all duration-200 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 z-10 ${
            addedToCart ? 'bg-[#005EE9] text-white' : 'bg-white text-[#0F172A] hover:bg-[#005EE9] hover:text-white'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
        </button>
      </div>
      
      {/* Product Info */}
      <div className="pt-4 pb-2">
        {/* Rating */}
        {product.rating > 0 && (
          <div className="mb-1">
            {renderStars(product.rating)}
          </div>
        )}
        
        {/* Title */}
        <Link 
          to={`/product/${product.slug || product.id}`}
          className="block text-sm font-medium text-[#0F172A] hover:text-[#005EE9] transition-colors line-clamp-2 mb-1"
        >
          {productName}
        </Link>
        
        {/* Category */}
        <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">
          {productCategory}
        </p>
        
        {/* Price */}
        <div className="flex items-center gap-2">
          {product.original_price ? (
            <>
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(product.original_price)}
              </span>
              <span className="text-[15px] font-medium text-[#0F172A]">
                {formatPrice(product.price)}
              </span>
            </>
          ) : (
            <span className="text-[15px] font-medium text-[#364151]">
              {formatPrice(product.price)}
            </span>
          )}
        </div>
        
        {/* Color Swatches */}
        {showSwatches && colorVariants.length > 0 && (
          <div className="flex gap-1.5 mt-3">
            {colorVariants.slice(0, 4).map((variant) => (
              <button
                key={variant.id}
                onClick={() => setSelectedColor(variant.variant_value)}
                className={`w-5 h-5 rounded border-2 transition-all ${
                  selectedColor === variant.variant_value 
                    ? 'border-[#0F172A] scale-110' 
                    : 'border-transparent hover:border-gray-300'
                }`}
                style={{ backgroundColor: variant.variant_value }}
                title={variant.variant_name}
              />
            ))}
            {colorVariants.length > 4 && (
              <span className="text-xs text-gray-400 self-center">+{colorVariants.length - 4}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
