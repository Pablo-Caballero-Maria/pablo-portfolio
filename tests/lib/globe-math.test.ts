import { describe, expect, it } from "vitest";

import {
  MAX_TILT,
  type Rotation,
  clamp,
  dragRotation,
  easeInOutCubic,
  focusRotation,
  interpolateRotation,
  normalizeLongitude,
  spin,
} from "@/lib/globe/math";

describe("normalizeLongitude", () => {
  it.each([
    [0, 0],
    [179, 179],
    [180, -180],
    [190, -170],
    [-190, 170],
    [720 + 45, 45],
  ])("%d° → %d°", (input, expected) => {
    expect(normalizeLongitude(input)).toBeCloseTo(expected);
  });
});

describe("clamp", () => {
  it("bounds a value", () => {
    expect(clamp(5, 0, 3)).toBe(3);
    expect(clamp(-5, 0, 3)).toBe(0);
    expect(clamp(2, 0, 3)).toBe(2);
  });
});

describe("dragRotation", () => {
  const start: Rotation = [10, 0, 0];

  it("turns with horizontal drags and tilts with vertical ones", () => {
    expect(dragRotation(start, 100, 0, 0.5)).toEqual([60, 0, 0]);
    expect(dragRotation(start, 0, 20, 0.5)).toEqual([10, -10, 0]);
  });

  it("never tilts past the limit, so the poles don't flip", () => {
    expect(dragRotation(start, 0, -10_000)[1]).toBe(MAX_TILT);
    expect(dragRotation(start, 0, 10_000)[1]).toBe(-MAX_TILT);
  });
});

describe("spin", () => {
  it("advances the longitude and wraps around", () => {
    expect(spin([179.9, 12, 0], 0.2)[0]).toBeCloseTo(-179.9);
    const [lambda, phi] = spin([0, 12, 0], 0.2);
    expect(lambda).toBeCloseTo(0.2);
    expect(phi).toBe(12);
  });
});

describe("focusRotation", () => {
  it("brings a centroid to the front, slightly above centre", () => {
    const [lambda, phi, gamma] = focusRotation([-3.7, 40]);
    expect(lambda).toBeCloseTo(3.7);
    expect(phi).toBeCloseTo(-32);
    expect(gamma).toBe(0);
  });

  it("clamps the tilt for far-north places", () => {
    expect(focusRotation([0, 89])[1]).toBe(-MAX_TILT);
  });
});

describe("interpolateRotation", () => {
  it("returns the ends at t = 0 and t = 1", () => {
    const from: Rotation = [10, 5, 0];
    const to: Rotation = [50, -20, 0];
    expect(interpolateRotation(from, to, 0)).toEqual(from);
    expect(interpolateRotation(from, to, 1)).toEqual(to);
  });

  it("turns the short way across the antimeridian", () => {
    // From 170° to -170° is 20° east, not 340° west.
    const halfway = interpolateRotation([170, 0, 0], [-170, 0, 0], 0.5);
    expect(Math.abs(halfway[0])).toBeCloseTo(180);
  });
});

describe("easeInOutCubic", () => {
  it("starts at 0, ends at 1 and is symmetric", () => {
    expect(easeInOutCubic(0)).toBe(0);
    expect(easeInOutCubic(1)).toBe(1);
    expect(easeInOutCubic(0.5)).toBeCloseTo(0.5);
    expect(easeInOutCubic(0.25) + easeInOutCubic(0.75)).toBeCloseTo(1);
  });
});
