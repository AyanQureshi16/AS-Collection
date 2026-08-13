import { motion } from "framer-motion";
import { Eye, Edit, Copy, Trash2, MoreVertical } from "lucide-react";

export default function ActionButtons({ onView = () => {}, onEdit = () => {}, onDuplicate = () => {}, onDelete = () => {} }) {
  return (
    <div className="flex items-center gap-2">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onView}
        className="p-2 rounded-lg text-white/60 hover:text-blue-400 hover:bg-blue-500/10 transition-all duration-200"
        title="View product"
        aria-label="View product"
      >
        <Eye size={16} />
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onEdit}
        className="p-2 rounded-lg text-white/60 hover:text-gold hover:bg-gold/10 transition-all duration-200"
        title="Edit product"
        aria-label="Edit product"
      >
        <Edit size={16} />
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onDuplicate}
        className="p-2 rounded-lg text-white/60 hover:text-green-400 hover:bg-green-500/10 transition-all duration-200"
        title="Duplicate product"
        aria-label="Duplicate product"
      >
        <Copy size={16} />
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onDelete}
        className="p-2 rounded-lg text-white/60 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
        title="Delete product"
        aria-label="Delete product"
      >
        <Trash2 size={16} />
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200"
        title="More product actions"
        aria-label="More product actions"
      >
        <MoreVertical size={16} />
      </motion.button>
    </div>
  );
}
