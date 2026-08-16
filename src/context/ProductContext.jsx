import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getStoredProducts, saveStoredProducts, normalizeProductStock } from "../utils/productStorage";

const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadProducts = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      const data = getStoredProducts();
      setProducts(data);
      setIsLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    const data = getStoredProducts();
    setProducts(data);
    setIsLoading(false);
  }, []);

  const refreshProducts = useCallback(() => {
    loadProducts();
  }, [loadProducts]);

  const addProduct = useCallback((product) => {
    const maxId = products.reduce((max, p) => Math.max(max, p.id || 0), 0);
    const now = new Date().toISOString();
    const newProduct = {
      ...product,
      id: maxId + 1,
      createdAt: product.createdAt || now,
      updatedAt: now,
      lastUpdated: "Just now",
    };
    const updated = [newProduct, ...products];
    setProducts(updated);
    saveStoredProducts(updated);
    return newProduct;
  }, [products]);

  const updateProduct = useCallback((id, updatedFields) => {
    const now = new Date().toISOString();
    const updated = products.map((p) =>
      p.id === id ? {
        ...p,
        ...updatedFields,
        updatedAt: now,
        createdAt: p.createdAt || now,
        lastUpdated: "Just now",
      } : p
    );
    setProducts(updated);
    saveStoredProducts(updated);
  }, [products]);

  const deleteProduct = useCallback((id) => {
    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);
    saveStoredProducts(updated);
  }, [products]);

  const duplicateProduct = useCallback((id) => {
    const original = products.find((p) => p.id === id);
    if (!original) return null;
    const maxId = products.reduce((max, p) => Math.max(max, p.id || 0), 0);
    const maxSkuNum = products.reduce((max, p) => {
      const match = (p.sku || "").match(/SKU-(\d+)/);
      return match ? Math.max(max, parseInt(match[1], 10)) : max;
    }, 0);
    const now = new Date().toISOString();
    const duplicated = {
      ...original,
      id: maxId + 1,
      sku: `SKU-${String(maxSkuNum + 1).padStart(3, "0")}`,
      name: `${original.name} (Copy)`,
      status: "Draft",
      createdAt: now,
      updatedAt: now,
      lastUpdated: "Just now",
    };
    const updated = [duplicated, ...products];
    setProducts(updated);
    saveStoredProducts(updated);
    return duplicated;
  }, [products]);

  const deductStock = useCallback((orderItems) => {
    const now = new Date().toISOString();
    const updated = products.map((product) => {
      const orderItem = orderItems.find((item) => 
        String(item.productId) === String(product.id) || String(item.id) === String(product.id)
      );
      
      if (!orderItem) return product;
      
      const currentStock = normalizeProductStock(product?.stock ?? product?.inventory ?? 0);
      const deductQuantity = Number(orderItem.quantity || 0);
      const newStock = Math.max(0, currentStock - deductQuantity);
      
      // Ensure stock never goes negative
      if (newStock < 0) {
        console.warn(`Attempted to deduct ${deductQuantity} from stock ${currentStock} for product ${product.name}. Stock not changed.`);
        return product;
      }
      
      return {
        ...product,
        stock: newStock,
        updatedAt: now,
        lastUpdated: "Just now",
      };
    });
    
    setProducts(updated);
    saveStoredProducts(updated);
    return updated;
  }, [products]);

  return (
    <ProductContext.Provider
      value={{
        products,
        isLoading,
        refreshProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        duplicateProduct,
        deductStock,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
}
