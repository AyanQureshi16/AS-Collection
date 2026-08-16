import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import LoadingScreen from "../ui/LoadingScreen";
import { useSettings } from "../../context/SettingsContext";
import { X } from "lucide-react";

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export default function Layout({ children }) {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const { settings } = useSettings();
  const [loading, setLoading] = useState(
    () => isHome && !sessionStorage.getItem("zelmior_loaded")
  );
  const [closedStoreBannerDismissed, setClosedStoreBannerDismissed] = useState(false);

  const handleLoadComplete = () => {
    sessionStorage.setItem("zelmior_loaded", "1");
    setLoading(false);
  };

  const isStoreClosed = settings?.storeStatus === "Closed";
  const isMaintenanceMode = settings?.maintenanceMode === true;
  const isAdminRoute = location.pathname.startsWith("/local-admin");

  return (
    <>
      {isHome && loading && (
        <LoadingScreen onComplete={handleLoadComplete} />
      )}

      {/* Store Closed Banner */}
      {isStoreClosed && !isAdminRoute && !closedStoreBannerDismissed && (
        <div className="bg-red-900/20 border-b border-red-500/30 py-3 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <p className="text-red-400 text-sm font-inter">
              Store is currently closed. Purchasing is disabled.
            </p>
            <button
              onClick={() => setClosedStoreBannerDismissed(true)}
              className="text-red-400 hover:text-red-300 transition-colors"
              aria-label="Dismiss banner"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Maintenance Mode */}
      {isMaintenanceMode && !isAdminRoute && (
        <div className="min-h-screen flex items-center justify-center bg-primary px-4">
          <div className="text-center max-w-md">
            <h1 className="font-display text-4xl text-primary mb-4">Under Maintenance</h1>
            <p className="font-inter text-muted text-lg mb-8">
              We're currently performing scheduled maintenance. Please check back soon.
            </p>
            <p className="font-inter text-muted/60 text-sm">
              Admin access remains available.
            </p>
          </div>
        </div>
      )}

      {!isMaintenanceMode || isAdminRoute ? (
        <div className="min-h-screen flex flex-col bg-primary">
          <Navbar />
          <AnimatePresence mode="wait">
            <motion.main
              key={location.pathname}
              className="flex-1"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              {children}
            </motion.main>
          </AnimatePresence>
          <Footer />
        </div>
      ) : null}
    </>
  );
}
