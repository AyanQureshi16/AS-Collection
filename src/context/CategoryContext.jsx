import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getStoredCategories, saveStoredCategories } from "../utils/categoryStorage";

const CategoryContext = createContext();

export function CategoryProvider({ children }) {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadCategories = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      const data = getStoredCategories();
      setCategories(data);
      setIsLoading(false);
    }, 300);
  }, []);

  useEffect(() => {
    const data = getStoredCategories();
    setCategories(data);
    setIsLoading(false);
  }, []);

  const refreshCategories = useCallback(() => {
    loadCategories();
  }, [loadCategories]);

  const addCategory = useCallback((category) => {
    const maxId = categories.reduce((max, c) => Math.max(max, c.id || 0), 0);
    const now = new Date().toISOString();
    const newCategory = {
      ...category,
      id: maxId + 1,
      createdAt: now,
      updatedAt: now,
    };
    const updated = [newCategory, ...categories];
    setCategories(updated);
    saveStoredCategories(updated);
    return newCategory;
  }, [categories]);

  const updateCategory = useCallback((id, updatedFields) => {
    const now = new Date().toISOString();
    const updated = categories.map((c) =>
      c.id === id ? { ...c, ...updatedFields, updatedAt: now } : c
    );
    setCategories(updated);
    saveStoredCategories(updated);
  }, [categories]);

  const deleteCategory = useCallback((id) => {
    const updated = categories.filter((c) => c.id !== id);
    setCategories(updated);
    saveStoredCategories(updated);
  }, [categories]);

  return (
    <CategoryContext.Provider
      value={{
        categories,
        isLoading,
        refreshCategories,
        addCategory,
        updateCategory,
        deleteCategory,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategories() {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error("useCategories must be used within a CategoryProvider");
  }
  return context;
}
