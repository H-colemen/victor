import { Shield, CheckCircle, Wrench, AlertCircle } from 'lucide-react';

export default function QualityWarranty() {
  return (
    <main className="pt-24 min-h-screen">
      <div className="container-custom py-12">
        <h1 className="text-[clamp(32px,4vw,48px)] font-serif text-[#0F172A] mb-8">
          Quality & Warranty
        </h1>

        <div className="max-w-3xl mx-auto space-y-12">
          {/* Hero Section */}
          <section className="bg-[#f8f9fb] p-8 rounded-lg text-center">
            <div className="w-20 h-20 bg-[#005EE9]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-10 h-10 text-[#005EE9]" />
            </div>
            <h2 className="text-2xl font-medium text-[#0F172A] mb-3">2-Year Warranty</h2>
            <p className="text-[#364151] leading-relaxed">
              All Home & Living Furniture&apos;s products come with a comprehensive 2-year warranty against manufacturing defects. We stand behind the quality of our furniture.
            </p>
          </section>

          {/* What's Covered */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <h2 className="text-xl font-medium text-[#0F172A]">What&apos;s Covered</h2>
            </div>
            <p className="text-[#364151] leading-relaxed mb-4">
              Our warranty covers the following manufacturing defects:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                'Structural frame defects',
                'Broken or loose joints',
                'Defective springs in sofas',
                'Faulty recliner mechanisms',
                'Peeling or cracking upholstery (not normal wear)',
                'Hardware defects (screws, bolts, hinges)',
                'Manufacturing defects in wood, metal, or glass',
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-[#364151]">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* What's Not Covered */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <AlertCircle className="w-6 h-6 text-amber-600" />
              <h2 className="text-xl font-medium text-[#0F172A]">What&apos;s Not Covered</h2>
            </div>
            <p className="text-[#364151] leading-relaxed mb-4">
              Our warranty does not cover:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                'Normal wear and tear',
                'Damage from misuse or abuse',
                'Accidental damage (spills, burns, cuts)',
                'Damage from improper cleaning',
                'Color fading from sunlight exposure',
                'Damage during moving or relocation',
                'Products used for commercial purposes',
                'Unauthorized modifications or repairs',
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span className="text-[#364151]">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* How to Claim */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <Wrench className="w-6 h-6 text-[#005EE9]" />
              <h2 className="text-xl font-medium text-[#0F172A]">How to Make a Warranty Claim</h2>
            </div>
            <div className="space-y-4">
              <p className="text-[#364151] leading-relaxed">
                If you believe your product has a manufacturing defect covered by our warranty:
              </p>
              <ol className="list-decimal pl-5 space-y-3 text-[#364151]">
                <li>
                  <strong>Contact us</strong> within the warranty period at{' '}
                  <a href="mailto:orders@homeandlivingfurnitures.com" className="text-[#005EE9] hover:underline">
                    orders@homeandlivingfurnitures.com
                  </a>{' '}
                  or WhatsApp +27 83 582 9819
                </li>
                <li>
                  <strong>Provide details</strong> including your order number, photos of the defect, and a description of the issue
                </li>
                <li>
                  <strong>Our team will review</strong> your claim and respond within 3-5 business days
                </li>
                <li>
                  <strong>If approved</strong>, we will repair, replace, or refund the item at our discretion
                </li>
              </ol>
            </div>
          </section>

          {/* Quality Promise */}
          <section className="bg-[#0F172A] p-8 rounded-lg text-white">
            <h2 className="text-xl font-medium mb-4">Our Quality Promise</h2>
            <p className="text-white/80 leading-relaxed mb-6">
              At Home & Living Furniture&apos;s, quality is our top priority. Every piece in our collection is carefully selected and inspected to ensure it meets our high standards.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#005EE9] mb-1">100%</div>
                <p className="text-sm text-white/70">Quality Inspected</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#005EE9] mb-1">2 Year</div>
                <p className="text-sm text-white/70">Warranty Coverage</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#005EE9] mb-1">30 Day</div>
                <p className="text-sm text-white/70">Return Policy</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
