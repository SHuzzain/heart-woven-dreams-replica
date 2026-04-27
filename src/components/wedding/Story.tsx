import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { StoryMilestone, useWeddingContent } from "./content";

const StoryCard = ({ item, index }: { item: StoryMilestone; index: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const rotate = useTransform(scrollYProgress, [0, 1], [index % 2 === 0 ? -3 : 3, index % 2 === 0 ? 2 : -2]);
  const isLeft = index % 2 === 0;

  return (
    <div ref={ref} className="grid md:grid-cols-2 gap-10 md:gap-20 items-center">
      <motion.div
        style={{ y, rotate }}
        className={`relative ${isLeft ? "md:order-1" : "md:order-2"}`}
      >
        <div className="relative group">
          <div className="absolute -inset-3 bg-gradient-gold opacity-30 blur-2xl rounded-3xl" />
          <motion.div
            whileHover={{ scale: 1.02, rotateY: 5 }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-2xl shadow-petal"
            style={{ transformStyle: "preserve-3d" }}
          >
            <img
              src={item.image}
              alt={item.title}
              loading="lazy"
              className="w-full aspect-[4/5] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-cocoa/30 via-transparent to-transparent" />
            <div className="absolute top-4 left-4 glass rounded-full px-4 py-1.5">
              <span className="font-serif italic text-sm text-cocoa">{item.year}</span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: isLeft ? 50 : -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className={`${isLeft ? "md:order-2" : "md:order-1"}`}
      >
        <span className="font-script text-5xl text-gradient-gold">Chapter {String(index + 1).padStart(2, "0")}</span>
        <h3 className="font-serif text-5xl md:text-6xl mt-2 text-cocoa">{item.title}</h3>
        <div className="mt-6 h-px w-24 bg-gradient-to-r from-gold to-transparent" />
        <p className="mt-6 text-lg leading-relaxed text-cocoa/75 font-light max-w-md">
          {item.description}
        </p>
      </motion.div>
    </div>
  );
};

export const Story = () => {
  const { content } = useWeddingContent();

  return (
    <section id="story" className="relative py-32 md:py-40 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-ivory via-ivory-warm to-ivory" />
      <div className="absolute inset-0 bg-noise opacity-[0.03]" />

      <div className="container relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-center mb-24"
        >
          <p className="font-serif tracking-[0.4em] uppercase text-sm text-gold-deep ornament">
            Our Journey
          </p>
          <h2 className="font-serif text-6xl md:text-8xl mt-4 text-cocoa">
            The Love <span className="font-script text-gradient-gold">Story</span>
          </h2>
        </motion.div>

        <div className="space-y-32 md:space-y-40">
          {content.story.map((m, i) => (
            <StoryCard key={i} item={m} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};
