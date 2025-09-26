export default function VideoLayer({ videoRef, poster, onEnded }) {
  return (
    <div className="fixed inset-0 w-full h-dvh z-0 pointer-events-none bg-black">
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover motion-safe:block motion-reduce:hidden [@media_(orientation:landscape)]:object-contain"
        autoPlay
        muted
        playsInline
        preload="metadata"
        poster={poster}
        onEnded={onEnded}
        aria-hidden="true"
      />
    </div>
  );
}
