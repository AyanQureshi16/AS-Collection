import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MessageCircle, User, Phone, Mail, MapPin, FileText, CheckCircle2 } from "lucide-react";
import Layout from "../components/layout/Layout";
import { useCart } from "../context/CartContext";
import { useProducts } from "../context/ProductContext";
import { useOrders } from "../context/OrderContext";
import { useCustomers } from "../context/CustomerContext";
import { useSettings } from "../context/SettingsContext";
import { normalizeProductStock } from "../utils/productStorage";
import { generateWhatsAppOrder } from "../utils/whatsapp";
import { STORE_CONFIG } from "../config/storeConfig";
import toast from "react-hot-toast";

const SHIPPING = 0;

const cities = [
  "Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad",
  "Multan", "Peshawar", "Quetta", "Sialkot", "Gujranwala",
  "Hyderabad", "Abbottabad", "Bahawalpur", "Sargodha", "Other",
];

export default function Checkout() {
  const { cartItems, cartSubtotal, clearCart } = useCart();
  const { products } = useProducts();
  const { orders, generateOrderNumber, addOrder } = useOrders();
  const { customers, addCustomer } = useCustomers();
  const { settings } = useSettings();
  const { deductStock } = useProducts();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    address: "",
    instructions: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(null);
  
  const currencySymbol = settings?.currencySymbol || "₨";
  const currency = settings?.currency || "PKR";
  const isStoreClosed = settings?.storeStatus === "Closed";

  const grandTotal = cartSubtotal + SHIPPING;

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Full name is required";
    if (!form.phone.trim() || !/^(03\d{9}|\+92\d{10}|92\d{10})$/.test(form.phone.replace(/\s+/g, ""))) {
      errs.phone = "Enter a valid phone number (e.g., 03001234567)";
    }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = "Please enter a valid email address";
    }
    if (!form.city) errs.city = "Please select your city";
    if (!form.address.trim() || form.address.trim().length < 10) {
      errs.address = "Please enter a complete delivery address";
    }
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();

    if (submitting) return;

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      toast.error("Please fill in all required fields correctly", {
        style: { background: "#1a1a1a", color: "#fff" },
      });
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    const productMap = new Map(products.map((product) => [String(product.id), product]));

    for (const item of cartItems) {
      const product = productMap.get(String(item.productId ?? item.id));
      const availableStock = normalizeProductStock(product?.stock ?? item?.stock ?? 0);

      if (!product) {
        toast.error(`${item.name} is no longer available.`);
        return;
      }

      if (availableStock <= 0) {
        toast.error(`${item.name} is currently out of stock.`);
        return;
      }

      if (Number(item.quantity || 0) > availableStock) {
        toast.error(`${item.name} only has ${availableStock} item(s) available.`);
        return;
      }
    }

    setSubmitting(true);

    try {
      const normalizedPhone = form.phone.replace(/\s+/g, "");
      const matchedCustomer = customers.find((customer) => {
        const storedPhone = (customer.phone || "").replace(/\D/g, "");
        const matchPhone = Boolean(storedPhone && normalizedPhone && storedPhone === normalizedPhone);
        const matchEmail = Boolean(form.email && customer.email && customer.email.toLowerCase() === form.email.toLowerCase());
        return matchPhone || matchEmail;
      });

      const savedCustomer = matchedCustomer || addCustomer({
        name: form.name.trim(),
        phone: normalizedPhone,
        email: form.email.trim(),
        city: form.city.trim(),
        address: form.address.trim(),
        specialInstructions: form.instructions.trim(),
      });

      const orderItems = cartItems.map((item) => {
        const product = productMap.get(String(item.productId ?? item.id));
        const quantity = Number(item.quantity || 0);
        const unitPrice = Number(product?.salePrice ?? product?.price ?? item.price ?? 0);
        return {
          productId: Number(product?.id ?? item.productId ?? item.id),
          productName: product?.name ?? item.name,
          quantity,
          price: unitPrice,
          subtotal: unitPrice * quantity,
          image: product?.image ?? item.image ?? item.imageUrl,
        };
      });

      const subtotal = orderItems.reduce((sum, item) => sum + Number(item.subtotal || 0), 0);
      const orderNumber = generateOrderNumber(orders);
      const createdOrder = addOrder({
        orderNumber,
        customer: {
          name: savedCustomer?.name || form.name.trim(),
          phone: savedCustomer?.phone || normalizedPhone,
          email: (savedCustomer?.email || form.email.trim()).toLowerCase(),
          city: savedCustomer?.city || form.city.trim(),
          address: savedCustomer?.address || form.address.trim(),
          specialInstructions: savedCustomer?.specialInstructions || form.instructions.trim(),
        },
        items: orderItems,
        subtotal,
        deliveryFee: SHIPPING,
        total: subtotal + SHIPPING,
        paymentMethod: "Cash on Delivery",
        status: "Pending",
      });

      if (!createdOrder) {
        throw new Error("Order creation failed");
      }

      // Deduct stock from products after successful order creation
      deductStock(orderItems);

      // Build WhatsApp message from the actual saved order object
      // DO NOT clear cart yet - user must confirm they sent the WhatsApp message
      setOrderPlaced(createdOrder);
      setSubmitting(false);

      // Use settings WhatsApp number (do not hardcode). Normalize to digits suitable for wa.me
      // Prefer global store-configured WhatsApp number (device-independent)
      const rawWa = STORE_CONFIG?.whatsapp || "";
      const waNumber = String(rawWa).replace(/[^0-9]/g, "");

      // Build cart items for WhatsApp from saved order (preserve saved prices and quantities)
      const waCartItems = (createdOrder.items || []).map((it) => ({
        name: it.productName || it.name || "",
        selectedSize: it.selectedSize || "",
        quantity: it.quantity || 0,
        price: it.price || 0,
      }));

      const waCustomer = {
        name: createdOrder.customer?.name || form.name,
        phone: createdOrder.customer?.phone || form.phone,
        city: createdOrder.customer?.city || form.city,
        address: createdOrder.customer?.address || form.address,
        instructions: createdOrder.customer?.specialInstructions || form.instructions || "",
      };

      if (!waNumber) {
        // Store WhatsApp number missing in global config: do not open WhatsApp, but inform the user. Order remains saved.
        toast.error("Store WhatsApp number is not configured.", {
          style: { background: "#1a1a1a", color: "#fff" },
        });
        return;
      }

      const waUrl = generateWhatsAppOrder(waCartItems, waCustomer, SHIPPING, waNumber, settings?.storeName || "AS Collection", currencySymbol);

      if (!waUrl) {
        toast.error("Could not generate WhatsApp URL. Please check settings.", { style: { background: "#1a1a1a", color: "#fff" } });
        return;
      }

      // Use direct navigation to wa.me to better avoid popup blockers; this is a user-initiated action inside the submit handler
      try {
        window.location.href = waUrl;
        toast.success("Order placed successfully! Redirecting to WhatsApp for confirmation.", {
          style: { background: "#1a1a1a", color: "#fff", border: "1px solid rgba(212,175,55,0.3)" },
          iconTheme: { primary: "#D4AF37", secondary: "#0A0A0A" },
        });
      } catch (err) {
        // Fallback to opening in the same tab using assign
        try { window.location.assign(waUrl); } catch (e) { /* ignore */ }
        toast.success("Order placed successfully! Opened WhatsApp for confirmation.", {
          style: { background: "#1a1a1a", color: "#fff", border: "1px solid rgba(212,175,55,0.3)" },
          iconTheme: { primary: "#D4AF37", secondary: "#0A0A0A" },
        });
      }
    } catch (error) {
      setSubmitting(false);
      toast.error(error.message || "Could not place order. Please try again.", {
        style: { background: "#1a1a1a", color: "#fff" },
      });
    }
  };

  if (orderPlaced) {
    return (
      <Layout>
        <div className="pt-32 pb-24 min-h-screen flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass gold-border max-w-xl w-full rounded-3xl p-10 text-center"
          >
            <div className="flex justify-center mb-6">
              <div className="rounded-full bg-green-500/10 p-4 text-green-400">
                <CheckCircle2 size={48} />
              </div>
            </div>
            <p className="text-gold font-inter text-xs tracking-[0.35em] uppercase mb-4">Order Placed Successfully</p>
            <h1 className="font-playfair font-black text-white text-3xl md:text-4xl mb-4">Thank You</h1>
            <p className="font-inter text-white/50 text-base mb-6">Your order number is:</p>
            <div className="inline-flex items-center justify-center rounded-xl border border-gold/40 bg-gold/10 px-6 py-4 font-mono text-xl gold-text font-semibold mb-4">
              {orderPlaced.orderNumber}
            </div>
            <p className="font-inter text-white/60 text-sm mb-8">
              You have been redirected to WhatsApp with your order details. Please send the message to confirm your order.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  clearCart();
                  toast.success("Cart cleared. Thank you for your order!", {
                    style: { background: "#1a1a1a", color: "#fff", border: "1px solid rgba(212,175,55,0.3)" },
                  });
                }}
                className="btn-gold px-8 py-4 text-center"
              >
                I've Sent My Order on WhatsApp
              </button>
              <Link to="/shop" className="btn-ghost px-8 py-4 text-center">
                Continue Shopping
              </Link>
            </div>
          </motion.div>
        </div>
      </Layout>
    );
  }

  if (isStoreClosed) {
    return (
      <Layout>
        <div className="pt-32 pb-24 min-h-screen flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <h1 className="font-playfair font-black text-white text-4xl mb-4">Store Closed</h1>
            <p className="font-inter text-white/50 text-base mb-8">The store is currently closed. Please check back later.</p>
            <Link to="/shop" className="btn-gold">Back to Shop</Link>
          </div>
        </div>
      </Layout>
    );
  }

  if (cartItems.length === 0) {
    return (
      <Layout>
        <div className="pt-32 pb-24 min-h-screen flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <h1 className="font-playfair font-black text-white text-4xl mb-4">Your Cart is Empty</h1>
            <p className="font-inter text-white/50 text-base mb-8">Start shopping to add products and continue to checkout.</p>
            <Link to="/shop" className="btn-gold">Start Shopping</Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="pt-32 pb-24">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
            <p className="text-gold font-inter text-xs tracking-[0.35em] uppercase mb-4">Complete Your Order</p>
            <h1 className="font-playfair font-black text-4xl md:text-5xl text-white mb-4">
              <span className="gold-text">Checkout</span>
            </h1>
            <p className="text-white/40 font-inter text-sm flex items-center gap-2">
              <MessageCircle size={16} className="text-green-400" />
              Your order will be confirmed via WhatsApp
            </p>
          </motion.div>

          <form onSubmit={handlePlaceOrder}>
            <div className="grid lg:grid-cols-5 gap-10">
              <div className="lg:col-span-3 space-y-6">
                <div className="glass gold-border rounded-2xl p-8">
                  <h2 className="font-playfair font-bold text-white text-xl mb-8 flex items-center gap-3">
                    <User size={20} className="text-gold" />
                    Customer Information
                  </h2>

                  <div className="space-y-5">
                    <div>
                      <label className="block text-white/60 text-sm font-inter mb-2" htmlFor="name">
                        Full Name <span className="text-gold">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="e.g., Ahmed Khan"
                        className={`input-luxury ${errors.name ? "border-red-500/50" : ""}`}
                      />
                      {errors.name && <p className="text-red-400 text-xs mt-2 font-inter">{errors.name}</p>}
                    </div>

                    <div>
                      <label className="block text-white/60 text-sm font-inter mb-2" htmlFor="phone">
                        Phone Number <span className="text-gold">*</span>
                      </label>
                      <div className="relative">
                        <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          placeholder="03001234567"
                          className={`input-luxury pl-12 ${errors.phone ? "border-red-500/50" : ""}`}
                        />
                      </div>
                      {errors.phone && <p className="text-red-400 text-xs mt-2 font-inter">{errors.phone}</p>}
                    </div>

                    <div>
                      <label className="block text-white/60 text-sm font-inter mb-2" htmlFor="email">
                        Email <span className="text-white/30 text-xs">(Optional)</span>
                      </label>
                      <div className="relative">
                        <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          placeholder="you@example.com"
                          className={`input-luxury pl-12 ${errors.email ? "border-red-500/50" : ""}`}
                        />
                      </div>
                      {errors.email && <p className="text-red-400 text-xs mt-2 font-inter">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="block text-white/60 text-sm font-inter mb-2" htmlFor="city">
                        City <span className="text-gold">*</span>
                      </label>
                      <select
                        id="city"
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        className={`input-luxury cursor-pointer ${errors.city ? "border-red-500/50" : ""}`}
                      >
                        <option value="" className="bg-dark-50">Select your city</option>
                        {cities.map((city) => (
                          <option key={city} value={city} className="bg-dark-50">{city}</option>
                        ))}
                      </select>
                      {errors.city && <p className="text-red-400 text-xs mt-2 font-inter">{errors.city}</p>}
                    </div>

                    <div>
                      <label className="block text-white/60 text-sm font-inter mb-2" htmlFor="address">
                        Address <span className="text-gold">*</span>
                      </label>
                      <div className="relative">
                        <MapPin size={18} className="absolute left-4 top-4 text-white/30" />
                        <textarea
                          id="address"
                          name="address"
                          value={form.address}
                          onChange={handleChange}
                          placeholder="House #, Street, Block, Area, City..."
                          rows={3}
                          className={`input-luxury pl-12 resize-none ${errors.address ? "border-red-500/50" : ""}`}
                        />
                      </div>
                      {errors.address && <p className="text-red-400 text-xs mt-2 font-inter">{errors.address}</p>}
                    </div>

                    <div>
                      <label className="block text-white/60 text-sm font-inter mb-2" htmlFor="instructions">
                        Special Instructions <span className="text-white/30 text-xs">(Optional)</span>
                      </label>
                      <div className="relative">
                        <FileText size={18} className="absolute left-4 top-4 text-white/30" />
                        <textarea
                          id="instructions"
                          name="instructions"
                          value={form.instructions}
                          onChange={handleChange}
                          placeholder="Gift wrapping, urgent delivery, color preference..."
                          rows={2}
                          className="input-luxury pl-12 resize-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="glass rounded-2xl p-5 border border-green-500/20 bg-green-500/5">
                  <div className="flex items-start gap-3">
                    <MessageCircle size={20} className="text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-playfair font-semibold text-green-400 text-sm mb-1">WhatsApp Order Confirmation</p>
                      <p className="font-inter text-white/40 text-xs leading-relaxed">
                        Clicking "Place Order" opens WhatsApp with your order summary pre-filled. Send the message to confirm.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2">
                <div className="glass gold-border rounded-2xl p-6 sticky top-28">
                  <h2 className="font-playfair font-bold text-white text-xl mb-6">Order Summary</h2>

                  <div className="space-y-4 mb-6">
                    {cartItems.map((item) => (
                      <div key={`${item.id}-${item.selectedSize || "default"}`} className="flex gap-4 pb-4 border-b border-white/5">
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-dark-100 flex-shrink-0">
                          <img src={item.image || item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-playfair font-semibold line-clamp-2">{item.name}</p>
                          <p className="text-white/30 text-xs mt-1">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-gold text-sm font-poppins font-semibold">
                          {currencySymbol} {(Number(item.price || 0) * Number(item.quantity || 0)).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4 text-sm font-inter">
                    <div className="flex justify-between text-white/50">
                      <span>Subtotal</span>
                      <span>{currencySymbol} {cartSubtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-white/50">
                      <span>Shipping</span>
                      <span className="text-gold">Free</span>
                    </div>
                    <div className="h-px bg-white/5 my-4" />
                    <div className="flex justify-between text-white font-poppins font-bold text-lg">
                      <span>Grand Total</span>
                      <span className="gold-text">{currencySymbol} {grandTotal.toLocaleString()}</span>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={submitting}
                    className="btn-gold w-full mt-8 py-4 disabled:opacity-60 disabled:cursor-not-allowed text-base"
                  >
                    {submitting ? "Processing..." : "Place Order"}
                  </motion.button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
