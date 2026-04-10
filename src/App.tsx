import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from '@/context/CartContext';

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

// Layout
import PublicLayout from '@/components/layout/PublicLayout';
import ScrollToTop from '@/components/ScrollToTop';

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
      <Router basename="/">
        <ScrollToTop />
        <Routes>
          {/* Admin Routes — no PublicLayout */}
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

          {/* Public routes wrapped in PublicLayout */}
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/shop" element={<PublicLayout><Shop /></PublicLayout>} />
          <Route path="/product/:id" element={<PublicLayout><ProductDetail /></PublicLayout>} />
          <Route path="/cart" element={<PublicLayout><Cart /></PublicLayout>} />
          <Route path="/checkout" element={<PublicLayout><Checkout /></PublicLayout>} />
          <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
          <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
          <Route path="/category/:category" element={<PublicLayout><Category /></PublicLayout>} />
          <Route path="/category/:category/:subcategory" element={<PublicLayout><Category /></PublicLayout>} />
          <Route path="/shipping-policies" element={<PublicLayout><ShippingPolicies /></PublicLayout>} />
          <Route path="/returns-refunds-policy" element={<PublicLayout><ReturnsPolicy /></PublicLayout>} />
          <Route path="/terms-of-service" element={<PublicLayout><TermsOfService /></PublicLayout>} />
          <Route path="/frequently-asked-questions" element={<PublicLayout><FAQ /></PublicLayout>} />
          <Route path="/quality-warranty" element={<PublicLayout><QualityWarranty /></PublicLayout>} />

          {/* Catch-all route to redirect back to Home if a page isn't found */}
          <Route path="*" element={<PublicLayout><Home /></PublicLayout>} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;