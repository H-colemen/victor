import { supabase } from '@/lib/supabase';
import type { Product, ProductImage, ProductVariant, Category } from '@/lib/supabase';

// ==================== PRODUCTS ====================

export async function getProducts(options?: {
  featured?: boolean;
  onSale?: boolean;
  isNew?: boolean;
  category?: string;
  search?: string;
  limit?: number;
}): Promise<Product[]> {
  let query = supabase
    .from('products')
    .select(`
      *,
      categories:category_id (name, slug),
      product_images (*),
      product_variants (*)
    `)
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (options?.featured) query = query.eq('is_featured', true);
  if (options?.onSale) query = query.eq('is_on_sale', true);
  if (options?.isNew) query = query.eq('is_new', true);
  if (options?.search) {
    query = query.or(`name.ilike.%${options.search}%,description.ilike.%${options.search}%`);
  }
  if (options?.limit) query = query.limit(options.limit);

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  return data?.map(product => ({
    ...product,
    category_name: product.categories?.name,
    category_slug: product.categories?.slug,
    images: product.product_images?.sort((a: ProductImage, b: ProductImage) => a.sort_order - b.sort_order),
    primary_image: product.product_images?.find((img: ProductImage) => img.is_primary)?.image_url
      || product.product_images?.[0]?.image_url,
    variants: product.product_variants?.filter((v: ProductVariant) => v.is_active) || [],
  })) || [];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  // Note: no is_active filter here — we fetch by slug directly.
  // Products marked inactive simply won't appear in listings but
  // direct URL access still works (consistent with most e-commerce sites).
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      categories:category_id (name, slug),
      product_images (*),
      product_variants (*)
    `)
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching product by slug:', error);
    return null;
  }

  if (!data) return null;

  return {
    ...data,
    category_name: data.categories?.name,
    category_slug: data.categories?.slug,
    images: data.product_images?.sort((a: ProductImage, b: ProductImage) => a.sort_order - b.sort_order) || [],
    primary_image: data.product_images?.find((img: ProductImage) => img.is_primary)?.image_url
      || data.product_images?.[0]?.image_url,
    variants: data.product_variants?.filter((v: ProductVariant) => v.is_active) || [],
  };
}

export async function getProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      categories:category_id (name, slug),
      product_images (*),
      product_variants (*)
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching product by id:', error);
    return null;
  }

  if (!data) return null;

  return {
    ...data,
    category_name: data.categories?.name,
    category_slug: data.categories?.slug,
    images: data.product_images?.sort((a: ProductImage, b: ProductImage) => a.sort_order - b.sort_order) || [],
    primary_image: data.product_images?.find((img: ProductImage) => img.is_primary)?.image_url
      || data.product_images?.[0]?.image_url,
    variants: data.product_variants?.filter((v: ProductVariant) => v.is_active) || [],
  };
}

export async function getRelatedProducts(productId: string, categoryId: string | null, limit: number = 3): Promise<Product[]> {
  if (!categoryId) return [];

  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      categories:category_id (name, slug),
      product_images (*),
      product_variants (*)
    `)
    .eq('category_id', categoryId)
    .neq('id', productId)
    .eq('is_active', true)
    .limit(limit);

  if (error) {
    console.error('Error fetching related products:', error);
    return [];
  }

  return data?.map(product => ({
    ...product,
    category_name: product.categories?.name,
    category_slug: product.categories?.slug,
    primary_image: product.product_images?.find((img: ProductImage) => img.is_primary)?.image_url
      || product.product_images?.[0]?.image_url,
    variants: product.product_variants?.filter((v: ProductVariant) => v.is_active) || [],
  })) || [];
}

// ==================== CATEGORIES ====================

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .is('parent_id', null)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  const categoriesWithSubs = await Promise.all(
    (data || []).map(async (cat) => {
      const { data: subs } = await supabase
        .from('categories')
        .select('*')
        .eq('parent_id', cat.id)
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      return { ...cat, subcategories: subs || [] };
    })
  );

  return categoriesWithSubs;
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error) {
    console.error('Error fetching category:', error);
    return null;
  }

  return data;
}

// ==================== HERO SLIDES ====================

export async function getHeroSlides(): Promise<{image_url: string; title?: string; subtitle?: string}[]> {
  const { data, error } = await supabase
    .from('hero_slides')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching hero slides:', error);
    return [
      { image_url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1600&q=80', subtitle: "Welcome to homecraft & Living Furnitures" },
      { image_url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1600&q=80', subtitle: "Let's Bring Comfort and Elegance to Your Home" },
      { image_url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1600&q=80', subtitle: "Quality Furniture for Every Home" },
      { image_url: 'https://images.unsplash.com/photo-1615873968403-89e068629265?w=1600&q=80', subtitle: "Transform Your Living Space" },
    ];
  }

  return data?.map(slide => ({
    image_url: slide.image_url,
    title: slide.title || undefined,
    subtitle: slide.subtitle || undefined,
  })) || [];
}

// ==================== TESTIMONIALS ====================

export async function getTestimonials(): Promise<{text: string; author: string; location?: string}[]> {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching testimonials:', error);
    return [
      { text: "Ngijabule kakhulu ngesofa engiyithengile kwa homecraft & Living Furnitures.", author: "Sibongile M" },
      { text: "Thank you so much, homecraft & Living Furnitures. Excellent service!", author: "Alicia" },
      { text: "Die meubels is pragtig en van hoë gehalte!", author: "Johan V" },
    ];
  }

  return data?.map(t => ({
    text: t.testimonial_text,
    author: t.customer_name,
    location: t.customer_location || undefined,
  })) || [];
}

// ==================== SITE SETTINGS ====================

export async function getSiteSettings(): Promise<Record<string, string>> {
  const { data, error } = await supabase
    .from('site_settings')
    .select('*');

  if (error) {
    console.error('Error fetching site settings:', error);
    return {};
  }

  const settings: Record<string, string> = {};
  data?.forEach(setting => {
    settings[setting.setting_key] = setting.setting_value || '';
  });

  return settings;
}