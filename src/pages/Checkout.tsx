import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Check, Truck, Shield, CreditCard, MapPin, User, Mail, Phone } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { createOrder } from '@/services/orderService';

export default function Checkout() {

  const { items, getTotalPrice, clearCart } = useCart();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'South Africa',
    billingSameAsShipping: true,
    billingAddress1: '',
    billingAddress2: '',
    billingCity: '',
    billingState: '',
    billingPostalCode: '',
    billingCountry: 'South Africa',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const formatPrice = (price: number) => `R${price.toLocaleString()}`;

  const shippingCost = getTotalPrice() >= 5000 ? 0 : 299;
  const totalAmount = getTotalPrice() + shippingCost;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email';
    
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.phone) newErrors.phone = 'Phone is required';
    if (!formData.address1) newErrors.address1 = 'Address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.postalCode) newErrors.postalCode = 'Postal code is required';

    if (!formData.billingSameAsShipping) {
      if (!formData.billingAddress1) newErrors.billingAddress1 = 'Billing address is required';
      if (!formData.billingCity) newErrors.billingCity = 'Billing city is required';
      if (!formData.billingPostalCode) newErrors.billingPostalCode = 'Billing postal code is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);

    const orderData = {
      customer_email: formData.email,
      customer_first_name: formData.firstName,
      customer_last_name: formData.lastName,
      customer_phone: formData.phone,
      shipping_address_line1: formData.address1,
      shipping_address_line2: formData.address2 || undefined,
      shipping_city: formData.city,
      shipping_state: formData.state || undefined,
      shipping_postal_code: formData.postalCode,
      shipping_country: formData.country,
      billing_same_as_shipping: formData.billingSameAsShipping,
      billing_address_line1: formData.billingSameAsShipping ? undefined : formData.billingAddress1,
      billing_address_line2: formData.billingSameAsShipping ? undefined : formData.billingAddress2,
      billing_city: formData.billingSameAsShipping ? undefined : formData.billingCity,
      billing_state: formData.billingSameAsShipping ? undefined : formData.billingState,
      billing_postal_code: formData.billingSameAsShipping ? undefined : formData.billingPostalCode,
      billing_country: formData.billingSameAsShipping ? undefined : formData.billingCountry,
      customer_notes: formData.notes || undefined,
      items: items.map(item => ({
        product_id: item.product.id,
        product_name: item.product.name || item.product.title || 'Product',
        product_image: item.product.image || item.product.primary_image,
        quantity: item.quantity,
        unit_price: item.product.price,
        selected_variant: item.selectedColor || item.selectedSize || undefined,
      })),
      subtotal: getTotalPrice(),
      shipping_cost: shippingCost,
      total_amount: totalAmount,
    };

    const { order, error } = await createOrder(orderData);

    if (error) {
      alert(error);
      setIsSubmitting(false);
      return;
    }

    if (order) {
      setOrderNumber(order.order_number);
      setOrderComplete(true);
      clearCart();
    }
    
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (items.length === 0 && !orderComplete) {
    return (
      <main className="pt-24 min-h-screen">
        <div className="container-custom py-12">
          <div className="max-w-xl mx-auto text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Truck className="w-10 h-10 text-gray-400" />
            </div>
            <h1 className="text-2xl font-serif mb-4">Your cart is empty</h1>
            <p className="text-gray-500 mb-8">Add some items to your cart before proceeding to checkout.</p>
            <Link to="/shop" className="btn-primary">
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (orderComplete) {
    return (
      <main className="pt-24 min-h-screen">
        <div className="container-custom py-12">
          <div className="max-w-xl mx-auto text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-serif mb-4">Thank You!</h1>
            <p className="text-gray-600 mb-2">Your order has been placed successfully.</p>
            <p className="text-lg font-medium text-[#0F172A] mb-6">
              Order Number: <span className="text-[#005EE9]">{orderNumber}</span>
            </p>
            <p className="text-sm text-gray-500 mb-8">
              We&apos;ve sent a confirmation email to {formData.email}. You will receive updates on your order status via email.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/shop" className="btn-primary">
                Continue Shopping
              </Link>
              <Link to={`/order/${orderNumber}`} className="btn-outline">
                View Order
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-24 min-h-screen bg-gray-50">
      <div className="container-custom py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-[#005EE9]">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/cart" className="hover:text-[#005EE9]">Cart</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-[#0F172A]">Checkout</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Contact Information */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-[#005EE9]" />
                  Contact Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg outline-none transition-all ${
                        errors.email ? 'border-red-500' : 'border-gray-200 focus:border-[#005EE9]'
                      }`}
                      placeholder="your@email.com"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#005EE9]" />
                  Shipping Address
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">First Name *</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg outline-none transition-all ${
                          errors.firstName ? 'border-red-500' : 'border-gray-200 focus:border-[#005EE9]'
                        }`}
                        placeholder="John"
                      />
                    </div>
                    {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg outline-none transition-all ${
                        errors.lastName ? 'border-red-500' : 'border-gray-200 focus:border-[#005EE9]'
                      }`}
                      placeholder="Doe"
                    />
                    {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium mb-1">Phone *</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg outline-none transition-all ${
                          errors.phone ? 'border-red-500' : 'border-gray-200 focus:border-[#005EE9]'
                        }`}
                        placeholder="+27 83 582 9819"
                      />
                    </div>
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium mb-1">Address Line 1 *</label>
                    <input
                      type="text"
                      name="address1"
                      value={formData.address1}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg outline-none transition-all ${
                        errors.address1 ? 'border-red-500' : 'border-gray-200 focus:border-[#005EE9]'
                      }`}
                      placeholder="123 Main Street"
                    />
                    {errors.address1 && <p className="text-red-500 text-sm mt-1">{errors.address1}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium mb-1">Address Line 2</label>
                    <input
                      type="text"
                      name="address2"
                      value={formData.address2}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-[#005EE9]"
                      placeholder="Apt, Suite, Unit, etc. (optional)"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">City *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg outline-none transition-all ${
                        errors.city ? 'border-red-500' : 'border-gray-200 focus:border-[#005EE9]'
                      }`}
                      placeholder="Johannesburg"
                    />
                    {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">State/Province</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-[#005EE9]"
                      placeholder="Gauteng"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Postal Code *</label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg outline-none transition-all ${
                        errors.postalCode ? 'border-red-500' : 'border-gray-200 focus:border-[#005EE9]'
                      }`}
                      placeholder="2000"
                    />
                    {errors.postalCode && <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Country</label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-[#005EE9]"
                    >
                      <option value="South Africa">South Africa</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Billing Address */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <input
                    type="checkbox"
                    id="billingSameAsShipping"
                    name="billingSameAsShipping"
                    checked={formData.billingSameAsShipping}
                    onChange={handleChange}
                    className="w-5 h-5 text-[#005EE9] rounded focus:ring-[#005EE9]"
                  />
                  <label htmlFor="billingSameAsShipping" className="text-sm font-medium">
                    Billing address same as shipping
                  </label>
                </div>

                {!formData.billingSameAsShipping && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-4 border-t">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium mb-1">Billing Address *</label>
                      <input
                        type="text"
                        name="billingAddress1"
                        value={formData.billingAddress1}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg outline-none transition-all ${
                          errors.billingAddress1 ? 'border-red-500' : 'border-gray-200 focus:border-[#005EE9]'
                        }`}
                        placeholder="123 Main Street"
                      />
                      {errors.billingAddress1 && <p className="text-red-500 text-sm mt-1">{errors.billingAddress1}</p>}
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium mb-1">Address Line 2</label>
                      <input
                        type="text"
                        name="billingAddress2"
                        value={formData.billingAddress2}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-[#005EE9]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">City *</label>
                      <input
                        type="text"
                        name="billingCity"
                        value={formData.billingCity}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg outline-none transition-all ${
                          errors.billingCity ? 'border-red-500' : 'border-gray-200 focus:border-[#005EE9]'
                        }`}
                      />
                      {errors.billingCity && <p className="text-red-500 text-sm mt-1">{errors.billingCity}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Postal Code *</label>
                      <input
                        type="text"
                        name="billingPostalCode"
                        value={formData.billingPostalCode}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg outline-none transition-all ${
                          errors.billingPostalCode ? 'border-red-500' : 'border-gray-200 focus:border-[#005EE9]'
                        }`}
                      />
                      {errors.billingPostalCode && <p className="text-red-500 text-sm mt-1">{errors.billingPostalCode}</p>}
                    </div>
                  </div>
                )}
              </div>

              {/* Order Notes */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-lg font-medium mb-4">Order Notes (Optional)</h2>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-[#005EE9] resize-none"
                  placeholder="Special instructions for delivery..."
                />
              </div>

              {/* Payment Method */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-[#005EE9]" />
                  Payment Method
                </h2>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    Payment will be processed securely. You will receive payment instructions via email after placing your order.
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#005EE9] text-white py-4 rounded-lg font-medium hover:bg-[#0F172A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  `Complete Order - ${formatPrice(totalAmount)}`
                )}
              </button>

              <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Shield className="w-4 h-4" />
                  Secure Checkout
                </span>
                <span className="flex items-center gap-1">
                  <Truck className="w-4 h-4" />
                  Free Delivery Over R5,000
                </span>
              </div>
            </form>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:sticky lg:top-28 h-fit">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-medium mb-6">Order Summary</h2>
              
              {/* Items */}
              <div className="space-y-4 mb-6 max-h-80 overflow-y-auto">
                {items.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                      <img
                        src={item.product.image || item.product.primary_image}
                        alt={item.product.name || item.product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.product.name || item.product.title}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      {item.selectedColor && <p className="text-xs text-gray-500">Color: {item.selectedColor}</p>}
                      {item.selectedSize && <p className="text-xs text-gray-500">Size: {item.selectedSize}</p>}
                    </div>
                    <p className="text-sm font-medium">{formatPrice(item.product.price * item.quantity)}</p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span>{formatPrice(getTotalPrice())}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className={shippingCost === 0 ? 'text-green-600' : ''}>
                    {shippingCost === 0 ? 'Free' : formatPrice(shippingCost)}
                  </span>
                </div>
                <div className="border-t pt-2 flex justify-between">
                  <span className="font-medium">Total</span>
                  <span className="text-xl font-semibold">{formatPrice(totalAmount)}</span>
                </div>
              </div>

              {getTotalPrice() < 5000 && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
                  Add {formatPrice(5000 - getTotalPrice())} more for free shipping!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
