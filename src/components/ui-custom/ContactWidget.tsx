import { useState, useRef, useEffect } from 'react';

const SUPPORT_NUMBER = '+27635193251';
const WHATSAPP_NUMBER = '27635193251';

type Message = {
  from: 'bot' | 'user';
  text: string;
  options?: string[];
};

type Flow = {
  [key: string]: {
    answer: string;
    options?: string[];
  };
};

const CHAT_FLOW: Flow = {
  start: {
    answer: "👋 Hi there! Welcome to **homecraft & Living** support. How can I help you today?",
    options: [
      "Track my order",
      "Delivery & shipping info",
      "Return or exchange",
      "Product availability",
      "Payment methods",
      "Something else",
    ],
  },
  "Track my order": {
    answer:
      "To track your order, please check the confirmation email we sent you — it contains your order number and tracking details. You can also WhatsApp us your order number and we'll look it up for you right away! 📦",
    options: ["Contact via WhatsApp", "Go back to menu"],
  },
  "Delivery & shipping info": {
    answer:
      "🚚 We deliver across South Africa! Delivery typically takes **3–7 business days** depending on your location. Orders over **R5,000** qualify for **free shipping**. For remote areas, delivery may take a little longer.",
    options: ["What are payment methods?", "Go back to menu"],
  },
  "Return or exchange": {
    answer:
      "We have a **7-day return policy** from the date of delivery. Items must be unused and in their original packaging. Please contact us via WhatsApp or call us with your order number to initiate a return or exchange. 🔄",
    options: ["Contact via WhatsApp", "Go back to menu"],
  },
  "Product availability": {
    answer:
      "Our stock updates regularly! If a product shows as available on the site, it's in stock. For bulk orders or custom colour requests, please reach out to us directly — we're happy to assist. 🛋️",
    options: ["Contact via WhatsApp", "Go back to menu"],
  },
  "Payment methods": {
    answer:
      "💳 We accept **EFT (bank transfer)**, **credit/debit cards**, and select **mobile payment** options. Payment details are provided at checkout. Orders are processed once payment is confirmed.",
    options: ["Delivery & shipping info", "Go back to menu"],
  },
  "Something else": {
    answer:
      "No problem! For anything not covered here, our friendly team is ready to help. Reach out to us directly and we'll get back to you as soon as possible. 😊",
    options: ["Contact via WhatsApp", "Call us now"],
  },
  "Contact via WhatsApp": {
    answer: `Great! Tap below to open WhatsApp and chat with our team directly. We typically respond within a few minutes during business hours. 💬`,
    options: ["Go back to menu"],
  },
  "Call us now": {
    answer: `You can reach us at **${SUPPORT_NUMBER}**. Our lines are open Monday–Saturday, 8am–6pm. 📞`,
    options: ["Go back to menu"],
  },
  "Go back to menu": {
    answer: "Sure! Here's the main menu again. What can I help you with?",
    options: [
      "Track my order",
      "Delivery & shipping info",
      "Return or exchange",
      "Product availability",
      "Payment methods",
      "Something else",
    ],
  },
};

function formatText(text: string) {
  // Bold between **
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith('**') && part.endsWith('**')
      ? <strong key={i}>{part.slice(2, -2)}</strong>
      : part
  );
}

export default function ContactWidget() {
  const [open, setOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userMessageCount, setUserMessageCount] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Start chat with greeting
  const openChat = () => {
    setOpen(false);
    setChatOpen(true);
    if (messages.length === 0) {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages([
          {
            from: 'bot',
            text: CHAT_FLOW.start.answer,
            options: CHAT_FLOW.start.options,
          },
        ]);
      }, 800);
    }
  };

  const handleOption = (option: string) => {
    const newUserCount = userMessageCount + 1;
    setUserMessageCount(newUserCount);

    // Add user message
    const userMsg: Message = { from: 'user', text: option };

    // If exceeded 2 messages, escalate to human
    if (newUserCount > 2) {
      setMessages((prev) => [
        ...prev,
        userMsg,
        {
          from: 'bot',
          text: `It looks like you need more detailed help! 🙌 Please contact our customer care team directly:\n\n📞 **${SUPPORT_NUMBER}**\n\nWe're available Mon–Sat, 8am–6pm. You can also WhatsApp us for faster response!`,
          options: ['Contact via WhatsApp', 'Restart chat'],
        },
      ]);
      return;
    }

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const flow = CHAT_FLOW[option];
      if (flow) {
        setMessages((prev) => [
          ...prev,
          { from: 'bot', text: flow.answer, options: flow.options },
        ]);
      }

      // Special: restart chat
      if (option === 'Restart chat') {
        setUserMessageCount(0);
        setMessages([
          {
            from: 'bot',
            text: CHAT_FLOW.start.answer,
            options: CHAT_FLOW.start.options,
          },
        ]);
      }
    }, 700);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2">

      {/* ── CHAT WINDOW ── */}
      {chatOpen && (
        <div className="mb-2 w-80 rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.18)] overflow-hidden flex flex-col bg-white"
          style={{ maxHeight: '480px' }}>

          {/* Header */}
          <div className="bg-[#1d9bf0] px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z" />
                </svg>
              </div>
              <div>
                <p className="text-white text-sm font-semibold leading-none">homecraft Support</p>
                <p className="text-white/70 text-xs mt-0.5">Typically replies in minutes</p>
              </div>
            </div>
            <button
              onClick={() => setChatOpen(false)}
              className="text-white/80 hover:text-white transition-colors"
              aria-label="Close chat"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 bg-gray-50" style={{ minHeight: 0 }}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className="flex flex-col gap-1.5 max-w-[85%]">
                  <div
                    className={`px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                      msg.from === 'user'
                        ? 'bg-[#1d9bf0] text-white rounded-br-sm'
                        : 'bg-white text-gray-800 shadow-sm rounded-bl-sm border border-gray-100'
                    }`}
                  >
                    {formatText(msg.text)}
                  </div>

                  {/* Options */}
                  {msg.from === 'bot' && msg.options && i === messages.length - 1 && (
                    <div className="flex flex-col gap-1.5 mt-1">
                      {msg.options.map((opt) => (
                        opt === 'Contact via WhatsApp' ? (
                          <a
                            key={opt}
                            href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%2C%20I%20need%20help%20with%20my%20order`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs px-3 py-2 rounded-xl border border-[#25D366] text-[#25D366] bg-white hover:bg-[#25D366] hover:text-white transition-colors font-medium text-center"
                          >
                            💬 WhatsApp Us
                          </a>
                        ) : opt === 'Call us now' ? (
                          <a
                            key={opt}
                            href={`tel:${SUPPORT_NUMBER}`}
                            className="text-xs px-3 py-2 rounded-xl border border-[#1d9bf0] text-[#1d9bf0] bg-white hover:bg-[#1d9bf0] hover:text-white transition-colors font-medium text-center"
                          >
                            📞 Call {SUPPORT_NUMBER}
                          </a>
                        ) : (
                          <button
                            key={opt}
                            onClick={() => handleOption(opt)}
                            className="text-xs px-3 py-2 rounded-xl border border-gray-200 text-gray-700 bg-white hover:bg-[#1d9bf0] hover:text-white hover:border-[#1d9bf0] transition-colors font-medium text-left"
                          >
                            {opt}
                          </button>
                        )
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-100 shadow-sm px-4 py-2.5 rounded-2xl rounded-bl-sm flex gap-1 items-center">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Footer */}
          <div className="px-3 py-2 bg-white border-t border-gray-100 shrink-0">
            <p className="text-[10px] text-gray-400 text-center">
              Need more help? Call us at{' '}
              <a href={`tel:${SUPPORT_NUMBER}`} className="text-[#1d9bf0] font-medium">
                {SUPPORT_NUMBER}
              </a>
            </p>
          </div>
        </div>
      )}

      {/* ── POPUP MENU (when chat is closed) ── */}
      {open && !chatOpen && (
        <div className="mb-2 bg-white rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.18)] overflow-hidden w-52">
          {/* Chat with us */}
          <button
            onClick={openChat}
            className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100"
          >
            <div className="w-8 h-8 rounded-full bg-[#1d9bf0] flex items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-700">Chat with us</span>
          </button>

          {/* Call Us */}
          <a
            href={`tel:${SUPPORT_NUMBER}`}
            className="flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-[#1d9bf0] flex items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-700">Call Us</span>
          </a>
        </div>
      )}

      {/* ── TOGGLE BUTTON ── */}
      <button
        onClick={() => {
          if (chatOpen) {
            setChatOpen(false);
          } else {
            setOpen((prev) => !prev);
          }
        }}
        className="w-14 h-14 rounded-full bg-[#1d9bf0] shadow-[0_4px_16px_rgba(29,155,240,0.45)] flex items-center justify-center hover:bg-[#1a8fd1] transition-colors"
        aria-label="Contact options"
      >
        {open || chatOpen ? (
          <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6">
            <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z" />
          </svg>
        )}
      </button>
    </div>
  );
}