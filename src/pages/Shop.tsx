import { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import ProductCard from '@/components/ui-custom/ProductCard';
import { getProducts } from '@/services/productService';
import type { Product } from '@/lib/supabase';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type SortOption = 'default' | 'popularity' | 'rating' | 'newest' | 'price-low' | 'price-high';

export default function Shop() {
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category');
  const saleFilter = searchParams.get('sale');
  const newFilter = searchParams.get('new');
  const searchQuery = searchParams.get('search');
  
  const [products, setProducts] = useState<Product[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, [categoryFilter, saleFilter, newFilter, searchQuery]);

  const loadProducts = async () => {
    setIsLoading(true);
    
    const options: any = {};
    if (saleFilter === 'true') options.onSale = true;
    if (newFilter === 'true') options.isNew = true;
    if (searchQuery) options.search = searchQuery;
    
    const data = await getProducts(options);
    setProducts(data);
    setIsLoading(false);
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];
    
    // Apply sorting
    switch (sortBy) {
      case 'popularity':
        result.sort((a, b) => (b.review_count || 0) - (a.review_count || 0));
        break;
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'newest':
        result.sort((a, b) => (b.is_new ? 1 : 0) - (a.is_new ? 1 : 0));
        break;
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }
    
    return result;
  }, [products, sortBy]);

  const getPageTitle = () => {
    if (searchQuery) return `Search results for "${searchQuery}"`;
    if (saleFilter === 'true') return 'On Sale';
    if (newFilter === 'true') return 'New Arrivals';
    if (categoryFilter) return categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1);
    return 'Shop';
  };

  if (isLoading) {
    return (
      <main className="pt-24 min-h-screen flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-[#005EE9] border-t-transparent rounded-full" />
      </main>
    );
  }

  return (
    <main className="pt-24 min-h-screen">
      <div className="container-custom py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-[#005EE9]">Home</Link>
          <span>/</span>
          <span className="text-[#0F172A]">{getPageTitle()}</span>
        </nav>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <p className="text-sm text-gray-600">
            Showing {filteredProducts.length} results
          </p>
          
          <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Default sorting" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default sorting</SelectItem>
              <SelectItem value="popularity">Sort by popularity</SelectItem>
              <SelectItem value="rating">Sort by average rating</SelectItem>
              <SelectItem value="newest">Sort by latest</SelectItem>
              <SelectItem value="price-low">Sort by price: low to high</SelectItem>
              <SelectItem value="price-high">Sort by price: high to low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-lg text-gray-500 mb-4">No products found</p>
            <Link to="/shop" className="btn-primary">
              View All Products
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
