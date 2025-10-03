import  MasonryImage  from "./MasonryImage";

export function MasonryGallery({ images, onOpen }) {
  return (
    <section className="columns-2 gap-x-4 md:columns-4" data-aos="fade-up">
      {images.map((src, i) => (
        <MasonryImage
          key={src}
          src={src}
          alt={`Gallery image ${i + 1}`}
          index={i}
          onOpen={onOpen}
        />
      ))}
    </section>
  );
}
