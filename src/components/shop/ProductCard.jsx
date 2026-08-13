import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Heart, Eye, ShoppingBag, Star } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { getProductStockStatus, normalizeProductStock } from "../../utils/productStorage";
import toast from "react-hot-toast";

export default function ProductCard({ product, onQuickView }) {
  const { addToCart, isInCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const normalizedProduct = product || {};
  const badges = Array.isArray(normalizedProduct.badges) ? normalizedProduct.badges : [];
  const images = Array.isArray(normalizedProduct.images) && normalizedProduct.images.length
    ? normalizedProduct.images
    : normalizedProduct.image
      ? [normalizedProduct.image]
      : [];
  const sizes = Array.isArray(normalizedProduct.sizes) && normalizedProduct.sizes.length
    ? normalizedProduct.sizes
    : ["N/A"];
  const productStock = normalizeProductStock(normalizedProduct?.stock ?? normalizedProduct?.inventory ?? 0);
  const stockStatus = getProductStockStatus(normalizedProduct);
  const isOutOfStock = productStock <= 0;
  const wishlisted = isWishlisted(normalizedProduct.id);
  const inCart = isInCart(normalizedProduct.id, sizes[0] || "");

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock) {
      toast.error("This product is out of stock.", {
        style: { background: "#1a1a1a", color: "#fff" },
      });
      return;
    }

    const added = addToCart(normalizedProduct, sizes[0] || "", 1);
    if (!added) {
      toast.error("Only available stock is left in the cart.", {
        style: { background: "#1a1a1a", color: "#fff" },
      });
      return;
    }

    toast.success(`${normalizedProduct.name} added to cart!`, {
      style: {
        background: "#1a1a1a",
        color: "#fff",
        border: "1px solid rgba(212,175,55,0.3)",
      },
      iconTheme: { primary: "#D4AF37", secondary: "#0A0A0A" },
    });
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(normalizedProduct);
    toast(wishlisted ? "Removed from wishlist" : "Added to wishlist!", {
      icon: wishlisted ? "💔" : "❤️",
      style: {
        background: "#1a1a1a",
        color: "#fff",
        border: "1px solid rgba(212,175,55,0.3)",
      },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ y: -4 }}
      className="group relative card-luxury"
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
        {badges.includes("Sale") && (
          <span className="bg-red-500 text-white text-[10px] font-poppins font-bold px-2 py-0.5 rounded-full">
            -{normalizedProduct.discount || 0}%
          </span>
        )}
        {badges.includes("New") && (
          <span className="bg-gold text-primary text-[10px] font-poppins font-bold px-2 py-0.5 rounded-full">
            NEW
          </span>
        )}
        {badges.includes("Best Seller") && (
          <span className="bg-white/10 backdrop-blur-md text-white text-[10px] font-poppins font-bold px-2 py-0.5 rounded-full border border-white/10">
            ⭐ BESTSELLER
          </span>
        )}
      </div>

      {/* Action buttons */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleWishlist}
          className={`w-8 h-8 rounded-full glass flex items-center justify-center transition-all ${
            wishlisted ? "text-red-400 border-red-400/30" : "text-white/60 gold-border"
          }`}
          aria-label="Toggle wishlist"
        >
          <Heart size={14} fill={wishlisted ? "currentColor" : "none"} />
        </motion.button>
        {onQuickView && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onQuickView(normalizedProduct);
            }}
            className="w-8 h-8 rounded-full glass gold-border flex items-center justify-center text-white/60 hover:text-gold transition-colors"
            aria-label="Quick view"
          >
            <Eye size={14} />
          </motion.button>
        )}
      </div>

      <Link to={`/product/${normalizedProduct.id}`} className="block">
        {/* Image */}
        <div className="zoom-container h-64 sm:h-72 bg-dark-50 overflow-hidden">
          <img
            src={images[0]}
            alt={normalizedProduct.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          {/* Hover overlay with second image */}
          {images[1] && (
            <img
              src={images[1]}
              alt={`${normalizedProduct.name} alternate`}
              className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            />
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-white/30 text-xs font-inter capitalize mb-1">
            {normalizedProduct.subcategory || normalizedProduct.category}
          </p>
          <h3 className="font-poppins font-semibold text-white text-sm line-clamp-2 mb-2 group-hover:text-gold transition-colors">
            {normalizedProduct.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={11}
                  className={s <= Math.round(normalizedProduct.rating || 0) ? "text-gold fill-gold" : "text-white/20"}
                />
              ))}
            </div>
            <span className="text-white/30 text-xs">({normalizedProduct.reviewCount || 0})</span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-poppins font-bold text-gold text-base">
                PKR {(normalizedProduct.price || 0).toLocaleString()}
              </span>
              {normalizedProduct.oldPrice && (
                <span className="font-inter text-white/30 text-xs line-through">
                  PKR {Number(normalizedProduct.oldPrice).toLocaleString()}
                </span>
              )}
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between text-[10px] uppercase tracking-[0.18em]">
            <span className={isOutOfStock ? "text-red-400" : stockStatus === "Limited Stock" ? "text-yellow-400" : "text-green-400"}>
              {stockStatus}
            </span>
          </div>
        </div>
      </Link>

      {/* Add to cart button — shows on hover */}
      <div className="px-4 pb-4">
        <motion.button
          whileHover={isOutOfStock ? undefined : { scale: 1.02 }}
          whileTap={isOutOfStock ? undefined : { scale: 0.98 }}
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`w-full py-2.5 rounded-xl font-poppins font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-300 ${
            isOutOfStock
              ? "bg-white/5 text-white/35 border border-white/10 cursor-not-allowed"
              : inCart
                ? "bg-gold/20 text-gold border border-gold/30"
                : "bg-white/5 hover:bg-gold hover:text-primary text-white border border-white/10 hover:border-transparent"
          }`}
        >
          <ShoppingBag size={15} />
          {isOutOfStock ? "Out of Stock" : inCart ? "In Cart" : "Add to Cart"}
        </motion.button>
      </div>
    </motion.div>
  );
}
