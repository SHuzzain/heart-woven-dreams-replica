import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { weddingConfig } from "./config";

export const IntroOverlay = ({ visible, onDone }: { visible: boolean; onDone: () => void }) => {
  useEffect(() => {
    if (visible) {
      const t = setTimeout(onDone, 3200);
      return () => clearTimeout(t);
    }
  }, [visible, onDone]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 1 } }}
          className="fixed inset-0 z-[100] bg-gradient-blush flex items-center justify-center overflow-hidden"
        >
          {/* radial glow */}
          <div className="absolute inset-0 bg-gradient-radial opacity-80" />

          {/* center monogram */}
          <div className="relative text-center">
            <motion.div
              initial={{ scale: 0.6, opacity: 0, rotate: -10 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <div className="absolute -inset-16 rounded-full bg-gold/20 blur-3xl animate-pulse" />
              <div className="relative">
                <div className="font-script text-[10rem] md:text-[16rem] leading-none text-gradient-gold px-[30px]">
                  {weddingConfig.initials}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.2 }}
              className="mt-4 font-serif tracking-[0.4em] uppercase text-sm text-cocoa/70"
            >
              A Love Story
            </motion.div>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.6, delay: 1.6 }}
              className="mt-6 mx-auto h-px w-40 bg-gradient-to-r from-transparent via-gold to-transparent"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
