"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ReactNode } from "react";

const SPRING = { type: "spring" as const, damping: 25, stiffness: 220, mass: 0.8 };
const FADE = { type: "tween" as const, duration: 0.2, ease: "easeOut" as const };

function getConfig(pathname: string) {
  if (pathname === "/profile") {
    return {
      className: "fixed inset-0 z-40 bg-neutral-900 overflow-y-auto pt-14",
      variants: {
        initial: { x: "-100%" },
        animate: { x: 0, transition: SPRING },
        exit: { x: "-100%", transition: SPRING },
      },
    };
  }
  if (pathname === "/news") {
    return {
      className: "fixed inset-0 z-40 bg-neutral-900 overflow-y-auto pt-14",
      variants: {
        initial: { x: "100%" },
        animate: { x: 0, transition: SPRING },
        exit: { x: "100%", transition: SPRING },
      },
    };
  }
  // Chat / Catalog: static base layer — opacity only, no X movement
  return {
    className: "relative z-0 w-full pt-14 pb-32 min-h-dvh",
    variants: {
      initial: { opacity: 0 },
      animate: { opacity: 1, transition: FADE },
      exit: { opacity: 0, transition: FADE },
    },
  };
}

export function PageTransitionWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { className, variants } = getConfig(pathname);

  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        key={pathname}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
