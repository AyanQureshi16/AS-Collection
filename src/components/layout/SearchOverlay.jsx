import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function SearchOverlay({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
      onClose();
      setQuery("");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-ink/95 backdrop-blur-xl"
          />

          {/* Search Overlay */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 left-0 right-0 z-50 pt-32 pb-12 px-4"
          >
            <div className="max-w-3xl mx-auto">
              <motion.form
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                onSubmit={handleSubmit}
                className="relative"
              >
                <div className="relative flex items-center bg-surface border border-champagne/20 overflow-hidden">
                  <div className="pl-6">
                    <Search size={20} strokeWidth={1.5} className="text-champagne" />
                  </div>
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for watches..."
                    autoFocus
                    className="flex-1 bg-transparent border-none outline-none px-4 py-5 text-ivory placeholder:text-muted text-base font-inter"
                  />
                  <button
                    type="button"
                    onClick={onClose}
                    className="pr-6 text-muted hover:text-ivory transition-colors"
                    aria-label="Close search"
                  >
                    <X size={20} strokeWidth={1.5} />
                  </button>
                </div>
              </motion.form>

              {/* Quick Links */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-8"
              >
                <p className="text-[#B8B8C0] text-sm font-inter mb-4 tracking-wide">
                  Popular Searches
                </p>
                <div className="flex flex-wrap gap-3">
                  {["Men's Watches", "Women's Watches", "Gold", "Chronograph", "Automatic"].map((term) => (
                    <Link
                      key={term}
                      to={`/shop?search=${encodeURIComponent(term)}`}
                      onClick={onClose}
                      className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[#B8B8C0] text-sm font-inter hover:border-[#D4AF37]/30 hover:text-[#D4AF37] transition-all"
                    >
                      {term}
                    </Link>
                  ))}
                </div>
              </motion.div>

              {/* Category Links */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4"
              >
                <Link
                  to="/shop?category=men"
                  onClick={onClose}
                  className="p-4 bg-white/5 border border-white/10 rounded-xl text-center hover:border-[#D4AF37]/30 transition-all group"
                >
                  <span className="text-[#F8F8F5] font-poppins font-medium group-hover:text-[#D4AF37] transition-colors">
                    Men
                  </span>
                </Link>
                <Link
                  to="/shop?category=women"
                  onClick={onClose}
                  className="p-4 bg-white/5 border border-white/10 rounded-xl text-center hover:border-[#D4AF37]/30 transition-all group"
                >
                  <span className="text-[#F8F8F5] font-poppins font-medium group-hover:text-[#D4AF37] transition-colors">
                    Women
                  </span>
                </Link>
                <Link
                  to="/shop?sort=new"
                  onClick={onClose}
                  className="p-4 bg-white/5 border border-white/10 rounded-xl text-center hover:border-[#D4AF37]/30 transition-all group"
                >
                  <span className="text-[#F8F8F5] font-poppins font-medium group-hover:text-[#D4AF37] transition-colors">
                    New Arrivals
                  </span>
                </Link>
                <Link
                  to="/shop?sort=bestseller"
                  onClick={onClose}
                  className="p-4 bg-white/5 border border-white/10 rounded-xl text-center hover:border-[#D4AF37]/30 transition-all group"
                >
                  <span className="text-[#F8F8F5] font-poppins font-medium group-hover:text-[#D4AF37] transition-colors">
                    Best Sellers
                  </span>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
