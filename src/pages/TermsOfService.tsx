export default function TermsOfService() {
  return (
    <main className="pt-24 min-h-screen">
      <div className="container-custom py-12">
        <h1 className="text-[clamp(32px,4vw,48px)] font-serif text-[#0F172A] mb-8">
          Terms of Service
        </h1>

        <div className="max-w-3xl mx-auto space-y-10 text-[#364151]">
          <section>
            <p className="leading-relaxed mb-4">
              Welcome to Home & Living Furniture&apos;s. By accessing or using our website and services, you agree to be bound by these Terms of Service. Please read them carefully before making a purchase.
            </p>
            <p className="text-sm text-gray-500">
              Last updated: January 2025
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-[#0F172A] mb-4">1. Acceptance of Terms</h2>
            <p className="leading-relaxed">
              By accessing our website, placing an order, or using our services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-[#0F172A] mb-4">2. Product Information</h2>
            <p className="leading-relaxed mb-4">
              We make every effort to display our products and their colors as accurately as possible. However:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Actual colors may vary depending on your monitor and device settings</li>
              <li>Product dimensions are approximate and may vary slightly</li>
              <li>We reserve the right to modify product specifications without prior notice</li>
              <li>All products are subject to availability</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-medium text-[#0F172A] mb-4">3. Pricing and Payment</h2>
            <p className="leading-relaxed mb-4">
              All prices are listed in South African Rand (ZAR) and include VAT where applicable. We reserve the right to:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Change prices at any time without prior notice</li>
              <li>Correct pricing errors on our website</li>
              <li>Refuse or cancel orders with incorrect pricing</li>
              <li>Offer promotional discounts and sales at our discretion</li>
            </ul>
            <p className="leading-relaxed mt-4">
              Payment must be made in full before orders are processed. We accept various payment methods including credit/debit cards and bank transfers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-[#0F172A] mb-4">4. Order Processing</h2>
            <p className="leading-relaxed mb-4">
              Once you place an order:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>You will receive an order confirmation email</li>
              <li>Orders are typically processed within 1-2 business days</li>
              <li>We reserve the right to cancel orders due to stock unavailability or other reasons</li>
              <li>Custom orders may require additional processing time</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-medium text-[#0F172A] mb-4">5. Delivery</h2>
            <p className="leading-relaxed mb-4">
              Delivery terms:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Delivery times are estimates and not guaranteed</li>
              <li>Risk of loss transfers to you upon delivery</li>
              <li>You must inspect items upon delivery and report any damage immediately</li>
              <li>Failed deliveries due to incorrect address information may incur additional fees</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-medium text-[#0F172A] mb-4">6. Warranty</h2>
            <p className="leading-relaxed">
              All our furniture comes with a 2-year warranty against manufacturing defects. This warranty does not cover damage caused by misuse, negligence, or normal wear and tear. Please refer to our Quality & Warranty page for complete details.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-[#0F172A] mb-4">7. Limitation of Liability</h2>
            <p className="leading-relaxed">
              To the maximum extent permitted by law, Home & Living Furniture&apos;s shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services or products.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-[#0F172A] mb-4">8. Governing Law</h2>
            <p className="leading-relaxed">
              These Terms of Service are governed by the laws of South Africa. Any disputes shall be resolved in the courts of South Africa.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-[#0F172A] mb-4">9. Changes to Terms</h2>
            <p className="leading-relaxed">
              We reserve the right to modify these Terms of Service at any time. Changes will be effective immediately upon posting to our website. Your continued use of our services constitutes acceptance of the updated terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-[#0F172A] mb-4">10. Contact Us</h2>
            <p className="leading-relaxed">
              If you have any questions about these Terms of Service, please contact us at{' '}
              <a href="mailto:orders@homeandlivingfurnitures.com" className="text-[#005EE9] hover:underline">
                orders@homeandlivingfurnitures.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
