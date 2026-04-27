import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { HeroScene } from "./HeroScene";
import { weddingConfig } from "./config";
import heroBg from "@/assets/hero-bg.jpg";

export const Hero = ({ onEnter }: { onEnter: () => void }) => {
  return (
    <section id="hero" className="relative h-screen w-full overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-110"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ivory/40 via-ivory/20 to-ivory/70" />
      <div className="absolute inset-0 bg-gradient-radial opacity-60" />

      {/* 3D scene */}
      <div className="absolute inset-0 pointer-events-none">
        <HeroScene />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3 }}
          className="mb-6"
        >
          <span className="font-script text-4xl md:text-5xl text-gradient-gold">
            Wedding Invitation
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, filter: "blur(8px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0)" }}
          transition={{ duration: 1.6, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="hero-title-3d font-serif text-cocoa"
        >
          <h1 className="flex flex-col xl:block text-6xl sm:text-7xl md:text-[8rem] xl:text-[8.5rem] 2xl:text-[10rem] leading-[0.85] xl:leading-[0.95] tracking-tight">
            {weddingConfig.bride}
            <span className="font-script text-gold-deep mx-0 xl:mx-6 text-5xl md:text-7xl xl:text-8xl 2xl:text-9xl align-middle">
              &amp;
            </span>
            {weddingConfig.groom}
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.4 }}
          className="mt-8 flex flex-col items-center gap-6"
        >
          <div className="gold-divider">
            <span className="font-serif italic text-lg md:text-xl text-cocoa/80 tracking-widest">
              {weddingConfig.tagline}
            </span>
          </div>

          <p className="font-serif text-base md:text-lg text-cocoa/70 tracking-[0.3em] uppercase">
            {weddingConfig.date.toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2 }}
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={onEnter}
          className="group mt-12 relative overflow-hidden rounded-full bg-gradient-gold px-10 py-4 font-serif text-lg tracking-[0.25em] uppercase text-ivory shadow-elegant transition-all hover:shadow-glow"
        >
          <span className="relative z-10">Enter Experience</span>
          <span className="absolute inset-0 bg-cocoa opacity-0 transition-opacity group-hover:opacity-10" />
        </motion.button>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-cocoa/60"
      >
        <span className="font-serif text-xs tracking-[0.3em] uppercase">Scroll</span>
        <ChevronDown className="w-4 h-4 animate-bounce" />
      </motion.div>
    </section>
  );
};
