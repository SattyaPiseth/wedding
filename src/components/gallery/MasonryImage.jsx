import AOS from "aos";

export function MasonryImage({ src, alt, index, effect = "fade-up" }) {
  return (
    <img
      src={src}
      alt={alt}
      className="mb-4 rounded-lg break-inside-avoid"
      data-aos={effect}
      data-aos-delay={index * 100}
      onLoad={() => AOS.refresh()}
      loading="lazy"
      decoding="async"
    />
  );
}
