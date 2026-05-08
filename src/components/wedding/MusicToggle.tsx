import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

/**
 * Background music for the wedding invitation.
 *
 * Looking for the actual MP3? See `public/music/README.md` for the list
 * of recommended royalty-free Tamil / Indian romantic instrumentals and
 * how to swap your own track in.
 *
 * The local file is preferred (faster, no CDN dependency). If it's
 * missing for any reason, a soft Pixabay loop is used as a fallback so
 * the toggle never plays silence.
 */
const LOCAL_TRACK = "/music/wedding-bgm.mp3";
const FALLBACK_TRACK = "https://cdn.pixabay.com/audio/2022/10/30/audio_347111d654.mp3";

const FADE_MS = 800;
const TARGET_VOLUME = 0.35;

export const MusicToggle = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeRafRef = useRef<number | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = new Audio(LOCAL_TRACK);
    audio.loop = true;
    audio.volume = 0;
    audio.preload = "auto";
    audio.crossOrigin = "anonymous";
    // If the local file is missing (404 / network), gracefully swap to
    // the royalty-free Pixabay loop so the button stays functional.
    audio.addEventListener("error", () => {
      if (audio.src !== FALLBACK_TRACK) {
        audio.src = FALLBACK_TRACK;
        audio.load();
      }
    });
    audioRef.current = audio;
    return () => {
      if (fadeRafRef.current !== null) cancelAnimationFrame(fadeRafRef.current);
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  // Smooth volume ramp so play/pause doesn't pop.
  const fadeTo = (target: number, onDone?: () => void) => {
    const audio = audioRef.current;
    if (!audio) return;
    if (fadeRafRef.current !== null) cancelAnimationFrame(fadeRafRef.current);

    const start = audio.volume;
    const startedAt = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - startedAt) / FADE_MS);
      audio.volume = start + (target - start) * t;
      if (t < 1) {
        fadeRafRef.current = requestAnimationFrame(tick);
      } else {
        fadeRafRef.current = null;
        onDone?.();
      }
    };
    fadeRafRef.current = requestAnimationFrame(tick);
  };

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      fadeTo(0, () => audio.pause());
      setPlaying(false);
    } else {
      try {
        audio.volume = 0;
        await audio.play();
        setPlaying(true);
        fadeTo(TARGET_VOLUME);
      } catch {
        /* autoplay blocked silently */
      }
    }
  };

  return (
    <Tooltip delayDuration={250}>
      <TooltipTrigger asChild>
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggle}
          aria-label={playing ? "Mute music" : "Play music"}
          aria-pressed={playing}
          className="group fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full glass flex items-center justify-center text-cocoa shadow-soft hover:shadow-glow transition-shadow"
        >
          <AnimatePresence mode="wait" initial={false}>
            {playing ? (
              <motion.span
                key="on"
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.6, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="relative inline-flex items-center justify-center"
              >
                <Volume2 className="w-5 h-5" />
              </motion.span>
            ) : (
              <motion.span
                key="off"
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.6, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="relative inline-flex items-center justify-center"
              >
                <VolumeX className="w-5 h-5" />
              </motion.span>
            )}
          </AnimatePresence>

          {/* Pulsing gold ring when playing */}
          {playing && (
            <>
              <span className="absolute inset-0 rounded-full border border-gold/40 animate-ping" />
              <span className="absolute -inset-1 rounded-full bg-gold/15 blur-md opacity-70" />
            </>
          )}
        </motion.button>
      </TooltipTrigger>
      <TooltipContent
        side="left"
        sideOffset={14}
        className="font-serif italic tracking-wider text-cocoa border-gold/30 bg-ivory/95"
      >
        {playing ? "Mute music" : "Play music"}
      </TooltipContent>
    </Tooltip>
  );
};
