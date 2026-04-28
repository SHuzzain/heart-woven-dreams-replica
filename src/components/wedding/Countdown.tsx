import { motion, AnimatePresence } from "framer-motion";
import { useRef } from "react";
import { weddingConfig, useCountdown } from "./config";
import { useParallax } from "@/hooks/use-parallax";

const Unit = ({ value, label }: { value: number; label: string }) => {
  const padded = String(value).padStart(2, "0");
  return (
    <div className="text-center">
      <div className="relative glass rounded-2xl px-4 md:px-8 py-6 md:py-8 min-w-[80px] md:min-w-[140px] shadow-petal overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial opacity-40" />
        <div className="relative h-16 md:h-24 flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="popLayout">
            <motion.span
              key={padded}
              initial={{ y: 30, opacity: 0, filter: "blur(6px)" }}
              animate={{ y: 0, opacity: 1, filter: "blur(0)" }}
              exit={{ y: -30, opacity: 0, filter: "blur(6px)" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="font-serif text-5xl md:text-7xl text-gradient-gold tabular-nums"
            >
              {padded}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
      <p className="mt-3 font-serif tracking-[0.3em] uppercase text-xs md:text-sm text-cocoa/60">
        {label}
      </p>
    </div>
  );
};

export const Countdown = () => {
  const t = useCountdown(weddingConfig.date);

  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const radialRef = useRef<HTMLDivElement>(null);
  // Subtle scroll-linked drifts: background drifts the opposite direction
  // (depth) while the heading and cards drift gently upward (foreground).
  const radialY = useParallax(radialRef, { distance: 80, direction: "down" });
  const headingY = useParallax(headingRef, { distance: 50, direction: "up" });
  const cardsY = useParallax(cardsRef, { distance: 30, direction: "up" });

  return (
    <section
      id="countdown"
      ref={sectionRef}
      className="relative py-32 md:py-40 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-blush" />
      <motion.div
        ref={radialRef}
        style={{ y: radialY }}
        className="absolute inset-0 bg-gradient-radial opacity-60"
      />

      {/* floating petals (CSS) */}
      {Array.from({ length: 12 }).map((_, i) => (
        <span
          key={i}
          className="absolute w-3 h-3 rounded-full bg-blush-deep/40 blur-[1px]"
          style={{
            left: `${(i * 8.3) % 100}%`,
            top: `${(i * 13) % 100}%`,
            animation: `float-petal ${5 + (i % 4)}s ease-in-out infinite`,
            animationDelay: `${i * 0.3}s`,
          }}
        />
      ))}

      <div className="container relative text-center">
        <motion.div
          ref={headingRef}
          style={{ y: headingY }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <p className="font-serif tracking-[0.4em] uppercase text-sm text-gold-deep ornament">
            The Countdown
          </p>
          <h2 className="font-serif text-5xl md:text-7xl mt-4 text-cocoa">
            Until we say <span className="font-script text-gradient-gold">"I do"</span>
          </h2>
        </motion.div>

        <motion.div
          ref={cardsRef}
          style={{ y: cardsY }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-3 md:gap-6"
        >
          <Unit value={t.days} label="Days" />
          <Unit value={t.hours} label="Hours" />
          <Unit value={t.minutes} label="Minutes" />
          <Unit value={t.seconds} label="Seconds" />
        </motion.div>
      </div>
    </section>
  );
};
