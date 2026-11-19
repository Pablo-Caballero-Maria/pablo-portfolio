/**
 * The globe's rotation maths, kept pure so it can be tested without a DOM.
 *
 * A rotation is d3-geo's `[λ, φ, γ]` in degrees: λ spins the globe around its axis (longitude),
 * φ tilts it towards or away from the viewer (latitude) and γ rolls it (always 0 here).
 */

export type Rotation = [lambda: number, phi: number, gamma: number];

/** How far the globe may tilt, so the poles never flip over. */
export const MAX_TILT = 70;

/** Degrees of rotation per SVG unit dragged. */
export const DRAG_SENSITIVITY = 0.35;

/** Degrees per frame of the idle spin. */
export const SPIN_STEP = 0.18;

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Wraps a longitude into [-180, 180). */
export function normalizeLongitude(lambda: number): number {
  return ((((lambda + 180) % 360) + 360) % 360) - 180;
}

/** The rotation after dragging by (dx, dy) SVG units from `start`. */
export function dragRotation(start: Rotation, dx: number, dy: number, k = DRAG_SENSITIVITY): Rotation {
  return [normalizeLongitude(start[0] + dx * k), clamp(start[1] - dy * k, -MAX_TILT, MAX_TILT), 0];
}

/** One frame of the idle spin. */
export function spin(rotation: Rotation, step = SPIN_STEP): Rotation {
  return [normalizeLongitude(rotation[0] + step), rotation[1], rotation[2]];
}

/**
 * The rotation that brings a country's centroid `[longitude, latitude]` to the front, tilted a
 * little less than the full latitude so the country sits slightly above the centre.
 */
export function focusRotation([longitude, latitude]: [number, number]): Rotation {
  return [normalizeLongitude(-longitude), clamp(-latitude * 0.8, -MAX_TILT, MAX_TILT), 0];
}

/** Linear interpolation between two rotations, turning the short way round in longitude. */
export function interpolateRotation(from: Rotation, to: Rotation, t: number): Rotation {
  let delta = to[0] - from[0];
  if (delta > 180) delta -= 360;
  if (delta < -180) delta += 360;
  return [
    normalizeLongitude(from[0] + delta * t),
    from[1] + (to[1] - from[1]) * t,
    from[2] + (to[2] - from[2]) * t,
  ];
}

/** Cubic ease-in-out on t ∈ [0, 1]. */
export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}
