import React, { useEffect, useRef, useId, useLayoutEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { ChevronLeftIcon, ChevronRightIcon, XIcon } from "./Icons.jsx";

/** Lock scroll on open with scrollbar compensation */
function useScrollLock(locked) {
  useLayoutEffect(() => {
    if (!locked) return;
    const docEl = document.documentElement;
    const prevOverflow = docEl.style.overflow;
    const prevPaddingRight = docEl.style.paddingRight;

    const scrollBar = window.innerWidth - docEl.clientWidth;
    docEl.style.overflow = "hidden";
    if (scrollBar > 0) docEl.style.paddingRight = `${scrollBar}px`;

    return () => {
      docEl.style.overflow = prevOverflow;
      docEl.style.paddingRight = prevPaddingRight;
    };
  }, [locked]);
}

/** Normalize image list: accept array of string | {src, alt?} */
function useImageSrc(images, index) {
  const item = images[index];
  if (!item) return { src: "", alt: "" };
  if (typeof item === "string") return { src: item, alt: `Gallery image ${index + 1}` };
  const { src, alt } = item;
  return { src, alt: alt ?? `Gallery image ${index + 1}` };
}

export const Lightbox = ({ images = [], index = 0, onClose, onPrev, onNext }) => {
  const count = images.length;
  if (!count) return null;

  const { src, alt } = useImageSrc(images, index);

  const backdropRef = useRef(null);
  const imgRef = useRef(null);
  const closeBtnRef = useRef(null);

  const headingId = useId();
  const descId = useId();

  const [isPortrait, setIsPortrait] = useState(false);

  // Lock background scroll while open
  useScrollLock(true);

  // Ensure the focus trap actually traps: focus the backdrop
  useEffect(() => {
    backdropRef.current?.focus();
  }, []);

  // Determine orientation when the image loads or src changes
  const handleImageReady = useCallback(() => {
    const el = imgRef.current;
    if (!el) return;
    // If already loaded from cache, natural sizes are ready
    const w = el.naturalWidth;
    const h = el.naturalHeight;
    if (w && h) setIsPortrait(h > w);
  }, []);

  useEffect(() => {
    // Re-evaluate when the source changes
    setIsPortrait(false);
    // If the image might already be cached, run a microtask to read natural dims
    const t = requestAnimationFrame(() => handleImageReady());
    return () => cancelAnimationFrame(t);
  }, [src, handleImageReady]);

  // Global key handlers for reliability
  useEffect(() => {
    const onKeyDown = (e) => {
      const { key } = e;
      if (key === "Escape") {
        e.preventDefault();
        onClose?.();
      } else if (key === "ArrowLeft") {
        e.preventDefault();
        onPrev?.();
      } else if (key === "ArrowRight") {
        e.preventDefault();
        onNext?.();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, onPrev, onNext]);

  // Simple focus trap within the lightbox
  useEffect(() => {
    const trap = (e) => {
      if (e.key !== "Tab") return;
      const root = backdropRef.current;
      if (!root) return;
      const focusables = root.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    const current = backdropRef.current;
    current?.addEventListener("keydown", trap);
    return () => current?.removeEventListener("keydown", trap);
  }, []);

  const node = (
    <div
      ref={backdropRef}
      role="dialog"
      aria-roledescription="lightbox"
      aria-modal="true"
      aria-labelledby={headingId}
      aria-describedby={descId}
      tabIndex={-1}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-3 sm:p-4 md:p-6"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
      onTouchStart={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <h2 id={headingId} className="sr-only">Image viewer</h2>

      {/* Fluid wrapper; slightly narrower on portrait for nicer balance */}
      <div
        className={[
          "relative mx-auto w-full",
          isPortrait
            ? "max-w-[min(94vw,820px)] sm:max-w-[min(92vw,900px)] md:max-w-[min(88vw,980px)]"
            : "max-w-[min(96vw,1200px)] sm:max-w-[min(94vw,1280px)] md:max-w-[min(92vw,1440px)]",
        ].join(" ")}
      >
        {/* Height pinned to viewport; a touch more headroom for portrait */}
        <figure
          className={[
            "relative w-full flex items-center justify-center select-none",
            isPortrait
              ? "h-[min(92svh,calc(100dvh-2.25rem))] sm:h-[min(94svh,calc(100dvh-2.5rem))]"
              : "h-[min(88svh,calc(100dvh-2rem))] sm:h-[min(90svh,calc(100dvh-2.5rem))]",
          ].join(" ")}
        >
          <div className="relative inline-block">
            <img
              ref={imgRef}
              src={src}
              alt={alt}
              onLoad={handleImageReady}
              className={[
                "block object-contain rounded-xl shadow-2xl",
                // Keep intrinsic aspect; only bound by the figure box
                // Portrait gets taller (max-h) but slightly narrower (max-w) to feel consistent
                isPortrait
                  ? "max-h-[88svh] sm:max-h-[90svh] md:max-h-[92svh] max-w-[82vw] sm:max-w-[78vw] md:max-w-[72vw] w-auto h-auto"
                  : "max-h-[82svh] sm:max-h-[86svh] md:max-h-[88svh] max-w-[94vw] sm:max-w-[92vw] md:max-w-[90vw] w-auto h-auto",
              ].join(" ")}
              draggable={false}
            />

            {/* Close button: top-end of the image box */}
            <button
              ref={closeBtnRef}
              type="button"
              onClick={onClose}
              className="absolute top-2 end-2 z-10 rounded-full
                         bg-white/10 text-white backdrop-blur
                         p-2 sm:p-2.5 md:p-3
                         hover:bg-white/20
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
              aria-label="Close"
            >
              <XIcon />
            </button>
          </div>

          {/* Prev / Next buttons (slightly adjusted offsets on portrait) */}
          <button
            type="button"
            onClick={onPrev}
            disabled={count <= 1}
            className={[
              "absolute top-1/2 -translate-y-1/2 rounded-full bg-white/10 text-white backdrop-blur",
              "hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
              "disabled:opacity-40 disabled:cursor-not-allowed",
              "p-2.5 sm:p-3 md:p-3",
              isPortrait ? "left-1.5 sm:left-2 md:left-3" : "left-2 sm:left-3 md:left-4",
            ].join(" ")}
            aria-label="Previous image"
          >
            <ChevronLeftIcon />
          </button>

          <button
            type="button"
            onClick={onNext}
            disabled={count <= 1}
            className={[
              "absolute top-1/2 -translate-y-1/2 rounded-full bg-white/10 text-white backdrop-blur",
              "hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
              "disabled:opacity-40 disabled:cursor-not-allowed",
              "p-2.5 sm:p-3 md:p-3",
              isPortrait ? "right-1.5 sm:right-2 md:right-3" : "right-2 sm:right-3 md:right-4",
            ].join(" ")}
            aria-label="Next image"
          >
            <ChevronRightIcon />
          </button>

          {/* Caption: a bit taller on portrait to avoid crowding */}
          <figcaption
            id={descId}
            className={[
              "pointer-events-none absolute inset-x-0 bottom-0 text-center text-neutral-100",
              "bg-gradient-to-t from-black/45 via-black/15 to-transparent",
              isPortrait ? "text-sm sm:text-base px-3 py-3 sm:px-4 sm:py-3.5"
                         : "text-xs sm:text-sm md:text-base px-3 py-2 sm:px-4 sm:py-2.5",
            ].join(" ")}
          >
            Image {index + 1} <span className="opacity-70">• {index + 1}/{count}</span>
          </figcaption>
        </figure>
      </div>
    </div>
  );

  return createPortal(node, document.body);
};
