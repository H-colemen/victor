import { Link } from 'react-router-dom';
import { Factory, Warehouse, Truck, Award } from 'lucide-react';

const features = [
  {
    icon: Factory,
    title: "Direct Manufacturing Partnerships",
    description: "We partner directly with local and international manufacturers to bring you the best prices."
  },
  {
    icon: Warehouse,
    title: "Warehouse Network",
    description: "Our network of warehouses ensures a wide selection of products at competitive prices."
  },
  {
    icon: Truck,
    title: "Secure Deliveries",
    description: "We handle everything from sales to secure deliveries, ensuring your furniture arrives safely."
  },
  {
    icon: Award,
    title: "Quality Guaranteed",
    description: "Every piece is carefully selected to meet our high standards of quality and durability."
  },
];

export default function About() {
  return (
    <main className="pt-24 min-h-screen">
      {/* Hero Section */}
      <section className="py-16 lg:py-24">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <h1 className="text-[clamp(36px,5vw,56px)] font-serif text-[#0F172A] leading-tight mb-6">
                About Us
              </h1>
              <p className="text-lg text-[#364151] leading-relaxed mb-6">
                At <strong>Home and Living Furniture&apos;s</strong>, we specialize in providing high-quality, stylish, and affordable furniture by partnering directly with <strong>local and international manufacturers</strong>.
              </p>
              <p className="text-lg text-[#364151] leading-relaxed mb-6">
                Instead of a traditional showroom, we operate through a <strong>network of warehouses</strong>, ensuring a <strong>wide selection of products at competitive prices</strong>.
              </p>
            </div>
            <div className="aspect-video lg:aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80"
                alt="About Home and Living Furniture's"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* What Sets Us Apart */}
      <section className="py-16 lg:py-24 bg-[#f8f9fb]">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="section-title mb-4">What Sets Us Apart</h2>
            <p className="text-[#364151]">
              Our model allows us to source and import premium furniture, making it accessible to our customers without the overhead costs of a physical store.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-lg text-center">
                <div className="w-16 h-16 bg-[#005EE9]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="w-8 h-8 text-[#005EE9]" />
                </div>
                <h3 className="text-lg font-medium text-[#0F172A] mb-3">{feature.title}</h3>
                <p className="text-sm text-[#364151] leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Promise */}
      <section className="py-16 lg:py-24">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="order-2 lg:order-1 aspect-video bg-gray-100 rounded-lg overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80"
                alt="Our Promise"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="section-title mb-6">Our Promise to You</h2>
              <p className="text-lg text-[#364151] leading-relaxed mb-6">
                With a commitment to <strong>quality, affordability, and exceptional service</strong>, we make furnishing your home simple and hassle-free.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#005EE9] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-[#364151]">Premium quality furniture at affordable prices</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#005EE9] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-[#364151]">Direct partnerships with manufacturers</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#005EE9] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-[#364151]">Safe and secure delivery nationwide</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#005EE9] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-[#364151]">2-year warranty on all products</span>
                </li>
              </ul>
              <Link to="/shop" className="btn-primary">
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-[#0F172A]">
        <div className="container-custom text-center">
          <h2 className="text-[clamp(28px,4vw,40px)] font-serif text-white mb-4">
            Home and Living Furniture&apos;s
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Connecting you to comfort, delivered with care.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/shop" className="btn-primary">
              Browse Collection
            </Link>
            <Link to="/contact" className="inline-block border border-white text-white px-9 py-3.5 text-sm font-medium tracking-wide hover:bg-white hover:text-[#0F172A] transition-all">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
