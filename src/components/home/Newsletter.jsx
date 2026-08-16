import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useSettings } from "../../context/SettingsContext";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const { settings } = useSettings();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <section className="py-32 relative overflow-hidden">
      {/* Cinematic purple atmospheric background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#241044]/50 via-[#08090B] to-[#6C3BFF]/30">
        <motion.div
          animate={{ 
            scale: [1, 1.15, 1],
            opacity: [0.25, 0.45, 0.25]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#6C3BFF]/20 rounded-full blur-[140px]"
        />
        
        {/* Gold accent glow */}
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#D4AF37]/8 rounded-full blur-[160px]"
        />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-[#D4AF37] font-inter text-xs tracking-[0.4em] uppercase mb-6 font-medium">
            Exclusive Access
          </p>
          
          <h2 className="font-playfair font-black text-4xl md:text-5xl lg:text-6xl text-[#F8F8F5] mb-8 leading-[0.95]">
            Stay in <span className="gold-text">Time.</span>
          </h2>
          
          <p className="font-inter text-[#B8B8C0] text-lg leading-relaxed mb-12 max-w-xl mx-auto">
            Discover new arrivals, exclusive releases, and stories from {settings?.storeName || 'ZELMIOR'}.
          </p>

          {!subscribed ? (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-[#F8F8F5] placeholder:text-white/30 focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/30 transition-all"
              />
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                className="bg-[#D4AF37] text-[#08090B] font-poppins font-semibold px-10 py-4 rounded-full transition-all duration-300 hover:bg-[#E7C45A] hover:shadow-[0_8px_40px_rgba(212,175,55,0.4)] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer whitespace-nowrap inline-flex items-center gap-2"
              >
                Subscribe <ArrowRight size={18} />
              </motion.button>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-3 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-xl px-8 py-5"
            >
              <div className="w-10 h-10 rounded-full bg-[#D4AF37] flex items-center justify-center">
                <ArrowRight size={18} className="text-[#08090B]" />
              </div>
              <span className="text-[#D4AF37] font-inter font-semibold text-base">Welcome to {settings?.storeName || 'ZELMIOR'}!</span>
            </motion.div>
          )}

          <p className="text-[#B8B8C0] text-xs font-inter mt-8">
            By subscribing, you agree to receive marketing emails from {settings?.storeName || 'ZELMIOR'}.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
