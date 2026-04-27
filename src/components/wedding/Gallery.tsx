import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useWeddingContent } from "./content";

export const Gallery = () => {
  const { content } = useWeddingContent();
  const photos = content.gallery;
  const [active, setActive] = useState<number | null>(null);

  const next = () => setActive((i) => (i === null ? null : (i + 1) % photos.length));
  const prev = () => setActive((i) => (i === null ? null : (i - 1 + photos.length) % photos.length));

  return (
    <section id="gallery" className="relative py-32 md:py-40 overflow-hidden bg-gradient-to-b from-ivory to-blush/30">
      <div className="container relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-center mb-20"
        >
          <p className="font-serif tracking-[0.4em] uppercase text-sm text-gold-deep ornament">
            Memories
          </p>
          <h2 className="font-serif text-6xl md:text-8xl mt-4 text-cocoa">
            Moments in <span className="font-script text-gradient-gold">frame</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[180px] md:auto-rows-[220px] gap-4 md:gap-6">
          {photos.map((p, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6 }}
              onClick={() => setActive(i)}
              className={`group relative overflow-hidden rounded-2xl shadow-soft hover:shadow-petal transition-shadow ${p.span ?? ""}`}
            >
              <img
                src={p.src}
                alt={p.alt}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-cocoa/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-4 left-4 right-4 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all">
                <span className="font-serif italic text-ivory text-lg">{p.alt}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {active !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-cocoa/90 backdrop-blur-md flex items-center justify-center p-6"
            onClick={() => setActive(null)}
          >
            <button
              className="absolute top-6 right-6 w-12 h-12 rounded-full glass-dark flex items-center justify-center text-ivory hover:bg-ivory/20 transition"
              onClick={(e) => { e.stopPropagation(); setActive(null); }}
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
            <button
              className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full glass-dark flex items-center justify-center text-ivory hover:bg-ivory/20 transition"
              onClick={(e) => { e.stopPropagation(); prev(); }}
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full glass-dark flex items-center justify-center text-ivory hover:bg-ivory/20 transition"
              onClick={(e) => { e.stopPropagation(); next(); }}
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <motion.img
              key={active}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              src={photos[active].src}
              alt={photos[active].alt}
              className="max-w-[90vw] max-h-[85vh] object-contain rounded-xl shadow-elegant"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
