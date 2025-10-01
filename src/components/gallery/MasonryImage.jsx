import AOS from "aos";

// export function MasonryImage({ src, alt, index, effect = "fade-up", onOpen }) {
//   return (
//     <button
//       type="button"
//       onClick={() => onOpen?.(index)}
//       className="mb-4 block w-full break-inside-avoid rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
//       aria-label={`Open ${alt}`}
//       data-aos={effect}
//       data-aos-delay={index * 80}
//     >
//       <img
//         src={src}
//         alt={alt}
//         className="w-full rounded-lg shadow-sm hover:brightness-105"
//         loading="lazy"
//         decoding="async"
//         onLoad={() => AOS.refresh()}
//         draggable={false}
//       />
//     </button>
//   );
// }

export function MasonryImage({ src, alt, index, effect = "fade-up", onOpen, width, height }) {
  return (
    <figure
      role="button"
      tabIndex={0}
      onClick={() => onOpen?.(index)}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onOpen?.(index)}
      className="ios-masonry-fix mb-4 block w-full rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      data-aos={effect}               // prefer opacity-only in columns
      data-aos-delay={index * 80}
      aria-label={`Open ${alt}`}
    >
      <img
        src={src}
        alt={alt}
        className="img-intrinsic w-full rounded-lg shadow-sm hover:brightness-105 block h-auto"
        loading="lazy"
        decoding="async"
        onLoad={() => AOS.refresh()}
        draggable={false}
        {...(width && height ? { width, height } : {})}
        sizes="(min-width: 768px) 25vw, 50vw"
      />
    </figure>
  );
}
