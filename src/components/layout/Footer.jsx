import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Instagram, Facebook, ArrowRight } from "lucide-react";
import { useSettings } from "../../context/SettingsContext";

const footerNav = {
  Shop: [
    { label: "The Collection", to: "/shop" },
    { label: "New Arrivals", to: "/shop?sort=new" },
    { label: "Men's Watches", to: "/shop?category=men" },
    { label: "Women's Watches", to: "/shop?category=women" },
  ],
  Brand: [
    { label: "About", to: "/about" },
    { label: "Contact", to: "/contact" },
    { label: "Shipping", to: "/contact" },
    { label: "Returns", to: "/contact" },
  ],
};

const baseSocials = [
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
  { label: "TikTok", href: "https://tiktok.com", custom: "Tk" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const { settings } = useSettings();
  
  const whatsappNumber = settings?.whatsapp || "";
  const cleanedWhatsApp = whatsappNumber.replace(/\D/g, "");
  const whatsappUrl = cleanedWhatsApp ? `https://wa.me/${cleanedWhatsApp}` : null;
  
  const socials = whatsappUrl 
    ? [...baseSocials, { label: "WhatsApp", href: whatsappUrl, custom: "Wa" }]
    : baseSocials;

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-ink border-t border-white/[0.06] mt-auto">
      {/* Large brand statement */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        <div className="text-center mb-20">
          <Link to="/" className="inline-block">
            <h2 className="font-display text-5xl md:text-7xl lg:text-8xl tracking-[0.15em] text-ivory font-light leading-none hover:text-champagne transition-colors duration-500">
              {settings?.storeName || 'ZELMIOR'}
            </h2>
          </Link>
          <p className="font-display italic text-champagne/80 text-lg md:text-xl mt-6 tracking-wide">
            The Art of Time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 mb-20">
          {/* Navigation columns */}
          {Object.entries(footerNav).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-inter text-[10px] tracking-[0.35em] uppercase text-muted mb-6">
                {title}
              </h4>
              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="font-inter text-sm text-muted hover:text-champagne transition-colors duration-300 link-underline pb-0.5"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div>
            <h4 className="font-inter text-[10px] tracking-[0.35em] uppercase text-muted mb-6">
              Newsletter
            </h4>
            <p className="font-inter text-sm text-muted mb-6 leading-relaxed">
              Be the first to discover new arrivals and exclusive releases.
            </p>
            {!subscribed ? (
              <form onSubmit={handleNewsletter} className="flex flex-col gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  required
                  className="input-luxury text-sm py-3"
                />
                <button type="submit" className="btn-primary text-[10px] py-3 group">
                  Subscribe
                  <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            ) : (
              <p className="font-inter text-sm text-champagne">Thank you for subscribing.</p>
            )}
          </div>
        </div>

        {/* Social + bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-8 border-t border-white/[0.06]">
          <div className="flex items-center gap-5">
            {socials.map(({ icon: Icon, href, label, custom }) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                whileHover={{ y: -2 }}
                className="w-10 h-10 border border-white/[0.08] flex items-center justify-center text-muted hover:text-champagne hover:border-champagne/30 transition-all duration-300 text-xs font-inter"
              >
                {Icon ? <Icon size={16} strokeWidth={1.5} /> : custom}
              </motion.a>
            ))}
          </div>

          <p className="font-inter text-xs text-muted/60">
            © {new Date().getFullYear()} {settings?.storeName || 'ZELMIOR'}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
