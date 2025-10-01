import React, { useEffect, useRef, useId, useLayoutEffect } from "react";
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
  const closeBtnRef = useRef(null);

  const headingId = useId();
  const descId = useId();

  // Lock background scroll while open
  useScrollLock(true);

  // Focus close button on mount
  useEffect(() => {
    closeBtnRef.current?.focus();
  }, []);

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

      <div className="relative mx-auto w-full max-w-6xl">
        <figure className="relative w-full h-[min(88dvh,calc(100dvh-2rem))] flex items-center justify-center select-none">
          <div className="relative inline-block">
            <img
              src={src}
              alt={alt}
              className="block max-w-full max-h-full w-auto h-auto object-contain rounded-xl shadow-2xl"
              draggable={false}
            />

            {/* Close button: top-end of the image box */}
            <button
              ref={closeBtnRef}
              type="button"
              onClick={onClose}
              className="absolute top-2 end-2 z-10 rounded-full bg-white/10 p-2 text-white backdrop-blur hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
              aria-label="Close"
            >
              <XIcon />
            </button>
          </div>

          {/* Prev / Next buttons stay centered relative to figure */}
          <button
            type="button"
            onClick={onPrev}
            disabled={count <= 1}
            className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Previous image"
          >
            <ChevronLeftIcon />
          </button>

          <button
            type="button"
            onClick={onNext}
            disabled={count <= 1}
            className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Next image"
          >
            <ChevronRightIcon />
          </button>

          <figcaption
            id={descId}
            className="absolute -bottom-10 left-1/2 -translate-x-1/2 mt-3 text-center text-sm text-neutral-200 p-5"
          >
            Image {index + 1} <span className="opacity-60">• {index + 1}/{count}</span>
          </figcaption>
        </figure>
      </div>
    </div>
  );

  // Render at body level to avoid ancestor transforms affecting fixed positioning
  return createPortal(node, document.body);
};
