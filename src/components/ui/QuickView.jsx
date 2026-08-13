import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Heart, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { normalizeProductStock } from "../../utils/productStorage";
import toast from "react-hot-toast";
import { useState } from "react";

export default function QuickView({ product, onClose }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0]);

  if (!product) return null;

  const stockValue = normalizeProductStock(product?.stock ?? product?.inventory ?? 0);

  const isOutOfStock = stockValue <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) {
      toast.error("This product is out of stock.", {
        style: { background: "#1a1a1a", color: "#fff" },
      });
      return;
    }

    const added = addToCart(product, selectedSize || product.sizes?.[0] || "", 1);
    if (!added) {
      toast.error("Only available stock is left in the cart.", {
        style: { background: "#1a1a1a", color: "#fff" },
      });
      return;
    }

    toast.success(`${product.name} added to cart!`, {
      style: { background: "#1a1a1a", color: "#fff", border: "1px solid rgba(212,175,55,0.3)" },
      iconTheme: { primary: "#D4AF37", secondary: "#0A0A0A" },
    });
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 200 }}
          className="bg-dark-50 border border-white/10 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="grid md:grid-cols-2">
            {/* Image */}
            <div className="h-80 md:h-full zoom-container rounded-l-2xl overflow-hidden bg-dark-100">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info */}
            <div className="p-6 relative">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1.5 text-white/40 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              <p className="text-white/40 text-xs font-inter capitalize mb-1">
                {product.category} / {product.subcategory}
              </p>
              <h2 className="font-poppins font-bold text-white text-xl mb-2">
                {product.name}
              </h2>

              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={13}
                      className={s <= Math.round(product.rating) ? "text-gold fill-gold" : "text-white/20"}
                    />
                  ))}
                </div>
                <span className="text-white/30 text-xs">({product.reviewCount} reviews)</span>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <span className="font-poppins font-bold text-gold text-2xl">
                  PKR {product.price.toLocaleString()}
                </span>
                {product.oldPrice && (
                  <span className="text-white/30 text-sm line-through">
                    PKR {product.oldPrice.toLocaleString()}
                  </span>
                )}
                {product.discount > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                    -{product.discount}%
                  </span>
                )}
              </div>

              <p className="text-white/50 text-sm font-inter leading-relaxed mb-5 line-clamp-3">
                {product.description}
              </p>

              {/* Sizes */}
              {product.sizes[0] !== "N/A" && product.sizes[0] !== "One Size" && (
                <div className="mb-5">
                  <p className="text-white/50 text-xs font-inter mb-2">Size: <span className="text-gold">{selectedSize}</span></p>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-poppins font-medium border transition-all ${
                          selectedSize === size
                            ? "bg-gold text-primary border-gold"
                            : "border-white/10 text-white/50 hover:border-gold/50"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <motion.button
                  whileHover={isOutOfStock ? undefined : { scale: 1.02 }}
                  whileTap={isOutOfStock ? undefined : { scale: 0.98 }}
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 ${
                    isOutOfStock
                      ? "bg-white/10 text-white/40 cursor-not-allowed"
                      : "btn-gold"
                  }`}
                >
                  <ShoppingBag size={16} />
                  {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleWishlist(product)}
                  className="p-3 border border-white/10 rounded-full hover:border-gold/30 transition-colors"
                >
                  <Heart
                    size={18}
                    className={isWishlisted(product.id) ? "text-red-400 fill-red-400" : "text-white/60"}
                  />
                </motion.button>
              </div>

              <Link
                to={`/product/${product.id}`}
                onClick={onClose}
                className="block text-center mt-4 text-gold/70 hover:text-gold text-sm font-inter underline underline-offset-2"
              >
                View Full Details →
              </Link>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
