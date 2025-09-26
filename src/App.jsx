import { useEffect, useRef, useState } from "react";
import VideoLayer from "./components/VideoLayer.jsx";
import Overlay from "./components/Overlay.jsx";
import Hero from "./components/Hero.jsx";

function App() {
  const audioRef = useRef(null);
  const videoRef = useRef(null);

  const [isStoryPlaying, setIsStoryPlaying] = useState(false);
  const [storyIndex, setStoryIndex] = useState(-1);
  const [unlocked, setUnlocked] = useState(false);

  const storyVideos = ["/videos/home.mp4"];

  // --- NEW: prime audio during a user gesture so later plays are allowed ---
  const primeAudio = async () => {
    const a = audioRef.current;
    if (!a) return;
    try {
      const prevMuted = a.muted;
      const prevVol = a.volume;
      a.muted = true;
      a.volume = 0;
      await a.play();     // unlock
      await a.pause();    // stop immediately
      a.currentTime = 0;  // rewind
      a.muted = prevMuted;
      a.volume = prevVol;
      setUnlocked(true);
    } catch {
      // ignore; a second tap will usually unlock if needed
    }
  };

  const handleStartStory = async () => {
    setIsStoryPlaying(true);
    setStoryIndex(0);

    const v = videoRef.current;
    const a = audioRef.current;

    // Prime audio + set up video source before trying to play both
    await primeAudio();

    if (v) {
      v.src = storyVideos[0];
      v.loop = false;
      v.muted = false;                 // try unmuted
      v.removeAttribute("muted");
    }

    // START BOTH together on the same user gesture
    await Promise.all([
      (async () => {
        if (!v) return;
        try {
          await v.play();
        } catch {
          // fallback: some browsers require muted video to start
          v.muted = true;
          v.setAttribute("muted", "");
          await v.play().catch(() => {});
        }
      })(),
      (async () => {
        if (!a) return;
        try {
          a.muted = false;
          await a.play();
        } catch {
          // fallback prime: start muted, unmute next tick
          try {
            a.muted = true;
            await a.play();
            setTimeout(() => { a.muted = false; }, 0);
          } catch {
            // still blocked; another user tap will allow it
          }
        }
      })(),
    ]);

    // IMPORTANT: remove this old line so music doesn't pause at start
    // audioRef.current?.pause();  // <-- DELETE
  };

  const handleVideoEnded = async () => {
    const next = storyIndex + 1;
    if (next < storyVideos.length && videoRef.current) {
      setStoryIndex(next);
      videoRef.current.src = storyVideos[next];
      videoRef.current.loop = false;
      try {
        await videoRef.current.play();
      } catch {
        videoRef.current.muted = true;
        videoRef.current.setAttribute("muted", "");
        await videoRef.current.play().catch(() => {});
      }
    } else {
      // Back to ambient loop (keep audio playing)
      if (videoRef.current) {
        videoRef.current.src = "/videos/background.mp4";
        videoRef.current.loop = true;
        videoRef.current.muted = true;
        videoRef.current.setAttribute("muted", "");
        await videoRef.current.play().catch(() => {});
      }
      // If you want music to CONTINUE, do nothing here.
      // If you want music to STOP after story, uncomment the next line:
      // audioRef.current?.pause();

      // Optional: if audio was still locked somehow, try again:
      if (!audioRef.current?.paused && unlocked) {
        // already playing; no-op
      } else if (unlocked) {
        audioRef.current?.play().catch(() => {});
      }

      setIsStoryPlaying(false);
      setStoryIndex(-1);
    }
  };

  return (
    <>
      {/* Ambient music */}
      <audio
        ref={audioRef}
        src="/audio/beautiful-in-white.mp3"
        preload="auto"
        loop
        hidden
      />

      {/* Background video layer */}
      <VideoLayer
        videoRef={videoRef}
        isStoryPlaying={isStoryPlaying}
        onEnded={handleVideoEnded}
      />

      {/* Overlay tint */}
      <Overlay />

      {/* Foreground hero/content */}
      <Hero
        isStoryPlaying={isStoryPlaying}
        onStart={handleStartStory}
      />
    </>
  );
}

export default App;
