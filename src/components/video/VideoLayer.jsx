export default function VideoLayer({ videoRef, poster, onEnded }) {
return (
  <div
  className="fixed inset-0 w-full h-svh z-0 pointer-events-none bg-black"
  aria-hidden="true"
  >
    <video
    ref={videoRef}
    className="absolute inset-0 w-full h-full object-cover motion-safe:block motion-reduce:hidden select-none [@media_(orientation:landscape)]:object-contain"
    autoPlay
    muted
    playsInline
    preload="metadata"
    poster={poster}
    onEnded={onEnded}
    tabIndex={-1}
    disablePictureInPicture
    aria-hidden="true"
    />
  </div>
  );
}