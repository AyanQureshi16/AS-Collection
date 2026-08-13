const STORAGE_KEY = "as_collection_orders";

const INITIAL_ORDERS = [
  {
    id: 1,
    orderNumber: `AS-${new Date().getFullYear()}-0001`,
    customer: {
      name: "Test Customer",
      phone: "03001234567",
      email: "test@example.com",
      address: "House 1, Test Street, Test City",
    },
    items: [
      { productId: 1, productName: "Obsidian Slim-Fit Kurta", quantity: 1, price: 5000, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80" },
      { productId: 3, productName: "Oud Royale Attar", quantity: 2, price: 1500, image: "https://images.unsplash.com/photo-1541643600914-78b084683702?w=100&q=80" },
    ],
    subtotal: 8000,
    deliveryFee: 200,
    total: 8200,
    paymentMethod: "Cash on Delivery",
    status: "Pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const getStoredOrders = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ORDERS));
      return INITIAL_ORDERS;
    }
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) throw new Error("Stored orders is not an array");
    return parsed;
  } catch (error) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ORDERS));
    return INITIAL_ORDERS;
  }
};

export const saveStoredOrders = (orders) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  } catch (error) {
    // fail silently
  }
};

export const initStoredOrders = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ORDERS));
  } catch (error) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ORDERS));
  }
};

export default { getStoredOrders, saveStoredOrders, initStoredOrders };
