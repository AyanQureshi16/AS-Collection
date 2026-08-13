const STORAGE_KEY = "as_collection_settings";

const DEFAULT_SETTINGS = {
  storeName: "AS Collection",
  tagline: "",
  email: "",
  phone: "",
  whatsapp: "",
  address: "",
  city: "",
  country: "",

  currency: "PKR",
  currencySymbol: "₨",

  storeStatus: "Open",

  allowOrders: true,
  allowCustomerReviews: true,

  lowStockThreshold: 10,

  orderStatusNotifications: true,
  newOrderNotifications: true,
  reviewNotifications: true,

  maintenanceMode: false,

  updatedAt: null,
};

export const getStoredSettings = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS));
      return DEFAULT_SETTINGS;
    }
    const parsed = JSON.parse(data);
    if (!parsed || typeof parsed !== "object") throw new Error("Stored settings invalid");
    // Merge with defaults to ensure missing fields don't break consumers
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch (error) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS));
    } catch (e) {
      // fail silently
    }
    return DEFAULT_SETTINGS;
  }
};

export const saveStoredSettings = (settings) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    // fail silently - callers should handle errors
  }
};

export const initStoredSettings = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS));
  } catch (error) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS));
    } catch (e) {
      // fail silently
    }
  }
};

export { DEFAULT_SETTINGS };

export default { getStoredSettings, saveStoredSettings, initStoredSettings };
