import { supabase, uploadImage, deleteImage } from '@/lib/supabase';
import type { Product, ProductImage, ProductVariant, Category, HeroSlide, Testimonial, SiteSetting } from '@/lib/supabase';

// ==================== ADMIN AUTH ====================

export async function adminLogin(email: string, password: string): Promise<{ user: any | null; error: string | null }> {
  // Sign in via Supabase Auth — this sets a real session so auth.uid() works in RLS
  const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });

  if (authError || !data.session) {
    return { user: null, error: 'Invalid credentials' };
  }

  // Verify the authenticated user is an active admin
  const { data: adminUser, error: adminError } = await supabase
    .from('admin_users')
    .select('id, email, role')
    .eq('email', email)
    .eq('is_active', true)
    .single();

  if (adminError || !adminUser) {
    await supabase.auth.signOut();
    return { user: null, error: 'Access denied. Not an admin account.' };
  }

  // Update last login timestamp
  await supabase
    .from('admin_users')
    .update({ last_login_at: new Date().toISOString() })
    .eq('id', adminUser.id);

  return { user: { id: adminUser.id, email: adminUser.email, role: adminUser.role }, error: null };
}

export async function adminLogout(): Promise<void> {
  await supabase.auth.signOut();
}

// ==================== PRODUCT MANAGEMENT ====================

export async function createProduct(product: Partial<Product>): Promise<{ product: Product | null; error: string | null }> {
  const { data, error } = await supabase
    .from('products')
    .insert(product)
    .select()
    .single();

  if (error) {
    console.error('Error creating product:', error);
    return { product: null, error: error.message };
  }

  return { product: data, error: null };
}

export async function updateProduct(id: string, product: Partial<Product>): Promise<{ product: Product | null; error: string | null }> {
  const { data, error } = await supabase
    .from('products')
    .update(product)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating product:', error);
    return { product: null, error: error.message };
  }

  return { product: data, error: null };
}

export async function deleteProduct(id: string): Promise<boolean> {
  const { data: images } = await supabase
    .from('product_images')
    .select('image_url')
    .eq('product_id', id);

  if (images) {
    for (const img of images) {
      try {
        const path = img.image_url.split('/').pop();
        if (path) await deleteImage('product-images', path);
      } catch (e) {
        console.error('Error deleting image:', e);
      }
    }
  }

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting product:', error);
    return false;
  }

  return true;
}

export async function getAllProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      categories:category_id (name, slug),
      product_images (*)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching all products:', error);
    return [];
  }

  return data?.map(product => ({
    ...product,
    category_name: product.categories?.name,
    category_slug: product.categories?.slug,
    images: product.product_images || [],
  })) || [];
}

// ==================== PRODUCT IMAGES ====================

export async function addProductImage(
  productId: string,
  file: File,
  isPrimary: boolean = false,
  showInDescription: boolean = false
): Promise<{ image: ProductImage | null; error: string | null }> {
  try {
    const path = `${productId}/${Date.now()}-${file.name}`;
    const imageUrl = await uploadImage(file, 'product-images', path);

    const { data, error } = await supabase
      .from('product_images')
      .insert({
        product_id: productId,
        image_url: imageUrl,
        is_primary: isPrimary,
        show_in_description: showInDescription,
        alt_text: file.name,
      })
      .select()
      .single();

    if (error) return { image: null, error: error.message };
    return { image: data, error: null };
  } catch (error: any) {
    return { image: null, error: error.message };
  }
}

export async function deleteProductImage(imageId: string, imageUrl: string): Promise<boolean> {
  try {
    const path = imageUrl.split('/').pop();
    if (path) await deleteImage('product-images', path);

    const { error } = await supabase
      .from('product_images')
      .delete()
      .eq('id', imageId);

    if (error) {
      console.error('Error deleting product image:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting product image:', error);
    return false;
  }
}

export async function setPrimaryImage(imageId: string, productId: string): Promise<boolean> {
  await supabase
    .from('product_images')
    .update({ is_primary: false })
    .eq('product_id', productId);

  const { error } = await supabase
    .from('product_images')
    .update({ is_primary: true })
    .eq('id', imageId);

  if (error) {
    console.error('Error setting primary image:', error);
    return false;
  }

  return true;
}

// ==================== PRODUCT VARIANTS ====================

export async function addProductVariant(variant: Partial<ProductVariant>): Promise<{ variant: ProductVariant | null; error: string | null }> {
  const { data, error } = await supabase
    .from('product_variants')
    .insert(variant)
    .select()
    .single();

  if (error) return { variant: null, error: error.message };
  return { variant: data, error: null };
}

export async function updateProductVariant(id: string, variant: Partial<ProductVariant>): Promise<boolean> {
  const { error } = await supabase
    .from('product_variants')
    .update(variant)
    .eq('id', id);

  if (error) {
    console.error('Error updating variant:', error);
    return false;
  }

  return true;
}

export async function deleteProductVariant(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('product_variants')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting variant:', error);
    return false;
  }

  return true;
}

// ==================== CATEGORY MANAGEMENT ====================

export async function createCategory(category: Partial<Category>): Promise<{ category: Category | null; error: string | null }> {
  const { data, error } = await supabase
    .from('categories')
    .insert(category)
    .select()
    .single();

  if (error) return { category: null, error: error.message };
  return { category: data, error: null };
}

export async function updateCategory(id: string, category: Partial<Category>): Promise<boolean> {
  const { error } = await supabase
    .from('categories')
    .update(category)
    .eq('id', id);

  if (error) {
    console.error('Error updating category:', error);
    return false;
  }

  return true;
}

export async function deleteCategory(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting category:', error);
    return false;
  }

  return true;
}

// ==================== HERO SLIDES ====================

export async function getAllHeroSlides(): Promise<HeroSlide[]> {
  const { data, error } = await supabase
    .from('hero_slides')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching hero slides:', error);
    return [];
  }

  return data || [];
}

export async function createHeroSlide(slide: Partial<HeroSlide>, file?: File): Promise<{ slide: HeroSlide | null; error: string | null }> {
  let imageUrl = slide.image_url;

  if (file) {
    try {
      const path = `hero-${Date.now()}-${file.name}`;
      imageUrl = await uploadImage(file, 'hero-images', path);
    } catch (error: any) {
      return { slide: null, error: error.message };
    }
  }

  const { data, error } = await supabase
    .from('hero_slides')
    .insert({ ...slide, image_url: imageUrl })
    .select()
    .single();

  if (error) return { slide: null, error: error.message };
  return { slide: data, error: null };
}

export async function updateHeroSlide(id: string, slide: Partial<HeroSlide>, file?: File): Promise<boolean> {
  let imageUrl = slide.image_url;

  if (file) {
    try {
      const path = `hero-${Date.now()}-${file.name}`;
      imageUrl = await uploadImage(file, 'hero-images', path);
    } catch (error) {
      console.error('Error uploading hero image:', error);
      return false;
    }
  }

  const { error } = await supabase
    .from('hero_slides')
    .update({ ...slide, image_url: imageUrl })
    .eq('id', id);

  if (error) {
    console.error('Error updating hero slide:', error);
    return false;
  }

  return true;
}

export async function deleteHeroSlide(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('hero_slides')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting hero slide:', error);
    return false;
  }

  return true;
}

// ==================== TESTIMONIALS ====================

export async function getAllTestimonials(): Promise<Testimonial[]> {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching testimonials:', error);
    return [];
  }

  return data || [];
}

export async function createTestimonial(testimonial: Partial<Testimonial>): Promise<{ testimonial: Testimonial | null; error: string | null }> {
  const { data, error } = await supabase
    .from('testimonials')
    .insert(testimonial)
    .select()
    .single();

  if (error) return { testimonial: null, error: error.message };
  return { testimonial: data, error: null };
}

export async function updateTestimonial(id: string, testimonial: Partial<Testimonial>): Promise<boolean> {
  const { error } = await supabase
    .from('testimonials')
    .update(testimonial)
    .eq('id', id);

  if (error) {
    console.error('Error updating testimonial:', error);
    return false;
  }

  return true;
}

export async function deleteTestimonial(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('testimonials')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting testimonial:', error);
    return false;
  }

  return true;
}

// ==================== SITE SETTINGS ====================

export async function getAllSiteSettings(): Promise<SiteSetting[]> {
  const { data, error } = await supabase
    .from('site_settings')
    .select('*');

  if (error) {
    console.error('Error fetching site settings:', error);
    return [];
  }

  return data || [];
}

export async function updateSiteSetting(key: string, value: string): Promise<boolean> {
  const { error } = await supabase
    .from('site_settings')
    .update({ setting_value: value, updated_at: new Date().toISOString() })
    .eq('setting_key', key);

  if (error) {
    console.error('Error updating site setting:', error);
    return false;
  }

  return true;
}

// ==================== STATS ====================

export async function getDashboardStats(): Promise<{
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
}> {
  const [{ count: totalProducts }, { count: totalOrders }, { data: orders }] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('total_amount, status'),
  ]);

  const totalRevenue = orders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;
  const pendingOrders = orders?.filter(o => o.status === 'pending').length || 0;

  return {
    totalProducts: totalProducts || 0,
    totalOrders: totalOrders || 0,
    totalRevenue,
    pendingOrders,
  };
}