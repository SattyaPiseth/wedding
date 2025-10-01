import React, {
  useEffect,
  useRef,
  useId,
  useLayoutEffect,
  useState,
  useCallback,
} from "react";
import { createPortal } from "react-dom";
import { ChevronLeftIcon, ChevronRightIcon, XIcon } from "./Icons.jsx";
import { AnimatePresence, motion } from "framer-motion";

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

  // Orientation detection
  const [isPortrait, setIsPortrait] = useState(false);
  const handleImageReady = useCallback(() => {
    const el = imgRef.current;
    if (!el) return;
    const w = el.naturalWidth;
    const h = el.naturalHeight;
    if (w && h) setIsPortrait(h > w);
  }, []);
  useEffect(() => {
    setIsPortrait(false);
    const t = requestAnimationFrame(handleImageReady);
    return () => cancelAnimationFrame(t);
  }, [src, handleImageReady]);

  // Direction of travel: -1 prev, +1 next
  const dirRef = useRef(0);

  // Debounce to prevent spam clicking during transition
  const [busy, setBusy] = useState(false);
  const transitionMs = 280; // keep in sync with 'transition' below

  const safePrev = () => {
    if (busy) return;
    setBusy(true);
    dirRef.current = -1;
    onPrev?.();
    setTimeout(() => setBusy(false), transitionMs);
  };
  const safeNext = () => {
    if (busy) return;
    setBusy(true);
    dirRef.current = 1;
    onNext?.();
    setTimeout(() => setBusy(false), transitionMs);
  };

  // Lock background scroll while open
  useScrollLock(true);

  // Ensure the focus trap actually traps: focus the backdrop
  useEffect(() => {
    backdropRef.current?.focus();
  }, []);

  // Preload neighbor images for smoother transitions
  useEffect(() => {
    const preload = (url) => {
      if (!url) return;
      const img = new Image();
      img.decoding = "async";
      img.loading = "eager";
      img.src = url;
    };

    if (!count) return;

    const nextIdx = (index + 1) % count;
    const prevIdx = (index - 1 + count) % count;

    const getSrc = (item) => (typeof item === "string" ? item : item?.src);

    preload(getSrc(images[nextIdx]));
    preload(getSrc(images[prevIdx]));
  }, [index, images, count]);

  // Global key handlers with direction
  useEffect(() => {
    const onKeyDown = (e) => {
      const { key } = e;
      if (key === "Escape") {
        e.preventDefault();
        onClose?.();
      } else if (key === "ArrowLeft") {
        e.preventDefault();
        safePrev();
      } else if (key === "ArrowRight") {
        e.preventDefault();
        safeNext();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]); // safePrev/safeNext are stable enough for this scope

  // Simple focus trap
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

  // Reduced motion?
  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

  // Direction-aware variants
  const variants = {
    enter: (d) => ({
      x: d * 40,         // from right if next, from left if prev
      opacity: 0.0,
      scale: 0.995,      // tiny scale helps reduce “pop”
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (d) => ({
      x: -d * 40,        // to the opposite side
      opacity: 0.0,
      scale: 0.995,
    }),
  };

  // Transition tuned for “buttery”
  const transition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.28, ease: [0.22, 0.61, 0.36, 1] };

  // Swipe gesture threshold (px)
  const swipeThreshold = 80;

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
          {/* Swipe wrapper */}
          <motion.div
            drag={reduceMotion ? false : "x"}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.12}
            onDragEnd={(_, info) => {
              if (busy) return; // respect debounce
              if (info.offset.x > swipeThreshold) {
                dirRef.current = -1; safePrev();
              } else if (info.offset.x < -swipeThreshold) {
                dirRef.current = 1; safeNext();
              }
            }}
            className="relative inline-block will-change-transform"
          >
            <AnimatePresence initial={false} custom={dirRef.current} mode="wait">
              <motion.img
                key={src} // re-mount on src change
                ref={imgRef}
                src={src}
                alt={alt}
                onLoad={handleImageReady}
                custom={dirRef.current}
                variants={variants}
                initial={reduceMotion ? false : "enter"}
                animate="center"
                exit={reduceMotion ? false : "exit"}
                transition={transition}
                className={[
                  "block object-contain rounded-xl shadow-2xl select-none",
                  isPortrait
                    ? "max-h-[88svh] sm:max-h-[90svh] md:max-h-[92svh] max-w-[82vw] sm:max-w-[78vw] md:max-w-[72vw] w-auto h-auto"
                    : "max-h-[82svh] sm:max-h-[86svh] md:max-h-[88svh] max-w-[94vw] sm:max-w-[92vw] md:max-w-[90vw] w-auto h-auto",
                ].join(" ")}
                draggable={false}
                style={{
                  backfaceVisibility: "hidden",
                  WebkitFontSmoothing: "antialiased",
                  willChange: reduceMotion ? undefined : "transform, opacity",
                }}
              />
            </AnimatePresence>

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
          </motion.div>

          {/* Prev / Next buttons */}
          <button
            type="button"
            onClick={safePrev}
            disabled={count <= 1 || busy}
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
            onClick={safeNext}
            disabled={count <= 1 || busy}
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

          {/* Caption with gradient */}
          <figcaption
            id={descId}
            className={[
              "pointer-events-none absolute inset-x-0 bottom-0 text-center text-neutral-100",
              "bg-gradient-to-t from-black/45 via-black/15 to-transparent",
              isPortrait
                ? "text-sm sm:text-base px-3 py-3 sm:px-4 sm:py-3.5"
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
