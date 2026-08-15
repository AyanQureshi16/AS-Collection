import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import LoadingScreen from "../ui/LoadingScreen";

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export default function Layout({ children }) {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const [loading, setLoading] = useState(
    () => isHome && !sessionStorage.getItem("zelmior_loaded")
  );

  const handleLoadComplete = () => {
    sessionStorage.setItem("zelmior_loaded", "1");
    setLoading(false);
  };

  return (
    <>
      {isHome && loading && (
        <LoadingScreen onComplete={handleLoadComplete} />
      )}

      <div className="min-h-screen flex flex-col bg-ink">
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
    </>
  );
}
