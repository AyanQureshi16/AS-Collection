import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, Zap } from "lucide-react";
import Layout from "../components/layout/Layout";
import Hero from "../components/home/Hero";
import FeaturedCategories from "../components/home/FeaturedCategories";
import FeaturedProducts from "../components/home/FeaturedProducts";
import Reviews from "../components/home/Reviews";
import InstagramGallery from "../components/home/InstagramGallery";
import ProductCard from "../components/shop/ProductCard";
import QuickView from "../components/ui/QuickView";
import { useProducts } from "../context/ProductContext";
import { getNewCustomerProducts } from "../data/products";

// Stats strip
function StatsStrip() {
  const stats = [
    { value: "10K+", label: "Happy Customers" },
    { value: "40+", label: "Luxury Products" },
    { value: "4.9★", label: "Average Rating" },
    { value: "100%", label: "Authentic" },
  ];

  return (
    <section className="py-10 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="font-poppins font-black text-3xl md:text-4xl gold-text">
                {stat.value}
              </div>
              <div className="font-inter text-white/40 text-sm mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// New Arrivals Section
function NewArrivals() {
  const { products } = useProducts();
  const visibleProducts = useMemo(() => getNewCustomerProducts(products).slice(0, 4), [products]);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4"
        >
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Zap size={16} className="text-gold" />
              <p className="text-gold font-inter text-xs tracking-[0.3em] uppercase">
                Just In
              </p>
            </div>
            <h2 className="section-title">
              New <span className="gold-text">Arrivals</span>
            </h2>
          </div>
          <Link
            to="/shop?sort=new"
            className="flex items-center gap-2 text-gold/70 hover:text-gold font-inter text-sm transition-colors group"
          >
            View All New <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {visibleProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {visibleProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={setQuickViewProduct}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-10 text-center text-white/50">
            No new arrivals yet.
          </div>
        )}
      </div>

      {quickViewProduct && (
        <QuickView product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      )}
    </section>
  );
}

// Brand Promise Section
function BrandPromise() {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1800&q=80"
          alt="Luxury brand"
          className="w-full h-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-primary" />
      </div>
      <div className="relative max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <TrendingUp size={40} className="text-gold mx-auto mb-6" />
          <h2 className="font-poppins font-black text-4xl md:text-5xl text-white mb-6 leading-tight">
            Crafted for the{" "}
            <span className="gold-text">Discerning Pakistani</span>
          </h2>
          <p className="font-inter text-white/50 text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
            At AS Collection, luxury is not a price tag — it's an experience.
            Every product is hand-selected or crafted to the highest standards,
            ensuring that when you wear AS, you wear confidence.
          </p>
          <Link to="/about" className="btn-outline-gold inline-flex items-center gap-2">
            Our Story <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <Layout>
      <Hero />
      <StatsStrip />
      <FeaturedCategories />
      <FeaturedProducts />
      <BrandPromise />
      <NewArrivals />
      <Reviews />
      <InstagramGallery />
    </Layout>
  );
}
