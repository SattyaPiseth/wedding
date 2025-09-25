import { useEffect, useRef } from "react";

function App() {
  const audioRef = useRef(null);
  useEffect(() => {
    // Try autoplay on mount
    const tryPlay = async () => {
      if (audioRef.current) {
        try {
          await audioRef.current.play();
        } catch (err) {
          console.log("Autoplay blocked by browser; waiting for user action.");
        }
      }
    };
    tryPlay();
  }, []);
  return (
    <>
      {/* Background music */}
      <audio
        ref={audioRef}
        src="/audio/beautiful-in-white.mp3"
        preload="auto"
        loop
        hidden
      />
      {/* Video background (global) */}
      <video
        className="fixed inset-0 w-full h-dvh object-cover pointer-events-none z-0 motion-safe:block motion-reduce:hidden"
        autoPlay
        muted
        playsInline
        preload="metadata"
        poster="/images/wedding-poster.jpg"
        aria-hidden="true"
      >
        <source src="./videos/background.mp4" type="video/mp4" />
      </video>

      {/* Contrast overlay */}
      <div
        className="fixed inset-0 z-[1] bg-black/10 sm:bg-black/15 md:bg-black/20"
        aria-hidden="true"
      />

      {/* App shell */}
      <div className="relative z-10 w-full mx-auto min-w-[320px] max-w-[440px] min-h-[568px] max-h-[956px] h-dvh flex flex-col">
        {/* Top bar (dynamic offset) */}
        <header
          className="
          p-4 flex items-center justify-center text-[#d2ab59] tracking-wide
          pt-[calc(env(safe-area-inset-top)+clamp(10svh,15dvh,20lvh))]
        "
        >
          <h1
            className="
              font-semibold moul-regular text-[clamp(1.25rem,4vw,1.75rem)] text-center
              opacity-0 will-change-transform
              animate-[pop_650ms_cubic-bezier(0.22,1,0.36,1)_both]
              motion-reduce:animate-none motion-reduce:opacity-100 motion-reduce:transform-none
            "
          >
            សិរីមង្គលអាពាហ៍ពិពាហ៍
          </h1>
        </header>

        {/* Main content */}
        <main className="flex-1 flex flex-col items-center justify-center gap-3 text-[#d2ab59] tracking-wider">
          <span
            className="
              text-center font-semibold moul-regular text-[clamp(1.2rem,4vw,1.75rem)]
              opacity-0 will-change-transform
              animate-[fade-up_700ms_ease-out_both] [animation-delay:120ms]
              motion-reduce:animate-none motion-reduce:opacity-100 motion-reduce:transform-none
            "
          >
            សូមគោរពអញ្ជើញ
          </span>

          <span
            className="
              text-center py-5 font-semibold moul-regular text-[clamp(1rem,3.2vw,1.5rem)] tracking-normal
              opacity-0 will-change-transform
              animate-[fade-up_700ms_ease-out_both] [animation-delay:240ms]
              motion-reduce:animate-none motion-reduce:opacity-100 motion-reduce:transform-none
            "
          >
            លោក ពិសិដ្ឋ សត្យា
          </span>
          {/* Glassmorphism button */}
          <button
            onClick={() => audioRef.current?.play()}
            className="
    px-6 py-2 rounded-xl relative
    font-semibold moul-regular
    text-[#d2ab59]
    bg-white/5 backdrop-blur-sm
    border border-[#d2ab59]/60
    shadow-md shadow-black/20
    transition duration-300
    hover:bg-white/10 hover:shadow-black/30
    active:scale-95
    focus:outline-none focus:ring-2 focus:ring-[#d2ab59]/40
  "
          >
            ចូលរួមពិធី
          </button>
        </main>

        {/* Footer (optional) */}
        {/*
        <footer className="p-4 pt-2 pb-[env(safe-area-inset-bottom)] bg-white/80 backdrop-blur rounded-t-2xl shadow-[0_-6px_12px_-8px_rgba(0,0,0,0.25)]">
          <p className="text-center text-sm">©</p>
        </footer>
        */}
      </div>
    </>
  );
}
export default App;
