import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

type ScrollIndicatorProps = {
  /** Text shown above the chevron. Defaults to "Scroll". */
  label?: string;
  /** Seconds to wait before fading the indicator in. */
  delay?: number;
  /**
   * Optional id of the section to smooth-scroll to when clicked
   * (e.g. "events"). When provided, the indicator renders as an <a>
   * and becomes keyboard / screen-reader accessible.
   */
  targetId?: string;
  /**
   * Override the positioning wrapper classes. The default pins the
   * indicator to the bottom-center of its closest positioned ancestor.
   * Pass any other Tailwind utilities (or "") to reposition / unposition.
   */
  className?: string;
};

const DEFAULT_POSITION = "absolute bottom-10 left-1/2 -translate-x-1/2 z-10";

export const ScrollIndicator = ({
  label = "Scroll",
  delay = 3,
  targetId,
  className = DEFAULT_POSITION,
}: ScrollIndicatorProps) => {
  const wrapperClass = `${className} flex flex-col items-center gap-2 text-cocoa`.trim();

  const motionProps = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { delay, duration: 1 },
  } as const;

  const content = (
    <>
      <span className="font-serif text-sm font-bold tracking-[0.3em] uppercase">{label}</span>
      <ChevronDown className="w-4 h-4 animate-bounce" />
    </>
  );

  if (targetId) {
    return (
      <motion.a
        href={`#${targetId}`}
        aria-label={`Scroll to ${label}`}
        {...motionProps}
        className={`${wrapperClass} cursor-pointer hover:text-gold-deep transition-colors`}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.div {...motionProps} aria-hidden="true" className={wrapperClass}>
      {content}
    </motion.div>
  );
};
