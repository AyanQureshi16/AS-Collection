import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function SignatureCollection() {
  return (
    <section className="py-32 relative overflow-hidden">
      {/* Cinematic purple atmospheric background */}
      <div className="absolute inset-0 bg-[#241044]">
        {/* Deep purple gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#241044]/80 via-[#6C3BFF]/40 to-[#08090B]" />
        
        {/* Dramatic purple glow orbs */}
        <motion.div
          animate={{ 
            scale: [1, 1.25, 1],
            opacity: [0.4, 0.6, 0.4]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 right-1/4 w-[700px] h-[700px] bg-[#6C3BFF]/30 rounded-full blur-[160px]"
        />
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-[#241044]/40 rounded-full blur-[140px]"
        />
        
        {/* Gold cinematic glow */}
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.15, 0.25, 0.15]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-[#D4AF37]/10 rounded-full blur-[180px]"
        />

        {/* Vignette effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#08090B] via-transparent to-[#08090B]/60" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left - Large Watch Image */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative order-2 lg:order-1"
          >
            <div className="relative">
              {/* Cinematic glow behind watch */}
              <motion.div
                animate={{ 
                  scale: [1, 1.08, 1],
                  opacity: [0.5, 0.7, 0.5]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/15 to-[#6C3BFF]/15 rounded-full blur-[100px]"
              />
              
              {/* Dramatic watch image */}
              <motion.img
                src="https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=1200&q=80"
                alt="Signature collection watch"
                className="relative w-full h-auto object-contain max-h-[550px] lg:max-h-[650px] mx-auto drop-shadow-[0_40px_80px_rgba(0,0,0,0.6)]"
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              />
              
              {/* Gold accent ring */}
              <div className="absolute inset-0 border border-[#D4AF37]/20 rounded-full scale-125 blur-sm" />
              
              {/* Purple accent ring */}
              <div className="absolute inset-0 border border-[#6C3BFF]/15 rounded-full scale-140 blur-md" />
            </div>
          </motion.div>

          {/* Right - Content */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="order-1 lg:order-2"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-[#D4AF37] font-inter text-xs tracking-[0.4em] uppercase mb-6 font-medium">
                Exclusive Edition
              </p>
              
              <h2 className="font-playfair font-black text-4xl md:text-5xl lg:text-7xl text-[#F8F8F5] mb-8 leading-[0.95]">
                CRAFTED FOR<br />
                <span className="gold-text">EVERY MOMENT.</span>
              </h2>
              
              <p className="font-inter text-[#B8B8C0] text-lg leading-relaxed mb-10 max-w-lg">
                A timepiece is more than an accessory. It becomes part of the moments you remember. Each ZELMIOR watch represents the pinnacle of precision engineering and timeless design.
              </p>

              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/shop"
                  className="bg-[#D4AF37] text-[#08090B] font-poppins font-semibold px-10 py-4 rounded-full transition-all duration-300 hover:bg-[#E7C45A] hover:shadow-[0_8px_40px_rgba(212,175,55,0.4)] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer inline-flex items-center gap-2 text-base"
                >
                  Discover ZELMIOR <ArrowRight size={18} />
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
