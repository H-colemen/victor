import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    category: 'Orders',
    questions: [
      {
        q: 'How do I place an order?',
        a: 'You can place an order directly through our website by browsing our collection, adding items to your cart, and proceeding to checkout. Alternatively, you can contact us via WhatsApp or email to place an order.'
      },
      {
        q: 'Can I modify or cancel my order?',
        a: 'Orders can be modified or cancelled within 24 hours of placing them. Please contact us immediately if you need to make changes. Once an order has been processed for shipping, it cannot be cancelled.'
      },
      {
        q: 'How do I track my order?',
        a: 'Once your order is dispatched, you will receive an email with a tracking number and link. You can also contact our customer service team for order updates.'
      },
    ]
  },
  {
    category: 'Delivery',
    questions: [
      {
        q: 'How long does delivery take?',
        a: 'Delivery times vary by location: Major cities (3-7 business days), Regional areas (5-10 business days), Remote areas (7-14 business days). Custom orders may take longer.'
      },
      {
        q: 'Do you offer free delivery?',
        a: 'Yes! We offer free delivery on all orders over R5,000. For orders below this amount, shipping costs are calculated based on your location and item size.'
      },
      {
        q: 'Do you deliver outside South Africa?',
        a: 'Currently, we only deliver within South Africa. We hope to expand to other countries in the future.'
      },
    ]
  },
  {
    category: 'Returns',
    questions: [
      {
        q: 'What is your return policy?',
        a: 'We offer a 30-day money-back guarantee on most items. Products must be in original condition, unused, and in original packaging. Custom items and mattresses cannot be returned for hygiene reasons.'
      },
      {
        q: 'How do I return an item?',
        a: 'Contact us within 30 days of delivery to initiate a return. We will provide you with return instructions and arrange collection or provide a drop-off location.'
      },
      {
        q: 'When will I receive my refund?',
        a: 'Refunds are processed within 5-10 business days after we receive and inspect the returned item. The refund will be credited to your original payment method.'
      },
    ]
  },
  {
    category: 'Products',
    questions: [
      {
        q: 'Do your products come with a warranty?',
        a: 'Yes, all our furniture comes with a 2-year warranty against manufacturing defects. This covers structural issues but not damage from misuse or normal wear and tear.'
      },
      {
        q: 'Can I see the products in person before buying?',
        a: 'As an online-only retailer, we do not have a physical showroom. However, we provide detailed product descriptions, multiple images, and dimensions to help you make an informed decision.'
      },
      {
        q: 'Do you offer assembly services?',
        a: 'Some of our products come fully assembled, while others require minimal assembly. Assembly instructions are included, and we can provide guidance if needed.'
      },
    ]
  },
  {
    category: 'Payment',
    questions: [
      {
        q: 'What payment methods do you accept?',
        a: 'We accept credit/debit cards (Visa, Mastercard), bank transfers, and secure online payment methods. All transactions are encrypted for your security.'
      },
      {
        q: 'Is my payment information secure?',
        a: 'Absolutely. We use industry-standard SSL encryption to protect your payment information. We never store your full credit card details on our servers.'
      },
      {
        q: 'Can I pay in installments?',
        a: 'We are working on offering payment plan options. Currently, full payment is required at the time of purchase.'
      },
    ]
  },
];

export default function FAQ() {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setOpenItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <main className="pt-24 min-h-screen">
      <div className="container-custom py-12">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-[clamp(32px,4vw,48px)] font-serif text-[#0F172A] mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-[#364151]">
            Find answers to common questions about our products, delivery, returns, and more.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-8">
          {faqs.map((category, catIndex) => (
            <div key={catIndex}>
              <h2 className="text-lg font-medium text-[#0F172A] mb-4">{category.category}</h2>
              <div className="space-y-3">
                {category.questions.map((item, qIndex) => {
                  const id = `${catIndex}-${qIndex}`;
                  const isOpen = openItems.includes(id);
                  
                  return (
                    <div key={qIndex} className="border rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleItem(id)}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-medium text-[#0F172A]">{item.q}</span>
                        {isOpen ? (
                          <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        )}
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4">
                          <p className="text-[#364151] leading-relaxed">{item.a}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="max-w-2xl mx-auto mt-12 text-center">
          <div className="bg-[#f8f9fb] p-6 rounded-lg">
            <h3 className="font-medium text-[#0F172A] mb-2">Still have questions?</h3>
            <p className="text-sm text-[#364151] mb-4">
              Can&apos;t find the answer you&apos;re looking for? Please contact our support team.
            </p>
            <a
              href="mailto:orders@homeandlivingfurnitures.com"
              className="inline-block text-[#005EE9] hover:underline"
            >
              orders@homeandlivingfurnitures.com
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
