import { MasonryImage } from "./MasonryImage";

export function MasonryGallery({ images }) {
  return (
    <section className="columns-2 md:columns-4 gap-x-4">
      {images.map((src, i) => (
        <MasonryImage key={src} src={src} alt={`Gallery image ${i + 1}`} index={i} />
      ))}
    </section>
  );
}
