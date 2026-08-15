import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import ProductCard from "../shop/ProductCard";
import { getFeaturedCustomerProducts } from "../../data/products";
import { useState } from "react";
import QuickView from "../ui/QuickView";
import { useProducts } from "../../context/ProductContext";
import { useLuxuryMotion } from "../../utils/motion";

export default function FeaturedProducts() {
  const { products } = useProducts();
  const featuredProducts = getFeaturedCustomerProducts(products);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const { fadeUp, transition } = useLuxuryMotion();

  if (!featuredProducts.length) return null;

  const [hero, ...rest] = featuredProducts;
  const sideProducts = rest.slice(0, 2);

  return (
    <section className="py-28 md:py-36 bg-ink">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial header */}
        <motion.div
          {...fadeUp}
          transition={transition}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-20 gap-6"
        >
          <div>
            <p className="eyebrow mb-4">Curated Selection</p>
            <h2 className="section-title leading-[1.05]">
              THE ZELMIOR<br />
              <span className="italic font-normal text-champagne">COLLECTION</span>
            </h2>
            <p className="font-inter text-muted text-sm md:text-base mt-4 max-w-md">
              Designed for every defining moment.
            </p>
          </div>
          <Link
            to="/shop"
            className="group inline-flex items-center gap-2 font-inter text-[11px] tracking-widest uppercase text-champagne link-underline pb-1 self-start md:self-auto"
          >
            View All
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-400" />
          </Link>
        </motion.div>

        {/* Editorial asymmetric layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
          {/* Large featured — 60% */}
          <div className="lg:col-span-3">
            <ProductCard product={hero} onQuickView={setQuickViewProduct} variant="featured" />
          </div>

          {/* Two stacked — 40% */}
          <div className="lg:col-span-2 flex flex-col gap-6 lg:gap-8">
            {sideProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={setQuickViewProduct}
                variant="compact"
              />
            ))}
          </div>
        </div>

        {/* Remaining products in horizontal scroll on mobile, grid on desktop */}
        {rest.length > 2 && (
          <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
            {rest.slice(2, 6).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={setQuickViewProduct}
              />
            ))}
          </div>
        )}
      </div>

      {quickViewProduct && (
        <QuickView product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      )}
    </section>
  );
}
