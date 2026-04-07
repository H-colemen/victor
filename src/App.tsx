import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from '@/context/CartContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/layout/CartDrawer';
import WhatsAppButton from '@/components/ui-custom/WhatsAppButton';
import ContactWidget from '@/components/ui-custom/ContactWidget';

// Public Pages
import Home from '@/pages/Home';
import Shop from '@/pages/Shop';
import ProductDetail from '@/pages/ProductDetail';
import Cart from '@/pages/Cart';
import Checkout from '@/pages/Checkout';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import Category from '@/pages/Category';

// Policy Pages
import ShippingPolicies from '@/pages/ShippingPolicies';
import ReturnsPolicy from '@/pages/ReturnsPolicy';
import TermsOfService from '@/pages/TermsOfService';
import FAQ from '@/pages/FAQ';
import QualityWarranty from '@/pages/QualityWarranty';

// Admin Pages
import AdminLogin from '@/pages/admin/AdminLogin';
import AdminLayout from '@/pages/admin/AdminLayout';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminProducts from '@/pages/admin/AdminProducts';
import ProductForm from '@/pages/admin/ProductForm';
import AdminOrders from '@/pages/admin/AdminOrders';
import AdminHeroSlides from '@/pages/admin/AdminHeroSlides';
import AdminSettings from '@/pages/admin/AdminSettings';

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="products/new" element={<ProductForm />} />
            <Route path="products/edit/:id" element={<ProductForm />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="hero-slides" element={<AdminHeroSlides />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* Public Routes */}
          <Route path="*" element={
            <div className="min-h-screen flex flex-col">
              <Header />
              <CartDrawer />
              <div className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/category/:category" element={<Category />} />
                  <Route path="/category/:category/:subcategory" element={<Category />} />
                  
                  {/* Policy Pages */}
                  <Route path="/shipping-policies" element={<ShippingPolicies />} />
                  <Route path="/returns-refunds-policy" element={<ReturnsPolicy />} />
                  <Route path="/terms-of-service" element={<TermsOfService />} />
                  <Route path="/frequently-asked-questions" element={<FAQ />} />
                  <Route path="/quality-warranty" element={<QualityWarranty />} />
                  
                  {/* Fallback */}
                  <Route path="*" element={<Home />} />
                </Routes>
              </div>
              <Footer />
              <WhatsAppButton />
              <ContactWidget />
            </div>
          } />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;