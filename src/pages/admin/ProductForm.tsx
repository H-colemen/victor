import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, X, Upload, Star } from 'lucide-react';
import { createProduct, updateProduct, addProductImage, deleteProductImage, setPrimaryImage } from '@/services/adminService';
import { getProductById } from '@/services/productService';
import { getCategories } from '@/services/productService';
import type { Product, Category, ProductImage } from '@/lib/supabase';

export default function ProductForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    slug: '',
    description: '',
    short_description: '',
    price: 0,
    original_price: null,
    category_id: '',
    sku: '',
    stock_quantity: 0,
    rating: 0,
    review_count: 0,
    is_featured: false,
    is_on_sale: false,
    is_new: false,
    is_active: true,
  });

  useEffect(() => {
    loadCategories();
    if (isEditing) {
      loadProduct();
    }
  }, [id]);

  const loadCategories = async () => {
    const data = await getCategories();
    setCategories(data);
  };

  const loadProduct = async () => {
    setIsLoading(true);
    const product = await getProductById(id!);
    if (product) {
      setFormData({
        name: product.name,
        slug: product.slug,
        description: product.description || '',
        short_description: product.short_description || '',
        price: product.price,
        original_price: product.original_price,
        category_id: product.category_id || '',
        sku: product.sku || '',
        stock_quantity: product.stock_quantity,
        rating: product.rating,
        review_count: product.review_count,
        is_featured: product.is_featured,
        is_on_sale: product.is_on_sale,
        is_new: product.is_new,
        is_active: product.is_active,
      });
      setImages(product.images || []);
    }
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const productData = {
      ...formData,
      slug: formData.slug || formData.name?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    };

    if (isEditing) {
      await updateProduct(id!, productData);
    } else {
      await createProduct(productData);
    }

    setIsSaving(false);
    navigate('/admin/products');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !id) return;

    setUploadingImage(true);
    const isFirstImage = images.length === 0;
    const { image, error } = await addProductImage(id, file, isFirstImage);
    
    if (image && !error) {
      setImages(prev => [...prev, image]);
    }
    setUploadingImage(false);
  };

  const handleDeleteImage = async (imageId: string, imageUrl: string) => {
    const success = await deleteProductImage(imageId, imageUrl);
    if (success) {
      setImages(prev => prev.filter(img => img.id !== imageId));
    }
  };

  const handleSetPrimary = async (imageId: string) => {
    if (!id) return;
    const success = await setPrimaryImage(imageId, id);
    if (success) {
      setImages(prev => prev.map(img => ({
        ...img,
        is_primary: img.id === imageId,
      })));
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-[#005EE9] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/products')}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-serif text-[#0F172A]">
            {isEditing ? 'Edit Product' : 'Add New Product'}
          </h1>
          <p className="text-gray-500">
            {isEditing ? 'Update product details' : 'Create a new product'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-medium mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Product Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#005EE9]"
                  placeholder="e.g., Georges Modular Sofa"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Slug</label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#005EE9]"
                  placeholder="auto-generated-from-name"
                />
                <p className="text-xs text-gray-500 mt-1">Leave empty to auto-generate from name</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Short Description</label>
                <input
                  type="text"
                  name="short_description"
                  value={formData.short_description || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#005EE9]"
                  placeholder="Brief product description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Full Description</label>
                <textarea
                  name="description"
                  value={formData.description || ''}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#005EE9] resize-none"
                  placeholder="Detailed product description..."
                />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-medium mb-4">Pricing</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Price (R) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#005EE9]"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Original Price (R)</label>
                <input
                  type="number"
                  name="original_price"
                  value={formData.original_price || ''}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#005EE9]"
                  placeholder="For sale items"
                />
              </div>
            </div>
          </div>

          {/* Images (only for edit mode) */}
          {isEditing && (
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-medium mb-4">Product Images</h2>
              
              {/* Upload */}
              <div className="mb-4">
                <label className="flex items-center justify-center gap-2 w-full h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#005EE9] hover:bg-blue-50 transition-colors">
                  <Upload className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-500">
                    {uploadingImage ? 'Uploading...' : 'Click to upload images'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Image Grid */}
              {images.length > 0 && (
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-4">
                  {images.map((image) => (
                    <div key={image.id} className="relative group">
                      <img
                        src={image.image_url}
                        alt="Product"
                        className={`w-full aspect-square object-cover rounded-lg ${
                          image.is_primary ? 'ring-2 ring-[#005EE9]' : ''
                        }`}
                      />
                      {image.is_primary && (
                        <span className="absolute top-1 left-1 bg-[#005EE9] text-white text-xs px-2 py-0.5 rounded">
                          Primary
                        </span>
                      )}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                        {!image.is_primary && (
                          <button
                            type="button"
                            onClick={() => handleSetPrimary(image.id)}
                            className="p-1.5 bg-white rounded hover:bg-gray-100"
                            title="Set as primary"
                          >
                            <Star className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDeleteImage(image.id, image.image_url)}
                          className="p-1.5 bg-white rounded hover:bg-red-100 text-red-600"
                          title="Delete"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Category & SKU */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-medium mb-4">Organization</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  name="category_id"
                  value={formData.category_id || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#005EE9]"
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <optgroup key={cat.id} label={cat.name}>
                      <option value={cat.id}>{cat.name}</option>
                      {cat.subcategories?.map((sub) => (
                        <option key={sub.id} value={sub.id}>— {sub.name}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">SKU</label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#005EE9]"
                  placeholder="e.g., SOFA-001"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Stock Quantity</label>
                <input
                  type="number"
                  name="stock_quantity"
                  value={formData.stock_quantity}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#005EE9]"
                />
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-medium mb-4">Status</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  className="w-5 h-5 text-[#005EE9] rounded"
                />
                <span className="text-sm">Active</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="is_featured"
                  checked={formData.is_featured}
                  onChange={handleChange}
                  className="w-5 h-5 text-[#005EE9] rounded"
                />
                <span className="text-sm">Featured</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="is_on_sale"
                  checked={formData.is_on_sale}
                  onChange={handleChange}
                  className="w-5 h-5 text-[#005EE9] rounded"
                />
                <span className="text-sm">On Sale</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="is_new"
                  checked={formData.is_new}
                  onChange={handleChange}
                  className="w-5 h-5 text-[#005EE9] rounded"
                />
                <span className="text-sm">New Arrival</span>
              </label>
            </div>
          </div>

          {/* Rating */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-medium mb-4">Rating</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Rating (0-5)</label>
                <input
                  type="number"
                  name="rating"
                  value={formData.rating}
                  onChange={handleChange}
                  min="0"
                  max="5"
                  step="0.1"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#005EE9]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Review Count</label>
                <input
                  type="number"
                  name="review_count"
                  value={formData.review_count}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#005EE9]"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate('/admin/products')}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 px-4 py-2 bg-[#005EE9] text-white rounded-lg hover:bg-[#0F172A] disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : isEditing ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
