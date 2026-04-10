import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, User, X, ChevronDown } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { getTotalItems, setIsOpen } = useCart();
  const location = useLocation();

  // FIX: Robust production path checking. 
  // This accounts for trailing slashes, GitHub Pages subdirectories, and index.html appends.
  const normalizedPath = location.pathname.replace(/\/$/, '') || '/';
  const baseUrl = (typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL) 
    ? import.meta.env.BASE_URL.replace(/\/$/, '') || '/'
    : '/';
    
  const isHome = normalizedPath === '/' || 
                 normalizedPath === baseUrl || 
                 location.pathname.endsWith('/index.html');

  const navLinks = [
    {
      label: 'SOFA',
      href: '/category/sofa',
      dropdown: [
        { label: 'Armchair', href: '/category/sofa/armchair' },
        { label: '2-Seater', href: '/category/sofa/2-seater' },
        { label: '3-Seater', href: '/category/sofa/3-seater' },
        { label: '4-Seater & Up', href: '/category/sofa/4-seater-up' },
        { label: 'L-Shape', href: '/category/sofa/l-shape' },
        { label: 'Outdoor/Patio', href: '/category/sofa/outdoor' },
      ],
    },
    { label: 'BEDROOM', href: '/category/bedroom' },
    {
      label: 'DINING',
      href: '/category/dining',
      dropdown: [
        { label: 'Dining Chair', href: '/category/dining/chair' },
        { label: 'Dining Set', href: '/category/dining/set' },
        { label: 'Dining Table', href: '/category/dining/table' },
      ],
    },
    {
      label: 'DECOR',
      href: '/category/decor',
      dropdown: [
        { label: 'Coffee Table', href: '/category/decor/coffee-table' },
        { label: 'Swing Chair', href: '/category/decor/swing-chair' },
        { label: 'TV Console', href: '/category/decor/tv-console' },
      ],
    },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/shop?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  // Color tokens based on page
  const textColor = isHome ? 'text-white/90 hover:text-white' : 'text-[#0F172A] hover:text-[#005EE9]';
  const cartColor = isHome ? 'text-white' : 'text-[#005EE9]';
  const userColor = isHome ? 'text-white' : 'text-[#364151]';
  const burgerColor = isHome ? 'bg-white' : 'bg-[#0F172A]';
  const currencyColor = isHome ? 'text-white' : 'text-[#0F172A]';

  return (
    <>
      <header
        className={`z-50 w-full ${
          isHome
            ? 'absolute top-0 left-0 right-0 bg-transparent'
            : 'sticky top-0 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.08)]'
        }`}
      >
        <div className="container-custom relative">
          <div className="flex items-center justify-between h-24">

            {/* Burger menu - far left on mobile */}
            <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden flex flex-col gap-1.5 p-1 z-10">
              <span className={`w-6 h-0.5 ${burgerColor}`} />
              <span className={`w-6 h-0.5 ${burgerColor}`} />
              <span className={`w-6 h-0.5 ${burgerColor}`} />
            </button>

            {/* Logo - far left on desktop, dead center on mobile */}
            <Link to="/" className="flex items-center gap-2 absolute left-1/2 transform -translate-x-1/2 lg:static lg:transform-none lg:translate-x-0 lg:ml-0">
              <img
                src="/head.png"
                alt="HomeCraft & Living"
                style={{ height: '180px', width: '1000px' }}
                className="object-contain"
              />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-0">
              {navLinks.map((link) => (
                <div key={link.label} className="relative group">
                  {link.dropdown ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger className={`flex items-center gap-1 px-5 py-8 text-[15px] font-medium tracking-wide transition-colors outline-none ${textColor}`}>
                        {link.label}
                        <ChevronDown className="w-4 h-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="min-w-[180px] bg-white border-t-2 border-[#005EE9] shadow-[0_8px_30px_rgba(0,0,0,0.1)]">
                        {link.dropdown.map((item) => (
                          <DropdownMenuItem key={item.label} asChild>
                            <Link to={item.href} className="px-4 py-2.5 text-sm text-[#0F172A] hover:bg-[#f7f9ff] hover:text-[#005EE9] cursor-pointer">
                              {item.label}
                            </Link>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <Link to={link.href} className={`block px-5 py-8 text-[15px] font-medium tracking-wide transition-colors ${textColor}`}>
                      {link.label}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-5">
              <form onSubmit={handleSearch} className="hidden md:block relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="search"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-[200px] pl-10 pr-4 py-2 rounded-full text-sm outline-none border bg-white text-[#0F172A] placeholder:text-gray-400 shadow-sm ${
                    isHome ? 'border-white/30' : 'border-gray-200'
                  }`}
                />
              </form>
              <span className={`hidden md:block text-sm font-semibold tracking-wide ${currencyColor}`}>RO</span>
              <button onClick={() => setIsOpen(true)} className={`relative ${cartColor}`}>
                <ShoppingBag className="w-6 h-6" />
                <span className="absolute -top-2 -right-2 bg-[#005EE9] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {getTotalItems()}
                </span>
              </button>
              <Link to="/account" className={`hidden sm:block ${userColor}`}>
                <User className="w-6 h-6" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 bg-white z-[999] transform transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6">
          <button onClick={() => setIsMobileMenuOpen(false)} className="absolute top-5 right-5 text-[#0F172A]">
            <X className="w-8 h-8" />
          </button>
          <div className="flex items-center gap-2">
            <img
              src="/head.png"
              alt="HomeCraft & Living"
              style={{ height: '40px', width: '100px' }}
              className="object-contain"
            />
          </div>
          <nav className="mt-16 flex flex-col">
            {navLinks.map((link) => (
              <div key={link.label}>
                <Link to={link.href} onClick={() => setIsMobileMenuOpen(false)} className="block py-4 text-xl font-serif text-[#0F172A] border-b border-[#D1DAE5]">
                  {link.label}
                </Link>
                {link.dropdown && (
                  <div className="pl-4">
                    {link.dropdown.map((item) => (
                      <Link key={item.label} to={item.href} onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-sm text-[#364151]">
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="block py-4 text-xl font-serif text-[#0F172A] border-b border-[#D1DAE5]">About</Link>
            <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="block py-4 text-xl font-serif text-[#0F172A] border-b border-[#D1DAE5]">Contact</Link>
          </nav>
        </div>
      </div>
    </>
  );
}