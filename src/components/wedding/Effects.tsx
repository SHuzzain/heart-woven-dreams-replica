import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Floating petals layered over the whole page (subtle, behind content)
export const FloatingPetals = () => {
  const petals = Array.from({ length: 14 }, (_, i) => i);
  return (
    <div className="pointer-events-none fixed inset-0 z-[1] overflow-hidden">
      {petals.map((i) => {
        const left = (i * 7.3) % 100;
        const delay = (i * 1.2) % 8;
        const dur = 14 + (i % 6) * 2;
        const size = 10 + (i % 5) * 4;
        const hue = i % 2 === 0 ? "350 60% 80%" : "38 70% 78%";
        return (
          <span
            key={i}
            className="absolute block rounded-full opacity-40 blur-[1px]"
            style={{
              left: `${left}%`,
              top: "-40px",
              width: size,
              height: size * 1.3,
              background: `hsl(${hue})`,
              animation: `petal-fall ${dur}s linear ${delay}s infinite`,
            }}
          />
        );
      })}
      <style>{`
        @keyframes petal-fall {
          0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.5; }
          100% { transform: translateY(110vh) translateX(80px) rotate(420deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

// Fireworks burst on scroll near bottom
export const Fireworks = () => {
  const [bursts, setBursts] = useState<{ id: number; x: number; y: number }[]>([]);
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY + window.innerHeight;
      const total = document.documentElement.scrollHeight;
      if (!triggered && scrolled / total > 0.92) {
        setTriggered(true);
        const newBursts = Array.from({ length: 5 }).map((_, i) => ({
          id: Date.now() + i,
          x: 15 + Math.random() * 70,
          y: 20 + Math.random() * 50,
        }));
        setBursts(newBursts);
        setTimeout(() => setBursts([]), 2400);
        // allow re-trigger after a while
        setTimeout(() => setTriggered(false), 6000);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [triggered]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[60]">
      <AnimatePresence>
        {bursts.map((b) => (
          <Burst key={b.id} x={b.x} y={b.y} />
        ))}
      </AnimatePresence>
    </div>
  );
};

const Burst = ({ x, y }: { x: number; y: number }) => {
  const particles = Array.from({ length: 24 });
  const colors = ["#f0c97a", "#f7c5cc", "#fbe2c4", "#d4a05a"];
  return (
    <div className="absolute" style={{ left: `${x}%`, top: `${y}%` }}>
      {particles.map((_, i) => {
        const angle = (i / particles.length) * Math.PI * 2;
        const dist = 80 + Math.random() * 60;
        const dx = Math.cos(angle) * dist;
        const dy = Math.sin(angle) * dist;
        return (
          <motion.span
            key={i}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{ x: dx, y: dy, opacity: 0, scale: 0.4 }}
            transition={{ duration: 1.6, ease: [0.1, 0.7, 0.3, 1] }}
            className="absolute w-1.5 h-1.5 rounded-full"
            style={{
              background: colors[i % colors.length],
              boxShadow: `0 0 8px ${colors[i % colors.length]}`,
            }}
          />
        );
      })}
    </div>
  );
};
