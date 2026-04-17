"use client";

import { useContext, useRef } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { LayoutRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime";
import type { ReactNode } from "react";

const SPRING = { type: "spring" as const, damping: 25, stiffness: 220, mass: 0.8 };

/**
 * Captures the LayoutRouterContext value on first render and holds it frozen
 * so the slide panel keeps rendering its original route content while AnimatePresence
 * runs the exit animation — even after Next.js has updated children to the new route.
 */
function FrozenRoute({ children }: { children: ReactNode }) {
  const context = useContext(LayoutRouterContext);
  const frozen = useRef(context).current;
  return (
    <LayoutRouterContext.Provider value={frozen!}>
      {children}
    </LayoutRouterContext.Provider>
  );
}

export function PageTransitionWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isSlide = pathname === "/profile" || pathname === "/news";

  return (
    <div className="relative w-full">
      {/*
       * Permanent base layer — Chat and Catalog live here and never unmount.
       * Outside AnimatePresence entirely, so they have zero exit animation
       * and cannot flash when a slide page appears or disappears above them.
       */}
      <div className="relative z-0 w-full pt-14 pb-32 min-h-dvh">
        {!isSlide ? children : null}
      </div>

      {/*
       * Slide panels — fixed above the base layer.
       * FrozenRoute prevents children from swapping to Chat content mid-exit.
       */}
      <AnimatePresence>
        {pathname === "/profile" && (
          <motion.div
            key="profile-panel"
            initial={{ x: "-100%" }}
            animate={{ x: 0, transition: SPRING }}
            exit={{ x: "-100%", transition: SPRING }}
            className="fixed inset-0 z-40 bg-neutral-900 overflow-y-auto pt-14"
          >
            <FrozenRoute>{children}</FrozenRoute>
          </motion.div>
        )}
        {pathname === "/news" && (
          <motion.div
            key="news-panel"
            initial={{ x: "100%" }}
            animate={{ x: 0, transition: SPRING }}
            exit={{ x: "100%", transition: SPRING }}
            className="fixed inset-0 z-40 bg-neutral-900 overflow-y-auto pt-14"
          >
            <FrozenRoute>{children}</FrozenRoute>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
