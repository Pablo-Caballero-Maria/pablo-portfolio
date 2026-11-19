"use client";

import Image from "next/image";
import { useRef, useState } from "react";

import type { Photo } from "@/content/types";
import { formatPosition, wrapIndex } from "@/lib/cycle";

import { ChevronLeftIcon, ChevronRightIcon } from "../ui/icons";

interface PhotoReelProps {
  photos: readonly Photo[];
}

const SWIPE_THRESHOLD = 50;
const roundButton =
  "grid h-10 w-10 place-items-center rounded-md border border-line bg-surface hover:border-accent";

/**
 * A horizontally scrolling strip of photos; each opens in a full-screen viewer (<dialog>) that
 * steps through them with the arrows, the keyboard (← →, Esc) or a swipe.
 */
export function PhotoReel({ photos }: PhotoReelProps) {
  const reel = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const touchX = useRef<number | null>(null);
  const [current, setCurrent] = useState(0);
  const photo = photos[current];

  function scroll(direction: 1 | -1) {
    const figure = reel.current?.querySelector("figure");
    const step = figure ? figure.getBoundingClientRect().width + 16 : 300;
    reel.current?.scrollBy({ left: direction * step * 2, behavior: "smooth" });
  }

  function open(index: number) {
    setCurrent(index);
    dialog.current?.showModal();
  }

  const show = (index: number) => setCurrent(wrapIndex(index, photos.length));
  const close = () => dialog.current?.close();

  return (
    <>
      <div className="mt-16 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Photo reel</p>
          <h3 className="mt-2 font-display text-2xl font-bold">Moments along the way</h3>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className={roundButton}
            aria-label="Scroll photos left"
            onClick={() => scroll(-1)}
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            className={roundButton}
            aria-label="Scroll photos right"
            onClick={() => scroll(1)}
          >
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div ref={reel} className="reel mt-6 flex gap-4 overflow-x-auto pb-4">
        {photos.map((item, index) => (
          <figure key={item.src} className="w-[78vw] max-w-[18rem] shrink-0 sm:w-72">
            <button
              type="button"
              className="group block w-full overflow-hidden rounded-lg border border-line bg-raised"
              aria-label={`Open photo: ${item.alt}`}
              onClick={() => open(index)}
            >
              <Image
                src={item.src}
                alt={item.alt}
                width={item.width}
                height={item.height}
                sizes="18rem"
                className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                style={item.objectPosition ? { objectPosition: item.objectPosition } : undefined}
              />
            </button>
            <figcaption className="mt-2.5 text-sm leading-snug">
              <span
                className={`block font-mono text-[11px] tracking-wider uppercase ${item.tone === "accent" ? "text-accent" : "text-warm"}`}
              >
                {item.tag}
              </span>
              {item.alt}
            </figcaption>
          </figure>
        ))}
      </div>

      <dialog
        ref={dialog}
        className="lightbox"
        aria-label="Photo viewer"
        onClick={(event) => {
          // A click on the backdrop (outside the photo and the buttons) closes the viewer.
          if (event.target === event.currentTarget || event.target === event.currentTarget.firstChild)
            close();
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") show(current - 1);
          if (event.key === "ArrowRight") show(current + 1);
        }}
        onTouchStart={(event) => {
          touchX.current = event.touches[0]?.clientX ?? null;
        }}
        onTouchEnd={(event) => {
          const start = touchX.current;
          const end = event.changedTouches[0]?.clientX;
          touchX.current = null;
          if (start === null || end === undefined) return;
          const dx = end - start;
          if (Math.abs(dx) > SWIPE_THRESHOLD) show(current + (dx < 0 ? 1 : -1));
        }}
      >
        {photo && (
          <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-4 sm:p-8">
            <div className="flex w-full max-w-5xl items-center justify-between font-mono text-xs text-white/80">
              <span>
                {formatPosition(current, photos.length)} · {photo.tag}
              </span>
              <button
                type="button"
                className="rounded-md border border-white/30 px-3 py-1.5 text-white hover:bg-white/10"
                onClick={close}
              >
                Close ✕
              </button>
            </div>
            <div className="relative flex min-h-0 w-full max-w-5xl flex-1 items-center justify-center">
              <Image
                src={photo.src}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                sizes="(min-width: 1024px) 64rem, 100vw"
                className="h-auto max-h-full w-auto max-w-full rounded-lg object-contain"
              />
              <button
                type="button"
                className="absolute left-0 grid h-11 w-11 place-items-center rounded-full bg-black/50 text-white hover:bg-black/70"
                aria-label="Previous photo"
                onClick={() => show(current - 1)}
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </button>
              <button
                type="button"
                className="absolute right-0 grid h-11 w-11 place-items-center rounded-full bg-black/50 text-white hover:bg-black/70"
                aria-label="Next photo"
                onClick={() => show(current + 1)}
              >
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </div>
            <p className="max-w-3xl text-center text-white">{photo.alt}</p>
          </div>
        )}
      </dialog>
    </>
  );
}
