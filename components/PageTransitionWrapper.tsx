"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion, Transition, Target } from "framer-motion";
import { ReactNode } from "react";

type RouteVariants = {
  initial: Target;
  animate: Target;
  exit: Target;
  transition: Transition;
};

function getVariants(pathname: string): RouteVariants {
  // Chat and Catalog: instant swap, no animation
  if (pathname === "/" || pathname === "/catalog") {
    return {
      initial: { opacity: 1 },
      animate: { opacity: 1 },
      exit: { opacity: 1 },
      transition: { duration: 0 },
    };
  }
  // Profile: enters from left → slides right into view
  if (pathname === "/profile") {
    return {
      initial: { opacity: 0, x: -80 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 80 },
      transition: { duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] },
    };
  }
  // News: enters from right → slides left into view
  if (pathname === "/news") {
    return {
      initial: { opacity: 0, x: 80 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -80 },
      transition: { duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] },
    };
  }
  // Any other route: quick fade
  return {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.15 },
  };
}

export function PageTransitionWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { initial, animate, exit, transition } = getVariants(pathname);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={initial}
        animate={animate}
        exit={exit}
        transition={transition}
        className="pt-14 pb-32 min-h-dvh"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
