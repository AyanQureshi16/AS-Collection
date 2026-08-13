import { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag, Heart, Star, ChevronLeft, ChevronRight,
  Minus, Plus, Share2, ArrowLeft, Check, Truck, Shield
} from "lucide-react";
import Layout from "../components/layout/Layout";
import ProductCard from "../components/shop/ProductCard";
import { getCustomerVisibleProducts, getRelatedProducts, normalizeProduct } from "../data/products";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useProducts } from "../context/ProductContext";
import { getProductStockStatus, normalizeProductStock } from "../utils/productStorage";
import toast from "react-hot-toast";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products } = useProducts();
  const activeProducts = useMemo(() => getCustomerVisibleProducts(products), [products]);
  const product = useMemo(
    () => {
      const found = activeProducts.find((item) => String(item.id) === String(id));
      return found ? normalizeProduct(found) : null;
    },
    [activeProducts, id]
  );

  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const stockValue = normalizeProductStock(product?.stock ?? product?.inventory ?? 0);
  const stockStatus = getProductStockStatus(product);
  const isOutOfStock = stockValue <= 0;

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || "");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [zoomed, setZoomed] = useState(false);

  useEffect(() => {
    if (!product) return;
    if (isOutOfStock) {
      setQuantity(1);
      return;
    }
    setQuantity((current) => Math.min(Math.max(1, current), stockValue || 1));
  }, [isOutOfStock, product, stockValue]);

  if (!product) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-poppins font-bold text-white text-3xl mb-4">
              Product Not Found
            </h1>
            <Link to="/shop" className="btn-gold">Back to Shop</Link>
          </div>
        </div>
      </Layout>
    );
  }

  const relatedProducts = getRelatedProducts(product.id, product.category, products);
  const wishlisted = isWishlisted(product.id);
  const badges = Array.isArray(product.badges) ? product.badges : [];
  const productSpecs = product.specifications || {};

  const handleAddToCart = () => {
    if (isOutOfStock) {
      toast.error("This product is out of stock.", {
        style: { background: "#1a1a1a", color: "#fff" },
      });
      return;
    }

    const added = addToCart(product, selectedSize || product.sizes?.[0] || "", quantity);
    if (!added) {
      toast.error(`Only ${stockValue} item(s) available in stock.`, {
        style: { background: "#1a1a1a", color: "#fff" },
      });
      return;
    }

    toast.success(`${product.name} added to cart!`, {
      style: { background: "#1a1a1a", color: "#fff", border: "1px solid rgba(212,175,55,0.3)" },
      iconTheme: { primary: "#D4AF37", secondary: "#0A0A0A" },
    });
  };

  const handleBuyNow = () => {
    if (isOutOfStock) {
      toast.error("This product is out of stock.", {
        style: { background: "#1a1a1a", color: "#fff" },
      });
      return;
    }

    const added = addToCart(product, selectedSize || product.sizes?.[0] || "", quantity);
    if (!added) {
      toast.error(`Only ${stockValue} item(s) available in stock.`, {
        style: { background: "#1a1a1a", color: "#fff" },
      });
      return;
    }

    navigate("/cart");
  };

  return (
    <Layout>
      <div className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-white/30 text-sm font-inter mb-8">
            <Link to="/" className="hover:text-gold transition-colors">Home</Link>
            <span>/</span>
            <Link to="/shop" className="hover:text-gold transition-colors">Shop</Link>
            <span>/</span>
            <Link to={`/shop?category=${product.category}`} className="hover:text-gold transition-colors capitalize">
              {product.category}
            </Link>
            <span>/</span>
            <span className="text-white/60 truncate max-w-xs">{product.name}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-12 xl:gap-20">
            {/* ─── Left: Image Gallery ──────────── */}
            <div className="space-y-4">
              {/* Main image */}
              <div
                className="relative h-[500px] rounded-2xl overflow-hidden bg-dark-50 cursor-zoom-in"
                onClick={() => setZoomed(!zoomed)}
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={selectedImage}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: zoomed ? 1.15 : 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    src={product.images[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>

                {/* Navigation arrows */}
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length); }}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 glass rounded-full flex items-center justify-center text-white hover:text-gold transition-colors"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedImage((prev) => (prev + 1) % product.images.length); }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 glass rounded-full flex items-center justify-center text-white hover:text-gold transition-colors"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </>
                )}

                {/* Zoom hint */}
                <div className="absolute bottom-3 right-3 text-white/30 text-xs font-inter">
                  {zoomed ? "Click to unzoom" : "Click to zoom"}
                </div>

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {badges.includes("Sale") && (
                    <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      -{product.discount || 0}% OFF
                    </span>
                  )}
                  {badges.includes("New") && (
                    <span className="bg-gold text-primary text-xs font-bold px-3 py-1 rounded-full">
                      NEW ARRIVAL
                    </span>
                  )}
                </div>
              </div>

              {/* Thumbnails */}
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`h-20 w-20 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === i ? "border-gold" : "border-white/10 hover:border-white/30"
                    }`}
                  >
                    <img src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* ─── Right: Product Info ──────────── */}
            <div className="py-2">
              {/* Category */}
              <p className="text-white/30 text-xs font-inter uppercase tracking-widest mb-2 capitalize">
                {product.category} · {product.subcategory}
              </p>

              <h1 className="font-poppins font-bold text-white text-2xl sm:text-3xl xl:text-4xl leading-tight mb-4">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-5">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={16} className={s <= Math.round(product.rating) ? "text-gold fill-gold" : "text-white/20"} />
                  ))}
                </div>
                <span className="font-poppins font-semibold text-gold">{product.rating}</span>
                <span className="text-white/30 text-sm">({product.reviewCount} reviews)</span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/5">
                <span className="font-poppins font-black text-gold text-3xl">
                  PKR {product.price.toLocaleString()}
                </span>
                {product.oldPrice && (
                  <>
                    <span className="text-white/30 text-lg line-through">
                      PKR {product.oldPrice.toLocaleString()}
                    </span>
                    <span className="bg-red-500/20 text-red-400 text-sm font-bold px-2 py-0.5 rounded-full border border-red-500/20">
                      Save PKR {(product.oldPrice - product.price).toLocaleString()}
                    </span>
                  </>
                )}
              </div>

              {/* Stock */}
              <div className="flex items-center gap-2 mb-5">
                <div className={`w-2 h-2 rounded-full ${stockStatus === "In Stock" ? "bg-green-400" : stockStatus === "Limited Stock" ? "bg-yellow-400" : "bg-white/30"}`} />
                <span className={`text-sm font-inter ${stockStatus === "In Stock" ? "text-green-400" : stockStatus === "Limited Stock" ? "text-yellow-400" : "text-white/50"}`}>
                  {stockStatus}
                </span>
              </div>

              {/* Size selector */}
              {product.sizes[0] !== "N/A" && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-poppins font-semibold text-white text-sm">
                      Size: <span className="text-gold">{selectedSize}</span>
                    </p>
                    <Link to="/shop" className="text-white/30 text-xs hover:text-gold">Size Guide</Link>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 rounded-xl text-sm font-poppins font-medium border transition-all ${
                          selectedSize === size
                            ? "bg-gold text-primary border-gold"
                            : "border-white/10 text-white/60 hover:border-gold/40"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Colors */}
              {product.colors[0] !== "N/A" && (
                <div className="mb-6">
                  <p className="font-poppins font-semibold text-white text-sm mb-3">
                    Available Colors:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <span
                        key={color}
                        className="px-3 py-1.5 rounded-lg text-xs font-inter text-white/50 border border-white/10"
                      >
                        {color}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="flex items-center gap-4 mb-6">
                <p className="font-poppins font-semibold text-white text-sm">Quantity:</p>
                <div className="flex items-center gap-3 glass rounded-xl px-4 py-2 gold-border">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="text-white/40 hover:text-white transition-colors disabled:opacity-50"
                    aria-label="Decrease quantity"
                    disabled={quantity <= 1}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="font-poppins font-bold text-white w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(stockValue || 1, q + 1))}
                    className="text-white/40 hover:text-white transition-colors disabled:opacity-50"
                    aria-label="Increase quantity"
                    disabled={isOutOfStock || quantity >= (stockValue || 1)}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex gap-3 mb-6">
                <motion.button
                  whileHover={isOutOfStock ? undefined : { scale: 1.02 }}
                  whileTap={isOutOfStock ? undefined : { scale: 0.98 }}
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 ${
                    isOutOfStock ? "bg-white/10 text-white/35 cursor-not-allowed" : "btn-gold"
                  }`}
                >
                  <ShoppingBag size={18} />
                  {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                </motion.button>
                <motion.button
                  whileHover={isOutOfStock ? undefined : { scale: 1.02 }}
                  whileTap={isOutOfStock ? undefined : { scale: 0.98 }}
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 ${
                    isOutOfStock ? "bg-white/10 text-white/35 cursor-not-allowed" : "btn-white"
                  }`}
                >
                  Buy Now
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleWishlist(product)}
                  className={`p-4 border rounded-2xl transition-all ${
                    wishlisted
                      ? "border-red-400/30 bg-red-400/10 text-red-400"
                      : "border-white/10 text-white/50 hover:border-white/30"
                  }`}
                >
                  <Heart size={18} fill={wishlisted ? "currentColor" : "none"} />
                </motion.button>
              </div>

              {/* Trust Signals */}
              <div className="grid grid-cols-2 gap-3 p-4 glass rounded-2xl gold-border">
                <div className="flex items-center gap-2">
                  <Truck size={16} className="text-gold flex-shrink-0" />
                  <div>
                    <p className="text-white text-xs font-poppins font-semibold">Free Delivery</p>
                    <p className="text-white/30 text-xs">Orders over PKR 5,000</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Shield size={16} className="text-gold flex-shrink-0" />
                  <div>
                    <p className="text-white text-xs font-poppins font-semibold">100% Authentic</p>
                    <p className="text-white/30 text-xs">Quality guaranteed</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={16} className="text-gold flex-shrink-0" />
                  <div>
                    <p className="text-white text-xs font-poppins font-semibold">Easy Returns</p>
                    <p className="text-white/30 text-xs">Within 7 days</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Share2 size={16} className="text-gold flex-shrink-0" />
                  <div>
                    <p className="text-white text-xs font-poppins font-semibold">WhatsApp Order</p>
                    <p className="text-white/30 text-xs">Instant confirmation</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ─── Tabs: Description / Specs / Reviews ─── */}
          <div className="mt-16">
            <div className="flex border-b border-white/10 mb-8">
              {["description", "specifications", "reviews"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 font-poppins font-semibold text-sm capitalize transition-all border-b-2 ${
                    activeTab === tab
                      ? "border-gold text-gold"
                      : "border-transparent text-white/40 hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                {activeTab === "description" && (
                  <div className="max-w-3xl">
                    <p className="font-inter text-white/60 text-base leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                )}

                {activeTab === "specifications" && (
                  <div className="max-w-2xl">
                    <table className="w-full">
                      <tbody>
                        {Object.entries(productSpecs).map(([key, val]) => (
                          <tr key={key} className="border-b border-white/5">
                            <td className="py-3 pr-6 font-poppins font-semibold text-white/50 text-sm w-1/3">
                              {key}
                            </td>
                            <td className="py-3 font-inter text-white/80 text-sm">{val}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div className="space-y-6 max-w-3xl">
                    {/* Summary */}
                    <div className="glass gold-border rounded-2xl p-6 flex items-center gap-6">
                      <div className="text-center">
                        <div className="font-poppins font-black text-gold text-5xl">
                          {product.rating}
                        </div>
                        <div className="flex justify-center mt-1">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} size={14} className={s <= Math.round(product.rating) ? "text-gold fill-gold" : "text-white/20"} />
                          ))}
                        </div>
                        <p className="text-white/30 text-xs mt-1">{product.reviewCount} reviews</p>
                      </div>
                      <div className="flex-1 space-y-2">
                        {[5, 4, 3, 2, 1].map((stars) => (
                          <div key={stars} className="flex items-center gap-3">
                            <span className="text-white/30 text-xs w-4">{stars}</span>
                            <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gold rounded-full"
                                style={{
                                  width: `${stars === 5 ? 70 : stars === 4 ? 20 : stars === 3 ? 7 : stars === 2 ? 2 : 1}%`,
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <p className="text-white/30 font-inter text-sm text-center">
                      Reviews from verified buyers across Pakistan.
                    </p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ─── Related Products ─── */}
          {relatedProducts.length > 0 && (
            <div className="mt-20">
              <h2 className="font-poppins font-bold text-white text-2xl mb-8">
                You Might Also <span className="gold-text">Like</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {relatedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
