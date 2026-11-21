/**
 * Draws the interactive globe into an <svg>: an orthographic projection (d3-geo) of the world's
 * countries, with the visited ones highlighted.
 *
 * It works outside React on purpose: the globe spins every frame, and setting ~180 `d`
 * attributes directly is much cheaper than re-rendering them through React. The React wrapper
 * (src/components/home/Globe.tsx) only creates it, forwards the selected country and destroys it.
 *
 * Interaction: it spins on its own (unless the visitor prefers reduced motion), stops while a
 * country is hovered, follows the pointer when dragged, and turns to a country on `focus()`.
 */
import { geoCentroid, geoGraticule10, geoOrthographic, geoPath } from "d3-geo";
import type { Feature, GeoJsonProperties, Geometry } from "geojson";
import { feature } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";

import {
  type Rotation,
  dragRotation,
  easeInOutCubic,
  focusRotation,
  interpolateRotation,
  spin,
} from "./math";

const SVG_NS = "http://www.w3.org/2000/svg";

/** The SVG's viewBox is SIZE × SIZE; the globe's radius leaves a small margin. */
export const GLOBE_SIZE = 500;
const RADIUS = 236;
const INITIAL_ROTATION: Rotation = [-20, -30, 0];
const FOCUS_DURATION_MS = 900;
/** Pointer travel (SVG units) below which a press counts as a click, not a drag. */
const CLICK_SLOP = 3;

export interface GlobeCountry {
  /** ISO 3166-1 numeric code, as used by the world-atlas TopoJSON ("724" = Spain). */
  id: string;
  kind: "work" | "trip";
}

export interface GlobeHover {
  id: string;
  clientX: number;
  clientY: number;
}

export interface GlobeRendererOptions {
  svg: SVGSVGElement;
  /** world-atlas `countries-110m.json`. */
  world: Topology<{ countries: GeometryCollection }>;
  countries: readonly GlobeCountry[];
  reducedMotion: boolean;
  onSelect: (id: string) => void;
  onHover: (hover: GlobeHover | null) => void;
}

type CountryFeature = Feature<Geometry, GeoJsonProperties>;

interface Shape {
  element: SVGPathElement;
  feature: CountryFeature;
}

interface DragState {
  clientX: number;
  clientY: number;
  start: Rotation;
  moved: boolean;
}

export class GlobeRenderer {
  private readonly projection = geoOrthographic()
    .scale(RADIUS)
    .translate([GLOBE_SIZE / 2, GLOBE_SIZE / 2])
    .clipAngle(90)
    .rotate(INITIAL_ROTATION);
  private readonly path = geoPath(this.projection);
  private readonly graticuleShape = geoGraticule10();
  private readonly graticule: SVGPathElement;
  private readonly shapes: Shape[] = [];
  private readonly visited = new Map<string, Shape>();
  private readonly disposers: Array<() => void> = [];

  private frame = 0;
  private hovering = false;
  private onScreen = true;
  private focusing = false;
  private drag: DragState | null = null;
  private suppressClick = false;

  constructor(private readonly options: GlobeRendererOptions) {
    const { svg, world, countries } = options;
    const kinds = new Map(countries.map((country) => [country.id, country.kind]));

    svg.replaceChildren();
    svg.append(this.create("circle", { class: "ocean", cx: GLOBE_SIZE / 2, cy: GLOBE_SIZE / 2, r: RADIUS }));
    this.graticule = this.create("path", { class: "grat" });
    svg.append(this.graticule);

    const land = this.create("g", {});
    const collection = feature(world, world.objects.countries);
    for (const country of collection.features) {
      const id = String(country.id ?? "");
      const kind = kinds.get(id);
      const element = this.create("path", {
        class: kind ? `visited${kind === "trip" ? " trip" : ""}` : "land",
      });
      const shape = { element, feature: country };
      this.shapes.push(shape);
      if (kind) {
        this.visited.set(id, shape);
        this.bindCountry(element, id);
      }
      land.append(element);
    }
    svg.append(land);

    this.listen(svg, "pointerdown", this.handlePointerDown);
    this.observeVisibility();
    this.render();
    if (!options.reducedMotion) this.startSpinning();
  }

  /** Highlights one visited country (or none). */
  mark(id: string | null): void {
    for (const [countryId, shape] of this.visited) {
      shape.element.classList.toggle("on", countryId === id);
    }
  }

  /** Turns the globe so the country faces the viewer. */
  focus(id: string): void {
    const shape = this.visited.get(id);
    if (!shape) return;
    const target = focusRotation(geoCentroid(shape.feature));
    const from = this.projection.rotate() as Rotation;

    if (this.options.reducedMotion) {
      this.setRotation(target);
      return;
    }

    this.focusing = true;
    const startedAt = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - startedAt) / FOCUS_DURATION_MS);
      this.setRotation(interpolateRotation(from, target, easeInOutCubic(t)));
      if (t < 1) requestAnimationFrame(step);
      else this.focusing = false;
    };
    requestAnimationFrame(step);
  }

  /** Stops every animation and listener and empties the SVG. */
  destroy(): void {
    cancelAnimationFrame(this.frame);
    this.frame = 0;
    for (const dispose of this.disposers.splice(0)) dispose();
    this.removeDragListeners();
    this.options.svg.replaceChildren();
  }

  private render(): void {
    this.graticule.setAttribute("d", this.path(this.graticuleShape) ?? "");
    for (const { element, feature: country } of this.shapes) {
      element.setAttribute("d", this.path(country) ?? "");
    }
  }

  private setRotation(rotation: Rotation): void {
    this.projection.rotate(rotation);
    this.render();
  }

  private startSpinning(): void {
    const tick = () => {
      if (!this.hovering && !this.drag && !this.focusing) {
        this.setRotation(spin(this.projection.rotate() as Rotation));
      }
      this.frame = this.onScreen ? requestAnimationFrame(tick) : 0;
    };
    this.frame = requestAnimationFrame(tick);
  }

  /** Pauses the spin while the globe is scrolled out of view. */
  private observeVisibility(): void {
    if (typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => {
      this.onScreen = entry?.isIntersecting ?? true;
      if (this.onScreen && !this.frame && !this.options.reducedMotion) this.startSpinning();
    });
    observer.observe(this.options.svg);
    this.disposers.push(() => observer.disconnect());
  }

  private bindCountry(element: SVGPathElement, id: string): void {
    const hover = (event: PointerEvent) => {
      if (this.drag?.moved) return;
      this.hovering = true;
      this.options.onHover({ id, clientX: event.clientX, clientY: event.clientY });
    };
    this.listen(element, "pointerenter", hover);
    this.listen(element, "pointermove", hover);
    this.listen(element, "pointerleave", () => {
      this.hovering = false;
      this.options.onHover(null);
    });
    this.listen(element, "click", () => {
      if (!this.suppressClick) this.options.onSelect(id);
    });
  }

  private readonly handlePointerDown = (event: PointerEvent) => {
    if (event.button !== 0) return;
    this.drag = {
      clientX: event.clientX,
      clientY: event.clientY,
      start: this.projection.rotate() as Rotation,
      moved: false,
    };
    window.addEventListener("pointermove", this.handlePointerMove);
    window.addEventListener("pointerup", this.handlePointerUp);
    window.addEventListener("pointercancel", this.handlePointerUp);
  };

  private readonly handlePointerMove = (event: PointerEvent) => {
    const drag = this.drag;
    if (!drag) return;
    // Pointer pixels → SVG units, so the drag feels the same at any rendered size.
    const scale = GLOBE_SIZE / (this.options.svg.getBoundingClientRect().width || GLOBE_SIZE);
    const dx = (event.clientX - drag.clientX) * scale;
    const dy = (event.clientY - drag.clientY) * scale;
    if (!drag.moved && Math.abs(dx) + Math.abs(dy) < CLICK_SLOP) return;
    if (!drag.moved) {
      drag.moved = true;
      this.options.onHover(null);
    }
    this.setRotation(dragRotation(drag.start, dx, dy));
  };

  private readonly handlePointerUp = () => {
    if (this.drag?.moved) {
      // The click that follows a drag must not select the country under the pointer.
      this.suppressClick = true;
      setTimeout(() => (this.suppressClick = false), 0);
    }
    this.drag = null;
    this.removeDragListeners();
  };

  private removeDragListeners(): void {
    window.removeEventListener("pointermove", this.handlePointerMove);
    window.removeEventListener("pointerup", this.handlePointerUp);
    window.removeEventListener("pointercancel", this.handlePointerUp);
  }

  private listen<K extends keyof SVGElementEventMap>(
    target: SVGElement,
    type: K,
    handler: (event: SVGElementEventMap[K]) => void,
  ): void {
    target.addEventListener(type, handler);
    this.disposers.push(() => target.removeEventListener(type, handler));
  }

  private create<K extends keyof SVGElementTagNameMap>(
    tag: K,
    attributes: Record<string, string | number>,
  ): SVGElementTagNameMap[K] {
    const element = document.createElementNS(SVG_NS, tag);
    for (const [name, value] of Object.entries(attributes)) element.setAttribute(name, String(value));
    return element;
  }
}
