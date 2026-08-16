import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, AlertTriangle } from "lucide-react";
import Layout from "../components/layout/Layout";
import { useCart } from "../context/CartContext";
import { useSettings } from "../context/SettingsContext";
import { useProducts } from "../context/ProductContext";
import { normalizeProductStock } from "../utils/productStorage";
import toast from "react-hot-toast";

const SHIPPING = 0;

export default function Cart() {
  const { cartItems, cartSubtotal, updateQuantity, removeFromCart, clearCart, getAvailableStock } = useCart();
  const { settings } = useSettings();
  const { products } = useProducts();
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [stockIssues, setStockIssues] = useState([]);
  
  const currencySymbol = settings?.currencySymbol || "₨";
  const currency = settings?.currency || "PKR";
  const isStoreClosed = settings?.storeStatus === "Closed";

  const grandTotal = cartSubtotal - couponDiscount + SHIPPING;

  // Check for stale cart items on mount
  useEffect(() => {
    const issues = [];
    cartItems.forEach((item) => {
      const availableStock = getAvailableStock(item);
      if (item.quantity > availableStock) {
        issues.push({
          item,
          availableStock,
          requestedQuantity: item.quantity
        });
      }
    });
    setStockIssues(issues);
  }, [cartItems, getAvailableStock]);

  const handleStockIssue = (item, availableStock) => {
    updateQuantity(item.id, item.selectedSize, availableStock);
    toast.success(`Quantity adjusted to available stock (${availableStock})`, {
      style: { background: "#1a1a1a", color: "#fff" },
    });
  };

  const handleRemove = (id, size) => {
    removeFromCart(id, size);
    toast("Item removed from cart", {
      icon: "🗑️",
      style: { background: "#1a1a1a", color: "#fff", border: "1px solid rgba(255,255,255,0.1)" },
    });
  };

  const handleCoupon = (e) => {
    e.preventDefault();
    if (couponCode.toLowerCase() === "as10") {
      const discount = Math.round(cartSubtotal * 0.1);
      setCouponDiscount(discount);
      setCouponApplied(true);
      toast.success("Coupon AS10 applied! 10% off", {
        style: { background: "#1a1a1a", color: "#fff", border: "1px solid rgba(212,175,55,0.3)" },
        iconTheme: { primary: "#D4AF37", secondary: "#0A0A0A" },
      });
    } else {
      toast.error("Invalid coupon code", {
        style: { background: "#1a1a1a", color: "#fff" },
      });
    }
  };

  if (cartItems.length === 0) {
    return (
      <Layout>
        <div className="pt-32 pb-24 min-h-screen flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md mx-auto px-4"
          >
            <div className="text-8xl mb-8">🛍️</div>
            <h1 className="font-playfair font-black text-white text-4xl mb-4">Your Cart is Empty</h1>
            <p className="font-inter text-white/50 text-lg mb-10 leading-relaxed">
              Looks like you haven't added anything yet. Start shopping our luxury collection.
            </p>
            <Link to="/shop" className="btn-gold inline-flex items-center gap-2">
              <ShoppingBag size={18} />
              Shop Now
            </Link>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
            <h1 className="font-playfair font-black text-4xl md:text-5xl text-white mb-4">
              Shopping <span className="gold-text">Cart</span>
            </h1>
            <p className="text-white/40 font-inter text-sm">
              {cartItems.length} item{cartItems.length !== 1 ? "s" : ""} in your cart
            </p>
          </motion.div>

          {/* Stock issues warning */}
          {stockIssues.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30"
            >
              <div className="flex items-start gap-3">
                <AlertTriangle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-red-400 font-inter text-sm font-semibold mb-2">
                    Stock has changed since you added these items:
                  </p>
                  <div className="space-y-2">
                    {stockIssues.map((issue, index) => (
                      <div key={index} className="flex items-center justify-between text-white/80 text-xs">
                        <span>{issue.item.name}</span>
                        <span className="text-red-400">
                          {issue.requestedQuantity} → {issue.availableStock} available
                        </span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      stockIssues.forEach((issue) => {
                        handleStockIssue(issue.item, issue.availableStock);
                      });
                      setStockIssues([]);
                    }}
                    className="mt-3 px-4 py-2 bg-red-500/20 text-red-400 text-xs font-inter rounded-lg hover:bg-red-500/30 transition-colors"
                  >
                    Adjust Quantities to Available Stock
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-5">
              {cartItems.map((item, i) => {
                const sizeLabel = item.selectedSize ? `Size: ${item.selectedSize}` : "No size selected";

                return (
                  <motion.div
                    key={`${item.id}-${item.selectedSize || "default"}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="glass gold-border rounded-2xl p-5 sm:p-6 flex gap-5"
                  >
                    <Link to={`/product/${item.id}`} className="flex-shrink-0">
                      <div className="w-24 h-28 sm:w-28 sm:h-32 rounded-xl overflow-hidden bg-charcoal">
                        <img src={item.image || item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                    </Link>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <Link to={`/product/${item.id}`}>
                            <h3 className="font-playfair font-semibold text-white text-base sm:text-lg hover:text-gold transition-colors line-clamp-2">
                              {item.name}
                            </h3>
                          </Link>
                          <p className="text-white/30 text-xs font-inter mt-2">{sizeLabel}</p>
                        </div>
                        <button
                          onClick={() => handleRemove(item.id, item.selectedSize)}
                          className="text-white/20 hover:text-red-400 transition-colors flex-shrink-0 p-1.5"
                          aria-label="Remove item"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-5">
                        <div className="flex items-center gap-3 glass rounded-xl px-4 py-2 border border-white/10">
                          <button
                            onClick={() => updateQuantity(item.id, item.selectedSize, Number(item.quantity) - 1)}
                            className="text-white/40 hover:text-white transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="font-poppins font-bold text-white text-sm w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.selectedSize, Number(item.quantity) + 1)}
                            className="text-white/40 hover:text-white transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="font-playfair font-bold gold-text text-lg">
                            {currencySymbol} {(Number(item.price || 0) * Number(item.quantity || 0)).toLocaleString()}
                          </p>
                          {Number(item.quantity || 0) > 1 && (
                            <p className="text-white/30 text-xs">{currencySymbol} {Number(item.price || 0).toLocaleString()} each</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              <button
                onClick={() => {
                  clearCart();
                  toast("Cart cleared", { icon: "🗑️", style: { background: "#1a1a1a", color: "#fff" } });
                }}
                className="text-white/30 hover:text-red-400 text-sm font-inter transition-colors flex items-center gap-2 mt-2"
              >
                <Trash2 size={14} />
                Clear all items
              </button>
            </div>

            <div className="space-y-5">
              <div className="glass gold-border rounded-2xl p-6">
                <h3 className="font-playfair font-semibold text-white text-base mb-5">Coupon Code</h3>
                {couponApplied ? (
                  <div className="flex items-center gap-2 text-green-400 text-sm font-inter">
                    <span>✓</span> AS10 applied — {currencySymbol} {couponDiscount.toLocaleString()} off
                  </div>
                ) : (
                  <form onSubmit={handleCoupon} className="flex gap-3">
                    <input
                      type="text"
                      placeholder="Enter code (try: AS10)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="input-luxury flex-1 text-sm py-3"
                      id="coupon-input"
                    />
                    <button
                      type="submit"
                      className="px-5 py-3 bg-gold text-primary font-poppins font-semibold text-sm rounded-xl hover:bg-gold-light transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                )}
              </div>

              <div className="glass gold-border rounded-2xl p-6">
                <h3 className="font-playfair font-semibold text-white text-base mb-5">Shipping</h3>
                <div className="flex justify-between text-sm font-inter text-white/50">
                  <span>Standard Delivery</span>
                  <span className="text-gold">Free</span>
                </div>
                <p className="text-white/30 text-xs mt-3">Estimated: 3–5 business days</p>
              </div>

              <div className="glass gold-border rounded-2xl p-6">
                <h3 className="font-playfair font-bold text-white text-xl mb-6">Order Summary</h3>
                <div className="space-y-4 text-sm font-inter">
                  <div className="flex justify-between text-white/50">
                    <span>Subtotal</span>
                    <span>{currencySymbol} {cartSubtotal.toLocaleString()}</span>
                  </div>
                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-green-400">
                      <span>Coupon Discount</span>
                      <span>-{currencySymbol} {couponDiscount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-white/50">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="h-px bg-white/5 my-4" />
                  <div className="flex justify-between text-white font-poppins font-bold text-lg">
                    <span>Grand Total</span>
                    <span className="gold-text">{currencySymbol} {grandTotal.toLocaleString()}</span>
                  </div>
                </div>

                <motion.div className="mt-6" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  {isStoreClosed ? (
                    <button
                      disabled
                      className="btn-gold w-full flex items-center justify-center gap-2 py-4 text-base opacity-60 cursor-not-allowed"
                    >
                      Store Closed - Checkout Disabled
                    </button>
                  ) : (
                    <Link to="/checkout" className="btn-gold w-full flex items-center justify-center gap-2 py-4 text-base">
                      Proceed to Checkout
                      <ArrowRight size={18} />
                    </Link>
                  )}
                </motion.div>

                <Link to="/shop" className="block text-center text-white/30 hover:text-gold text-sm font-inter mt-5 transition-colors">
                  ← Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
