export const appleEase = [0.2, 0.8, 0.2, 1] as const;

export const springSnappy = {
  type: "spring",
  stiffness: 400,
  damping: 30,
} as const;

export const springPanel = {
  type: "spring",
  stiffness: 200,
  damping: 26,
} as const;

export const heroEntrance = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: appleEase },
} as const;

export const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: springPanel,
} as const;
