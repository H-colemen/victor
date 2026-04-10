import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, X, Star, ImagePlus, FileText, Plus, Trash2 } from 'lucide-react';
import { createProduct, updateProduct, addProductImage, deleteProductImage, setPrimaryImage } from '@/services/adminService';
import { getProductById } from '@/services/productService';
import { getCategories } from '@/services/productService';
import { supabase } from '@/lib/supabase';
import type { Product, Category, ProductImage } from '@/lib/supabase';

// ─── Variant helpers ────────────────────────────────────────────────────────

interface LocalVariant {
  id?: string;           // present if already saved in DB
  variant_type: 'color' | 'size' | 'material';
  variant_name: string;
  variant_value: string;
  price_adjustment: number;
  stock_quantity: number;
  is_active: boolean;
  _deleted?: boolean;    // mark for removal on save
}

const emptyVariant = (type: LocalVariant['variant_type']): LocalVariant => ({
  variant_type: type,
  variant_name: '',
  variant_value: type === 'color' ? '#cccccc' : '',
  price_adjustment: 0,
  stock_quantity: 0,
  is_active: true,
});

// ─── Component ───────────────────────────────────────────────────────────────

export default function ProductForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const descFileInputRef = useRef<HTMLInputElement>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [variants, setVariants] = useState<LocalVariant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingCount, setUploadingCount] = useState(0);
  const [uploadingDescCount, setUploadingDescCount] = useState(0);

  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [pendingPreviews, setPendingPreviews] = useState<string[]>([]);
  const [pendingDescFiles, setPendingDescFiles] = useState<File[]>([]);
  const [pendingDescPreviews, setPendingDescPreviews] = useState<string[]>([]);

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
    if (isEditing) loadProduct();
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
      // Load variants from product
      const dbVariants: LocalVariant[] = (product.variants || []).map(v => ({
        id: v.id,
        variant_type: v.variant_type,
        variant_name: v.variant_name,
        variant_value: v.variant_value,
        price_adjustment: v.price_adjustment,
        stock_quantity: v.stock_quantity,
        is_active: v.is_active,
      }));
      setVariants(dbVariants);
    }
    setIsLoading(false);
  };

  // ── Variant CRUD (local state) ──────────────────────────────────────────

  const addVariant = (type: LocalVariant['variant_type']) => {
    setVariants(prev => [...prev, emptyVariant(type)]);
  };

  const updateVariant = (index: number, field: keyof LocalVariant, value: any) => {
    setVariants(prev => prev.map((v, i) => i === index ? { ...v, [field]: value } : v));
  };

  const removeVariant = (index: number) => {
    setVariants(prev => {
      const v = prev[index];
      if (v.id) {
        // Mark for DB deletion
        return prev.map((item, i) => i === index ? { ...item, _deleted: true } : item);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  // ── Save variants to Supabase ─────────────────────────────────────────

  const saveVariants = async (productId: string) => {
    for (const v of variants) {
      if (v._deleted && v.id) {
        await supabase.from('product_variants').delete().eq('id', v.id);
        continue;
      }
      if (v._deleted) continue;

      const payload = {
        product_id: productId,
        variant_type: v.variant_type,
        variant_name: v.variant_name,
        variant_value: v.variant_value,
        price_adjustment: v.price_adjustment,
        stock_quantity: v.stock_quantity,
        is_active: v.is_active,
      };

      if (v.id) {
        await supabase.from('product_variants').update(payload).eq('id', v.id);
      } else {
        await supabase.from('product_variants').insert(payload);
      }
    }
  };

  // ── Form submit ────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const productData = {
      ...formData,
      slug: formData.slug || formData.name?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    };

    if (isEditing) {
      await updateProduct(id!, productData);
      await saveVariants(id!);
      setIsSaving(false);
      navigate('/admin/products');
    } else {
      const { product: newProduct, error: createError } = await createProduct(productData);
      if (createError || !newProduct) {
        console.error('Failed to create product:', createError);
        setIsSaving(false);
        return;
      }

      await saveVariants(newProduct.id);

      if (pendingFiles.length > 0) {
        setUploadingCount(pendingFiles.length);
        for (let i = 0; i < pendingFiles.length; i++) {
          await addProductImage(newProduct.id, pendingFiles[i], i === 0, false);
          setUploadingCount(prev => prev - 1);
        }
      }

      if (pendingDescFiles.length > 0) {
        setUploadingDescCount(pendingDescFiles.length);
        for (const file of pendingDescFiles) {
          await addProductImage(newProduct.id, file, false, true);
          setUploadingDescCount(prev => prev - 1);
        }
      }

      setIsSaving(false);
      navigate('/admin/products');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked :
              type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  // ── Image handlers ─────────────────────────────────────────────────────

  const handleGalleryUpload = async (files: File[]) => {
    if (!id || files.length === 0) return;
    setUploadingCount(files.length);
    for (const file of files) {
      const isFirst = images.filter(i => !i.show_in_description).length === 0;
      const { image, error } = await addProductImage(id, file, isFirst, false);
      if (image && !error) setImages(prev => [...prev, image]);
      setUploadingCount(prev => prev - 1);
    }
  };

  const handleDescriptionUpload = async (files: File[]) => {
    if (!id || files.length === 0) return;
    setUploadingDescCount(files.length);
    for (const file of files) {
      const { image, error } = await addProductImage(id, file, false, true);
      if (image && !error) setImages(prev => [...prev, image]);
      setUploadingDescCount(prev => prev - 1);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>, isDesc: boolean) => {
    const files = Array.from(e.target.files || []);
    if (isEditing) {
      isDesc ? handleDescriptionUpload(files) : handleGalleryUpload(files);
    } else {
      if (isDesc) {
        setPendingDescFiles(prev => [...prev, ...files]);
        setPendingDescPreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
      } else {
        setPendingFiles(prev => [...prev, ...files]);
        setPendingPreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
      }
    }
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent, isDesc: boolean) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    if (isEditing) {
      isDesc ? handleDescriptionUpload(files) : handleGalleryUpload(files);
    } else {
      if (isDesc) {
        setPendingDescFiles(prev => [...prev, ...files]);
        setPendingDescPreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
      } else {
        setPendingFiles(prev => [...prev, ...files]);
        setPendingPreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
      }
    }
  };

  const handleDeleteImage = async (imageId: string, imageUrl: string) => {
    const success = await deleteProductImage(imageId, imageUrl);
    if (success) setImages(prev => prev.filter(img => img.id !== imageId));
  };

  const handleSetPrimary = async (imageId: string) => {
    if (!id) return;
    const success = await setPrimaryImage(imageId, id);
    if (success) {
      setImages(prev => prev.map(img => ({ ...img, is_primary: img.id === imageId })));
    }
  };

  const handleToggleDescription = async (image: ProductImage) => {
    const newValue = !image.show_in_description;
    const { error } = await supabase
      .from('product_images')
      .update({ show_in_description: newValue })
      .eq('id', image.id);
    if (!error) {
      setImages(prev => prev.map(img =>
        img.id === image.id ? { ...img, show_in_description: newValue } : img
      ));
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-[#005EE9] border-t-transparent rounded-full" />
      </div>
    );
  }

  const galleryImages = images.filter(img => !img.show_in_description);
  const descImages = images.filter(img => img.show_in_description);
  const totalGallery = galleryImages.length + pendingPreviews.length;
  const totalDesc = descImages.length + pendingDescPreviews.length;

  const activeVariants = variants.filter(v => !v._deleted);
  const colorVariants = activeVariants.filter(v => v.variant_type === 'color');
  const sizeVariants = activeVariants.filter(v => v.variant_type === 'size');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/admin/products')} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-serif text-[#0F172A]">
            {isEditing ? 'Edit Product' : 'Add New Product'}
          </h1>
          <p className="text-gray-500">{isEditing ? 'Update product details' : 'Create a new product'}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Main Column ── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Basic Info */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-medium mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Product Name *</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#005EE9]"
                  placeholder="e.g., Arden Carbon Gray Fabric Bedframe" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Slug</label>
                <input type="text" name="slug" value={formData.slug} onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#005EE9]"
                  placeholder="auto-generated-from-name" />
                <p className="text-xs text-gray-500 mt-1">Leave empty to auto-generate from name</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Short Description</label>
                <input type="text" name="short_description" value={formData.short_description || ''} onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#005EE9]"
                  placeholder="Brief product description shown on product page" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Full Description</label>
                <textarea name="description" value={formData.description || ''} onChange={handleChange} rows={5}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#005EE9] resize-none"
                  placeholder="Detailed product description shown in Description tab..." />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-medium mb-1">Pricing</h2>
            <p className="text-xs text-gray-400 mb-4">
              Set the base price. Use size variants below to create a price range (e.g. R3,499 – R5,999).
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Base Price (R) *</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange}
                  required min="0" step="0.01"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#005EE9]"
                  placeholder="0.00" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Original Price (R)</label>
                <input type="number" name="original_price" value={formData.original_price || ''} onChange={handleChange}
                  min="0" step="0.01"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#005EE9]"
                  placeholder="For sale items only" />
              </div>
            </div>
          </div>

          {/* ── VARIANTS ── */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-lg font-medium">Variants</h2>
              <span className="text-sm text-gray-400">{activeVariants.length} variant{activeVariants.length !== 1 ? 's' : ''}</span>
            </div>
            <p className="text-xs text-gray-400 mb-5">
              Add size variants to show a price range on the product card and detail page (e.g. Double / Queen / King).
              Add color variants to show color swatches. Price Adjustment is added to the base price for that size.
            </p>

            {/* Size Variants */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-[#0F172A]">Size Variants</h3>
                <button
                  type="button"
                  onClick={() => addVariant('size')}
                  className="flex items-center gap-1.5 text-xs bg-[#005EE9] text-white px-3 py-1.5 rounded-lg hover:bg-[#0047c0] transition-colors"
                >
                  <Plus className="w-3 h-3" /> Add Size
                </button>
              </div>

              {sizeVariants.length === 0 && (
                <p className="text-sm text-gray-400 italic py-2">No size variants yet. Click "Add Size" to create one.</p>
              )}

              <div className="space-y-2">
                {variants.map((v, index) => {
                  if (v.variant_type !== 'size' || v._deleted) return null;
                  return (
                    <div key={index} className="grid grid-cols-12 gap-2 items-center bg-gray-50 rounded-lg p-3">
                      {/* Name */}
                      <div className="col-span-3">
                        <label className="block text-[10px] text-gray-500 mb-0.5">Label *</label>
                        <input
                          type="text"
                          value={v.variant_name}
                          onChange={e => updateVariant(index, 'variant_name', e.target.value)}
                          placeholder="e.g. Queen"
                          className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded outline-none focus:border-[#005EE9]"
                        />
                      </div>
                      {/* Value */}
                      <div className="col-span-3">
                        <label className="block text-[10px] text-gray-500 mb-0.5">Value</label>
                        <input
                          type="text"
                          value={v.variant_value}
                          onChange={e => updateVariant(index, 'variant_value', e.target.value)}
                          placeholder="e.g. queen"
                          className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded outline-none focus:border-[#005EE9]"
                        />
                      </div>
                      {/* Price adjustment */}
                      <div className="col-span-3">
                        <label className="block text-[10px] text-gray-500 mb-0.5">Price Adj. (R)</label>
                        <input
                          type="number"
                          value={v.price_adjustment}
                          onChange={e => updateVariant(index, 'price_adjustment', parseFloat(e.target.value) || 0)}
                          placeholder="0"
                          className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded outline-none focus:border-[#005EE9]"
                        />
                      </div>
                      {/* Stock */}
                      <div className="col-span-2">
                        <label className="block text-[10px] text-gray-500 mb-0.5">Stock</label>
                        <input
                          type="number"
                          value={v.stock_quantity}
                          onChange={e => updateVariant(index, 'stock_quantity', parseInt(e.target.value) || 0)}
                          min="0"
                          className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded outline-none focus:border-[#005EE9]"
                        />
                      </div>
                      {/* Delete */}
                      <div className="col-span-1 flex justify-center pt-4">
                        <button
                          type="button"
                          onClick={() => removeVariant(index)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Price range preview */}
              {sizeVariants.length > 0 && formData.price && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg text-sm text-[#005EE9]">
                  <span className="font-medium">Price range preview: </span>
                  {(() => {
                    const adjs = sizeVariants.map(v => v.price_adjustment || 0);
                    const min = Math.min(...adjs);
                    const max = Math.max(...adjs);
                    const base = formData.price || 0;
                    if (min === max) return `R${(base + min).toLocaleString()}`;
                    return `R${(base + min).toLocaleString()} – R${(base + max).toLocaleString()}`;
                  })()}
                </div>
              )}
            </div>

            {/* Color Variants */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-[#0F172A]">Color Variants</h3>
                <button
                  type="button"
                  onClick={() => addVariant('color')}
                  className="flex items-center gap-1.5 text-xs bg-[#005EE9] text-white px-3 py-1.5 rounded-lg hover:bg-[#0047c0] transition-colors"
                >
                  <Plus className="w-3 h-3" /> Add Color
                </button>
              </div>

              {colorVariants.length === 0 && (
                <p className="text-sm text-gray-400 italic py-2">No color variants yet. Click "Add Color" to create one.</p>
              )}

              <div className="space-y-2">
                {variants.map((v, index) => {
                  if (v.variant_type !== 'color' || v._deleted) return null;
                  return (
                    <div key={index} className="grid grid-cols-12 gap-2 items-center bg-gray-50 rounded-lg p-3">
                      {/* Color picker */}
                      <div className="col-span-2">
                        <label className="block text-[10px] text-gray-500 mb-0.5">Color *</label>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="color"
                            value={v.variant_value}
                            onChange={e => updateVariant(index, 'variant_value', e.target.value)}
                            className="w-8 h-8 rounded border border-gray-200 cursor-pointer p-0.5"
                          />
                          <input
                            type="text"
                            value={v.variant_value}
                            onChange={e => updateVariant(index, 'variant_value', e.target.value)}
                            placeholder="#cccccc"
                            className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded outline-none focus:border-[#005EE9]"
                          />
                        </div>
                      </div>
                      {/* Name */}
                      <div className="col-span-4">
                        <label className="block text-[10px] text-gray-500 mb-0.5">Color Name *</label>
                        <input
                          type="text"
                          value={v.variant_name}
                          onChange={e => updateVariant(index, 'variant_name', e.target.value)}
                          placeholder="e.g. Carbon Grey"
                          className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded outline-none focus:border-[#005EE9]"
                        />
                      </div>
                      {/* Price adj */}
                      <div className="col-span-2">
                        <label className="block text-[10px] text-gray-500 mb-0.5">Price Adj.</label>
                        <input
                          type="number"
                          value={v.price_adjustment}
                          onChange={e => updateVariant(index, 'price_adjustment', parseFloat(e.target.value) || 0)}
                          placeholder="0"
                          className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded outline-none focus:border-[#005EE9]"
                        />
                      </div>
                      {/* Stock */}
                      <div className="col-span-2">
                        <label className="block text-[10px] text-gray-500 mb-0.5">Stock</label>
                        <input
                          type="number"
                          value={v.stock_quantity}
                          onChange={e => updateVariant(index, 'stock_quantity', parseInt(e.target.value) || 0)}
                          min="0"
                          className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded outline-none focus:border-[#005EE9]"
                        />
                      </div>
                      {/* Active toggle */}
                      <div className="col-span-1 flex flex-col items-center pt-3 gap-1">
                        <label className="block text-[10px] text-gray-500">Active</label>
                        <input
                          type="checkbox"
                          checked={v.is_active}
                          onChange={e => updateVariant(index, 'is_active', e.target.checked)}
                          className="w-4 h-4"
                        />
                      </div>
                      {/* Delete */}
                      <div className="col-span-1 flex justify-center pt-4">
                        <button
                          type="button"
                          onClick={() => removeVariant(index)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── GALLERY IMAGES ── */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-lg font-medium">Gallery Images</h2>
              <span className="text-sm text-gray-400">{totalGallery} image{totalGallery !== 1 ? 's' : ''}</span>
            </div>
            <p className="text-xs text-gray-400 mb-4">
              These appear in the main product photo viewer with thumbnails below.
              {isEditing ? ' ★ sets the primary. 📄 moves to Description tab.' : ' First image becomes the primary.'}
            </p>

            <div
              onDrop={(e) => handleDrop(e, false)}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center gap-2 w-full py-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#005EE9] hover:bg-blue-50 transition-colors mb-4"
            >
              {uploadingCount > 0 ? (
                <>
                  <div className="animate-spin w-7 h-7 border-4 border-[#005EE9] border-t-transparent rounded-full" />
                  <span className="text-sm text-[#005EE9] font-medium">Uploading {uploadingCount} image{uploadingCount !== 1 ? 's' : ''}…</span>
                </>
              ) : (
                <>
                  <ImagePlus className="w-8 h-8 text-gray-400" />
                  <span className="text-sm font-medium text-gray-600">Click or drag & drop gallery images</span>
                  <span className="text-xs text-gray-400">Select multiple files at once</span>
                </>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" multiple
                onChange={(e) => handleFileInput(e, false)}
                disabled={uploadingCount > 0} className="hidden" />
            </div>

            {galleryImages.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-3">
                {galleryImages.map((image) => (
                  <div key={image.id} className="relative group">
                    <img src={image.image_url} alt="Product"
                      className={`w-full aspect-square object-cover rounded-lg ${image.is_primary ? 'ring-2 ring-[#005EE9]' : ''}`} />
                    {image.is_primary && (
                      <span className="absolute top-1 left-1 bg-[#005EE9] text-white text-[10px] px-1.5 py-0.5 rounded font-medium">Primary</span>
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-1.5">
                      {!image.is_primary && (
                        <button type="button" onClick={() => handleSetPrimary(image.id)}
                          className="p-1.5 bg-white rounded hover:bg-yellow-50" title="Set as primary">
                          <Star className="w-3.5 h-3.5 text-yellow-500" />
                        </button>
                      )}
                      <button type="button" onClick={() => handleToggleDescription(image)}
                        className="p-1.5 bg-white rounded hover:bg-emerald-50" title="Move to description tab">
                        <FileText className="w-3.5 h-3.5 text-emerald-600" />
                      </button>
                      <button type="button" onClick={() => handleDeleteImage(image.id, image.image_url)}
                        className="p-1.5 bg-white rounded hover:bg-red-50 text-red-600" title="Delete">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {pendingPreviews.length > 0 && (
              <>
                <p className="text-xs text-gray-400 mb-2">Queued for upload:</p>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                  {pendingPreviews.map((src, index) => (
                    <div key={index} className="relative group">
                      <img src={src} alt={`Preview ${index + 1}`}
                        className={`w-full aspect-square object-cover rounded-lg ${index === 0 ? 'ring-2 ring-[#005EE9]' : ''}`} />
                      {index === 0 && (
                        <span className="absolute top-1 left-1 bg-[#005EE9] text-white text-[10px] px-1.5 py-0.5 rounded font-medium">Primary</span>
                      )}
                      <button type="button"
                        onClick={() => {
                          URL.revokeObjectURL(pendingPreviews[index]);
                          setPendingFiles(prev => prev.filter((_, i) => i !== index));
                          setPendingPreviews(prev => prev.filter((_, i) => i !== index));
                        }}
                        className="absolute top-1 right-1 p-1 bg-white/90 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* ── DESCRIPTION IMAGES ── */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-lg font-medium">Description Images</h2>
              <span className="text-sm text-gray-400">{totalDesc} image{totalDesc !== 1 ? 's' : ''}</span>
            </div>
            <p className="text-xs text-gray-400 mb-4">
              These appear in the Description tab on the product page — great for dimensions, close-ups, or lifestyle photos.
            </p>

            <div
              onDrop={(e) => handleDrop(e, true)}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => descFileInputRef.current?.click()}
              className="flex flex-col items-center justify-center gap-2 w-full py-8 border-2 border-dashed border-emerald-300 rounded-lg cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 transition-colors mb-4"
            >
              {uploadingDescCount > 0 ? (
                <>
                  <div className="animate-spin w-7 h-7 border-4 border-emerald-500 border-t-transparent rounded-full" />
                  <span className="text-sm text-emerald-600 font-medium">Uploading {uploadingDescCount} image{uploadingDescCount !== 1 ? 's' : ''}…</span>
                </>
              ) : (
                <>
                  <FileText className="w-8 h-8 text-emerald-400" />
                  <span className="text-sm font-medium text-gray-600">Click or drag & drop description images</span>
                  <span className="text-xs text-gray-400">Dimensions, close-ups, lifestyle shots</span>
                </>
              )}
              <input ref={descFileInputRef} type="file" accept="image/*" multiple
                onChange={(e) => handleFileInput(e, true)}
                disabled={uploadingDescCount > 0} className="hidden" />
            </div>

            {descImages.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-3">
                {descImages.map((image) => (
                  <div key={image.id} className="relative group">
                    <img src={image.image_url} alt="Description"
                      className="w-full aspect-square object-cover rounded-lg ring-2 ring-emerald-400" />
                    <span className="absolute top-1 left-1 bg-emerald-500 text-white text-[10px] px-1.5 py-0.5 rounded font-medium">Desc</span>
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-1.5">
                      <button type="button" onClick={() => handleToggleDescription(image)}
                        className="p-1.5 bg-white rounded hover:bg-blue-50" title="Move back to gallery">
                        <ImagePlus className="w-3.5 h-3.5 text-[#005EE9]" />
                      </button>
                      <button type="button" onClick={() => handleDeleteImage(image.id, image.image_url)}
                        className="p-1.5 bg-white rounded hover:bg-red-50 text-red-600" title="Delete">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {pendingDescPreviews.length > 0 && (
              <>
                <p className="text-xs text-gray-400 mb-2">Queued for upload:</p>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                  {pendingDescPreviews.map((src, index) => (
                    <div key={index} className="relative group">
                      <img src={src} alt={`Desc preview ${index + 1}`}
                        className="w-full aspect-square object-cover rounded-lg ring-2 ring-emerald-400" />
                      <span className="absolute top-1 left-1 bg-emerald-500 text-white text-[10px] px-1.5 py-0.5 rounded font-medium">Desc</span>
                      <button type="button"
                        onClick={() => {
                          URL.revokeObjectURL(pendingDescPreviews[index]);
                          setPendingDescFiles(prev => prev.filter((_, i) => i !== index));
                          setPendingDescPreviews(prev => prev.filter((_, i) => i !== index));
                        }}
                        className="absolute top-1 right-1 p-1 bg-white/90 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── Sidebar ── */}
        <div className="space-y-6">
          {/* Category & SKU */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-medium mb-4">Organization</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select name="category_id" value={formData.category_id || ''} onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#005EE9]">
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
                <input type="text" name="sku" value={formData.sku || ''} onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#005EE9]"
                  placeholder="e.g., BED-001" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Stock Quantity</label>
                <input type="number" name="stock_quantity" value={formData.stock_quantity} onChange={handleChange}
                  min="0" className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#005EE9]" />
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-medium mb-4">Status</h2>
            <div className="space-y-3">
              {[
                { name: 'is_active', label: 'Active' },
                { name: 'is_featured', label: 'Featured' },
                { name: 'is_on_sale', label: 'On Sale' },
                { name: 'is_new', label: 'New Arrival' },
              ].map(({ name, label }) => (
                <label key={name} className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" name={name} checked={!!(formData as any)[name]}
                    onChange={handleChange} className="w-5 h-5 text-[#005EE9] rounded" />
                  <span className="text-sm">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-medium mb-4">Rating</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Rating (0–5)</label>
                <input type="number" name="rating" value={formData.rating} onChange={handleChange}
                  min="0" max="5" step="0.1"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#005EE9]" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Review Count</label>
                <input type="number" name="review_count" value={formData.review_count} onChange={handleChange}
                  min="0" className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#005EE9]" />
              </div>
            </div>
          </div>

          {/* Image legend */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-xs text-gray-500 space-y-2">
            <p className="font-medium text-gray-600">Image Guide</p>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#005EE9] inline-block flex-shrink-0" />
              <span>Blue ring = primary / gallery image</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block flex-shrink-0" />
              <span>Green ring = description tab image</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="w-3 h-3 text-emerald-600 flex-shrink-0" />
              <span>Move image to description tab</span>
            </div>
            <div className="flex items-center gap-2">
              <ImagePlus className="w-3 h-3 text-[#005EE9] flex-shrink-0" />
              <span>Move image back to gallery</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button type="button" onClick={() => navigate('/admin/products')}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving || uploadingCount > 0 || uploadingDescCount > 0}
              className="flex-1 px-4 py-2 bg-[#005EE9] text-white rounded-lg hover:bg-[#0F172A] disabled:opacity-50 transition-colors"
            >
              {isSaving
                ? (uploadingCount + uploadingDescCount) > 0
                  ? `Uploading ${uploadingCount + uploadingDescCount}…`
                  : 'Saving…'
                : isEditing ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}