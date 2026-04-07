import { useEffect, useState } from 'react';
import { getAllOrders, updateOrderStatus } from '@/services/orderService';
import type { Order } from '@/lib/supabase';
import { Eye, Truck, CheckCircle, XCircle, Package } from 'lucide-react';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  refunded: 'bg-gray-100 text-gray-800',
};

const paymentStatusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
  refunded: 'bg-gray-100 text-gray-800',
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [shippingCarrier, setShippingCarrier] = useState('');

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    if (filterStatus === 'all') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(o => o.status === filterStatus));
    }
  }, [filterStatus, orders]);

  const loadOrders = async () => {
    setIsLoading(true);
    const data = await getAllOrders();
    setOrders(data);
    setFilteredOrders(data);
    setIsLoading(false);
  };

  const handleStatusUpdate = async (orderId: string, newStatus: Order['status']) => {
    let trackingInfo;
    if (newStatus === 'shipped') {
      trackingInfo = {
        tracking_number: trackingNumber,
        shipping_carrier: shippingCarrier,
      };
    }
    
    const success = await updateOrderStatus(orderId, newStatus, trackingInfo);
    if (success) {
      loadOrders();
      setTrackingNumber('');
      setShippingCarrier('');
    }
  };

  const formatPrice = (price: number) => `R${price?.toLocaleString() || 0}`;
  const formatDate = (date: string) => new Date(date).toLocaleDateString('en-ZA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif text-[#0F172A]">Orders</h1>
          <p className="text-gray-500">Manage customer orders</p>
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#005EE9]"
        >
          <option value="all">All Orders</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No orders yet</h3>
            <p className="text-gray-500">Orders will appear here when customers make purchases</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Order</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Customer</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Total</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Status</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="font-medium">{order.order_number}</p>
                      <p className="text-sm text-gray-500">{order.items?.length || 0} items</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm">{order.customer_first_name} {order.customer_last_name}</p>
                      <p className="text-sm text-gray-500">{order.customer_email}</p>
                    </td>
                    <td className="px-6 py-4 text-sm">{formatDate(order.created_at)}</td>
                    <td className="px-6 py-4 font-medium">{formatPrice(order.total_amount)}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className={`text-xs px-2 py-1 rounded-full w-fit ${statusColors[order.status]}`}>
                          {order.status}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full w-fit ${paymentStatusColors[order.payment_status]}`}>
                          {order.payment_status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 text-gray-500 hover:text-[#005EE9] hover:bg-blue-50 rounded-lg"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {order.status === 'pending' && (
                          <button
                            onClick={() => handleStatusUpdate(order.id, 'processing')}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="Mark as Processing"
                          >
                            <Package className="w-4 h-4" />
                          </button>
                        )}
                        {order.status === 'processing' && (
                          <button
                            onClick={() => setSelectedOrder({ ...order, showTracking: true } as any)}
                            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg"
                            title="Mark as Shipped"
                          >
                            <Truck className="w-4 h-4" />
                          </button>
                        )}
                        {order.status !== 'delivered' && order.status !== 'cancelled' && (
                          <button
                            onClick={() => handleStatusUpdate(order.id, 'delivered')}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                            title="Mark as Delivered"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        {order.status !== 'cancelled' && order.status !== 'delivered' && (
                          <button
                            onClick={() => handleStatusUpdate(order.id, 'cancelled')}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            title="Cancel Order"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <div>
                <h2 className="text-xl font-medium">Order {selectedOrder.order_number}</h2>
                <p className="text-sm text-gray-500">{formatDate(selectedOrder.created_at)}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div>
                <h3 className="font-medium mb-2">Customer Information</h3>
                <div className="bg-gray-50 p-4 rounded-lg text-sm">
                  <p><span className="text-gray-500">Name:</span> {selectedOrder.customer_first_name} {selectedOrder.customer_last_name}</p>
                  <p><span className="text-gray-500">Email:</span> {selectedOrder.customer_email}</p>
                  <p><span className="text-gray-500">Phone:</span> {selectedOrder.customer_phone || 'N/A'}</p>
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h3 className="font-medium mb-2">Shipping Address</h3>
                <div className="bg-gray-50 p-4 rounded-lg text-sm">
                  <p>{selectedOrder.shipping_address_line1}</p>
                  {selectedOrder.shipping_address_line2 && <p>{selectedOrder.shipping_address_line2}</p>}
                  <p>{selectedOrder.shipping_city}, {selectedOrder.shipping_state} {selectedOrder.shipping_postal_code}</p>
                  <p>{selectedOrder.shipping_country}</p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-medium mb-2">Order Items</h3>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                      <img
                        src={item.product_image || 'https://via.placeholder.com/50'}
                        alt={item.product_name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.product_name}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        {item.selected_variant && (
                          <p className="text-xs text-gray-500">Variant: {item.selected_variant}</p>
                        )}
                      </div>
                      <p className="font-medium text-sm">{formatPrice(item.total_price)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <h3 className="font-medium mb-2">Order Summary</h3>
                <div className="bg-gray-50 p-4 rounded-lg text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Subtotal</span>
                    <span>{formatPrice(selectedOrder.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Shipping</span>
                    <span>{selectedOrder.shipping_cost === 0 ? 'Free' : formatPrice(selectedOrder.shipping_cost)}</span>
                  </div>
                  {selectedOrder.discount_amount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Discount</span>
                      <span className="text-green-600">-{formatPrice(selectedOrder.discount_amount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-medium pt-2 border-t">
                    <span>Total</span>
                    <span>{formatPrice(selectedOrder.total_amount)}</span>
                  </div>
                </div>
              </div>

              {/* Customer Notes */}
              {selectedOrder.customer_notes && (
                <div>
                  <h3 className="font-medium mb-2">Customer Notes</h3>
                  <div className="bg-yellow-50 p-4 rounded-lg text-sm">
                    {selectedOrder.customer_notes}
                  </div>
                </div>
              )}

              {/* Tracking Info */}
              {selectedOrder.tracking_number && (
                <div>
                  <h3 className="font-medium mb-2">Tracking Information</h3>
                  <div className="bg-blue-50 p-4 rounded-lg text-sm">
                    <p><span className="text-gray-500">Carrier:</span> {selectedOrder.shipping_carrier}</p>
                    <p><span className="text-gray-500">Tracking Number:</span> {selectedOrder.tracking_number}</p>
                  </div>
                </div>
              )}

              {/* Tracking Input (for shipping) */}
              {(selectedOrder as any).showTracking && (
                <div>
                  <h3 className="font-medium mb-2">Add Tracking Information</h3>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Shipping Carrier (e.g., DHL, FedEx)"
                      value={shippingCarrier}
                      onChange={(e) => setShippingCarrier(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="Tracking Number"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                    />
                    <button
                      onClick={() => handleStatusUpdate(selectedOrder.id, 'shipped')}
                      className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700"
                    >
                      Mark as Shipped
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
