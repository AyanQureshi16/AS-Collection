import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getStoredSettings, saveStoredSettings, initStoredSettings, DEFAULT_SETTINGS } from "../utils/settingsStorage";

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      initStoredSettings();
      const s = getStoredSettings();
      setSettings(s);
    } catch (error) {
      setSettings(DEFAULT_SETTINGS);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshSettings = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      try {
        const s = getStoredSettings();
        setSettings(s);
      } catch (error) {
        setSettings(DEFAULT_SETTINGS);
      } finally {
        setIsLoading(false);
      }
    }, 150);
  }, []);

  const updateSettings = useCallback((updates) => {
    const now = new Date().toISOString();
    setSettings((prev) => {
      const merged = { ...(prev || DEFAULT_SETTINGS), ...updates, updatedAt: now };
      try {
        saveStoredSettings(merged);
      } catch (error) {
        // silent
      }
      return merged;
    });
  }, []);

  const resetSettings = useCallback(() => {
    const defaults = { ...DEFAULT_SETTINGS, updatedAt: new Date().toISOString() };
    setSettings(defaults);
    try {
      saveStoredSettings(defaults);
    } catch (error) {
      // silent
    }
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, isLoading, refreshSettings, updateSettings, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}
