import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Heart, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useSettings } from "../../context/SettingsContext";
import { normalizeProductStock, getProductImages } from "../../utils/productStorage";
import toast from "react-hot-toast";
import { useState } from "react";

export default function QuickView({ product, onClose }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { settings } = useSettings();
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0]);
  const [selectedImage, setSelectedImage] = useState(0);
  
  const currencySymbol = settings?.currencySymbol || "₨";
  const currency = settings?.currency || "PKR";
  const lowStockThreshold = settings?.lowStockThreshold || 10;

  if (!product) return null;

  const images = getProductImages(product);
  const stockValue = normalizeProductStock(product?.stock ?? product?.inventory ?? 0);

  const isOutOfStock = stockValue <= 0;

  const handleAddToCart = () => {
    const isStoreClosed = settings?.storeStatus === "Closed";
    
    if (isStoreClosed) {
      toast.error("Store is currently closed. Purchasing is disabled.", {
        style: { background: "#1a1a1a", color: "#fff" },
      });
      return;
    }
    
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

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
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
          className="bg-surface border border-themed rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="grid md:grid-cols-2">
            {/* Image */}
            <div className="h-80 md:h-full zoom-container rounded-l-2xl overflow-hidden bg-surface relative">
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  src={images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>

              {/* +N badge */}
              {images.length > 1 && (
                <div className="absolute bottom-4 right-4 bg-primary/90 backdrop-blur-sm text-champagne text-[10px] font-inter tracking-widest uppercase px-2.5 py-1 border border-champagne/30">
                  +{images.length - 1}
                </div>
              )}

              {/* Navigation arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 glass flex items-center justify-center text-primary hover:text-champagne transition-colors"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={16} strokeWidth={1.5} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 glass flex items-center justify-center text-primary hover:text-champagne transition-colors"
                    aria-label="Next image"
                  >
                    <ChevronRight size={16} strokeWidth={1.5} />
                  </button>
                </>
              )}
            </div>

            {/* Info */}
            <div className="p-6 relative">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1.5 text-muted hover:text-primary transition-colors"
              >
                <X size={20} />
              </button>

              <p className="text-muted text-xs font-inter capitalize mb-1">
                {product.category} / {product.subcategory}
              </p>
              <h2 className="font-poppins font-bold text-primary text-xl mb-2">
                {product.name}
              </h2>

              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={13}
                      className={s <= Math.round(product.rating) ? "text-champagne fill-champagne" : "text-muted/20"}
                    />
                  ))}
                </div>
                <span className="text-muted/30 text-xs">({product.reviewCount} reviews)</span>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <span className="font-poppins font-bold text-champagne text-2xl">
                  {currencySymbol} {product.price.toLocaleString()}
                </span>
                {product.oldPrice && (
                  <span className="text-muted/30 text-sm line-through">
                    {currencySymbol} {product.oldPrice.toLocaleString()}
                  </span>
                )}
                {product.discount > 0 && (
                  <span className="bg-red-500 text-primary text-xs px-2 py-0.5 rounded-full font-bold">
                    -{product.discount}%
                  </span>
                )}
              </div>

              <p className="text-muted/50 text-sm font-inter leading-relaxed mb-5 line-clamp-3">
                {product.description}
              </p>

              {/* Sizes */}
              {product.sizes[0] !== "N/A" && product.sizes[0] !== "One Size" && (
                <div className="mb-5">
                  <p className="text-muted/50 text-xs font-inter mb-2">Size: <span className="text-champagne">{selectedSize}</span></p>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-poppins font-medium border transition-all ${
                          selectedSize === size
                            ? "bg-champagne text-primary border-champagne"
                            : "border-themed text-muted/50 hover:border-champagne/50"
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
                      ? "bg-themed text-muted/40 cursor-not-allowed"
                      : "btn-primary"
                  }`}
                >
                  <ShoppingBag size={16} />
                  {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleWishlist(product)}
                  className="p-3 border border-themed rounded-full hover:border-champagne/30 transition-colors"
                >
                  <Heart
                    size={18}
                    className={isWishlisted(product.id) ? "text-red-400 fill-red-400" : "text-muted/60"}
                  />
                </motion.button>
              </div>

              <Link
                to={`/product/${product.id}`}
                onClick={onClose}
                className="block text-center mt-4 text-champagne/70 hover:text-champagne text-sm font-inter underline underline-offset-2"
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
