import { supabase } from '@/lib/supabase';
import type { Order } from '@/lib/supabase';

export interface CheckoutData {
  customer_email: string;
  customer_first_name: string;
  customer_last_name: string;
  customer_phone: string;
  shipping_address_line1: string;
  shipping_address_line2?: string;
  shipping_city: string;
  shipping_state?: string;
  shipping_postal_code: string;
  shipping_country: string;
  billing_same_as_shipping: boolean;
  billing_address_line1?: string;
  billing_address_line2?: string;
  billing_city?: string;
  billing_state?: string;
  billing_postal_code?: string;
  billing_country?: string;
  customer_notes?: string;
  items: {
    product_id: string;
    product_name: string;
    product_image?: string;
    quantity: number;
    unit_price: number;
    selected_variant?: string;
  }[];
  subtotal: number;
  shipping_cost: number;
  total_amount: number;
}

export async function createOrder(checkoutData: CheckoutData): Promise<{ order: Order | null; error: string | null }> {
  try {
    // Prepare order data
    const orderData = {
      customer_email: checkoutData.customer_email,
      customer_first_name: checkoutData.customer_first_name,
      customer_last_name: checkoutData.customer_last_name,
      customer_phone: checkoutData.customer_phone,
      shipping_address_line1: checkoutData.shipping_address_line1,
      shipping_address_line2: checkoutData.shipping_address_line2 || null,
      shipping_city: checkoutData.shipping_city,
      shipping_state: checkoutData.shipping_state || null,
      shipping_postal_code: checkoutData.shipping_postal_code,
      shipping_country: checkoutData.shipping_country,
      billing_address_line1: checkoutData.billing_same_as_shipping ? checkoutData.shipping_address_line1 : checkoutData.billing_address_line1,
      billing_address_line2: checkoutData.billing_same_as_shipping ? checkoutData.shipping_address_line2 : checkoutData.billing_address_line2,
      billing_city: checkoutData.billing_same_as_shipping ? checkoutData.shipping_city : checkoutData.billing_city,
      billing_state: checkoutData.billing_same_as_shipping ? checkoutData.shipping_state : checkoutData.billing_state,
      billing_postal_code: checkoutData.billing_same_as_shipping ? checkoutData.shipping_postal_code : checkoutData.billing_postal_code,
      billing_country: checkoutData.billing_same_as_shipping ? checkoutData.shipping_country : checkoutData.billing_country,
      subtotal: checkoutData.subtotal,
      shipping_cost: checkoutData.shipping_cost,
      total_amount: checkoutData.total_amount,
      customer_notes: checkoutData.customer_notes || null,
      status: 'pending',
      payment_status: 'pending',
    };

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert(orderData)
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      return { order: null, error: 'Failed to create order. Please try again.' };
    }

    // Create order items
    const orderItems = checkoutData.items.map(item => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.product_name,
      product_image: item.product_image || null,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.unit_price * item.quantity,
      selected_variant: item.selected_variant || null,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Error creating order items:', itemsError);
      // Rollback order if items fail
      await supabase.from('orders').delete().eq('id', order.id);
      return { order: null, error: 'Failed to create order items. Please try again.' };
    }

    // Send order confirmation email (this would be handled by a serverless function)
    // For now, we'll just return the order
    
    return { order, error: null };
  } catch (error) {
    console.error('Unexpected error creating order:', error);
    return { order: null, error: 'An unexpected error occurred. Please try again.' };
  }
}

export async function getOrderByNumber(orderNumber: string): Promise<Order | null> {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (*)
    `)
    .eq('order_number', orderNumber)
    .single();

  if (error) {
    console.error('Error fetching order:', error);
    return null;
  }

  return {
    ...data,
    items: data.order_items || [],
  };
}

export async function getOrdersByEmail(email: string): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (*)
    `)
    .eq('customer_email', email)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching orders:', error);
    return [];
  }

  return data?.map(order => ({
    ...order,
    items: order.order_items || [],
  })) || [];
}

// Admin functions
export async function getAllOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (*)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching all orders:', error);
    return [];
  }

  return data?.map(order => ({
    ...order,
    items: order.order_items || [],
  })) || [];
}

export async function updateOrderStatus(
  orderId: string, 
  status: Order['status'],
  trackingInfo?: { tracking_number?: string; shipping_carrier?: string }
): Promise<boolean> {
  const updateData: Partial<Order> = { status };
  
  if (status === 'shipped') {
    updateData.shipped_at = new Date().toISOString();
    if (trackingInfo) {
      updateData.tracking_number = trackingInfo.tracking_number;
      updateData.shipping_carrier = trackingInfo.shipping_carrier;
    }
  }
  
  if (status === 'delivered') {
    updateData.delivered_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from('orders')
    .update(updateData)
    .eq('id', orderId);

  if (error) {
    console.error('Error updating order status:', error);
    return false;
  }

  return true;
}

export async function addAdminNote(orderId: string, note: string): Promise<boolean> {
  const { error } = await supabase
    .from('orders')
    .update({ admin_notes: note })
    .eq('id', orderId);

  if (error) {
    console.error('Error adding admin note:', error);
    return false;
  }

  return true;
}
