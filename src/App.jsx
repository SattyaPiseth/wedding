import { Outlet, useNavigate } from "react-router-dom";
import { useRef, useState, useEffect, useCallback } from "react";
import VideoLayer from "./components/VideoLayer.jsx";
import Overlay from "./components/Overlay.jsx";

const STORY_VIDEOS = ["/videos/home.mp4"]; // extend as needed
const BG_VIDEO = "/videos/background.mp4";
const BG_POSTER = "/images/background.jpg";
const BGMUSIC = "/audio/beautiful-in-white.mp3";

export default function App() {
  const navigate = useNavigate();
  const audioRef = useRef(null);
  const videoRef = useRef(null);

  // app state
  const [mode, setMode] = useState("background"); // 'background' | 'story'
  const [storyIndex, setStoryIndex] = useState(-1);
  const [unlocked, setUnlocked] = useState(false);

  // 1) Prime audio once on user action
  const primeAudio = useCallback(async () => {
    const a = audioRef.current;
    if (!a) return;
    try {
      const prevMuted = a.muted;
      const prevVol = a.volume;
      a.muted = true;
      a.volume = 0;
      await a.play();
      a.pause();
      a.currentTime = 0;
      a.muted = prevMuted;
      a.volume = prevVol;
      setUnlocked(true);
    } catch {
      // still locked — user will need another gesture
    }
  }, []);

  // 2) Public API to start the story
  const startStory = useCallback(async () => {
    await primeAudio();
    setStoryIndex(0);
    setMode("story");
  }, [primeAudio]);

  // 3) Centralized effect that reacts to (mode, storyIndex)
  useEffect(() => {
    const v = videoRef.current;
    const a = audioRef.current;
    if (!v) return;

    const applyAndPlay = async (src, { loop, muted }) => {
      v.loop = loop;
      v.muted = muted;
      if (muted) v.setAttribute("muted", "");
      else v.removeAttribute("muted");

      if (v.src !== window.location.origin + src) {
        v.src = src;
        v.load(); // reset pipeline deterministically
      }

      try {
        await v.play();
      } catch {
        // Autoplay fallback: force muted and retry
        v.muted = true;
        v.setAttribute("muted", "");
        await v.play().catch(() => {});
      }
    };

    if (mode === "story") {
      const src = STORY_VIDEOS[storyIndex] ?? STORY_VIDEOS[0];
      applyAndPlay(src, { loop: false, muted: false });
      // bring in bg music only if you want it *during* story:
      // (often stories want clean SFX/music track only)
      if (unlocked) a?.play().catch(() => {});
    } else {
      // background
      applyAndPlay(BG_VIDEO, { loop: false, muted: true }); // play-once background
      // keep ambient music going if user has unlocked
      if (unlocked) a?.play().catch(() => {});
    }
  }, [mode, storyIndex, unlocked]);

  // 4) End-of-video only matters in story mode
  const handleEnded = useCallback(() => {
    if (mode !== "story") return;
    const next = storyIndex + 1;
    if (next < STORY_VIDEOS.length) {
      setStoryIndex(next);
    } else {
      setStoryIndex(-1);
      setMode("background"); // returns to background; background won’t loop
      navigate("/home");
    }
  }, [mode, storyIndex]);

  return (
    <>
      {/* Ambient music */}
      <audio ref={audioRef} src={BGMUSIC} preload="auto" loop hidden />

      {/* Background / Story video */}
      <VideoLayer
        videoRef={videoRef}
        poster={BG_POSTER}
        // Bind onEnded only during story mode
        onEnded={mode === "story" ? handleEnded : undefined}
        // Keep the element declarative; no loop prop here (we set it in effect)
      />

      <Overlay />

      {/* Pass a simple API to children */}
      <main className="relative z-20">
        <Outlet context={{ mode, startStory }} />
      </main>
    </>
  );
}
