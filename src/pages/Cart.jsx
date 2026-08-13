import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import Layout from "../components/layout/Layout";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

const SHIPPING = 0;

export default function Cart() {
  const { cartItems, cartSubtotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);

  const grandTotal = cartSubtotal - couponDiscount + SHIPPING;

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
        <div className="pt-28 pb-20 min-h-screen flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md mx-auto px-4"
          >
            <div className="text-8xl mb-6">🛍️</div>
            <h1 className="font-poppins font-bold text-white text-3xl mb-3">Your Cart is Empty</h1>
            <p className="font-inter text-white/40 text-base mb-8">
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
      <div className="pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
            <h1 className="font-poppins font-black text-4xl text-white mb-2">
              Shopping <span className="gold-text">Cart</span>
            </h1>
            <p className="text-white/40 font-inter text-sm">
              {cartItems.length} item{cartItems.length !== 1 ? "s" : ""} in your cart
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item, i) => {
                const sizeLabel = item.selectedSize ? `Size: ${item.selectedSize}` : "No size selected";

                return (
                  <motion.div
                    key={`${item.id}-${item.selectedSize || "default"}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="glass gold-border rounded-2xl p-4 sm:p-5 flex gap-4"
                  >
                    <Link to={`/product/${item.id}`} className="flex-shrink-0">
                      <div className="w-20 h-24 sm:w-24 sm:h-28 rounded-xl overflow-hidden bg-dark-50">
                        <img src={item.image || item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                    </Link>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <Link to={`/product/${item.id}`}>
                            <h3 className="font-poppins font-semibold text-white text-sm sm:text-base hover:text-gold transition-colors line-clamp-2">
                              {item.name}
                            </h3>
                          </Link>
                          <p className="text-white/30 text-xs font-inter mt-1">{sizeLabel}</p>
                        </div>
                        <button
                          onClick={() => handleRemove(item.id, item.selectedSize)}
                          className="text-white/20 hover:text-red-400 transition-colors flex-shrink-0 p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-2 bg-dark-100 rounded-xl px-3 py-1.5 border border-white/5">
                          <button
                            onClick={() => updateQuantity(item.id, item.selectedSize, Number(item.quantity) - 1)}
                            className="text-white/40 hover:text-white transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="font-poppins font-bold text-white text-sm w-6 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.selectedSize, Number(item.quantity) + 1)}
                            className="text-white/40 hover:text-white transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="font-poppins font-bold text-gold text-base">
                            PKR {(Number(item.price || 0) * Number(item.quantity || 0)).toLocaleString()}
                          </p>
                          {Number(item.quantity || 0) > 1 && (
                            <p className="text-white/30 text-xs">PKR {Number(item.price || 0).toLocaleString()} each</p>
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
                className="text-white/30 hover:text-red-400 text-xs font-inter transition-colors flex items-center gap-1.5"
              >
                <Trash2 size={13} />
                Clear all items
              </button>
            </div>

            <div className="space-y-4">
              <div className="glass gold-border rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="font-poppins font-semibold text-white text-sm">Coupon</h3>
                </div>
                {couponApplied ? (
                  <div className="flex items-center gap-2 text-green-400 text-sm font-inter">
                    <span>✓</span> AS10 applied — PKR {couponDiscount.toLocaleString()} off
                  </div>
                ) : (
                  <form onSubmit={handleCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter code (try: AS10)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="input-luxury flex-1 text-sm py-2.5"
                      id="coupon-input"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 bg-gold text-primary font-poppins font-semibold text-sm rounded-xl hover:bg-gold-light transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                )}
              </div>

              <div className="glass gold-border rounded-2xl p-5">
                <h3 className="font-poppins font-semibold text-white text-sm mb-4">Shipping</h3>
                <div className="flex justify-between text-sm font-inter text-white/50">
                  <span>Standard Delivery</span>
                  <span>Free</span>
                </div>
                <p className="text-white/30 text-xs mt-3">Estimated: 3–5 business days</p>
              </div>

              <div className="glass gold-border rounded-2xl p-5">
                <h3 className="font-poppins font-bold text-white text-base mb-4">Order Summary</h3>
                <div className="space-y-3 text-sm font-inter">
                  <div className="flex justify-between text-white/50">
                    <span>Subtotal</span>
                    <span>PKR {cartSubtotal.toLocaleString()}</span>
                  </div>
                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-green-400">
                      <span>Coupon Discount</span>
                      <span>-PKR {couponDiscount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-white/50">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="h-px bg-white/5 my-3" />
                  <div className="flex justify-between text-white font-poppins font-bold text-base">
                    <span>Grand Total</span>
                    <span className="text-gold">PKR {grandTotal.toLocaleString()}</span>
                  </div>
                </div>

                <motion.div className="mt-5" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link to="/checkout" className="btn-gold w-full flex items-center justify-center gap-2 py-4 text-base">
                    Proceed to Checkout
                    <ArrowRight size={18} />
                  </Link>
                </motion.div>

                <Link to="/shop" className="block text-center text-white/30 hover:text-gold text-xs font-inter mt-4 transition-colors">
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
