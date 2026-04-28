import { useScroll, useTransform, type MotionValue } from "framer-motion";
import type { RefObject } from "react";

type ScrollOffset = NonNullable<Parameters<typeof useScroll>[0]>["offset"];

export type UseParallaxOptions = {
  /**
   * Total pixel distance the element travels across a single viewport pass.
   * Smaller = subtler. Default `60`.
   */
  distance?: number;
  /**
   * `"up"` drifts the element upward (slightly faster than the surrounding
   * scroll) for a "closer to camera" feel; `"down"` reverses it for a
   * "deeper background" feel. Default `"up"`.
   */
  direction?: "up" | "down";
  /**
   * `useScroll` offset boundaries. Defaults to a full viewport pass:
   * `["start end", "end start"]` (element enters from below → leaves at top).
   */
  offset?: ScrollOffset;
};

/**
 * Scroll-linked parallax helper.
 *
 * Returns a `MotionValue<number>` that you can plug into a `motion.*`
 * element's `style={{ y }}` (or any other Y-axis transform). The element
 * smoothly drifts a few pixels as it passes through the viewport, giving the
 * surrounding layout a subtle sense of depth.
 *
 * @example
 * const ref = useRef<HTMLDivElement>(null);
 * const y = useParallax(ref, { distance: 40 });
 * return <motion.div ref={ref} style={{ y }}>...</motion.div>;
 */
export const useParallax = <T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  {
    distance = 60,
    direction = "up",
    offset = ["start end", "end start"],
  }: UseParallaxOptions = {}
): MotionValue<number> => {
  const { scrollYProgress } = useScroll({ target: ref, offset });
  const half = distance / 2;
  const [from, to] = direction === "up" ? [half, -half] : [-half, half];
  return useTransform(scrollYProgress, [0, 1], [from, to]);
};
