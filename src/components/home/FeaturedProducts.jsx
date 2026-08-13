import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import ProductCard from "../shop/ProductCard";
import { getFeaturedCustomerProducts } from "../../data/products";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import QuickView from "../ui/QuickView";
import { useProducts } from "../../context/ProductContext";

export default function FeaturedProducts() {
  const { products } = useProducts();
  const featuredProducts = getFeaturedCustomerProducts(products);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  if (!featuredProducts.length) return null;

  return (
    <section className="py-20 section-glow">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4"
        >
          <div>
            <p className="text-gold font-inter text-xs tracking-[0.3em] uppercase mb-3">
              Bestsellers
            </p>
            <h2 className="section-title">
              Featured <span className="gold-text">Products</span>
            </h2>
          </div>
          <Link
            to="/shop"
            className="flex items-center gap-2 text-gold/70 hover:text-gold font-inter text-sm transition-colors group"
          >
            View All
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Swiper */}
        <Swiper
          modules={[Autoplay, Navigation, Pagination]}
          spaceBetween={20}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true }}
          breakpoints={{
            480: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
          className="pb-12"
        >
          {featuredProducts.map((product) => (
            <SwiperSlide key={product.id}>
              <ProductCard product={product} onQuickView={setQuickViewProduct} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {quickViewProduct && (
        <QuickView
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </section>
  );
}
