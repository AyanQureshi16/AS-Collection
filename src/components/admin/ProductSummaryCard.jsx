import { useMemo } from "react";
import { motion } from "framer-motion";
import { Package, Star, Archive, AlertCircle } from "lucide-react";
import { useProducts } from "../../context/ProductContext";

export default function ProductSummaryCard() {
  const { products } = useProducts();

  const stats = useMemo(() => {
    const totalProducts = products.length;
    const featuredCount = products.filter((p) => p.featured).length;
    const draftCount = products.filter((p) => p.status === "Draft").length;
    const outOfStockCount = products.filter((p) => p.status === "Out of Stock" || p.stock === 0).length;

    return [
      { label: "Total Products", value: String(totalProducts), icon: Package, color: "text-gold" },
      { label: "Featured", value: String(featuredCount), icon: Star, color: "text-yellow-400" },
      { label: "Draft", value: String(draftCount), icon: Archive, color: "text-gray-400" },
      { label: "Out of Stock", value: String(outOfStockCount), icon: AlertCircle, color: "text-red-400" },
    ];
  }, [products]);

  const categoryCount = useMemo(() => {
    const uniqueCategories = new Set(products.map((p) => p.category));
    return uniqueCategories.size;
  }, [products]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass gold-border rounded-2xl p-6"
    >
      <h3 className="font-poppins font-semibold text-white text-lg mb-4">
        Product Summary
      </h3>
      <div className="space-y-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-white/5 ${stat.color}`}>
                  <Icon size={20} />
                </div>
                <span className="font-inter text-white/70 text-sm">{stat.label}</span>
              </div>
              <span className="font-poppins font-bold text-white text-lg">{stat.value}</span>
            </div>
          );
        })}
      </div>
      <div className="mt-6 pt-4 border-t border-white/5">
        <div className="flex items-center justify-between">
          <span className="font-inter text-white/50 text-xs">Categories</span>
          <span className="font-poppins font-semibold text-gold text-sm">{categoryCount}</span>
        </div>
      </div>
    </motion.div>
  );
}
