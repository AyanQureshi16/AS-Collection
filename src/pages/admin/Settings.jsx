import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Settings as SettingsIcon, Save, RotateCw } from "lucide-react";
import { useSettings } from "../../context/SettingsContext";
import LoadingSkeleton from "../../components/admin/LoadingSkeleton";
import { toast } from "react-hot-toast";

const currencySymbols = {
  PKR: "₨",
  USD: "$",
  EUR: "€",
  GBP: "£",
};

function fieldLabel(id, label) {
  return (
    <label htmlFor={id} className="block mb-1 text-sm text-white/70">
      {label}
    </label>
  );
}

export default function Settings() {
  const { settings, isLoading, updateSettings, resetSettings, refreshSettings } = useSettings();
  const [form, setForm] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setForm(settings || null);
      setErrors({});
    }
  }, [isLoading, settings]);

  const initialJson = useMemo(() => (form ? JSON.stringify(form) : null), [form]);
  const storedJson = useMemo(() => (settings ? JSON.stringify(settings) : null), [settings]);

  const hasUnsaved = useMemo(() => {
    if (!form || !settings) return false;
    return JSON.stringify(form) !== JSON.stringify(settings);
  }, [form, settings]);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  function validate(values) {
    const e = {};
    if (!values.storeName || String(values.storeName).trim().length < 2) e.storeName = "Store name is required";
    if (values.email) {
      const re = /^\S+@\S+\.\S+$/;
      if (!re.test(values.email)) e.email = "Email is not valid";
    }
    const numFields = ["lowStockThreshold"];
    numFields.forEach((f) => {
      const v = values[f];
      if (v === undefined || v === null || v === "") {
        e[f] = "Required";
      } else if (!Number.isFinite(Number(v)) || parseInt(v, 10) < 0) {
        e[f] = "Must be a number >= 0";
      }
    });
    if (!["PKR", "USD", "EUR", "GBP"].includes(values.currency)) e.currency = "Unsupported currency";
    if (!["Open", "Closed"].includes(values.storeStatus)) e.storeStatus = "Invalid store status";
    return e;
  }

  const handleSave = () => {
    if (!form) return;
    const v = validate(form);
    if (Object.keys(v).length) {
      setErrors(v);
      toast.error("Please fix validation errors before saving.");
      return;
    }
    setIsSaving(true);
    try {
      updateSettings(form);
      toast.success("Settings saved successfully.");
    } catch (err) {
      toast.error("Unable to save settings. Please try again.");
    } finally {
      setIsSaving(false);
      // refresh to ensure context state reflects storage
      refreshSettings();
    }
  };

  const handleReset = () => {
    const ok = window.confirm("Are you sure you want to reset all settings to their default values?");
    if (!ok) return;
    try {
      resetSettings();
      setForm(null);
      toast.success("Settings reset to defaults.");
      refreshSettings();
    } catch (err) {
      toast.error("Unable to reset settings. Please try again.");
    }
  };

  if (isLoading || !form) return <LoadingSkeleton />;

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-white/50 mb-1"><span>Admin</span><span className="text-white/30">/</span><span>Settings</span></div>
          <h1 className="font-poppins font-bold text-white text-2xl">Settings</h1>
          <p className="text-white/50 text-sm">Manage your store configuration and admin preferences.</p>
        </div>

        <div className="flex items-center gap-3">
          {hasUnsaved && <div className="text-xs text-amber-400">Unsaved changes</div>}
          <button id="reset-settings-btn" onClick={handleReset} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm flex items-center gap-2">
            <RotateCw size={16} /> Reset to Defaults
          </button>
          <button id="save-settings-btn" onClick={handleSave} disabled={isSaving} className="px-4 py-2 rounded-xl bg-gold text-black text-sm font-semibold flex items-center gap-2">
            <Save size={16} /> {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Store Information */}
        <div className="glass gold-border rounded-2xl p-4">
          <h3 className="font-poppins font-semibold text-white text-lg mb-4">Store Information</h3>

          <div className="space-y-4">
            <div>
              {fieldLabel("store-name", "Store Name")}
              <input id="store-name" value={form.storeName || ""} onChange={(e)=> handleChange("storeName", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm" />
              {errors.storeName && <div className="text-rose-400 text-xs mt-1">{errors.storeName}</div>}
            </div>

            <div>
              {fieldLabel("store-tagline", "Tagline")}
              <input id="store-tagline" value={form.tagline || ""} onChange={(e)=> handleChange("tagline", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm" />
            </div>

            <div>
              {fieldLabel("store-email", "Email")}
              <input id="store-email" value={form.email || ""} onChange={(e)=> handleChange("email", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm" />
              {errors.email && <div className="text-rose-400 text-xs mt-1">{errors.email}</div>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                {fieldLabel("store-phone", "Phone")}
                <input id="store-phone" value={form.phone || ""} onChange={(e)=> handleChange("phone", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm" />
              </div>
              <div>
                {fieldLabel("store-whatsapp", "WhatsApp Number")}
                <input id="store-whatsapp" value={form.whatsapp || ""} onChange={(e)=> handleChange("whatsapp", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm" />
                <div className="text-white/50 text-xs mt-2">Note: Checkout redirects customers to the global store WhatsApp number configured in <code>src/config/storeConfig.js</code>. This field is local to this browser and does not affect checkout redirection.</div>
              </div>
            </div>

            <div>
              {fieldLabel("store-address", "Address")}
              <input id="store-address" value={form.address || ""} onChange={(e)=> handleChange("address", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                {fieldLabel("store-city", "City")}
                <input id="store-city" value={form.city || ""} onChange={(e)=> handleChange("city", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm" />
              </div>
              <div>
                {fieldLabel("store-country", "Country")}
                <input id="store-country" value={form.country || ""} onChange={(e)=> handleChange("country", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm" />
              </div>
            </div>
          </div>
        </div>

        {/* Store Configuration & Order Settings */}
        <div className="space-y-6">
          <div className="glass gold-border rounded-2xl p-4">
            <h3 className="font-poppins font-semibold text-white text-lg mb-4">Store Configuration</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                {fieldLabel("currency-select", "Currency")}
                <select id="currency-select" value={form.currency || "PKR"} onChange={(e)=> handleChange("currency", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm">
                  <option value="PKR">PKR</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
                {errors.currency && <div className="text-rose-400 text-xs mt-1">{errors.currency}</div>}
              </div>

              <div>
                {fieldLabel("currency-symbol", "Currency Symbol")}
                <select id="currency-symbol" value={form.currencySymbol || currencySymbols[form.currency] || "₨"} onChange={(e)=> handleChange("currencySymbol", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm">
                  {Object.keys(currencySymbols).map((k)=> (<option key={k} value={currencySymbols[k]}>{k} — {currencySymbols[k]}</option>))}
                </select>
              </div>

              <div>
                {fieldLabel("store-status", "Store Status")}
                <select id="store-status" value={form.storeStatus || "Open"} onChange={(e)=> handleChange("storeStatus", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm">
                  <option value="Open">Open</option>
                  <option value="Closed">Closed</option>
                </select>
                <div className="text-white/50 text-xs mt-1">Controls whether your store is currently accepting normal orders.</div>
                {errors.storeStatus && <div className="text-rose-400 text-xs mt-1">{errors.storeStatus}</div>}
              </div>
            </div>
          </div>

          <div className="glass gold-border rounded-2xl p-4">
            <h3 className="font-poppins font-semibold text-white text-lg mb-4">Order Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white">Allow Orders</div>
                  <div className="text-white/50 text-sm">Allow customers to place orders through the store.</div>
                </div>
                <div>
                  <label className="inline-flex items-center">
                    <input type="checkbox" checked={!!form.allowOrders} onChange={(e)=> handleChange("allowOrders", e.target.checked)} className="mr-2" aria-label="allow-orders" />
                    <span className="text-white/70">{form.allowOrders ? "Enabled" : "Disabled"}</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white">Customer Reviews</div>
                  <div className="text-white/50 text-sm">Allow customers to submit product reviews.</div>
                </div>
                <div>
                  <label className="inline-flex items-center">
                    <input type="checkbox" checked={!!form.allowCustomerReviews} onChange={(e)=> handleChange("allowCustomerReviews", e.target.checked)} className="mr-2" aria-label="allow-reviews" />
                    <span className="text-white/70">{form.allowCustomerReviews ? "Enabled" : "Disabled"}</span>
                  </label>
                </div>
              </div>

              <div>
                {fieldLabel("low-stock-threshold", "Low Stock Threshold")}
                <input id="low-stock-threshold" type="number" min={0} value={form.lowStockThreshold ?? 0} onChange={(e)=> handleChange("lowStockThreshold", parseInt(e.target.value || "0", 10))} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm" />
                {errors.lowStockThreshold && <div className="text-rose-400 text-xs mt-1">{errors.lowStockThreshold}</div>}
                <div className="text-white/50 text-xs mt-1">Products at or below this quantity are considered low stock.</div>
              </div>
            </div>
          </div>

          <div className="glass gold-border rounded-2xl p-4">
            <h3 className="font-poppins font-semibold text-white text-lg mb-4">Notification Preferences</h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white">New Order Notifications</div>
                  <div className="text-white/50 text-sm">Notify admins about new orders.</div>
                </div>
                <div>
                  <label className="inline-flex items-center">
                    <input type="checkbox" checked={!!form.newOrderNotifications} onChange={(e)=> handleChange("newOrderNotifications", e.target.checked)} className="mr-2" aria-label="new-order-notifications" />
                    <span className="text-white/70">{form.newOrderNotifications ? "On" : "Off"}</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white">Order Status Notifications</div>
                  <div className="text-white/50 text-sm">Notify admins when order statuses change.</div>
                </div>
                <div>
                  <label className="inline-flex items-center">
                    <input type="checkbox" checked={!!form.orderStatusNotifications} onChange={(e)=> handleChange("orderStatusNotifications", e.target.checked)} className="mr-2" aria-label="order-status-notifications" />
                    <span className="text-white/70">{form.orderStatusNotifications ? "On" : "Off"}</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white">Review Notifications</div>
                  <div className="text-white/50 text-sm">Notify admins about new reviews.</div>
                </div>
                <div>
                  <label className="inline-flex items-center">
                    <input type="checkbox" checked={!!form.reviewNotifications} onChange={(e)=> handleChange("reviewNotifications", e.target.checked)} className="mr-2" aria-label="review-notifications" />
                    <span className="text-white/70">{form.reviewNotifications ? "On" : "Off"}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="glass gold-border rounded-2xl p-4">
            <h3 className="font-poppins font-semibold text-white text-lg mb-4">Store Availability</h3>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white">Maintenance Mode</div>
                <div className="text-white/50 text-sm">Temporarily disable normal customer activity while you make changes.</div>
              </div>
              <div>
                <label className="inline-flex items-center">
                  <input type="checkbox" checked={!!form.maintenanceMode} onChange={(e)=> handleChange("maintenanceMode", e.target.checked)} className="mr-2" aria-label="maintenance-mode" />
                  <span className="text-white/70">{form.maintenanceMode ? "Enabled" : "Disabled"}</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
