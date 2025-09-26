import { Outlet } from "react-router-dom";
import { useRef, useState } from "react";
import VideoLayer from "./components/VideoLayer.jsx";
import Overlay from "./components/Overlay.jsx";

export default function App() {
  const audioRef = useRef(null);
  const videoRef = useRef(null);

  const [isStoryPlaying, setIsStoryPlaying] = useState(false);
  const [storyIndex, setStoryIndex] = useState(-1);
  const [unlocked, setUnlocked] = useState(false);

  const storyVideos = ["/videos/home.mp4"];

  const primeAudio = async () => {
    const a = audioRef.current;
    if (!a) return;
    try {
      const prevMuted = a.muted;
      const prevVol = a.volume;
      a.muted = true;
      a.volume = 0;
      await a.play();
      await a.pause();
      a.currentTime = 0;
      a.muted = prevMuted;
      a.volume = prevVol;
      setUnlocked(true);
    } catch {}
  };

  const handleStartStory = async () => {
    setIsStoryPlaying(true);
    setStoryIndex(0);

    const v = videoRef.current;
    const a = audioRef.current;

    await primeAudio();

    if (v) {
      v.src = storyVideos[0];
      v.loop = false;
      v.muted = false;
      v.removeAttribute("muted");
    }

    await Promise.all([
      (async () => {
        if (!v) return;
        try {
          await v.play();
        } catch {
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
          try {
            a.muted = true;
            await a.play();
            setTimeout(() => (a.muted = false), 0);
          } catch {}
        }
      })(),
    ]);
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
      if (videoRef.current) {
        videoRef.current.src = "/videos/background.mp4";
        videoRef.current.loop = true;
        videoRef.current.muted = true;
        videoRef.current.setAttribute("muted", "");
        await videoRef.current.play().catch(() => {});
      }

      if (!audioRef.current?.paused && unlocked) {
        // already playing
      } else if (unlocked) {
        audioRef.current?.play().catch(() => {});
      }

      setIsStoryPlaying(false);
      setStoryIndex(-1);
    }
  };

  return (
    <>
      {/* Ambient music (persistent across routes) */}
      <audio
        ref={audioRef}
        src="/audio/beautiful-in-white.mp3"
        preload="auto"
        loop
        hidden
      />

      {/* Background video (persistent) */}
      <VideoLayer
        videoRef={videoRef}
        isStoryPlaying={isStoryPlaying}
        onEnded={handleVideoEnded}
      />

      {/* Overlay (persistent) */}
      <Overlay />

      {/* Pages render here. Share layout state via Outlet context */}
      <Outlet context={{ isStoryPlaying, onStart: handleStartStory }} />
    </>
  );
}
