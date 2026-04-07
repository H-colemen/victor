import { Link } from 'react-router-dom';
import { Send, Facebook, Instagram } from 'lucide-react';
import { useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const customerCareLinks = [
    { label: 'About Us', href: '/about' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Shipping Policies', href: '/shipping-policies' },
    { label: 'Returns & Refunds Policy', href: '/returns-refunds-policy' },
    { label: 'Quality & Warranty', href: '/quality-warranty' },
    { label: 'Terms of Service', href: '/terms-of-service' },
    { label: 'Frequently Asked Questions', href: '/frequently-asked-questions' },
  ];

  return (
    <footer className="bg-[#070614] text-white">
      {/* Newsletter Section */}
      <div className="border-b border-white/10">
        <div className="container-custom py-16">
          <div className="text-center max-w-xl mx-auto">
            <h3 className="text-xl font-serif mb-6">Subscribe to our newsletter</h3>
            <form onSubmit={handleSubscribe} className="flex">
              <input
                type="email"
                placeholder="Your email address..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 bg-white/5 border border-white/20 border-r-0 text-white text-sm outline-none focus:border-[#005EE9] transition-colors"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-[#005EE9] text-white text-sm font-medium hover:bg-[#0F172A] transition-colors"
              >
                {subscribed ? 'Subscribed!' : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
          {/* Brand Column */}
          <div>
            <Link to="/" className="inline-block mb-4">
              <span className="text-xl font-serif tracking-widest uppercase text-white">
                HOME & LIVING FURNITURES
              </span>
            </Link>
            <p className="text-sm text-white/55 leading-relaxed mb-6">
              Crafted for comfort, designed for style. Discover quality furniture that makes every space feel like home.
            </p>
            <a 
              href="mailto:orders@homeandlivingfurnitures.com"
              className="inline-flex items-center gap-2 text-sm text-[#005EE9] hover:text-white transition-colors"
            >
              <Send className="w-4 h-4" />
              orders@homeandlivingfurnitures.com
            </a>
            
            {/* Newsletter in brand column */}
            <div className="mt-8">
              <p className="text-sm text-white/50 mb-3">Subscribe to our newsletter</p>
              <form onSubmit={handleSubscribe} className="flex">
                <input
                  type="email"
                  placeholder="Your email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-3 py-2.5 bg-white/5 border border-white/20 border-r-0 text-white text-sm outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-[#005EE9] text-white text-sm hover:bg-[#0F172A] transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

          {/* Customer Care Column */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-6">
              Customer Care
            </h4>
            <ul className="space-y-3">
              {customerCareLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="inline-flex items-center gap-2 text-sm text-white/55 hover:text-white transition-colors"
                  >
                    <span className="text-[10px]">○</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials Column */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-6">
              Our Socials
            </h4>
            <div className="flex gap-3 mb-6">
              <a
                href="https://www.facebook.com/profile.php?id=61586012254518"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:bg-[#005EE9] hover:border-[#005EE9] hover:text-white transition-all"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/homeandlivingfurnitures/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:bg-[#005EE9] hover:border-[#005EE9] hover:text-white transition-all"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
            <p className="text-sm text-white/55">
              Shop With Us at Ease — Easy and Safe Delivery
            </p>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/10">
        <div className="container-custom py-6">
          <p className="text-center text-sm text-white/35">
            ©2025. Home & Living. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
