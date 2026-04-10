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

    // Send order confirmation email via Supabase Edge Function
    // Note: verify_jwt must be set to false in supabase/config.toml for this function
    // since guest checkout users won't have a session token.
    try {
      const emailRes = await fetch(
        'https://lbsweigzfibryltxgvgu.supabase.co/functions/v1/send-order-email',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: order.customer_email,
            orderId: order.order_number || order.id,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                <h2 style="color: #005EE9;">Thank you for your order!</h2>
                <p>Hi ${order.customer_first_name},</p>
                <p>We've successfully received your order and are getting it ready for you.</p>
                <div style="background-color: #f8f9fb; padding: 15px; border-radius: 5px; margin: 20px 0;">
                  <p style="margin: 0;"><strong>Order Number:</strong> ${order.order_number || order.id}</p>
                  <p style="margin: 5px 0 0 0;"><strong>Total Amount:</strong> R${order.total_amount.toLocaleString()}</p>
                </div>
                <p>We will send you another update once your order has shipped.</p>
                <p>Best regards,<br/>The Homecraft &amp; Living Team</p>
              </div>
            `,
          }),
        }
      );

      if (!emailRes.ok) {
        const errBody = await emailRes.text();
        console.error('Email function returned an error:', emailRes.status, errBody);
      }
    } catch (emailError) {
      // Log but don't surface to the user — order is already created successfully.
      console.error('Failed to send confirmation email:', emailError);
    }

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