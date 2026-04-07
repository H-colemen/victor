import { useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Image, 
  MessageSquare, 
  Settings, 
  LogOut,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/products', label: 'Products', icon: Package },
  { path: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { path: '/admin/hero-slides', label: 'Hero Slides', icon: Image },
  { path: '/admin/testimonials', label: 'Testimonials', icon: MessageSquare },
  { path: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/admin/login');
  };

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Desktop Sidebar */}
      <aside 
        className={`fixed lg:static inset-y-0 left-0 z-50 bg-[#0F172A] text-white transition-all duration-300 ${
          isSidebarOpen ? 'w-64' : 'w-20'
        } ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-white/10">
            <Link to="/admin" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#005EE9] rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="font-bold text-lg">H</span>
              </div>
              {isSidebarOpen && (
                <div className="overflow-hidden">
                  <p className="font-medium whitespace-nowrap">Admin Panel</p>
                  <p className="text-xs text-white/50 whitespace-nowrap">Home & Living</p>
                </div>
              )}
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-[#005EE9] text-white'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {isSidebarOpen && <span className="whitespace-nowrap">{item.label}</span>}
              </Link>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-white/10">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors w-full"
            >
              <LogOut className="w-5 h-5" />
              {isSidebarOpen && <span>Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-30">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="hidden lg:block p-2 hover:bg-gray-100 rounded-lg"
              >
                {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              
              {/* Breadcrumb */}
              <nav className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
                <Link to="/admin" className="hover:text-[#005EE9]">Admin</Link>
                {location.pathname !== '/admin' && (
                  <>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-[#0F172A]">
                      {navItems.find(item => isActive(item.path))?.label}
                    </span>
                  </>
                )}
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <Link 
                to="/" 
                target="_blank"
                className="text-sm text-gray-600 hover:text-[#005EE9]"
              >
                View Website
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
