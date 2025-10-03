export default function MasonryImage({
  src,
  alt,
  index,
  onOpen,
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen?.(index)}
      className="mb-4 block w-full break-inside-avoid rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      aria-label={alt || "Open image"}
    >
      <img
        src={src}
        alt={alt || ""}
        className="w-full rounded-lg shadow-sm hover:brightness-105"
        loading="lazy"
        decoding="async"
        draggable={false}
      />
    </button>
  );
}
