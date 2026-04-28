import { motion } from "framer-motion";
import { MapPin, Navigation } from "lucide-react";
import { weddingConfig } from "./config";

export const Location = () => {
  const v = weddingConfig.venue;
  return (
    <section id="location" className="relative py-32 md:py-40 bg-ivory">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-center mb-20"
        >
          <p className="font-serif tracking-[0.4em] uppercase text-sm text-gold-deep ornament">
            Find Us
          </p>
          <h2 className="font-serif text-6xl md:text-8xl mt-4 text-cocoa">
            The <span className="font-script text-gradient-gold">Venue</span>
          </h2>
          <p className="mt-6 font-serif italic text-cocoa/70 text-lg">
            Reception &amp; Wedding will be held at the same venue
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="group"
          >
            <div className="relative overflow-hidden rounded-3xl shadow-elegant">
              <div className="aspect-[16/9] relative">
                <iframe
                  title={v.name}
                  src={v.mapsEmbedSrc}
                  className="absolute inset-0 w-full h-full grayscale-[20%] sepia-[10%] group-hover:grayscale-0 transition-all duration-700"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <motion.div
                  animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 2.4, repeat: Infinity }}
                  className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gold/30 blur-xl"
                />
              </div>

              <div className="glass p-8 md:p-10 relative">
                <div className="text-center">
                  <p className="font-serif italic text-gold-deep tracking-widest uppercase text-xs">
                    Wedding & Reception Venue
                  </p>
                  <h3 className="font-serif text-3xl md:text-4xl mt-3 text-cocoa flex items-center justify-center gap-2">
                    <MapPin className="w-5 h-5 text-gold" />
                    {v.name}
                  </h3>
                  <p className="text-cocoa/60 text-sm mt-2 font-light">{v.address}</p>

                  <div className="mt-6 grid sm:grid-cols-2 gap-4 max-w-md mx-auto text-sm font-serif">
                    <div className="rounded-2xl border border-gold/20 bg-ivory/50 p-4">
                      <p className="text-gold-deep tracking-widest uppercase text-xs">Reception</p>
                      <p className="mt-2 text-cocoa">17 May 2026</p>
                      <p className="text-cocoa/70">{weddingConfig.receptionTime}</p>
                    </div>
                    <div className="rounded-2xl border border-gold/20 bg-ivory/50 p-4">
                      <p className="text-gold-deep tracking-widest uppercase text-xs">Wedding</p>
                      <p className="mt-2 text-cocoa">18 May 2026</p>
                      <p className="text-cocoa/70">{weddingConfig.weddingTime}</p>
                    </div>
                  </div>

                  <a
                    href={v.mapsDirectionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-gold px-6 py-3 font-serif tracking-[0.2em] uppercase text-sm text-ivory shadow-soft hover:shadow-glow transition-shadow"
                  >
                    <Navigation className="w-4 h-4" />
                    Get Directions
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
