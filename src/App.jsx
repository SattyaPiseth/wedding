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

  useEffect(() => {
    // Try autoplay ambient music; many phones will block until a tap.
    audioRef.current?.play().then(() => {
      setUnlocked(true);
    }).catch(() => {});
  }, []);

  const handleStartStory = async () => {
    setIsStoryPlaying(true);
    setStoryIndex(0);

    if (videoRef.current) {
      videoRef.current.src = storyVideos[0];
      videoRef.current.loop = false;
      videoRef.current.muted = false;
      videoRef.current.removeAttribute("muted");
      try {
        await videoRef.current.play();
      } catch {
        videoRef.current.muted = true;
        videoRef.current.setAttribute("muted", "");
        await videoRef.current.play().catch(() => {});
      }
    }

    audioRef.current?.pause();
    if (!unlocked) setUnlocked(true);
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
      // Back to ambient loop
      if (videoRef.current) {
        videoRef.current.src = "/videos/background.mp4";
        videoRef.current.loop = true;
        videoRef.current.muted = true;
        videoRef.current.setAttribute("muted", "");
        await videoRef.current.play().catch(() => {});
      }
      if (unlocked) audioRef.current?.play().catch(() => {});
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
