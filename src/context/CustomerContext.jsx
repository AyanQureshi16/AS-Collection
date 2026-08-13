import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getStoredCustomers, saveStoredCustomers } from "../utils/customerStorage";

const CustomerContext = createContext();

export function CustomerProvider({ children }) {
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadCustomers = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      const data = getStoredCustomers();
      setCustomers(data);
      setIsLoading(false);
    }, 300);
  }, []);

  useEffect(() => {
    const data = getStoredCustomers();
    setCustomers(data);
    setIsLoading(false);
  }, []);

  const refreshCustomers = useCallback(() => {
    loadCustomers();
  }, [loadCustomers]);

  const addCustomer = useCallback((customer) => {
    const maxId = customers.reduce((max, c) => Math.max(max, c.id || 0), 0);
    const now = new Date().toISOString();
    const newCustomer = {
      ...customer,
      id: maxId + 1,
      createdAt: now,
      updatedAt: now,
    };
    const updated = [newCustomer, ...customers];
    setCustomers(updated);
    saveStoredCustomers(updated);
    return newCustomer;
  }, [customers]);

  const updateCustomer = useCallback((id, updatedFields) => {
    const now = new Date().toISOString();
    const updated = customers.map((c) => (c.id === id ? { ...c, ...updatedFields, updatedAt: now } : c));
    setCustomers(updated);
    saveStoredCustomers(updated);
  }, [customers]);

  const deleteCustomer = useCallback((id) => {
    const updated = customers.filter((c) => c.id !== id);
    setCustomers(updated);
    saveStoredCustomers(updated);
  }, [customers]);

  return (
    <CustomerContext.Provider value={{ customers, isLoading, refreshCustomers, addCustomer, updateCustomer, deleteCustomer }}>
      {children}
    </CustomerContext.Provider>
  );
}

export function useCustomers() {
  const ctx = useContext(CustomerContext);
  if (!ctx) throw new Error("useCustomers must be used within CustomerProvider");
  return ctx;
}
