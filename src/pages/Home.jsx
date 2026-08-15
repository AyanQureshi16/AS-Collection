import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Crosshair, Gem, Layers, Sparkles } from "lucide-react";
import Layout from "../components/layout/Layout";
import Hero from "../components/home/Hero";
import FeaturedCategories from "../components/home/FeaturedCategories";
import FeaturedProducts from "../components/home/FeaturedProducts";
import BrandStory from "../components/home/BrandStory";
import BrandMarquee from "../components/home/BrandMarquee";
import Reviews from "../components/home/Reviews";
import InstagramGallery from "../components/home/InstagramGallery";
import ProductCard from "../components/shop/ProductCard";
import QuickView from "../components/ui/QuickView";
import { useProducts } from "../context/ProductContext";
import { getNewCustomerProducts } from "../data/products";
import { useLuxuryMotion } from "../utils/motion";

function WhyZelmior() {
  const { fadeUp, transition } = useLuxuryMotion();

  const benefits = [
    { icon: Crosshair, title: "Precision", description: "Engineered with meticulous attention to detail and accuracy." },
    { icon: Gem, title: "Timeless Design", description: "Aesthetic restraint that transcends seasonal trends." },
    { icon: Layers, title: "Crafted Detail", description: "Every component selected for quality and enduring beauty." },
    { icon: Sparkles, title: "Confident Style", description: "A timepiece that reflects ambition and appreciation for quality." },
  ];

  return (
    <section className="py-28 md:py-36 bg-surface border-y border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          {...fadeUp}
          transition={transition}
          viewport={{ once: true }}
          className="text-center mb-16 md:mb-20"
        >
          <p className="eyebrow mb-4">Why ZELMIOR</p>
          <h2 className="section-title">Built to Endure</h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {benefits.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="text-center lg:text-left"
              >
                <Icon size={20} strokeWidth={1.5} className="text-champagne mx-auto lg:mx-0 mb-5" />
                <h3 className="font-display text-xl text-ivory font-light mb-3">{item.title}</h3>
                <p className="font-inter text-sm text-muted leading-relaxed">{item.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function NewArrivals() {
  const { products } = useProducts();
  const visibleProducts = useMemo(() => getNewCustomerProducts(products).slice(0, 4), [products]);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const { fadeUp, transition } = useLuxuryMotion();

  if (!visibleProducts.length) return null;

  return (
    <section className="py-28 md:py-36 bg-ink">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          {...fadeUp}
          transition={transition}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-16 gap-4"
        >
          <div>
            <p className="eyebrow mb-4">Just Arrived</p>
            <h2 className="section-title">New Arrivals</h2>
          </div>
          <Link
            to="/shop?sort=new"
            className="group inline-flex items-center gap-2 font-inter text-[11px] tracking-widest uppercase text-champagne link-underline pb-1"
          >
            View All
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-400" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} onQuickView={setQuickViewProduct} />
          ))}
        </div>
      </div>

      {quickViewProduct && (
        <QuickView product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      )}
    </section>
  );
}

export default function Home() {
  return (
    <Layout>
      <Hero />
      <BrandMarquee />
      <FeaturedCategories />
      <FeaturedProducts />
      <BrandStory />
      <WhyZelmior />
      <NewArrivals />
      <Reviews />
      <InstagramGallery />
    </Layout>
  );
}
