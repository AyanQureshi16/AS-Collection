import { motion } from "framer-motion";
import { Package, Plus } from "lucide-react";

export default function EmptyState({ message = "No products found", onAdd = () => {} }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20"
    >
      <div className="w-24 h-24 rounded-2xl bg-gold/10 flex items-center justify-center mb-6 border border-gold/20">
        <Package size={48} className="text-gold" />
      </div>
      <h3 className="font-poppins font-semibold text-white text-xl mt-6 mb-2">
        {message}
      </h3>
      <p className="text-white/50 text-sm font-inter mb-6 max-w-md text-center">
        Get started by adding your first product to the catalog.
      </p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        id="add-product-btn-empty"
        onClick={onAdd}
        aria-label="Add product from empty state"
        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gold text-primary font-poppins font-semibold text-sm hover:bg-gold-light transition-all duration-200"
      >
        <Plus size={18} />
        Add Product
      </motion.button>
    </motion.div>
  );
}
