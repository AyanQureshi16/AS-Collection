import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getStoredMedia, saveStoredMedia } from "../utils/mediaStorage";

const MediaContext = createContext();

export function MediaProvider({ children }) {
  const [media, setMedia] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const data = getStoredMedia();
    setMedia(data);
    setIsLoading(false);
  }, []);

  const refreshMedia = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      const data = getStoredMedia();
      setMedia(data);
      setIsLoading(false);
    }, 250);
  }, []);

  const addMedia = useCallback((item) => {
    const maxId = media.reduce((max, m) => Math.max(max, m.id || 0), 0);
    const now = new Date().toISOString();
    const newItem = { ...item, id: maxId + 1, createdAt: now, updatedAt: now };
    const updated = [newItem, ...media];
    setMedia(updated);
    saveStoredMedia(updated);
    return newItem;
  }, [media]);

  const updateMedia = useCallback((id, updatedFields) => {
    const now = new Date().toISOString();
    const updated = media.map((m) => (m.id === id ? { ...m, ...updatedFields, updatedAt: now } : m));
    setMedia(updated);
    saveStoredMedia(updated);
  }, [media]);

  const deleteMedia = useCallback((id) => {
    const updated = media.filter((m) => m.id !== id);
    setMedia(updated);
    saveStoredMedia(updated);
  }, [media]);

  return (
    <MediaContext.Provider value={{ media, isLoading, refreshMedia, addMedia, updateMedia, deleteMedia }}>
      {children}
    </MediaContext.Provider>
  );
}

export function useMedia() {
  const ctx = useContext(MediaContext);
  if (!ctx) throw new Error("useMedia must be used within MediaProvider");
  return ctx;
}
