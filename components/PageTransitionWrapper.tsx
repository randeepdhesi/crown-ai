"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion, Transition, Target } from "framer-motion";
import { ReactNode } from "react";

// Same tween physics as the Settings bottom sheet
const SLIDE_TRANSITION: Transition = {
  type: "tween",
  duration: 0.3,
  ease: [0.32, 0.72, 0, 1],
};

type RouteVariants = {
  initial: Target;
  animate: Target;
  exit: Target;
  transition: Transition;
};

function getVariants(pathname: string): RouteVariants {
  // Profile: full-width slide in from left
  if (pathname === "/profile") {
    return {
      initial: { x: "-100%" },
      animate: { x: 0 },
      exit: { x: "-100%" },
      transition: SLIDE_TRANSITION,
    };
  }
  // News: full-width slide in from right
  if (pathname === "/news") {
    return {
      initial: { x: "100%" },
      animate: { x: 0 },
      exit: { x: "100%" },
      transition: SLIDE_TRANSITION,
    };
  }
  // Chat and Catalog: fast fade (mode="wait" needs a real animation to fire completion)
  return {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.08 },
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
