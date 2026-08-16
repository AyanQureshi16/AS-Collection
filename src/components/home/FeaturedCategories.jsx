import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useLuxuryMotion } from "../../utils/motion";

const categories = [
  {
    id: "new",
    label: "New Arrivals",
    subtitle: "Fresh Collection",
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&q=80",
    link: "/shop?sort=new",
  },
  {
    id: "men",
    label: "Men's Watches",
    subtitle: "Bold & Refined",
    image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800&q=80",
    link: "/shop?category=men",
  },
  {
    id: "women",
    label: "Women's Watches",
    subtitle: "Elegant & Timeless",
    image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&q=80",
    link: "/shop?category=women",
  },
];

export default function FeaturedCategories() {
  const { fadeUp, transition } = useLuxuryMotion();

  return (
    <section className="py-28 md:py-36 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          {...fadeUp}
          transition={transition}
          viewport={{ once: true }}
          className="mb-16 md:mb-20"
        >
          <p className="eyebrow mb-4">Explore</p>
          <h2 className="section-title">Featured Categories</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                to={cat.link}
                className="group relative block overflow-hidden h-[320px] md:h-[400px]"
              >
                <img
                  src={cat.image}
                  alt={cat.label}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-primary/10 group-hover:from-primary/80 transition-all duration-500" />

                <div className="absolute inset-0 p-8 md:p-10 flex flex-col justify-end transition-transform duration-500 group-hover:-translate-y-2">
                  <p className="font-inter text-[10px] tracking-widest uppercase text-champagne mb-3">
                    {cat.subtitle}
                  </p>
                  <h3 className="font-display text-3xl md:text-4xl text-primary font-light mb-4">
                    {cat.label}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 font-inter text-[10px] tracking-widest uppercase text-primary group-hover:text-champagne transition-colors duration-400">
                      Explore
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-400" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
