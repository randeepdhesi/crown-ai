"use client";

import { useContext, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { LayoutRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime";
import type { ReactNode } from "react";

const SPRING = { type: "spring" as const, damping: 25, stiffness: 220, mass: 0.8 };
const FADE = { duration: 0.2 };

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
  const router = useRouter();
  const isSlide = pathname === "/profile" || pathname === "/news";

  return (
    <div className="relative w-full">
      {/* Permanent base layer — Chat/Catalog never unmount, zero animation */}
      <div className="relative z-0 w-full pt-14 pb-32 min-h-dvh">
        {!isSlide ? children : null}
      </div>

      {/* Blurred backdrop — sits at z-30, behind panels (z-40) */}
      <AnimatePresence>
        {isSlide && (
          <motion.div
            key="drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={FADE}
            className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm cursor-pointer"
            onClick={() => router.push("/")}
          />
        )}
      </AnimatePresence>

      {/* Profile — left-edge drawer */}
      <AnimatePresence>
        {pathname === "/profile" && (
          <motion.div
            key="profile-panel"
            initial={{ x: "-100%" }}
            animate={{ x: 0, transition: SPRING }}
            exit={{ x: "-100%", transition: SPRING }}
            className="fixed top-0 left-0 z-40 h-full w-full md:w-[400px] bg-neutral-900 border-r border-white/5 shadow-2xl overflow-y-auto pt-14 md:rounded-r-3xl"
          >
            <FrozenRoute>{children}</FrozenRoute>
          </motion.div>
        )}
      </AnimatePresence>

      {/* News — right-edge drawer */}
      <AnimatePresence>
        {pathname === "/news" && (
          <motion.div
            key="news-panel"
            initial={{ x: "100%" }}
            animate={{ x: 0, transition: SPRING }}
            exit={{ x: "100%", transition: SPRING }}
            className="fixed top-0 right-0 z-40 h-full w-full md:w-[400px] bg-neutral-900 border-l border-white/5 shadow-2xl overflow-y-auto pt-14 md:rounded-l-3xl"
          >
            <FrozenRoute>{children}</FrozenRoute>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
