import { useState } from 'react';

export default function ContactWidget() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2">
      {/* Popup Menu */}
      {open && (
        <div className="mb-2 bg-white rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.18)] overflow-hidden w-52 animate-fade-in">
          {/* Chat with us */}
          <a
            href="/contact"
            className="flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100"
          >
            <div className="w-8 h-8 rounded-full bg-[#1d9bf0] flex items-center justify-center shrink-0">
              <svg
                viewBox="0 0 24 24"
                fill="white"
                className="w-4 h-4"
              >
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-700">Chat with us</span>
          </a>

          {/* Call Us */}
          <a
            href="tel:+27835829819"
            className="flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-[#1d9bf0] flex items-center justify-center shrink-0">
              <svg
                viewBox="0 0 24 24"
                fill="white"
                className="w-4 h-4"
              >
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-700">Call Us</span>
          </a>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-14 h-14 rounded-full bg-[#1d9bf0] shadow-[0_4px_16px_rgba(29,155,240,0.45)] flex items-center justify-center hover:bg-[#1a8fd1] transition-colors"
        aria-label="Contact options"
      >
        {open ? (
          // Chevron down (close)
          <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6">
            <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
          </svg>
        ) : (
          // Message / chat icon
          <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z" />
          </svg>
        )}
      </button>
    </div>
  );
}