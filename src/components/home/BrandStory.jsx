import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useProducts } from "../../context/ProductContext";
import { getCustomerVisibleProducts } from "../../data/products";
import { useLuxuryMotion } from "../../utils/motion";

export default function BrandStory() {
  const { products } = useProducts();
  const { fadeUp, transition } = useLuxuryMotion();

  const watchProduct = getCustomerVisibleProducts(products).find(
    (p) => String(p.category).toLowerCase() === "watches"
  );
  const storyImage =
    watchProduct?.images?.[1] ||
    watchProduct?.images?.[0] ||
    "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=1200&q=80";

  return (
    <section className="py-28 md:py-36 bg-ink overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image — cinematic editorial */}
          <motion.div
            {...fadeUp}
            transition={transition}
            viewport={{ once: true }}
            className="relative order-1 lg:order-1"
          >
            <div className="relative aspect-[4/5] overflow-hidden">
              <img
                src={storyImage}
                alt="ZELMIOR timepiece"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 border border-champagne/20 hidden lg:block" />
          </motion.div>

          {/* Text — magazine layout */}
          <motion.div
            {...fadeUp}
            transition={{ ...transition, delay: 0.15 }}
            viewport={{ once: true }}
            className="order-2 lg:order-2 lg:pl-8"
          >
            <p className="eyebrow mb-6">Our Philosophy</p>
            <h2 className="section-title mb-8 leading-[1.05]">
              TIME IS<br />
              <span className="italic font-normal text-champagne">PERSONAL.</span>
            </h2>
            <p className="font-inter text-muted text-base md:text-lg leading-relaxed mb-6 max-w-md">
              ZELMIOR creates watches designed to become part of the moments you remember.
            </p>
            <p className="font-inter text-muted/70 text-sm leading-relaxed mb-12 max-w-md">
              Each timepiece is a statement of precision, restraint, and enduring style — crafted for those who understand that true luxury speaks quietly.
            </p>
            <Link
              to="/about"
              className="group inline-flex items-center gap-3 font-inter text-xs tracking-widest uppercase text-champagne link-underline pb-1"
            >
              Our Story
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-400" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
