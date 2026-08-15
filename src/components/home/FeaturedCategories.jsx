import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useProducts } from "../../context/ProductContext";
import { getCustomerVisibleProducts } from "../../data/products";
import { useLuxuryMotion } from "../../utils/motion";

const categorySubtitles = {
  men: "Bold & Refined",
  women: "Elegant & Timeless",
  watches: "Classic Collection",
  perfumes: "Luxury Scents",
  uncategorized: "Curated Selection",
};

export default function FeaturedCategories() {
  const { products } = useProducts();
  const { fadeUp, transition } = useLuxuryMotion();

  const categoryList = getCustomerVisibleProducts(products)
    .reduce((acc, product) => {
      const key = String(product.category || "uncategorized").toLowerCase();
      const label = product.category || "Uncategorized";
      if (!acc[key]) {
        const productImage = product.images?.[0] || product.image;
        acc[key] = {
          id: key,
          label,
          subtitle: categorySubtitles[key] || "Curated Selection",
          image: productImage,
          count: 0,
        };
      }
      acc[key].count += 1;
      if (product.images?.[0] && !acc[key].image) {
        acc[key].image = product.images[0];
      }
      return acc;
    }, {});

  const categories = Object.values(categoryList).slice(0, 4);
  if (!categories.length) return null;

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className={i === 0 ? "md:row-span-2" : ""}
            >
              <Link
                to={`/shop?category=${cat.id}`}
                className={`group relative block overflow-hidden ${
                  i === 0 ? "h-[520px] md:h-full md:min-h-[640px]" : "h-[280px] md:h-[300px]"
                }`}
              >
                <img
                  src={cat.image}
                  alt={cat.label}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/40 to-ink/10 group-hover:from-ink/80 transition-all duration-500" />

                <div className="absolute inset-0 p-8 md:p-10 flex flex-col justify-end transition-transform duration-500 group-hover:-translate-y-2">
                  <p className="font-inter text-[10px] tracking-widest uppercase text-champagne mb-3">
                    {cat.subtitle}
                  </p>
                  <h3 className="font-display text-3xl md:text-4xl text-ivory font-light mb-4 capitalize">
                    {cat.label}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="font-inter text-xs text-muted">{cat.count} pieces</span>
                    <span className="inline-flex items-center gap-2 font-inter text-[10px] tracking-widest uppercase text-ivory group-hover:text-champagne transition-colors duration-400">
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
