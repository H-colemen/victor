import type { ReactNode } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/ui-custom/WhatsAppButton';
import ContactWidget from '@/components/ui-custom/ContactWidget';
import CartDrawer from '@/components/layout/CartDrawer';

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      <Footer />
      <CartDrawer />
      <WhatsAppButton />
      <ContactWidget />
    </div>
  );
}