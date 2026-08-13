import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useProducts } from "../../context/ProductContext";
import { getCustomerVisibleProducts } from "../../data/products";

const categoryImages = {
  men: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
  women: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=800&q=80",
  watches: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&q=80",
  perfumes: "https://images.unsplash.com/photo-1541643600914-78b084683702?w=800&q=80",
};

export default function FeaturedCategories() {
  const { products } = useProducts();
  const cats = getCustomerVisibleProducts(products)
    .reduce((acc, product) => {
      const key = String(product.category || "uncategorized").toLowerCase();
      const label = product.category || "Uncategorized";
      if (!acc[key]) {
        acc[key] = {
          id: key,
          label,
          subtitle: "Curated selection",
          image: categoryImages[key] || "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
          count: 0,
        };
      }
      acc[key].count += 1;
      return acc;
    }, {});

  const categoryList = Object.values(cats).slice(0, 4);

  if (!categoryList.length) return null;

  return (
    <section className="py-20 px-4 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-14"
      >
        <p className="text-gold font-inter text-xs tracking-[0.3em] uppercase mb-3">Collections</p>
        <h2 className="section-title mb-4">
          Shop by <span className="gold-text">Category</span>
        </h2>
        <p className="section-subtitle">Explore our curated collections — each crafted for the style-conscious Pakistani.</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {categoryList.map((cat, i) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
          >
            <Link to={`/shop?category=${cat.id}`} className="group relative block h-80 rounded-2xl overflow-hidden">
              <img src={cat.image} alt={cat.label} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
              <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-gold/40 transition-all duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-white/50 text-xs font-inter mb-1">{cat.subtitle}</p>
                    <h3 className="font-poppins font-bold text-white text-2xl group-hover:text-gold transition-colors">{cat.label}</h3>
                    <p className="text-white/30 text-xs font-inter mt-1">{cat.count} Products</p>
                  </div>
                  <motion.div initial={{ x: -5, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} className="w-10 h-10 rounded-full bg-gold/10 group-hover:bg-gold flex items-center justify-center transition-all duration-300 border border-gold/20 group-hover:border-gold">
                    <ArrowRight size={18} className="text-gold group-hover:text-primary transition-colors" />
                  </motion.div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
