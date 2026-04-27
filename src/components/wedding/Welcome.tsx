import { motion } from "framer-motion";
import { weddingConfig } from "./config";

export const Welcome = () => {
  return (
    <section className="relative py-28 md:py-36 bg-ivory">
      <div className="container max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
        >
          <p className="font-serif tracking-[0.4em] uppercase text-sm text-gold-deep ornament">
            A Note From Us
          </p>
          <h2 className="font-script text-7xl md:text-8xl text-gradient-gold mt-4">
            Welcome
          </h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.3 }}
          className="mt-8 font-serif italic text-2xl md:text-3xl leading-relaxed text-cocoa/80"
        >
          "Out of all the moments in life, we couldn't imagine spending the most beautiful one
          without you. Thank you for being part of our forever."
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.7 }}
          className="mt-8 font-script text-5xl text-gold-deep"
        >
          {weddingConfig.bride} &amp; {weddingConfig.groom}
        </motion.p>
      </div>
    </section>
  );
};
