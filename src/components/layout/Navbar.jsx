import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Menu, X, Search, User, Sun, Moon } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useSettings } from "../../context/SettingsContext";
import { useTheme } from "../../context/ThemeContext";
import SearchOverlay from "./SearchOverlay";

const navLinks = [
  { to: "/shop", label: "Collection" },
  { to: "/shop?sort=new", label: "New Arrivals" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { cartCount } = useCart();
  const { settings } = useSettings();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const isHome = location.pathname === "/";

  const isActiveLink = (to) => {
    if (to === "/shop") {
      // Collection is active only when on /shop with no sort query param
      return location.pathname === "/shop" && !location.search.includes("sort=");
    }
    if (to === "/shop?sort=new") {
      // New Arrivals is active only when on /shop with sort=new
      return location.pathname === "/shop" && location.search === "?sort=new";
    }
    // For other routes, use exact pathname match
    return location.pathname === to;
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const navBg = scrolled || !isHome
    ? "glass-nav py-3"
    : "bg-transparent py-5";

  return (
    <>
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navBg}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="group flex flex-col" aria-label={`${settings?.storeName || 'ZELMIOR'} Home`}>
              <span className="font-display text-xl md:text-2xl tracking-[0.25em] text-primary font-light leading-none group-hover:text-champagne transition-colors duration-400">
                {settings?.storeName || 'ZELMIOR'}
              </span>
              <span className="font-inter text-[9px] tracking-[0.35em] uppercase text-muted mt-1 hidden sm:block">
                Premium Watches
              </span>
            </Link>

            {/* Desktop Nav — centered */}
            <div className="hidden md:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
              {navLinks.map((link) => {
                const isActive = isActiveLink(link.to);
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`font-inter text-[11px] tracking-widest uppercase transition-colors duration-300 relative group ${
                      isActive ? "text-champagne" : "text-muted hover:text-primary"
                    }`}
                  >
                    {link.label}
                    <span
                      className={`absolute -bottom-1.5 left-0 h-px bg-champagne transition-all duration-400 ${
                        isActive ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                    />
                  </Link>
                );
              })}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2.5 text-muted hover:text-primary transition-colors duration-300"
                aria-label="Search"
              >
                <Search size={18} strokeWidth={1.5} />
              </button>

              <button
                onClick={toggleTheme}
                className="p-2.5 text-muted hover:text-primary transition-colors duration-300"
                aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              >
                {theme === "dark" ? <Sun size={18} strokeWidth={1.5} /> : <Moon size={18} strokeWidth={1.5} />}
              </button>

              <Link
                to="/contact"
                className="hidden sm:flex p-2.5 text-muted hover:text-primary transition-colors duration-300"
                aria-label="Account"
              >
                <User size={18} strokeWidth={1.5} />
              </Link>

              <Link
                to="/cart"
                className="p-2.5 text-muted hover:text-primary transition-colors duration-300 relative"
                aria-label="Shopping Cart"
              >
                <ShoppingBag size={18} strokeWidth={1.5} />
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span
                      key={cartCount}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute top-1 right-1 w-4 h-4 bg-champagne text-ink text-[9px] font-inter font-semibold flex items-center justify-center"
                    >
                      {cartCount > 9 ? "9+" : cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>

              <button
                className="md:hidden p-2.5 text-muted hover:text-ivory transition-colors"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-40 bg-ink/80 backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-sm bg-surface border-l border-themed md:hidden flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-themed">
                <Link to="/" onClick={() => setMobileOpen(false)} aria-label={`${settings?.storeName || 'ZELMIOR'} Home`}>
                  <span className="font-display text-xl tracking-[0.2em] text-primary">{settings?.storeName || 'ZELMIOR'}</span>
                </Link>
                <button onClick={() => setMobileOpen(false)} aria-label="Close menu" className="text-muted hover:text-primary p-2">
                  <X size={20} />
                </button>
              </div>

              <nav className="flex-1 flex flex-col justify-center px-8 gap-8">
                {navLinks.map((link, i) => {
                  const isActive = isActiveLink(link.to);
                  return (
                    <motion.div
                      key={link.to}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                    >
                      <Link
                        to={link.to}
                        className={`font-display text-3xl font-light tracking-wide transition-colors ${
                          isActive ? "text-champagne" : "text-primary/70 hover:text-primary"
                        }`}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              <div className="p-8 border-t border-themed flex gap-6">
                <button
                  onClick={() => { setSearchOpen(true); setMobileOpen(false); }}
                  className="text-muted hover:text-primary transition-colors"
                  aria-label="Search"
                >
                  <Search size={22} strokeWidth={1.5} />
                </button>
                <button
                  onClick={() => { toggleTheme(); }}
                  className="text-muted hover:text-primary transition-colors"
                  aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                >
                  {theme === "dark" ? <Sun size={22} strokeWidth={1.5} /> : <Moon size={22} strokeWidth={1.5} />}
                </button>
                <Link to="/cart" onClick={() => setMobileOpen(false)} className="text-muted hover:text-primary relative">
                  <ShoppingBag size={22} strokeWidth={1.5} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-champagne text-ink text-[9px] font-semibold flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
