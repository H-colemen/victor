import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      content: 'orders@homeandlivingfurnitures.com',
      href: 'mailto:orders@homeandlivingfurnitures.com',
    },
    {
      icon: Phone,
      title: 'Phone',
      content: '+27 83 582 9819',
      href: 'tel:+27835829819',
    },
    {
      icon: MapPin,
      title: 'Location',
      content: 'South Africa',
      href: '#',
    },
    {
      icon: Clock,
      title: 'Business Hours',
      content: 'Mon - Fri: 9AM - 5PM',
      href: '#',
    },
  ];

  return (
    <main className="pt-24 min-h-screen">
      {/* Hero Section */}
      <section className="py-16 lg:py-20 bg-[#f8f9fb]">
        <div className="container-custom text-center">
          <h1 className="text-[clamp(36px,5vw,56px)] font-serif text-[#0F172A] mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-[#364151] max-w-2xl mx-auto">
            Have a question or need assistance? We&apos;re here to help! Reach out to us and we&apos;ll get back to you as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 -mt-8">
        <div className="container-custom">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md hover:border-[#005EE9] transition-all group"
              >
                <div className="w-12 h-12 bg-[#005EE9]/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-[#005EE9] transition-colors">
                  <item.icon className="w-6 h-6 text-[#005EE9] group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-medium text-[#0F172A] mb-1">{item.title}</h3>
                <p className="text-sm text-[#364151]">{item.content}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 lg:py-24">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Form */}
            <div>
              <h2 className="section-title mb-6">Send Us a Message</h2>
              <p className="text-[#364151] mb-8">
                Fill out the form below and we&apos;ll get back to you within 24 hours.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-[#0F172A] mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#005EE9] focus:ring-2 focus:ring-[#005EE9]/20 outline-none transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-[#0F172A] mb-2">
                      Your Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#005EE9] focus:ring-2 focus:ring-[#005EE9]/20 outline-none transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-[#0F172A] mb-2">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#005EE9] focus:ring-2 focus:ring-[#005EE9]/20 outline-none transition-all"
                  >
                    <option value="">Select a subject</option>
                    <option value="order">Order Inquiry</option>
                    <option value="delivery">Delivery Question</option>
                    <option value="returns">Returns & Refunds</option>
                    <option value="product">Product Information</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-[#0F172A] mb-2">
                    Your Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#005EE9] focus:ring-2 focus:ring-[#005EE9]/20 outline-none transition-all resize-none"
                    placeholder="How can we help you?"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitted}
                  className={`w-full py-4 px-6 font-medium flex items-center justify-center gap-2 transition-all ${
                    submitted
                      ? 'bg-green-600 text-white'
                      : 'bg-[#005EE9] text-white hover:bg-[#0F172A]'
                  }`}
                >
                  {submitted ? (
                    <>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Message Sent!
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Map or Image */}
            <div className="flex flex-col justify-center">
              <div className="aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden mb-6">
                <img
                  src="https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80"
                  alt="Contact Home and Living Furniture's"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="bg-[#f8f9fb] p-6 rounded-lg">
                <h3 className="font-medium text-[#0F172A] mb-3">Quick Response Time</h3>
                <p className="text-sm text-[#364151] mb-4">
                  We typically respond to all inquiries within 24 hours during business days.
                </p>
                <div className="flex items-center gap-2 text-sm text-[#005EE9]">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Average response time: 2-4 hours</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp CTA */}
      <section className="py-16 bg-[#25D366]/10">
        <div className="container-custom text-center">
          <h2 className="section-title mb-4">Prefer WhatsApp?</h2>
          <p className="text-[#364151] mb-6 max-w-xl mx-auto">
            Chat with us directly on WhatsApp for quick responses and personalized assistance.
          </p>
          <a
            href="https://wa.me/27835829819"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-[#25D366] text-white px-8 py-4 rounded-full font-medium hover:bg-[#128C7E] transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Chat on WhatsApp
          </a>
        </div>
      </section>
    </main>
  );
}
