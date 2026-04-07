import { Link } from 'react-router-dom';
import { ShoppingBag, Plus, Minus, Trash2, ArrowLeft } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function Cart() {
  const { items, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();

  const formatPrice = (price: number) => `R${price.toLocaleString()}`;

  if (items.length === 0) {
    return (
      <main className="pt-24 min-h-screen">
        <div className="container-custom py-12">
          <h1 className="text-2xl font-serif mb-8">Cart</h1>
          <div className="bg-gray-50 p-8 text-center rounded-lg">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-lg text-gray-600 mb-2">Your cart is currently empty.</p>
            <Link to="/shop" className="btn-primary inline-block mt-4">
              Return to shop
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-24 min-h-screen">
      <div className="container-custom py-12">
        <h1 className="text-2xl font-serif mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white border rounded-lg overflow-hidden">
              {/* Header */}
              <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b text-sm font-medium text-gray-600">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Total</div>
              </div>

              {/* Items */}
              <div className="divide-y">
                {items.map((item) => (
                  <div key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}`} className="p-4">
                    <div className="md:grid md:grid-cols-12 md:gap-4 items-center">
                      {/* Product */}
                      <div className="md:col-span-6 flex gap-4 mb-4 md:mb-0">
                        <Link 
                          to={`/product/${item.product.id}`}
                          className="w-20 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0"
                        >
                          <img
                            src={item.product.image}
                            alt={item.product.title}
                            className="w-full h-full object-cover"
                          />
                        </Link>
                        <div className="min-w-0">
                          <Link
                            to={`/product/${item.product.id}`}
                            className="block text-sm font-medium text-[#0F172A] hover:text-[#005EE9] transition-colors line-clamp-2"
                          >
                            {item.product.title}
                          </Link>
                          <p className="text-xs text-gray-500 mt-1">{item.product.category}</p>
                          {item.selectedColor && (
                            <p className="text-xs text-gray-500">Color: {item.selectedColor}</p>
                          )}
                          {item.selectedSize && (
                            <p className="text-xs text-gray-500">Size: {item.selectedSize}</p>
                          )}
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="md:hidden text-red-500 text-xs mt-2 flex items-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" />
                            Remove
                          </button>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="md:col-span-2 md:text-center mb-4 md:mb-0">
                        <span className="md:hidden text-sm text-gray-500">Price: </span>
                        <span className="text-sm">{formatPrice(item.product.price)}</span>
                      </div>

                      {/* Quantity */}
                      <div className="md:col-span-2 md:text-center mb-4 md:mb-0">
                        <span className="md:hidden text-sm text-gray-500">Qty: </span>
                        <div className="inline-flex items-center border rounded">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="p-2 hover:bg-gray-100 transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-3 text-sm font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="p-2 hover:bg-gray-100 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Total */}
                      <div className="md:col-span-2 md:text-right flex items-center justify-between md:block">
                        <span className="md:hidden text-sm text-gray-500">Total: </span>
                        <span className="font-medium">{formatPrice(item.product.price * item.quantity)}</span>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="hidden md:inline-block text-red-500 hover:bg-red-50 p-2 rounded transition-colors ml-4"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-between gap-4 mt-6">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[#005EE9] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Continue Shopping
              </Link>
              <button
                onClick={clearCart}
                className="text-sm text-red-500 hover:text-red-700 transition-colors"
              >
                Clear Cart
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-lg font-serif mb-6">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span>{formatPrice(getTotalPrice())}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="border-t pt-3 flex justify-between">
                  <span className="font-medium">Total</span>
                  <span className="text-xl font-semibold">{formatPrice(getTotalPrice())}</span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="block w-full bg-[#005EE9] text-white text-center py-3 font-medium hover:bg-[#0F172A] transition-colors mb-3"
              >
                Proceed to Checkout
              </Link>
              <p className="text-xs text-gray-500 text-center">
                Shipping & taxes calculated at checkout
              </p>
            </div>

            {/* Trust Badges */}
            <div className="mt-6 p-4 bg-white border rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium">Secure Checkout</p>
                  <p className="text-xs text-gray-500">SSL encrypted payment</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium">2 Year Warranty</p>
                  <p className="text-xs text-gray-500">On all furniture</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
