import { motion } from "framer-motion";
import { Mail, Phone, Heart } from "lucide-react";
import { weddingConfig } from "./config";

export const Footer = () => {
  return (
    <footer className="relative bg-cocoa text-ivory py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-cocoa via-cocoa to-[hsl(25_30%_12%)]" />
      <div className="absolute inset-0 bg-gradient-radial opacity-20" />

      <div className="container relative text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <div className="font-script text-7xl md:text-8xl text-gradient-gold leading-none">
            {weddingConfig.initials}
          </div>
          <p className="mt-4 font-serif italic text-ivory/70 text-lg">
            With love and gratitude
          </p>
        </motion.div>

        <div className="mt-10 mx-auto h-px w-32 bg-gradient-to-r from-transparent via-gold to-transparent" />

        <p className="mt-10 max-w-xl mx-auto font-serif text-ivory/80 leading-relaxed">
          Thank you for being part of our story. Your presence — in person or in spirit —
          means the world to us.
        </p>

        <div className="mt-10 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-10 text-sm font-serif text-ivory/70">
          <a href={`mailto:${weddingConfig.contactEmail}`} className="flex items-center gap-2 hover:text-gold-light transition-colors">
            <Mail className="w-4 h-4" />
            {weddingConfig.contactEmail}
          </a>
          <a href={`tel:${weddingConfig.contactPhone}`} className="flex items-center gap-2 hover:text-gold-light transition-colors">
            <Phone className="w-4 h-4" />
            {weddingConfig.contactPhone}
          </a>
        </div>

        <div className="mt-12 flex items-center justify-center gap-2 text-xs tracking-[0.3em] uppercase text-ivory/40 font-serif">
          <span>Made with</span>
          <Heart className="w-3 h-3 fill-rose text-rose" />
          <span>for {weddingConfig.bride} &amp; {weddingConfig.groom}</span>
        </div>
      </div>
    </footer>
  );
};
