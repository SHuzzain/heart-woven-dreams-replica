import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Compass, MapPin, Heart, X, type LucideIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { weddingConfig } from "./config";
import { useIsMobile } from "@/hooks/use-mobile";

type QuickNavItem = {
  id: string;
  href: string;
  eyebrow: string;
  label: string;
  Icon: LucideIcon;
};

const items: QuickNavItem[] = [
  // Order matters — first item ends up closest to the FAB (bottom of stack);
  // later items stack further upward. Both share the same gold-gradient
  // styling as the trigger so they read as one family.
  {
    id: "celebration",
    href: "#events",
    eyebrow: "Save the Date",
    label: "The Celebration",
    Icon: Heart,
  },
  {
    id: "venue",
    href: "#location",
    eyebrow: "Venue",
    label: weddingConfig.venue.name,
    Icon: MapPin,
  },
];

/**
 * Floating speed-dial in the hero's bottom-left corner.
 *
 * Closed: a single gold-gradient FAB showing a Compass icon.
 * Open:   the Compass swaps to an X and the Venue + Celebration shortcut
 *         icons fan out above it. Tapping any shortcut navigates and
 *         auto-closes the menu; tapping the X (or pressing Escape, or
 *         clicking outside) collapses back to the closed state.
 */
export const HeroQuickNav = () => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Close on Escape and on clicks outside the menu — common menu UX.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onPointer = (e: PointerEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);
  {/* move this top level in mobile view */ }
  return (
    <div
      ref={containerRef}
      className="absolute left-6 md:bottom-10 md:left-10 z-20 flex flex-col-reverse items-start gap-4 max-md:top-2 max-md:left-2"
    >


      {/* Expanded menu items */}
      {isMobile &&
        <AnimatePresence>
          {open &&
            items.map((item, i) => {
              const Icon = item.Icon;
              return (
                <motion.a
                  key={item.id}
                  href={item.href}
                  role="menuitem"
                  aria-label={`${item.eyebrow}: ${item.label}`}
                  title={item.label}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 16, scale: 0.6, x: 2 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 16, scale: 0.6 }}
                  transition={{
                    duration: 0.35,
                    delay: i * 0.07,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  whileHover={{ scale: 1.06, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="group inline-flex items-center gap-3"
                >
                  <span className="relative flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-gold shadow-glow transition-shadow group-hover:shadow-elegant">
                    <span className="absolute inset-0 rounded-full bg-gold/40 blur-xl opacity-60 group-hover:opacity-100 transition-opacity" />
                    <Icon className="relative w-5 h-5 md:w-6 md:h-6 text-ivory" strokeWidth={1.5} />
                  </span>
                  <span className="hidden md:flex flex-col leading-tight rounded-full bg-ivory/60 backdrop-blur-sm px-4 py-1.5 shadow-soft">
                    <span className="font-serif italic text-gold-deep tracking-[0.25em] uppercase text-[10px]">
                      {item.eyebrow}
                    </span>
                    <span className="font-serif text-cocoa text-sm">{item.label}</span>
                  </span>
                </motion.a>
              );
            })}
        </AnimatePresence>
      }


      {/* Trigger / FAB — anchored at the bottom; menu items stack above it */}
      <Tooltip delayDuration={250}>
        <TooltipTrigger asChild>
          <motion.button
            type="button"
            aria-expanded={open}
            aria-haspopup="menu"
            aria-label={open ? "Close quick navigation" : "Open quick navigation"}
            onClick={() => setOpen((v) => !v)}
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 2.6, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ scale: 1.08, y: -4 }}
            whileTap={{ scale: 0.95 }}
            className="group relative flex items-center justify-center size-12 md:size-14 rounded-full bg-gradient-gold shadow-glow transition-shadow hover:shadow-elegant focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-deep focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
          >
            <span className="absolute inset-0 rounded-full bg-gold/40 blur-xl opacity-60 transition-opacity group-hover:opacity-100" />
            {/* Subtle slow rotation on the closed compass for liveliness */}
            <AnimatePresence mode="wait" initial={false}>
              {open ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className="relative inline-flex"
                >
                  <X className="size-6 md:size-7 text-ivory" strokeWidth={2} />
                </motion.span>
              ) : (
                <motion.span
                  key="open"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className="relative inline-flex"
                >
                  <Compass className="size-5 md:size-6 text-ivory" strokeWidth={1.5} />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </TooltipTrigger>
        <TooltipContent
          side="right"
          sideOffset={14}
          className="font-serif italic tracking-wider text-cocoa border-gold/30 bg-ivory/95"
        >
          {open ? "Close menu" : "Find your way"}
        </TooltipContent>
      </Tooltip>

      {!isMobile &&
        <AnimatePresence>
          {open &&
            items.map((item, i) => {
              const Icon = item.Icon;
              return (
                <motion.a
                  key={item.id}
                  href={item.href}
                  role="menuitem"
                  aria-label={`${item.eyebrow}: ${item.label}`}
                  title={item.label}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 16, scale: 0.6, }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 16, scale: 0.6 }}
                  transition={{
                    duration: 0.35,
                    delay: i * 0.07,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  whileHover={{ scale: 1.06, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="group inline-flex items-center gap-3"
                >
                  <span className="relative flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-gold shadow-glow transition-shadow group-hover:shadow-elegant">
                    <span className="absolute inset-0 rounded-full bg-gold/40 blur-xl opacity-60 group-hover:opacity-100 transition-opacity" />
                    <Icon className="relative w-5 h-5 md:w-6 md:h-6 text-ivory" strokeWidth={1.5} />
                  </span>
                  <span className="hidden md:flex flex-col leading-tight rounded-full bg-ivory/60 backdrop-blur-sm px-4 py-1.5 shadow-soft">
                    <span className="font-serif italic text-gold-deep tracking-[0.25em] uppercase text-[10px]">
                      {item.eyebrow}
                    </span>
                    <span className="font-serif text-cocoa text-sm">{item.label}</span>
                  </span>
                </motion.a>
              );
            })}
        </AnimatePresence>
      }
    </div>
  );
};
