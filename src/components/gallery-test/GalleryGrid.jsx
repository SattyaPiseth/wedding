import { useEffect, useState } from "react";
import GalleryItem from "./GalleryItem.jsx";
import {Lightbox} from "./Lightbox.jsx";

export default function GalleryGrid({ images }) {
  const [isOpen, setIsOpen] = useState(false);
  const [idx, setIdx] = useState(0);
  const open = (i) => {
    setIdx(i);
    setIsOpen(true);
  };
  const close = () => setIsOpen(false);
  const prev = () => setIdx((i) => (i - 1 + images.length) % images.length);
  const next = () => setIdx((i) => (i + 1) % images.length);

  // optional: close on ESC even when focus is outside modal trigger area
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  return (
    <>
      <section className="mx-auto grid max-w-6xl grid-cols-2 gap-3 px-4 sm:grid-cols-3 md:gap-4">
        {images.map((img, i) => (
          <GalleryItem key={img.src} img={img} onClick={() => open(i)} />
        ))}
      </section>
      {isOpen && (
        <Lightbox
          images={images}
          index={idx}
          onClose={close}
          onPrev={prev}
          onNext={next}
        />
      )}
    </>
  );
}
