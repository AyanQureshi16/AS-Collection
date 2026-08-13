import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
} from "lucide-react";

const footerLinks = {
  Shop: [
    { label: "Men's Collection", to: "/shop?category=men" },
    { label: "Women's Collection", to: "/shop?category=women" },
    { label: "Luxury Watches", to: "/shop?category=watches" },
    { label: "Signature Perfumes", to: "/shop?category=perfumes" },
    { label: "New Arrivals", to: "/shop?sort=new" },
    { label: "Best Sellers", to: "/shop?sort=bestseller" },
  ],
  Company: [
    { label: "About Us", to: "/about" },
    { label: "Contact", to: "/contact" },
    { label: "Careers", to: "/about" },
    { label: "Press", to: "/about" },
  ],
  Support: [
    { label: "FAQ", to: "/contact" },
    { label: "Shipping Policy", to: "/contact" },
    { label: "Return & Exchange", to: "/contact" },
    { label: "Size Guide", to: "/shop" },
    { label: "Track Order", to: "/contact" },
  ],
};

const socials = [
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

export default function Footer() {
  return (
    <footer className="bg-dark-50 border-t border-white/5 mt-auto">
      {/* Newsletter Strip */}
      <div className="bg-gold py-10 px-4">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1 text-center md:text-left">
            <h3 className="font-poppins font-bold text-primary text-2xl">
              Join the Inner Circle
            </h3>
            <p className="text-primary/70 font-inter text-sm mt-1">
              Exclusive offers, early access, and style inspiration delivered to your inbox.
            </p>
          </div>
          <form
            className="flex gap-2 w-full md:w-auto"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 md:w-64 px-4 py-3 rounded-full bg-primary/10 text-primary placeholder:text-primary/50 border border-primary/20 focus:outline-none focus:border-primary/50 font-inter text-sm"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="bg-primary text-white px-6 py-3 rounded-full font-poppins font-semibold text-sm flex items-center gap-2 whitespace-nowrap"
            >
              Subscribe <ArrowRight size={16} />
            </motion.button>
          </form>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gold flex items-center justify-center">
                <span className="font-poppins font-black text-primary text-sm">AS</span>
              </div>
              <div>
                <div className="font-poppins font-bold text-white text-lg leading-none">
                  AS Collection
                </div>
                <div className="text-gold text-[10px] font-inter tracking-[0.2em] uppercase">
                  Luxury Fashion
                </div>
              </div>
            </Link>
            <p className="font-inter text-white/50 text-sm leading-relaxed mb-6 max-w-xs">
              Pakistan's premier destination for luxury fashion, premium timepieces,
              and signature fragrances. Crafting experiences, not just products.
            </p>
            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-white/40 text-sm">
                <MapPin size={16} className="text-gold flex-shrink-0" />
                <span>Plot 14, Fashion Street, Lahore, Pakistan</span>
              </div>
              <div className="flex items-center gap-3 text-white/40 text-sm">
                <Phone size={16} className="text-gold flex-shrink-0" />
                <span>+92 300 123 4567</span>
              </div>
              <div className="flex items-center gap-3 text-white/40 text-sm">
                <Mail size={16} className="text-gold flex-shrink-0" />
                <span>hello@ascollection.pk</span>
              </div>
            </div>
            {/* Socials */}
            <div className="flex items-center gap-3">
              {socials.map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  aria-label={label}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-9 h-9 rounded-full glass gold-border flex items-center justify-center text-white/50 hover:text-gold transition-colors"
                >
                  <Icon size={16} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-poppins font-semibold text-white text-sm uppercase tracking-widest mb-4">
                {title}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="font-inter text-white/40 text-sm hover:text-gold transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-inter text-white/30 text-xs">
            © {new Date().getFullYear()} AS Collection. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="font-inter text-white/20 text-xs">Privacy Policy</span>
            <span className="font-inter text-white/20 text-xs">Terms of Service</span>
            <span className="font-inter text-white/20 text-xs">Cookies</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
