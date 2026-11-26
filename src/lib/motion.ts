/**
 * The few animations of the site (motion), kept short and subtle and shared here so they feel
 * alike. Only things that appear after an interaction are animated, never prerendered content
 * (it would stay hidden until the JavaScript loads). Visitors who ask their system for reduced
 * motion get none (MotionConfig in Providers.tsx).
 */
import type { Transition } from "motion/react";

export const EASE_OUT: Transition = { duration: 0.2, ease: [0.22, 1, 0.36, 1] };

/** Fades in while rising a few pixels; fades out the same way. */
export const rise = {
  initial: { opacity: 0, y: 4 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
  transition: EASE_OUT,
} as const;

/** Just a fade, for things placed with a transform of their own (the globe's tooltip). */
export const fade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.15 },
} as const;
