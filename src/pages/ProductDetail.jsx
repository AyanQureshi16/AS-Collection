import { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag, Heart, ChevronLeft, ChevronRight,
  Minus, Plus, Truck, Shield, ChevronDown
} from "lucide-react";
import Layout from "../components/layout/Layout";
import ProductCard from "../components/shop/ProductCard";
import { getCustomerVisibleProducts, getRelatedProducts, normalizeProduct } from "../data/products";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useProducts } from "../context/ProductContext";
import { getProductStockStatus, normalizeProductStock } from "../utils/productStorage";
import toast from "react-hot-toast";

function Accordion({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-white/[0.06]">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left group"
        aria-expanded={open}
      >
        <span className="font-inter text-[11px] tracking-widest uppercase text-ivory group-hover:text-champagne transition-colors">
          {title}
        </span>
        <ChevronDown
          size={16}
          className={`text-muted transition-transform duration-400 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-6">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products } = useProducts();
  const activeProducts = useMemo(() => getCustomerVisibleProducts(products), [products]);
  const product = useMemo(() => {
    const found = activeProducts.find((item) => String(item.id) === String(id));
    return found ? normalizeProduct(found) : null;
  }, [activeProducts, id]);

  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const stockValue = normalizeProductStock(product?.stock ?? product?.inventory ?? 0);
  const stockStatus = getProductStockStatus(product);
  const isOutOfStock = stockValue <= 0;

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || "");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!product) return;
    setSelectedSize(product.sizes?.[0] || "");
    if (isOutOfStock) {
      setQuantity(1);
      return;
    }
    setQuantity((current) => Math.min(Math.max(1, current), stockValue || 1));
  }, [isOutOfStock, product, stockValue]);

  if (!product) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center pt-24">
          <div className="text-center">
            <h1 className="font-display text-3xl text-ivory mb-6">Product Not Found</h1>
            <Link to="/shop" className="btn-primary">Back to Collection</Link>
          </div>
        </div>
      </Layout>
    );
  }

  const relatedProducts = getRelatedProducts(product.id, product.category, products);
  const wishlisted = isWishlisted(product.id);
  const productSpecs = product.specifications || {};

  const handleAddToCart = () => {
    if (isOutOfStock) {
      toast.error("This product is out of stock.", { style: { background: "#111", color: "#F5F2EA" } });
      return;
    }
    const added = addToCart(product, selectedSize || product.sizes?.[0] || "", quantity);
    if (!added) {
      toast.error(`Only ${stockValue} item(s) available in stock.`, { style: { background: "#111", color: "#F5F2EA" } });
      return;
    }
    toast.success(`${product.name} added to cart!`, {
      style: { background: "#111", color: "#F5F2EA", border: "1px solid rgba(201,168,106,0.25)" },
      iconTheme: { primary: "#C9A86A", secondary: "#080808" },
    });
  };

  const handleBuyNow = () => {
    if (isOutOfStock) {
      toast.error("This product is out of stock.", { style: { background: "#111", color: "#F5F2EA" } });
      return;
    }
    const added = addToCart(product, selectedSize || product.sizes?.[0] || "", quantity);
    if (!added) {
      toast.error(`Only ${stockValue} item(s) available in stock.`, { style: { background: "#111", color: "#F5F2EA" } });
      return;
    }
    navigate("/cart");
  };

  return (
    <Layout>
      <div className="pt-28 pb-24 bg-ink">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-muted text-[10px] font-inter tracking-widest uppercase mb-12">
            <Link to="/" className="hover:text-champagne transition-colors">Home</Link>
            <span>/</span>
            <Link to="/shop" className="hover:text-champagne transition-colors">Collection</Link>
            <span>/</span>
            <span className="text-ivory/60 truncate max-w-[200px]">{product.name}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-12 xl:gap-20">
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="relative aspect-square overflow-hidden bg-surface"
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={selectedImage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    src={product.images[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>

                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 glass flex items-center justify-center text-ivory hover:text-champagne transition-colors"
                      aria-label="Previous image"
                    >
                      <ChevronLeft size={18} strokeWidth={1.5} />
                    </button>
                    <button
                      onClick={() => setSelectedImage((prev) => (prev + 1) % product.images.length)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 glass flex items-center justify-center text-ivory hover:text-champagne transition-colors"
                      aria-label="Next image"
                    >
                      <ChevronRight size={18} strokeWidth={1.5} />
                    </button>
                  </>
                )}
              </motion.div>

              {product.images.length > 1 && (
                <div className="flex gap-3">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`h-20 w-20 overflow-hidden border transition-all ${
                        selectedImage === i ? "border-champagne" : "border-white/[0.08] hover:border-white/20"
                      }`}
                    >
                      <img src={img} alt={`${product.name} view ${i + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.8 }}
              className="lg:py-4"
            >
              <p className="eyebrow mb-4 capitalize">{product.category}</p>
              <h1 className="font-display text-3xl sm:text-4xl xl:text-5xl text-ivory font-light leading-tight mb-6">
                {product.name}
              </h1>

              <div className="flex items-baseline gap-4 mb-8 pb-8 border-b border-white/[0.06]">
                <span className="font-inter text-2xl text-champagne">
                  PKR {product.price.toLocaleString()}
                </span>
                {product.oldPrice && (
                  <span className="font-inter text-muted line-through text-lg">
                    PKR {product.oldPrice.toLocaleString()}
                  </span>
                )}
              </div>

              <p className="font-inter text-muted text-sm leading-relaxed mb-8 line-clamp-3">
                {product.description}
              </p>

              <div className="flex items-center gap-2 mb-8">
                <div className={`w-1.5 h-1.5 rounded-full ${
                  stockStatus === "In Stock" ? "bg-green-400" : stockStatus === "Limited Stock" ? "bg-yellow-400" : "bg-muted"
                }`} />
                <span className="font-inter text-xs tracking-wider uppercase text-muted">{stockStatus}</span>
              </div>

              {product.sizes[0] !== "N/A" && (
                <div className="mb-6">
                  <p className="font-inter text-[10px] tracking-widest uppercase text-muted mb-3">
                    Size — <span className="text-ivory">{selectedSize}</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 text-xs font-inter border transition-all ${
                          selectedSize === size
                            ? "bg-champagne text-ink border-champagne"
                            : "border-white/[0.08] text-muted hover:border-champagne/40"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {product.colors[0] !== "N/A" && (
                <div className="mb-6">
                  <p className="font-inter text-[10px] tracking-widest uppercase text-muted mb-3">Colors</p>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <span key={color} className="px-3 py-1.5 text-xs font-inter text-muted border border-white/[0.08]">
                        {color}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-4 mb-8">
                <p className="font-inter text-[10px] tracking-widest uppercase text-muted">Quantity</p>
                <div className="flex items-center gap-4 border border-white/[0.08] px-4 py-2">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="text-muted hover:text-ivory disabled:opacity-40"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="font-inter text-sm text-ivory w-6 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(stockValue || 1, q + 1))}
                    disabled={isOutOfStock || quantity >= (stockValue || 1)}
                    className="text-muted hover:text-ivory disabled:opacity-40"
                    aria-label="Increase quantity"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mb-10">
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 font-inter text-[11px] tracking-widest uppercase ${
                    isOutOfStock ? "bg-surface text-muted cursor-not-allowed" : "btn-primary"
                  }`}
                >
                  <ShoppingBag size={16} strokeWidth={1.5} />
                  {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  className={`flex-1 py-4 font-inter text-[11px] tracking-widest uppercase ${
                    isOutOfStock ? "bg-surface text-muted cursor-not-allowed" : "btn-white"
                  }`}
                >
                  Buy Now
                </button>
                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-4 border transition-all ${
                    wishlisted ? "border-champagne/40 text-champagne" : "border-white/[0.08] text-muted hover:text-ivory"
                  }`}
                  aria-label="Toggle wishlist"
                >
                  <Heart size={18} strokeWidth={1.5} fill={wishlisted ? "currentColor" : "none"} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 py-6 border-t border-white/[0.06]">
                <div className="flex items-start gap-3">
                  <Truck size={16} strokeWidth={1.5} className="text-champagne mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-inter text-xs text-ivory">Free Delivery</p>
                    <p className="font-inter text-[11px] text-muted">Orders over PKR 5,000</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield size={16} strokeWidth={1.5} className="text-champagne mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-inter text-xs text-ivory">100% Authentic</p>
                    <p className="font-inter text-[11px] text-muted">Quality guaranteed</p>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <Accordion title="Details" defaultOpen>
                  <p className="font-inter text-muted text-sm leading-relaxed">{product.description}</p>
                </Accordion>
                <Accordion title="Specifications">
                  <table className="w-full">
                    <tbody>
                      {Object.entries(productSpecs).map(([key, val]) => (
                        <tr key={key} className="border-b border-white/[0.04]">
                          <td className="py-3 pr-6 font-inter text-[10px] tracking-wider uppercase text-muted w-2/5">{key}</td>
                          <td className="py-3 font-inter text-sm text-ivory/80">{val}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Accordion>
                <Accordion title="Shipping">
                  <div className="font-inter text-sm text-muted leading-relaxed space-y-3">
                    <p>Free nationwide delivery on orders over PKR 5,000. Standard delivery within 3–5 business days across Pakistan.</p>
                    <p>All orders are securely packaged and insured. WhatsApp order confirmation available for instant support.</p>
                  </div>
                </Accordion>
              </div>
            </motion.div>
          </div>

          {product.images[1] && (
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mt-24 md:mt-32 relative h-[50vh] md:h-[70vh] overflow-hidden"
            >
              <img src={product.images[1]} alt={`${product.name} detail`} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/20" />
            </motion.div>
          )}

          {relatedProducts.length > 0 && (
            <div className="mt-24 md:mt-32">
              <p className="eyebrow mb-4">You May Also Like</p>
              <h2 className="font-display text-3xl text-ivory font-light mb-12">Related Timepieces</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
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
