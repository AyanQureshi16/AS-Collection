import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getStoredReviews, saveStoredReviews } from "../utils/reviewStorage";

const ReviewContext = createContext();

export function ReviewProvider({ children }) {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const data = getStoredReviews();
    setReviews(data);
    setIsLoading(false);
  }, []);

  const refreshReviews = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      const data = getStoredReviews();
      setReviews(data);
      setIsLoading(false);
    }, 250);
  }, []);

  const addReview = useCallback((review) => {
    const maxId = reviews.reduce((max, r) => Math.max(max, r.id || 0), 0);
    const now = new Date().toISOString();
    const newReview = { ...review, id: maxId + 1, createdAt: now, updatedAt: now };
    const updated = [newReview, ...reviews];
    setReviews(updated);
    saveStoredReviews(updated);
    return newReview;
  }, [reviews]);

  const updateReview = useCallback((id, updatedFields) => {
    const now = new Date().toISOString();
    const updated = reviews.map((r) => (r.id === id ? { ...r, ...updatedFields, updatedAt: now } : r));
    setReviews(updated);
    saveStoredReviews(updated);
  }, [reviews]);

  const deleteReview = useCallback((id) => {
    const updated = reviews.filter((r) => r.id !== id);
    setReviews(updated);
    saveStoredReviews(updated);
  }, [reviews]);

  return (
    <ReviewContext.Provider value={{ reviews, isLoading, refreshReviews, addReview, updateReview, deleteReview }}>
      {children}
    </ReviewContext.Provider>
  );
}

export function useReviews() {
  const ctx = useContext(ReviewContext);
  if (!ctx) throw new Error("useReviews must be used within ReviewProvider");
  return ctx;
}
