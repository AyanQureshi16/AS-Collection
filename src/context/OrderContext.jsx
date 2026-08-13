import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getStoredOrders, saveStoredOrders } from "../utils/orderStorage";

const OrderContext = createContext();

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadOrders = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      const data = getStoredOrders();
      setOrders(data);
      setIsLoading(false);
    }, 300);
  }, []);

  useEffect(() => {
    const data = getStoredOrders();
    setOrders(data);
    setIsLoading(false);
  }, []);

  const refreshOrders = useCallback(() => {
    loadOrders();
  }, [loadOrders]);

  const generateOrderNumber = useCallback((existing = orders) => {
    const year = new Date().getFullYear();
    let maxSeq = (existing || []).reduce((max, o) => {
      const match = (o.orderNumber || "").match(/AS-(\d{4})-(\d+)/);
      if (!match) return max;
      const seq = parseInt(match[2], 10);
      return Math.max(max, seq || 0);
    }, 0);

    let candidate = `AS-${year}-${String(maxSeq + 1).padStart(4, "0")}`;
    let attempts = 0;
    while ((existing || []).some((o) => o.orderNumber === candidate) && attempts < 50) {
      maxSeq += 1;
      candidate = `AS-${year}-${String(maxSeq + 1).padStart(4, "0")}`;
      attempts += 1;
    }

    return candidate;
  }, [orders]);

  const addOrder = useCallback((order) => {
    const maxId = orders.reduce((max, o) => Math.max(max, o.id || 0), 0);
    const now = new Date().toISOString();
    const orderNumber = order.orderNumber || generateOrderNumber(orders);
    const newOrder = {
      ...order,
      id: maxId + 1,
      orderNumber,
      createdAt: now,
      updatedAt: now,
    };
    const updated = [newOrder, ...orders];
    setOrders(updated);
    saveStoredOrders(updated);
    return newOrder;
  }, [generateOrderNumber, orders]);

  const updateOrder = useCallback((id, updatedFields) => {
    const now = new Date().toISOString();
    const updated = orders.map((o) => (o.id === id ? { ...o, ...updatedFields, updatedAt: now } : o));
    setOrders(updated);
    saveStoredOrders(updated);
  }, [orders]);

  const deleteOrder = useCallback((id) => {
    const updated = orders.filter((o) => o.id !== id);
    setOrders(updated);
    saveStoredOrders(updated);
  }, [orders]);

  return (
    <OrderContext.Provider value={{ orders, isLoading, refreshOrders, generateOrderNumber, addOrder, updateOrder, deleteOrder }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrders must be used within OrderProvider");
  return ctx;
}
