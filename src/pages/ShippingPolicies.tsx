import { Truck, Clock, MapPin, Package } from 'lucide-react';

export default function ShippingPolicies() {
  return (
    <main className="pt-24 min-h-screen">
      <div className="container-custom py-12">
        <h1 className="text-[clamp(32px,4vw,48px)] font-serif text-[#0F172A] mb-8">
          Shipping Policies
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-[#f8f9fb] p-6 rounded-lg sticky top-28">
              <h3 className="font-medium text-[#0F172A] mb-4">Quick Links</h3>
              <nav className="space-y-2">
                <a href="#delivery" className="block text-sm text-[#364151] hover:text-[#005EE9]">Delivery Areas</a>
                <a href="#timeframes" className="block text-sm text-[#364151] hover:text-[#005EE9]">Delivery Timeframes</a>
                <a href="#costs" className="block text-sm text-[#364151] hover:text-[#005EE9]">Shipping Costs</a>
                <a href="#tracking" className="block text-sm text-[#364151] hover:text-[#005EE9]">Order Tracking</a>
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-2 space-y-12">
            <section id="delivery">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="w-6 h-6 text-[#005EE9]" />
                <h2 className="text-xl font-medium text-[#0F172A]">Delivery Areas</h2>
              </div>
              <p className="text-[#364151] leading-relaxed mb-4">
                We currently deliver to all major cities and towns across South Africa. Our delivery network covers:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-[#364151]">
                <li>Gauteng (Johannesburg, Pretoria, and surrounding areas)</li>
                <li>Western Cape (Cape Town and surrounding areas)</li>
                <li>KwaZulu-Natal (Durban and surrounding areas)</li>
                <li>Eastern Cape (Port Elizabeth, East London)</li>
                <li>Free State (Bloemfontein)</li>
                <li>Mpumalanga, Limpopo, North West, and Northern Cape</li>
              </ul>
            </section>

            <section id="timeframes">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-6 h-6 text-[#005EE9]" />
                <h2 className="text-xl font-medium text-[#0F172A]">Delivery Timeframes</h2>
              </div>
              <div className="space-y-4 text-[#364151]">
                <p className="leading-relaxed">
                  Delivery times vary depending on your location and the items ordered:
                </p>
                <div className="bg-[#f8f9fb] p-4 rounded-lg">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Location</th>
                        <th className="text-left py-2">Estimated Delivery</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2">Major Cities (JHB, CPT, DBN)</td>
                        <td className="py-2">3-7 business days</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Regional Areas</td>
                        <td className="py-2">5-10 business days</td>
                      </tr>
                      <tr>
                        <td className="py-2">Remote Areas</td>
                        <td className="py-2">7-14 business days</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-sm text-gray-500">
                  * Please note that custom or made-to-order items may require additional processing time.
                </p>
              </div>
            </section>

            <section id="costs">
              <div className="flex items-center gap-3 mb-4">
                <Truck className="w-6 h-6 text-[#005EE9]" />
                <h2 className="text-xl font-medium text-[#0F172A]">Shipping Costs</h2>
              </div>
              <div className="space-y-4 text-[#364151]">
                <p className="leading-relaxed">
                  We offer free delivery on orders over R5,000. For orders below this amount, shipping costs are calculated based on:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Your delivery location</li>
                  <li>The size and weight of your items</li>
                  <li>Whether assembly is required</li>
                </ul>
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <p className="text-green-800 font-medium">🎉 Free Delivery on Orders Over R5,000!</p>
                </div>
              </div>
            </section>

            <section id="tracking">
              <div className="flex items-center gap-3 mb-4">
                <Package className="w-6 h-6 text-[#005EE9]" />
                <h2 className="text-xl font-medium text-[#0F172A]">Order Tracking</h2>
              </div>
              <p className="text-[#364151] leading-relaxed mb-4">
                Once your order is dispatched, you will receive an email with a tracking number and link to track your delivery. You can also contact our customer service team for updates on your order status.
              </p>
              <div className="bg-[#f8f9fb] p-4 rounded-lg">
                <p className="text-sm text-[#364151]">
                  <strong>Need help?</strong> Contact us at{' '}
                  <a href="mailto:orders@homeandlivingfurnitures.com" className="text-[#005EE9] hover:underline">
                    orders@homeandlivingfurnitures.com
                  </a>{' '}
                  or WhatsApp us at +27 83 582 9819
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
