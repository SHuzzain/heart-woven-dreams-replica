import { motion } from "framer-motion";
import { Calendar, Clock, Heart, Wine, MapPin } from "lucide-react";
import { weddingConfig } from "./config";

const events = [
  {
    icon: Wine,
    label: "The Celebration",
    title: "Reception",
    date: "Sunday, May 17, 2026",
    time: "7:00 PM",
  },
  {
    icon: Heart,
    label: "The Ceremony",
    title: "Wedding",
    date: "Monday, May 18, 2026",
    time: weddingConfig.weddingTime,
  },
];

export const Events = () => {
  return (
    <section id="events" className="relative py-32 md:py-40 overflow-hidden bg-ivory-warm">
      <div className="absolute inset-0 bg-gradient-to-br from-blush/20 via-transparent to-gold-light/20" />

      <div className="container relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-center mb-20"
        >
          <p className="font-serif tracking-[0.4em] uppercase text-sm text-gold-deep ornament">
            Save the Date
          </p>
          <h2 className="font-serif text-6xl md:text-8xl mt-4 text-cocoa">
            The <span className="font-script text-gradient-gold">Celebration</span>
          </h2>
          <p className="mt-6 font-serif italic text-cocoa/70 text-lg max-w-xl mx-auto flex items-center justify-center gap-2">
            <MapPin className="w-4 h-4 text-gold" />
            Both at {weddingConfig.venue.name}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {events.map((e, i) => {
            const Icon = e.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -8 }}
                className="group relative"
              >
                <div className="absolute -inset-2 bg-gradient-gold opacity-0 group-hover:opacity-30 blur-2xl transition-opacity rounded-3xl" />
                <div className="relative glass rounded-3xl p-10 md:p-12 text-center">
                  <div className="mx-auto w-16 h-16 rounded-full bg-gradient-gold flex items-center justify-center shadow-glow mb-6">
                    <Icon className="w-7 h-7 text-ivory" strokeWidth={1.5} />
                  </div>
                  <p className="font-serif italic text-gold-deep tracking-widest uppercase text-xs">
                    {e.label}
                  </p>
                  <h3 className="font-serif text-5xl md:text-6xl mt-3 text-cocoa">{e.title}</h3>
                  <div className="mt-6 mx-auto h-px w-20 bg-gradient-to-r from-transparent via-gold to-transparent" />

                  <div className="mt-8 space-y-3 font-serif text-cocoa/80">
                    <div className="flex items-center justify-center gap-3">
                      <Calendar className="w-4 h-4 text-gold" />
                      <span className="text-lg">{e.date}</span>
                    </div>
                    <div className="flex items-center justify-center gap-3">
                      <Clock className="w-4 h-4 text-gold" />
                      <span className="text-lg">{e.time}</span>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-gold/20">
                    <p className="font-serif text-2xl text-cocoa">{weddingConfig.venue.name}</p>
                    <p className="text-sm text-cocoa/60 mt-1 font-light">{weddingConfig.venue.address}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
