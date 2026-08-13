import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Layout from "../components/layout/Layout";
import ProductCard from "../components/shop/ProductCard";
import QuickView from "../components/ui/QuickView";
import { products } from "../data/products";

const categoryData = [
  {
    id: "men",
    label: "Men's Collection",
    subtitle: "Timeless elegance for the modern Pakistani gentleman",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80",
    count: 12,
    tags: ["Kurtas", "Sherwanis", "Blazers", "Shirts", "Trousers", "Accessories"],
  },
  {
    id: "women",
    label: "Women's Collection",
    subtitle: "Graceful couture from lawn to bridal",
    image: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=1200&q=80",
    count: 12,
    tags: ["Lawn Suits", "Bridal", "Sarees", "Abayas", "Dresses", "Shawls"],
  },
  {
    id: "watches",
    label: "Luxury Watches",
    subtitle: "Swiss precision meets Pakistani passion",
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=1200&q=80",
    count: 8,
    tags: ["Automatic", "Chronograph", "Dress Watch", "Dive Watch", "Smart Watch"],
  },
  {
    id: "perfumes",
    label: "Signature Fragrances",
    subtitle: "From Kashmiri oud to Parisian floral",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683702?w=1200&q=80",
    count: 8,
    tags: ["Attar", "EDP", "Cologne", "Body Mist", "Gift Sets"],
  },
];

export default function Categories() {
  const [activeCategory, setActiveCategory] = useState("men");
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const activeCat = categoryData.find((c) => c.id === activeCategory);
  const filteredProducts = products.filter((p) => p.category === activeCategory);

  return (
    <Layout>
      {/* Header */}
      <div className="pt-28 pb-12 section-glow border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gold font-inter text-xs tracking-[0.3em] uppercase mb-3"
          >
            Collections
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-poppins font-black text-4xl md:text-5xl text-white"
          >
            Our <span className="gold-text">Categories</span>
          </motion.h1>
        </div>
      </div>

      {/* Category hero banners */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {categoryData.map((cat, i) => (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setActiveCategory(cat.id)}
              className={`relative h-44 rounded-2xl overflow-hidden text-left transition-all ${
                activeCategory === cat.id ? "ring-2 ring-gold" : ""
              }`}
            >
              <img
                src={cat.image}
                alt={cat.label}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className={`font-poppins font-bold text-sm leading-tight transition-colors ${
                  activeCategory === cat.id ? "text-gold" : "text-white"
                }`}>
                  {cat.label}
                </h3>
                <p className="text-white/40 text-xs">{cat.count} items</p>
              </div>
              {activeCategory === cat.id && (
                <motion.div
                  layoutId="activeCat"
                  className="absolute inset-0 border-2 border-gold rounded-2xl"
                />
              )}
            </motion.button>
          ))}
        </div>

        {/* Active category detail */}
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10"
        >
          {/* Category header */}
          <div className="relative h-64 sm:h-80 rounded-3xl overflow-hidden mb-8">
            <img
              src={activeCat.image}
              alt={activeCat.label}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />
            <div className="absolute inset-0 flex items-center p-8 sm:p-12">
              <div>
                <h2 className="font-poppins font-black text-3xl sm:text-4xl text-white mb-3">
                  {activeCat.label}
                </h2>
                <p className="font-inter text-white/60 text-base mb-4">
                  {activeCat.subtitle}
                </p>
                <div className="flex flex-wrap gap-2">
                  {activeCat.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-white/70 text-xs font-inter border border-white/10"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Products grid */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-poppins font-bold text-white text-xl">
              {filteredProducts.length} Products
            </h3>
            <Link
              to={`/shop?category=${activeCategory}`}
              className="flex items-center gap-2 text-gold/70 hover:text-gold font-inter text-sm transition-colors group"
            >
              View All <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={setQuickViewProduct}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {quickViewProduct && (
        <QuickView product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      )}
    </Layout>
  );
}
