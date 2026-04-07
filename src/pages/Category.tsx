import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ProductCard from '@/components/ui-custom/ProductCard';
import { getProducts, getCategoryBySlug } from '@/services/productService';
import type { Product, Category } from '@/lib/supabase';

const categoryDescriptions: Record<string, string> = {
  sofa: 'Discover our collection of comfortable and stylish sofas. From compact 2-seaters to spacious sectional sofas, find the perfect centerpiece for your living room.',
  bedroom: 'Create your dream bedroom with our range of beds, bedframes, and bedroom furniture. Quality craftsmanship for restful nights.',
  dining: 'Elevate your dining experience with our elegant dining tables, chairs, and complete dining sets. Perfect for family meals and entertaining.',
  decor: 'Add the finishing touches to your home with our decor collection. Coffee tables, TV consoles, and accent pieces to complete your space.',
};

const subcategoryNames: Record<string, string> = {
  'armchair': 'Armchair',
  '2-seater': '2-Seater',
  '3-seater': '3-Seater',
  '4-seater-up': '4-Seater & Up',
  'l-shape': 'L-Shape',
  'outdoor': 'Outdoor/Patio',
  'chair': 'Dining Chair',
  'set': 'Dining Set',
  'table': 'Dining Table',
  'coffee-table': 'Coffee Table',
  'swing-chair': 'Swing Chair',
  'tv-console': 'TV Console',
};

export default function Category() {
  const { category, subcategory } = useParams<{ category: string; subcategory?: string }>();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categoryData, setCategoryData] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCategoryData();
  }, [category, subcategory]);

  const loadCategoryData = async () => {
    if (!category) return;
    setIsLoading(true);
    
    // Get category info
    const catData = await getCategoryBySlug(category);
    setCategoryData(catData);
    
    // Get products
    const allProducts = await getProducts();
    
    // Filter by category/subcategory
    const filtered = allProducts.filter(product => {
      const productCatSlug = product.category_slug?.toLowerCase();
      const productCatName = product.category_name?.toLowerCase();
      
      if (subcategory) {
        // Check if product matches subcategory
        const subcatName = subcategoryNames[subcategory]?.toLowerCase();
        return productCatSlug === category.toLowerCase() && 
               (product.subcategory?.toLowerCase().includes(subcategory.toLowerCase()) ||
                subcatName && product.subcategory?.toLowerCase().includes(subcatName));
      }
      
      return productCatSlug === category.toLowerCase() || 
             productCatName === category.toLowerCase();
    });
    
    setProducts(filtered);
    setIsLoading(false);
  };

  const categoryName = category ? category.charAt(0).toUpperCase() + category.slice(1) : '';
  const subcategoryName = subcategory ? subcategoryNames[subcategory] || subcategory : '';
  const pageTitle = subcategoryName ? `${subcategoryName} ${categoryName}` : categoryName;
  const description = categoryData?.description || categoryDescriptions[category?.toLowerCase() || ''] || '';

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
          {subcategory ? (
            <>
              <Link to={`/category/${category}`} className="hover:text-[#005EE9]">{categoryName}</Link>
              <span>/</span>
              <span className="text-[#0F172A]">{subcategoryName}</span>
            </>
          ) : (
            <span className="text-[#0F172A]">{categoryName}</span>
          )}
        </nav>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-[clamp(32px,4vw,48px)] font-serif text-[#0F172A] mb-4">
            {pageTitle}
          </h1>
          <p className="text-[#364151] max-w-2xl">
            {description}
          </p>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-lg text-gray-500 mb-4">No products found in this category</p>
            <Link to="/shop" className="btn-primary">
              View All Products
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
