import AOS from "aos";

export function MasonryImage({ src, alt, index, effect = "fade-up", onOpen }) {
  return (
    <button
      type="button"
      onClick={() => onOpen?.(index)}
      className="mb-4 block w-full break-inside-avoid rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      aria-label={`Open ${alt}`}
      data-aos={effect}
      data-aos-delay={index * 80}
    >
      <img
        src={src}
        alt={alt}
        className="w-full rounded-lg shadow-sm hover:brightness-105"
        loading="lazy"
        decoding="async"
        onLoad={() => AOS.refresh()}
        draggable={false}
      />
    </button>
  );
}

