import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types
export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  price: number;
  original_price: number | null;
  category_id: string | null;
  sku: string | null;
  stock_quantity: number;
  rating: number;
  review_count: number;
  is_featured: boolean;
  is_on_sale: boolean;
  is_new: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Joined fields
  category_name?: string;
  category_slug?: string;
  category?: string;
  subcategory?: string;
  primary_image?: string;
  image?: string;
  title?: string;
  images?: ProductImage[];
  variants?: ProductVariant[];
};

export type ProductImage = {
  id: string;
  product_id: string;
  image_url: string;
  alt_text: string | null;
  sort_order: number;
  is_primary: boolean;
  show_in_description: boolean;
  created_at: string;
};

export type ProductVariant = {
  id: string;
  product_id: string;
  variant_type: 'color' | 'size' | 'material';
  variant_name: string;
  variant_value: string;
  price_adjustment: number;
  stock_quantity: number;
  image_url: string | null;
  is_active: boolean;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  parent_id: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  subcategories?: Category[];
};

export type Order = {
  id: string;
  order_number: string;
  customer_email: string;
  customer_first_name: string;
  customer_last_name: string;
  customer_phone: string | null;
  shipping_address_line1: string;
  shipping_address_line2: string | null;
  shipping_city: string;
  shipping_state: string | null;
  shipping_postal_code: string;
  shipping_country: string;
  billing_address_line1: string | null;
  billing_address_line2: string | null;
  billing_city: string | null;
  billing_state: string | null;
  billing_postal_code: string | null;
  billing_country: string | null;
  subtotal: number;
  shipping_cost: number;
  discount_amount: number;
  tax_amount: number;
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_method: string | null;
  customer_notes: string | null;
  admin_notes: string | null;
  tracking_number: string | null;
  shipping_carrier: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  product_sku: string | null;
  product_image: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
  selected_variant: string | null;
  created_at: string;
};

export type HeroSlide = {
  id: string;
  image_url: string;
  title: string | null;
  subtitle: string | null;
  button_text: string;
  button_link: string;
  sort_order: number;
  is_active: boolean;
};

export type Testimonial = {
  id: string;
  customer_name: string;
  customer_location: string | null;
  testimonial_text: string;
  rating: number;
  customer_image: string | null;
  is_active: boolean;
  sort_order: number;
};

export type SiteSetting = {
  id: string;
  setting_key: string;
  setting_value: string | null;
  setting_type: string;
  description: string | null;
};

// Helper functions
export async function uploadImage(file: File, bucket: string, path: string) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (error) throw error;

  // Manually construct the public URL to ensure correct format
  const publicUrl = `${supabaseUrl}/storage/v1/object/public/${bucket}/${data.path}`;

  return publicUrl;
}

export async function deleteImage(bucket: string, path: string) {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path]);

  if (error) throw error;
}
