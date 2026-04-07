import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Link } from 'react-router-dom';

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, updateQuantity, removeFromCart, getTotalPrice } = useCart();

  const formatPrice = (price: number) => {
    return `R${price.toLocaleString()}`;
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[100]"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-[101] shadow-2xl transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-6 h-6 text-[#005EE9]" />
              <h2 className="text-xl font-serif">Your Cart</h2>
              <span className="bg-[#005EE9] text-white text-xs font-bold px-2 py-1 rounded-full">
                {items.length}
              </span>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
                <p className="text-lg text-gray-500 mb-2">Your cart is empty</p>
                <p className="text-sm text-gray-400 mb-6">Looks like you haven&apos;t added anything yet</p>
                <Link
                  to="/shop"
                  onClick={() => setIsOpen(false)}
                  className="btn-primary"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {items.map((item) => (
                  <div key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}`} className="flex gap-4">
                    {/* Product Image */}
                    <Link 
                      to={`/product/${item.product.id}`}
                      onClick={() => setIsOpen(false)}
                      className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.title}
                        className="w-full h-full object-cover"
                      />
                    </Link>
                    
                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/product/${item.product.id}`}
                        onClick={() => setIsOpen(false)}
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
                      <p className="text-sm font-semibold text-[#0F172A] mt-2">
                        {formatPrice(item.product.price)}
                      </p>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border rounded">
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
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-xl font-semibold">{formatPrice(getTotalPrice())}</span>
              </div>
              <p className="text-xs text-gray-500">Shipping calculated at checkout</p>
              <Link
                to="/cart"
                onClick={() => setIsOpen(false)}
                className="block w-full bg-[#005EE9] text-white text-center py-3 font-medium hover:bg-[#0F172A] transition-colors"
              >
                View Cart
              </Link>
              <Link
                to="/checkout"
                onClick={() => setIsOpen(false)}
                className="block w-full bg-[#0F172A] text-white text-center py-3 font-medium hover:bg-[#005EE9] transition-colors"
              >
                Checkout
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
