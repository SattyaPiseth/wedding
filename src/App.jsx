import { useEffect, useRef, useState } from "react";

function App() {
  const audioRef = useRef(null);
  const videoRef = useRef(null);

  const [isStoryPlaying, setIsStoryPlaying] = useState(false);
  const [storyIndex, setStoryIndex] = useState(-1);

  // List your story clips
  const storyVideos = [
    "/videos/home.mp4",
  ];

  useEffect(() => {
    // Try autoplay background music
    audioRef.current?.play().catch(() => {});
  }, []);

  const handleStartStory = async () => {
    setIsStoryPlaying(true);
    setStoryIndex(0); // start with story-01
    if (videoRef.current) {
      videoRef.current.src = storyVideos[0];
      videoRef.current.loop = false;
      videoRef.current.muted = false;
      try {
        await videoRef.current.play();
      } catch {
        videoRef.current.muted = true;
        await videoRef.current.play().catch(() => {});
      }
    }
    audioRef.current?.pause();
  };

  const handleVideoEnded = async () => {
    const next = storyIndex + 1;
    if (next < storyVideos.length && videoRef.current) {
      setStoryIndex(next);
      videoRef.current.src = storyVideos[next];
      videoRef.current.loop = false;
      try {
        await videoRef.current.play();
      } catch {}
    } else {
      // all stories finished → back to ambient
      if (videoRef.current) {
        videoRef.current.src = "/videos/background.mp4";
        videoRef.current.loop = true;
        videoRef.current.muted = true;
        await videoRef.current.play().catch(() => {});
      }
      audioRef.current?.play().catch(() => {});
      setIsStoryPlaying(false);
      setStoryIndex(-1);
    }
  };

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

      {/* Video background */}
      <div className="fixed inset-0 w-full h-dvh z-0 pointer-events-none">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover motion-safe:block motion-reduce:hidden"
          autoPlay
          muted
          playsInline
          preload="metadata"
          poster="/images/wedding-poster.jpg"
          aria-hidden="true"
          src="/videos/background.mp4"
          loop={!isStoryPlaying}
          onEnded={handleVideoEnded}
        />
      </div>

      {/* Overlay */}
      <div className="fixed inset-0 z-[1] bg-black/10 sm:bg-black/15 md:bg-black/20" />

      {/* App shell */}
      <div className="relative z-10 w-full mx-auto min-w-[320px] max-w-[440px] h-[clamp(568px,100svh,956px)] flex flex-col">
        <header className="p-4 flex items-center justify-center text-[var(--gold)] tracking-wide pt-[calc(env(safe-area-inset-top)+clamp(10svh,15dvh,20lvh))]">
          <h1
            className={`font-semibold moul-regular text-[clamp(1.25rem,4vw,1.75rem)] text-center
              animate-[pop_650ms_cubic-bezier(0.22,1,0.36,1)_both]
              ${isStoryPlaying ? "hidden" : ""}`}
          >
            សិរីមង្គលអាពាហ៍ពិពាហ៍
          </h1>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center gap-3 text-[var(--gold)] tracking-wider">
          <span
            className={`moul-regular text-[clamp(1.2rem,4vw,1.75rem)] text-center
              animate-[fade-up_700ms_ease-out_both] [animation-delay:120ms]
              ${isStoryPlaying ? "hidden" : ""}`}
          >
            សូមគោរពអញ្ជើញ
          </span>

          <span
            className={`moul-regular text-[clamp(1rem,3.2vw,1.5rem)] py-5 text-center
              animate-[fade-up_700ms_ease-out_both] [animation-delay:240ms]
              ${isStoryPlaying ? "hidden" : ""}`}
          >
            លោក ពិសិដ្ឋ សត្យា
          </span>

          <button
            onClick={handleStartStory}
            className={`px-6 py-2 rounded-xl font-semibold moul-regular
              text-[var(--gold)] bg-white/5 backdrop-blur-sm
              border border-[var(--gold)]/60 shadow-md shadow-black/20
              hover:bg-white/10 transition duration-300
              focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/40
              ${isStoryPlaying ? "hidden" : ""}`}
          >
            ចូលរួមពិធី
          </button>
        </main>
      </div>
    </>
  );
}

export default App;
