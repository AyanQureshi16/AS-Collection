import { useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useProducts } from "../../context/ProductContext";
import { useSettings } from "../../context/SettingsContext";
import { getFeaturedCustomerProducts, getCustomerVisibleProducts } from "../../data/products";

export default function Hero() {
  const containerRef = useRef(null);
  const prefersReduced = useReducedMotion();
  const { products } = useProducts();
  const { settings } = useSettings();

  const heroProduct = useMemo(() => {
    const featured = getFeaturedCustomerProducts(products);
    const watch = featured.find((p) => String(p.category).toLowerCase() === "watches");
    if (watch) return watch;
    const anyWatch = getCustomerVisibleProducts(products).find(
      (p) => String(p.category).toLowerCase() === "watches"
    );
    return anyWatch || featured[0] || getCustomerVisibleProducts(products)[0];
  }, [products]);

  const heroImage =
    heroProduct?.images?.[0] ||
    "https://images.squarespace-cdn.com/content/v1/53a2b3a1e4b0a5020bebe676/1683448311987-VA24A3PJIAEQWFFBKGMU/luxury-rolex-watch-photography-uk-5.JPG";

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const ease = [0.22, 1, 0.36, 1];
  const noMotion = prefersReduced;

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100svh] flex items-center overflow-hidden bg-primary"
    >
      {/* Cinematic background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: noMotion ? 0 : 1.4, ease }}
        className="absolute inset-0"
      >
        <div className="absolute inset-0 bg-primary" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_70%_50%,rgba(201,168,106,0.06)_0%,transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_80%_at_20%_80%,rgba(201,168,106,0.04)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-transparent to-primary" />
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 pt-24 pb-16 lg:pb-0">
        <motion.div
          style={{ opacity: contentOpacity }}
          className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[calc(100svh-6rem)]"
        >
          {/* Mobile: Watch first */}
          <motion.div
            initial={noMotion ? false : { opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: noMotion ? 0 : 1.4, delay: 0.6, ease }}
            style={{ y: noMotion ? 0 : parallaxY }}
            className="relative order-1 lg:order-2 flex items-center justify-center"
          >
            <div className="relative w-full max-w-[520px] lg:max-w-none">
              {/* Subtle glow */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,168,106,0.12)_0%,transparent_65%)] blur-2xl scale-110" />

              <motion.img
                src={heroImage}
                alt={heroProduct?.name || "ZELMIOR premium watch"}
                className="relative w-full h-auto object-contain max-h-[340px] sm:max-h-[420px] lg:max-h-[580px] mx-auto drop-shadow-[0_32px_64px_rgba(0,0,0,0.7)]"
                animate={noMotion ? {} : { y: [0, -10, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              />

              {/* Reflection line */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-champagne/20 to-transparent" />
            </div>
          </motion.div>

          {/* Content */}
          <div className="relative order-2 lg:order-1 z-10 lg:pr-8">
            <motion.p
              initial={noMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: noMotion ? 0 : 0.8, delay: 0.4, ease }}
              className="eyebrow mb-6"
            >
              The Art of Time
            </motion.p>

            <motion.h1
              initial={noMotion ? false : { opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: noMotion ? 0 : 1, delay: 0.55, ease }}
              className="font-display font-light text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] xl:text-[6.5rem] leading-[0.95] tracking-tight text-primary mb-8"
            >
              TIME,<br />
              <span className="italic text-champagne">REFINED.</span>
            </motion.h1>

            <motion.p
              initial={noMotion ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: noMotion ? 0 : 0.8, delay: 0.75, ease }}
              className="font-inter text-muted text-base sm:text-lg leading-relaxed max-w-md mb-12"
            >
              Precision-crafted watches designed for those who value every second.
            </motion.p>

            <motion.div
              initial={noMotion ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: noMotion ? 0 : 0.8, delay: 0.95, ease }}
              className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5"
            >
              <Link to="/shop" className="btn-primary group">
                Explore Collection
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-400" />
              </Link>
              <Link to="/about" className="btn-ghost">
                Discover {settings?.storeName || 'ZELMIOR'}
              </Link>
            </motion.div>

            {/* Trust indicators — minimal */}
            <motion.div
              initial={noMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: noMotion ? 0 : 0.8, delay: 1.2, ease }}
              className="flex flex-wrap gap-x-10 gap-y-4 mt-16 pt-8 border-t border-themed"
            >
              {["Premium Quality", "Secure Shopping", "Nationwide Delivery"].map((item) => (
                <span key={item} className="font-inter text-[11px] tracking-widest uppercase text-muted">
                  {item}
                </span>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-3"
        aria-hidden="true"
      >
        <span className="font-inter text-[10px] tracking-[0.3em] uppercase text-muted/60">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-champagne/40 to-transparent" />
      </motion.div>
    </section>
  );
}
