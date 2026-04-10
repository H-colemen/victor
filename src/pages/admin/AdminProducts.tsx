import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Eye, Image as ImageIcon } from 'lucide-react';
import { getAllProducts, deleteProduct } from '@/services/adminService';
import type { Product } from '@/lib/supabase';

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      setFilteredProducts(
        products.filter(p =>
          p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category_name?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredProducts(products);
    }
  }, [searchQuery, products]);

  const loadProducts = async () => {
    setIsLoading(true);
    const data = await getAllProducts();
    setProducts(data);
    setFilteredProducts(data);
    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (deleteConfirm === id) {
      const success = await deleteProduct(id);
      if (success) {
        loadProducts();
      }
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
    }
  };

  const formatPrice = (price: number) => `R${price?.toLocaleString() || 0}`;

  // Get price display - range or single, NO strikethrough
  const getPriceDisplay = (product: Product) => {
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
    
    return formatPrice(product.price);
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#005EE9] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif text-[#0F172A]">Products</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your product catalog</p>
        </div>
        <Link
          to="/admin/products/new"
          className="flex items-center gap-2 bg-[#005EE9] text-white px-4 py-2 rounded-lg hover:bg-[#0F172A] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </Link>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#005EE9]"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {filteredProducts.length === 0 ? (
          <div className="p-12 text-center">
            <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No products yet</h3>
            <p className="text-gray-500 mb-4">Start by adding your first product</p>
            <Link
              to="/admin/products/new"
              className="inline-flex items-center gap-2 bg-[#005EE9] text-white px-4 py-2 rounded-lg hover:bg-[#0F172A] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Product</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Price</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Stock</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Status</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.primary_image || product.images?.[0]?.image_url || 'https://via.placeholder.com/50'}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-gray-500">{product.sku || 'No SKU'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">{product.category_name || 'Uncategorized'}</td>
                    <td className="px-6 py-4">
                      <span className="font-medium">{getPriceDisplay(product)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm ${
                        product.stock_quantity === 0 ? 'text-red-600' :
                        product.stock_quantity < 5 ? 'text-orange-600' :
                        'text-green-600'
                      }`}>
                        {product.stock_quantity}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {product.is_featured && (
                          <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Featured</span>
                        )}
                        {product.is_on_sale && (
                          <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Sale</span>
                        )}
                        {product.is_new && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">New</span>
                        )}
                        {!product.is_active && (
                          <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">Inactive</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/product/${product.slug}`}
                          target="_blank"
                          className="p-2 text-gray-500 hover:text-[#005EE9] hover:bg-blue-50 rounded-lg transition-colors"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/admin/products/edit/${product.id}`}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            deleteConfirm === product.id
                              ? 'text-red-600 bg-red-50'
                              : 'text-gray-500 hover:text-red-600 hover:bg-red-50'
                          }`}
                          title={deleteConfirm === product.id ? 'Click again to confirm' : 'Delete'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}