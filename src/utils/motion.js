import { useReducedMotion } from "framer-motion";

export function useLuxuryMotion() {
  const prefersReduced = useReducedMotion();

  return {
    prefersReduced,
    fadeUp: prefersReduced
      ? { initial: {}, animate: {}, whileInView: {} }
      : {
          initial: { opacity: 0, y: 28 },
          animate: { opacity: 1, y: 0 },
          whileInView: { opacity: 1, y: 0 },
        },
    fadeIn: prefersReduced
      ? { initial: {}, animate: {} }
      : { initial: { opacity: 0 }, animate: { opacity: 1 } },
    scaleIn: prefersReduced
      ? { initial: {}, animate: {} }
      : { initial: { opacity: 0, scale: 0.92 }, animate: { opacity: 1, scale: 1 } },
    transition: prefersReduced
      ? { duration: 0 }
      : { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
    slowTransition: prefersReduced
      ? { duration: 0 }
      : { duration: 1.2, ease: [0.22, 1, 0.36, 1] },
  };
}

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

export const staggerItem = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};
