// components/PromoteSection.jsx
import React, { useRef, useEffect } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useReducedMotion,
} from "framer-motion";

/**
 * @param {object} props
 * @param {string} [props.src]
 * @param {string} [props.alt]
 * @param {string} [props.caption]
 * @param {string} [props.className]
 * @param {string} [props.sizes]
 * @param {number} [props.width]
 * @param {number} [props.height]
 * @param {"sm"|"md"|"lg"} [props.glass="md"]
 * @param {boolean} [props.enableTilt=true]
 * @param {number} [props.tiltRange=40]      // px radius mapped to rotation
 * @param {number} [props.hoverScale=1.01]   // figure hover scale
 */
export const PromoteSection = ({
  src = "/images/memora-shine/memora-shine-end-page.png",
  alt = "សេចក្តីអបអរសាទរ ព្រមទាំងអញ្ជើញចូលរួមក្នុងពិធី",
  caption,
  className = "",
  sizes = "(max-width: 640px) 100vw, 640px",
  width,
  height,
  glass = "md",
  enableTilt = true,
  tiltRange = 40,
  hoverScale = 1.01,
}) => {
  const prefersReduced = useReducedMotion();

  // Glass presets
  const glassMap = {
    sm: "bg-white/5 supports-[backdrop-filter]:bg-white/10 supports-[backdrop-filter]:backdrop-blur-sm",
    md: "bg-white/10 supports-[backdrop-filter]:bg-white/15 supports-[backdrop-filter]:backdrop-blur-md",
    lg: "bg-white/15 supports-[backdrop-filter]:bg-white/20 supports-[backdrop-filter]:backdrop-blur-lg",
  };

  // Motion values
  const ref = useRef(null);
  const rafRef = useRef(0); // throttle mousemove with rAF

  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  // Map mouse distance to rotation (guarded by reduced motion / enableTilt)
  const rotateX = useTransform(
    my,
    [-tiltRange, tiltRange],
    prefersReduced || !enableTilt ? [0, 0] : [6, -6]
  );
  const rotateY = useTransform(
    mx,
    [-tiltRange, tiltRange],
    prefersReduced || !enableTilt ? [0, 0] : [-6, 6]
  );

  // Mouse handlers (rAF throttled for less layout thrash)
  const onMove = (e) => {
    if (prefersReduced || !enableTilt || !ref.current) return;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const r = ref.current.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);

      // clamp into [-tiltRange, tiltRange]
      const cx = Math.max(-tiltRange, Math.min(tiltRange, dx / 6));
      const cy = Math.max(-tiltRange, Math.min(tiltRange, dy / 6));
      mx.set(cx);
      my.set(cy);
    });
  };

  const onLeave = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    mx.set(0);
    my.set(0);
  };

  useEffect(() => () => rafRef.current && cancelAnimationFrame(rafRef.current), []);

  // Entrance variants
  const figureVariants = {
    hidden: {
      opacity: 0,
      y: prefersReduced ? 0 : 16,
      scale: prefersReduced ? 1 : 0.985,
    },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 140, damping: 18, mass: 0.6 },
    },
  };

  // Breathing glow
  const glowPulse = prefersReduced
    ? {}
    : {
        opacity: [0.15, 0.3, 0.15],
        transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
      };

  return (
    <motion.figure
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      variants={figureVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        willChange: enableTilt && !prefersReduced ? "transform" : undefined,
      }}
      whileHover={prefersReduced ? {} : { scale: hoverScale }}
      className={[
        "relative isolate mt-6 overflow-hidden rounded-lg",
        // Borders & subtle ring
        "border border-white/20 ring-1 ring-black/5 dark:border-white/10 dark:ring-white/5",
        // Glass
        glassMap[glass],
        // Shadow + GPU hint
        "shadow-lg transform-gpu",
        className,
      ].join(" ")}
      // more descriptive landmark for screen readers
      role="group"
      aria-label={caption || alt || "Promotion"}
    >
      {/* Soft animated glows */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full bg-gradient-to-br from-white/40 via-white/10 to-transparent blur-2xl"
        animate={glowPulse}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-gradient-to-tr from-[#f7c948]/30 via-transparent to-transparent blur-2xl"
        animate={glowPulse}
      />

      {/* Content */}
      <motion.div
        className="relative z-10"
        style={{
          transform:
            enableTilt && !prefersReduced ? "translateZ(20px)" : undefined,
          willChange: enableTilt && !prefersReduced ? "transform" : undefined,
        }}
      >
        <motion.img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          draggable="false"
          className="block h-auto w-full rounded-md shadow-sm select-none"
          sizes={sizes}
          width={width}
          height={height}
          initial={prefersReduced ? {} : { scale: 1.01 }}
          whileHover={prefersReduced ? {} : { scale: 1.025 }}
          transition={{ type: "spring", stiffness: 180, damping: 16 }}
        />

        {caption && (
          <motion.figcaption
            className="siemreap-regular px-4 py-3 text-center text-sm sm:text-base text-black/70 dark:text-white/80"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.35, ease: "easeOut", delay: 0.05 }}
          >
            {caption}
          </motion.figcaption>
        )}
      </motion.div>

      {/* Frosted border sheen */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-lg ring-1 ring-inset ring-white/20"
        animate={prefersReduced ? {} : { opacity: [0.6, 0.85, 0.6] }}
        transition={
          prefersReduced ? {} : { duration: 6, repeat: Infinity, ease: "easeInOut" }
        }
      />
    </motion.figure>
  );
};
