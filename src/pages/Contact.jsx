import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, MessageCircle, Send } from "lucide-react";
import Layout from "../components/layout/Layout";
import toast from "react-hot-toast";

const faqs = [
  {
    q: "How do I place an order?",
    a: "Browse our collection, add items to your cart, then proceed to checkout. Your order will be confirmed via WhatsApp by our team within 30 minutes.",
  },
  {
    q: "What are the delivery charges?",
    a: "Standard delivery is PKR 200 across Pakistan. Orders above PKR 5,000 qualify for free delivery.",
  },
  {
    q: "Can I return or exchange a product?",
    a: "Yes! We accept returns and exchanges within 7 days of delivery. The product must be in its original condition with tags attached.",
  },
  {
    q: "How long does delivery take?",
    a: "Standard delivery takes 3–5 business days. Express delivery (1–2 days) is available for major cities — contact us for details.",
  },
  {
    q: "Are all products authentic?",
    a: "Absolutely. AS Collection guarantees 100% authentic products. All our items come with authenticity documentation.",
  },
];

function FAQItem({ item, index }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07 }}
      className="border-b border-white/5"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left"
      >
        <span className="font-poppins font-semibold text-white text-sm pr-4">{item.q}</span>
        <span className={`text-gold flex-shrink-0 text-xl font-bold transition-transform ${open ? "rotate-45" : ""}`}>+</span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        className="overflow-hidden"
      >
        <p className="font-inter text-white/40 text-sm pb-5 leading-relaxed">{item.a}</p>
      </motion.div>
    </motion.div>
  );
}

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Message sent! We'll reply within 24 hours.", {
      style: { background: "#1a1a1a", color: "#fff", border: "1px solid rgba(212,175,55,0.3)" },
      iconTheme: { primary: "#D4AF37", secondary: "#0A0A0A" },
    });
    setSent(true);
    setForm({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <Layout>
      {/* Header */}
      <div className="pt-28 pb-12 section-glow border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gold font-inter text-xs tracking-[0.3em] uppercase mb-3"
          >
            Get in Touch
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-poppins font-black text-4xl md:text-5xl text-white mb-4"
          >
            Contact <span className="gold-text">Us</span>
          </motion.h1>
          <p className="font-inter text-white/40 text-base max-w-lg mx-auto">
            Have a question? We'd love to hear from you. Our team typically responds within 30 minutes.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-5 gap-10">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-5">
            {[
              {
                icon: Phone,
                title: "Phone / WhatsApp",
                lines: ["+92 300 123 4567", "+92 321 987 6543"],
                action: { label: "Chat on WhatsApp", href: "https://wa.me/923001234567" },
              },
              {
                icon: Mail,
                title: "Email",
                lines: ["hello@ascollection.pk", "orders@ascollection.pk"],
                action: { label: "Send Email", href: "mailto:hello@ascollection.pk" },
              },
              {
                icon: MapPin,
                title: "Visit Our Store",
                lines: ["Plot 14, Fashion Street", "DHA Phase 5, Lahore, Pakistan"],
                action: null,
              },
              {
                icon: Clock,
                title: "Business Hours",
                lines: ["Mon – Sat: 10:00 AM – 8:00 PM", "Sunday: 12:00 PM – 6:00 PM"],
                action: null,
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass gold-border rounded-2xl p-5"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0">
                    <item.icon size={18} className="text-gold" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-poppins font-semibold text-white text-sm mb-1">{item.title}</h3>
                    {item.lines.map((line) => (
                      <p key={line} className="text-white/40 text-sm font-inter">{line}</p>
                    ))}
                    {item.action && (
                      <a
                        href={item.action.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-gold text-xs font-inter mt-2 hover:underline"
                      >
                        {item.title.includes("WhatsApp") && <MessageCircle size={12} />}
                        {item.action.label} →
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass gold-border rounded-2xl p-6 sm:p-8"
            >
              <h2 className="font-poppins font-bold text-white text-xl mb-6">
                Send us a Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-white/50 text-xs font-inter block mb-1.5">Your Name</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Ahmed Khan"
                      className="input-luxury"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-white/50 text-xs font-inter block mb-1.5">Email Address</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="ahmed@email.com"
                      className="input-luxury"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-white/50 text-xs font-inter block mb-1.5">Subject</label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder="Order inquiry, return request..."
                    className="input-luxury"
                    required
                  />
                </div>

                <div>
                  <label className="text-white/50 text-xs font-inter block mb-1.5">Message</label>
                  <textarea
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="How can we help you?"
                    className="input-luxury resize-none"
                    required
                  />
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-gold w-full flex items-center justify-center gap-2 py-4"
                  id="contact-submit"
                >
                  {sent ? (
                    <>✓ Message Sent!</>
                  ) : (
                    <>
                      <Send size={17} />
                      Send Message
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-gold font-inter text-xs tracking-[0.3em] uppercase mb-3">
              FAQ
            </p>
            <h2 className="font-poppins font-bold text-white text-3xl">
              Frequently Asked <span className="gold-text">Questions</span>
            </h2>
          </motion.div>
          <div className="max-w-3xl mx-auto glass gold-border rounded-2xl px-6 py-2">
            {faqs.map((item, i) => (
              <FAQItem key={item.q} item={item} index={i} />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
