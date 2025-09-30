import useSrcSet from "./../../hook/useSrcSet";

export default function GalleryItem({ img, onClick }) {
  const { srcset, sizes } = useSrcSet(img.src, img.w);
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-neutral-200 ring-1 ring-inset ring-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      aria-label={`Open ${img.alt}`}
    >
      <img
        src={`${img.src}&w=800`}
        srcSet={srcset}
        sizes={sizes}
        alt={img.alt}
        loading="lazy"
        className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <span className="pointer-events-none absolute bottom-2 left-2 rounded-md bg-black/55 px-2 py-1 text-[11px] font-medium text-white opacity-0 shadow-sm ring-1 ring-white/10 transition-opacity duration-300 group-hover:opacity-100">
        {img.alt}
      </span>
    </button>
  );
}
