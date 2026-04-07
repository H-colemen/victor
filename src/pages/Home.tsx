import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Lock, Package, HeartHandshake, Quote } from 'lucide-react';
import ProductCard from '@/components/ui-custom/ProductCard';
import { getProducts, getHeroSlides, getTestimonials } from '@/services/productService';
import type { Product } from '@/lib/supabase';

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [heroSlides, setHeroSlides] = useState<{image_url: string; title?: string; subtitle?: string}[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [saleProducts, setSaleProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [testimonials, setTestimonials] = useState<{text: string; author: string; location?: string}[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadHomeData();
  }, []);

  useEffect(() => {
    if (heroSlides.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  const loadHomeData = async () => {
    setIsLoading(true);
    const [slides, featured, sale, newProducts, testimonialsData] = await Promise.all([
      getHeroSlides(),
      getProducts({ featured: true, limit: 9 }),
      getProducts({ onSale: true, limit: 4 }),
      getProducts({ isNew: true, limit: 4 }),
      getTestimonials(),
    ]);
    setHeroSlides(slides);
    setFeaturedProducts(featured);
    setSaleProducts(sale);
    setNewArrivals(newProducts);
    setTestimonials(testimonialsData);
    setIsLoading(false);
  };

  const trustItems = [
    {
      icon: Lock,
      title: "Secure Payment",
      description: "Shop with confidence! We offer safe and encrypted payment options for a worry-free checkout.",
    },
    {
      icon: Package,
      title: "Delivered With Care",
      description: "Your furniture is handled with the utmost care to ensure it arrives safely and in perfect condition.",
    },
    {
      icon: HeartHandshake,
      title: "Excellent Service",
      description: "From browsing to delivery, our friendly team is here to provide a seamless and satisfying shopping experience.",
    },
  ];

  if (isLoading) {
    return (
      // No pt-24 — header is absolute so it doesn't push content
      <main className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-[#005EE9] border-t-transparent rounded-full" />
      </main>
    );
  }

  return (
    <main>
      {/* Hero Section — relative so the absolute header overlays it perfectly */}
      <section className="relative h-screen min-h-[600px] overflow-hidden">
        {/* Slides */}
        <div className="absolute inset-0">
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.image_url})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-[#070614]/65 to-[#070614]/25" />
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <p className="text-sm tracking-[3px] uppercase text-white/80 mb-5">
            {heroSlides[currentSlide]?.title || "Welcome to HavenCraft Homes"}
          </p>
          <h1 className="text-[clamp(42px,7vw,80px)] text-white leading-[1.15] max-w-[800px] mb-10 font-serif">
            {heroSlides[currentSlide]?.subtitle || "Let's Bring Comfort and Elegance to Your Home"}
          </h1>
          <Link to="/shop" className="btn-primary">
            Shop Now
          </Link>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentSlide ? 'bg-white w-6' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-9">
            <h2 className="section-title">Featured Products</h2>
            <Link to="/shop" className="btn-outline">Shop Now</Link>
          </div>
          {featuredProducts.length === 0 ? (
            <div className="text-center py-12 text-gray-500"><p>No featured products yet</p></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* On Sale */}
      <section className="py-20 bg-[#f8f9fb]">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-9">
            <h2 className="section-title">On Sale</h2>
            <Link to="/shop?sale=true" className="btn-outline">Shop Now</Link>
          </div>
          {saleProducts.length === 0 ? (
            <div className="text-center py-12 text-gray-500"><p>No sale items yet</p></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {saleProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-20">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-9">
            <h2 className="section-title">New Arrivals</h2>
            <Link to="/shop?new=true" className="btn-outline">Shop Now</Link>
          </div>
          {newArrivals.length === 0 ? (
            <div className="text-center py-12 text-gray-500"><p>No new arrivals yet</p></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newArrivals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-[#fafaf8]">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
            <div>
              <p className="text-xs tracking-[3px] uppercase text-[#005EE9] mb-4">Our Story</p>
              <h2 className="text-[clamp(32px,4vw,48px)] text-[#0F172A] leading-tight mb-6 font-serif">
                The Heart of Cozy Living
              </h2>
              <p className="text-[15px] leading-relaxed text-[#364151] mb-4">
                At <strong>HavenCraft Homes</strong>, we believe that a home is more than just a place—it&apos;s a feeling. It&apos;s where laughter is shared, memories are made, and comfort is found.
              </p>
              <h3 className="text-xl font-serif text-[#0F172A] mt-6 mb-2">How It All Started</h3>
              <p className="text-[15px] leading-relaxed text-[#364151] mb-4">
                What started as a passion for well-crafted furniture turned into a vision to bring <strong>affordable luxury</strong> to homes everywhere.
              </p>
              <h3 className="text-xl font-serif text-[#0F172A] mt-6 mb-2">Our Promise to You</h3>
              <p className="text-[15px] leading-relaxed text-[#364151] mb-6">
                Every piece in our collection is thoughtfully selected to offer <strong>timeless style, lasting durability, and ultimate coziness</strong>.
              </p>
              <Link to="/about" className="btn-primary inline-block mt-4">Read More</Link>
            </div>
            <div className="rounded overflow-hidden aspect-[16/10] bg-[#0F172A]">
              <img
                src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80"
                alt="Furniture collection"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24">
        <div className="container-custom">
          <h2 className="section-title text-center mb-3">What Our Customers Say</h2>
          <div className="w-16 h-0.5 bg-[#D1DAE5] mx-auto mb-12" />
          {testimonials.length === 0 ? (
            <div className="text-center py-12 text-gray-500"><p>No testimonials yet</p></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="p-8 bg-white border border-[#D1DAE5] relative">
                  <Quote className="w-9 h-9 text-[#005EE9] mb-4" />
                  <p className="text-sm leading-relaxed text-[#364151] mb-5">{testimonial.text}</p>
                  <p className="font-semibold text-sm text-[#0F172A]">{testimonial.author}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-[#0F172A] py-20 px-4 text-center">
        <h3 className="text-[clamp(26px,4vw,36px)] text-white mb-3 font-serif">Bringing Comfort Home</h3>
        <p className="text-white/70 text-[15px] leading-relaxed max-w-lg mx-auto mb-4">
          We&apos;re more than just a furniture store—we&apos;re a brand built on the idea that <strong>home should be your favorite place</strong>.
        </p>
        <p className="text-white/85 font-semibold mb-7">
          Welcome to HavenCraft Homes—where comfort meets style.
        </p>
        <Link to="/shop" className="btn-primary hover:bg-[#005EE9]">
          Purchase Our Best Furnitures
        </Link>
      </section>

      {/* Trust Icons */}
      <section className="py-16 border-t border-[#D1DAE5]">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {trustItems.map((item, index) => (
              <div key={index} className="flex items-start gap-5">
                <div className="w-13 h-13 rounded-full bg-[#005EE9] flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-[15px] text-[#0F172A] mb-1.5">{item.title}</h4>
                  <p className="text-sm text-[#364151] leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}