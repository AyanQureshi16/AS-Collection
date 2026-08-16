import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useSettings } from "../../context/SettingsContext";
import { getProductStockStatus, normalizeProductStock } from "../../utils/productStorage";
import toast from "react-hot-toast";

export default function ProductCard({ product, onQuickView, variant = "default" }) {
  const { addToCart, isInCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { settings } = useSettings();
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
  const lowStockThreshold = settings?.lowStockThreshold || 10;
  const stockStatus = getProductStockStatus(normalizedProduct, lowStockThreshold);
  const isOutOfStock = productStock <= 0;
  const wishlisted = isWishlisted(normalizedProduct.id);
  const inCart = isInCart(normalizedProduct.id, sizes[0] || "");
  
  const currencySymbol = settings?.currencySymbol || "₨";
  const currency = settings?.currency || "PKR";
  const isStoreClosed = settings?.storeStatus === "Closed";

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isStoreClosed) {
      toast.error("Store is currently closed. Purchasing is disabled.", { style: { background: "#111", color: "#F5F2EA" } });
      return;
    }
    if (isOutOfStock) {
      toast.error("This product is out of stock.", { style: { background: "#111", color: "#F5F2EA" } });
      return;
    }
    const added = addToCart(normalizedProduct, sizes[0] || "", 1);
    if (!added) {
      toast.error("Only available stock is left in the cart.", { style: { background: "#111", color: "#F5F2EA" } });
      return;
    }
    toast.success(`${normalizedProduct.name} added to cart!`, {
      style: { background: "#111", color: "#F5F2EA", border: "1px solid rgba(201,168,106,0.25)" },
      iconTheme: { primary: "#C9A86A", secondary: "#080808" },
    });
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(normalizedProduct);
    toast(wishlisted ? "Removed from wishlist" : "Added to wishlist!", {
      style: { background: "#111", color: "#F5F2EA", border: "1px solid rgba(201,168,106,0.25)" },
    });
  };

  const isFeatured = variant === "featured";
  const isCompact = variant === "compact";

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="group relative"
    >
      <Link to={`/product/${normalizedProduct.id}`} className="block">
        {/* Image container */}
        <div
          className="relative overflow-hidden bg-surface aspect-[4/5]"
        >
          <img
            src={images[0]}
            alt={normalizedProduct.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />

          {images[1] && (
            <img
              src={images[1]}
              alt={`${normalizedProduct.name} alternate view`}
              className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              loading="lazy"
            />
          )}

          {/* Dark overlay on hover */}
          <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/30 transition-colors duration-400" />

          {/* View Watch label */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-400">
            <span className="font-inter text-[10px] tracking-[0.35em] uppercase text-primary border border-primary/40 px-6 py-3">
              View Watch
            </span>
          </div>

          {/* Badges — minimal */}
          {(badges.includes("New") || badges.includes("Sale")) && (
            <div className="absolute top-4 left-4 flex gap-2">
              {badges.includes("New") && (
                <span className="bg-champagne text-ink text-[9px] font-inter tracking-widest uppercase px-3 py-1">
                  New
                </span>
              )}
              {badges.includes("Sale") && (
                <span className="bg-primary/10 backdrop-blur text-primary text-[9px] font-inter tracking-widest uppercase px-3 py-1 border border-themed">
                  Sale
                </span>
              )}
            </div>
          )}

          {/* Wishlist */}
          <button
            onClick={handleWishlist}
            className={`absolute top-4 right-4 p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 ${
              wishlisted ? "opacity-100 text-champagne" : "text-primary/70 hover:text-champagne"
            }`}
            aria-label="Toggle wishlist"
          >
            <Heart size={16} strokeWidth={1.5} fill={wishlisted ? "currentColor" : "none"} />
          </button>
        </div>

        {/* Product info — shifts up slightly on hover */}
        <div className="pt-5 pb-2 transition-transform duration-400 group-hover:-translate-y-1">
          <p className="font-inter text-[10px] tracking-widest uppercase text-muted mb-2 capitalize">
            {normalizedProduct.subcategory || normalizedProduct.category}
          </p>
          <h3 className="font-display text-lg md:text-xl text-primary font-light leading-snug mb-2 group-hover:text-champagne transition-colors duration-400">
            {normalizedProduct.name}
          </h3>
          <div className="flex items-baseline gap-3">
            <span className="font-inter text-sm text-champagne">
              {currencySymbol} {(normalizedProduct.price || 0).toLocaleString()}
            </span>
            {normalizedProduct.oldPrice && (
              <span className="font-inter text-xs text-muted line-through">
                {currencySymbol} {Number(normalizedProduct.oldPrice).toLocaleString()}
              </span>
            )}
          </div>
          {!isCompact && (
            <p className={`font-inter text-[10px] tracking-wider uppercase mt-2 ${
              isOutOfStock ? "text-red-400/80" : stockStatus === "Limited Stock" ? "text-yellow-500/80" : "text-muted/60"
            }`}>
              {stockStatus}
            </p>
          )}
        </div>
      </Link>

      {/* Add to cart — appears on hover */}
      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-400">
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock || isStoreClosed}
          className={`w-full py-3 font-inter text-[10px] tracking-widest uppercase flex items-center justify-center gap-2 transition-all duration-300 border ${
            isOutOfStock || isStoreClosed
              ? "border-white/[0.06] text-muted/40 cursor-not-allowed"
              : inCart
                ? "border-champagne/30 text-champagne bg-champagne/5"
                : "border-white/[0.08] text-ivory hover:bg-champagne hover:text-ink hover:border-champagne"
          }`}
        >
          <ShoppingBag size={13} strokeWidth={1.5} />
          {isStoreClosed ? "Store Closed" : isOutOfStock ? "Out of Stock" : inCart ? "In Cart" : "Add to Cart"}
        </button>
      </div>
    </motion.article>
  );
}
