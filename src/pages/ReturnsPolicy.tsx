import { RefreshCw, Calendar, CheckCircle, XCircle } from 'lucide-react';

export default function ReturnsPolicy() {
  return (
    <main className="pt-24 min-h-screen">
      <div className="container-custom py-12">
        <h1 className="text-[clamp(32px,4vw,48px)] font-serif text-[#0F172A] mb-8">
          Returns & Refunds Policy
        </h1>

        <div className="max-w-3xl mx-auto space-y-12">
          <section>
            <div className="flex items-center gap-3 mb-4">
              <RefreshCw className="w-6 h-6 text-[#005EE9]" />
              <h2 className="text-xl font-medium text-[#0F172A]">Our Returns Promise</h2>
            </div>
            <p className="text-[#364151] leading-relaxed mb-4">
              At Home & Living Furniture&apos;s, we want you to be completely satisfied with your purchase. If you&apos;re not happy with your order, we offer a hassle-free returns process within 30 days of delivery.
            </p>
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <p className="text-green-800 font-medium">30-Day Money-Back Guarantee</p>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-6 h-6 text-[#005EE9]" />
              <h2 className="text-xl font-medium text-[#0F172A]">Items Eligible for Return</h2>
            </div>
            <p className="text-[#364151] leading-relaxed mb-4">
              You can return items that meet the following criteria:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-[#364151]">
              <li>Items in their original condition and packaging</li>
              <li>Items with all tags and labels attached</li>
              <li>Items that have not been assembled or used</li>
              <li>Items returned within 30 days of delivery</li>
              <li>Items accompanied by the original receipt or proof of purchase</li>
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <XCircle className="w-6 h-6 text-[#005EE9]" />
              <h2 className="text-xl font-medium text-[#0F172A]">Non-Returnable Items</h2>
            </div>
            <p className="text-[#364151] leading-relaxed mb-4">
              The following items cannot be returned:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-[#364151]">
              <li>Custom-made or personalized items</li>
              <li>Items that have been assembled or used</li>
              <li>Items without original packaging</li>
              <li>Clearance or final sale items</li>
              <li>Mattresses and bedding for hygiene reasons (unless defective)</li>
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-6 h-6 text-[#005EE9]" />
              <h2 className="text-xl font-medium text-[#0F172A]">How to Return</h2>
            </div>
            <div className="space-y-4 text-[#364151]">
              <p className="leading-relaxed">
                To initiate a return, please follow these steps:
              </p>
              <ol className="list-decimal pl-5 space-y-3">
                <li>
                  <strong>Contact us</strong> within 30 days of delivery at{' '}
                  <a href="mailto:orders@homeandlivingfurnitures.com" className="text-[#005EE9] hover:underline">
                    orders@homeandlivingfurnitures.com
                  </a>{' '}
                  or WhatsApp +27 83 582 9819
                </li>
                <li>
                  <strong>Provide your order details</strong> including order number and reason for return
                </li>
                <li>
                  <strong>Wait for approval</strong> - our team will review your request and provide return instructions
                </li>
                <li>
                  <strong>Package the item</strong> securely in its original packaging
                </li>
                <li>
                  <strong>Arrange collection</strong> - we can arrange pickup or you can drop off at a designated location
                </li>
              </ol>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-medium text-[#0F172A] mb-4">Refund Process</h2>
            <div className="space-y-4 text-[#364151]">
              <p className="leading-relaxed">
                Once we receive and inspect your returned item:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>We will notify you of the approval or rejection of your refund</li>
                <li>If approved, your refund will be processed within 5-10 business days</li>
                <li>Refunds will be credited to your original payment method</li>
                <li>Shipping costs are non-refundable unless the item was defective</li>
              </ul>
            </div>
          </section>

          <section className="bg-[#f8f9fb] p-6 rounded-lg">
            <h2 className="text-lg font-medium text-[#0F172A] mb-3">Need Help?</h2>
            <p className="text-[#364151] text-sm">
              If you have any questions about our returns policy, please contact us at{' '}
              <a href="mailto:orders@homeandlivingfurnitures.com" className="text-[#005EE9] hover:underline">
                orders@homeandlivingfurnitures.com
              </a>{' '}
              or WhatsApp us at +27 83 582 9819
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
