import React, { useEffect, useRef, useId } from "react";
import { ChevronLeftIcon, ChevronRightIcon, XIcon } from "./Icons.jsx";

export const Lightbox = ({ images = [], index = 0, onClose, onPrev, onNext }) => {
  const backdropRef = useRef(null);
  const figRef = useRef(null);
  const imgRef = useRef(null);

  const closeBtnRef = useRef(null);
  const prevBtnRef = useRef(null);
  const nextBtnRef = useRef(null);

  // unique ids per instance
  const headingId = useId();
  const descId = useId();

  // Focus the close button on mount
  useEffect(() => {
    closeBtnRef.current?.focus();
  }, []);

  // Focus trap + keyboard controls
  useEffect(() => {
    const dialog = backdropRef.current;
    if (!dialog) return;

    const getFocusable = () =>
      dialog.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

    const onKeyDown = (e) => {
      const { key } = e;
      if (key === "Escape") {
        e.preventDefault();
        onClose?.();
        return;
      }
      if (key === "ArrowLeft") {
        e.preventDefault();
        onPrev?.();
        return;
      }
      if (key === "ArrowRight") {
        e.preventDefault();
        onNext?.();
        return;
      }

      if (key !== "Tab") return;
      const focusable = getFocusable();
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first || document.activeElement === dialog) {
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

    dialog.addEventListener("keydown", onKeyDown);
    return () => dialog.removeEventListener("keydown", onKeyDown);
  }, [onClose, onPrev, onNext]);

  const src = images[index];
  const count = images.length;
  if (!count) return null;

  // Dynamically position controls relative to the rendered img box
  useEffect(() => {
    const fig = figRef.current;
    const img = imgRef.current;
    const closeBtn = closeBtnRef.current;
    const prevBtn = prevBtnRef.current;
    const nextBtn = nextBtnRef.current;
    if (!fig || !img || !closeBtn || !prevBtn || !nextBtn) return;

    const place = () => {
      const i = img.getBoundingClientRect();
      const f = fig.getBoundingClientRect();
      // coords relative to figure
      const relTop = i.top - f.top;
      const relLeft = i.left - f.left;

      // dynamic offset: 2% of width, clamped to 8..18px
      const dyn = Math.max(8, Math.min(18, i.width * 0.02));

      // Close: top-right of image
      closeBtn.style.position = "absolute";
      closeBtn.style.top = `${relTop + dyn}px`;
      closeBtn.style.left = `${relLeft + i.width - dyn}px`;
      closeBtn.style.transform = "translate(-100%, 0)";

      // Prev: mid-left
      prevBtn.style.position = "absolute";
      prevBtn.style.top = `${relTop + i.height / 2}px`;
      prevBtn.style.left = `${relLeft + dyn}px`;
      prevBtn.style.transform = "translate(0, -50%)";

      // Next: mid-right
      nextBtn.style.position = "absolute";
      nextBtn.style.top = `${relTop + i.height / 2}px`;
      nextBtn.style.left = `${relLeft + i.width - dyn}px`;
      nextBtn.style.transform = "translate(-100%, -50%)";
    };

    // observers / listeners (with guards)
    let ro;
    const hasRO = typeof window !== "undefined" && "ResizeObserver" in window;
    if (hasRO) {
      ro = new ResizeObserver(() => requestAnimationFrame(place));
      ro.observe(img);
      ro.observe(fig);
    }

    const onWinResize = () => requestAnimationFrame(place);
    window.addEventListener("resize", onWinResize);
    const onLoad = () => place();
    img.addEventListener("load", onLoad);

    // initial
    requestAnimationFrame(place);

    return () => {
      ro?.disconnect?.();
      window.removeEventListener("resize", onWinResize);
      img.removeEventListener("load", onLoad);
    };
  }, [src]);

  return (
    <div
      ref={backdropRef}
      role="dialog"
      aria-roledescription="lightbox"
      aria-modal="true"
      aria-labelledby={headingId}
      aria-describedby={descId}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 sm:p-4 md:p-6"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
      onTouchStart={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <h2 id={headingId} className="sr-only">
        Image viewer
      </h2>

      <div className="relative mx-auto w-full max-w-6xl">
        <figure
          ref={figRef}
          className="relative w-full h-[min(88svh,calc(100dvh-2rem))] grid place-items-center select-none"
        >
          <img
            ref={imgRef}
            src={src}
            alt={`Gallery image ${index + 1}`}
            className="block max-w-full max-h-full w-auto h-auto object-contain rounded-xl shadow-2xl"
            draggable={false}
          />

          {/* Dynamically positioned controls (styled by classes; positioned by JS) */}
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            className="z-20 rounded-full bg-white/10 p-2 text-white backdrop-blur hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
            aria-label="Close"
          >
            <XIcon />
          </button>

          <button
            ref={prevBtnRef}
            type="button"
            onClick={onPrev}
            disabled={count <= 1}
            className="z-20 rounded-full bg-white/10 p-3 text-white backdrop-blur hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Previous image"
          >
            <ChevronLeftIcon />
          </button>

          <button
            ref={nextBtnRef}
            type="button"
            onClick={onNext}
            disabled={count <= 1}
            className="z-20 rounded-full bg-white/10 p-3 text-white backdrop-blur hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Next image"
          >
            <ChevronRightIcon />
          </button>

          <figcaption id={descId} className="mt-3 text-center text-sm text-neutral-200">
            Image {index + 1} <span className="opacity-60">• {index + 1}/{count}</span>
          </figcaption>
        </figure>
      </div>
    </div>
  );
};
