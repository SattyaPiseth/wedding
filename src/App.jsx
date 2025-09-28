import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useRef, useState, useEffect, useCallback } from "react";
import VideoLayer from "./components/VideoLayer.jsx";
import Overlay from "./components/Overlay.jsx";
import Aos from "aos";
import "aos/dist/aos.css";
import Seo19 from "./components/Seo19.jsx";

const STORY_VIDEOS = ["/videos/home.mp4"];
const BGMUSIC = "/audio/beautiful-in-white.mp3";

// Default + route backgrounds
const DEFAULT_BG = {
  src: "/videos/background.mp4",
  poster: "/images/background.jpg",
  loop: true,
  // muted: true,
};

const BG_BY_ROUTE = {
  "/": {
    src: "/videos/background.mp4",
    poster: "/images/background.jpg",
    loop: true,
    // muted: true,
  },
  "/home": {
    src: "/videos/bg-homepage.mp4",
    poster: "/images/home-bg.png",
    loop: false,
    // muted: true,
  },
  // add more routes here ...
};

export default function App() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const audioRef = useRef(null);
  const videoRef = useRef(null);

  // app state
  const [mode, setMode] = useState("background"); // 'background' | 'story'
  const [storyIndex, setStoryIndex] = useState(-1);
  const [unlocked, setUnlocked] = useState(false);

  // route background + override
  const routeBg = BG_BY_ROUTE[pathname] ?? DEFAULT_BG;
  const [bgOverride, setBgOverride] = useState(null);
  const effectiveBg = bgOverride ?? routeBg;

  const setBackground = useCallback(
    (next) => setBgOverride((prev) => ({ ...(prev ?? routeBg), ...next })),
    [routeBg]
  );
  const resetBackground = useCallback(() => setBgOverride(null), []);

  // Init once
  useEffect(() => {
    Aos.init({
      duration: 800,
      easing: "ease-in-out",
      once: true, // animate only the first time element enters viewport
      // mirror: false,    // set true if you want to animate on scroll-up too
      // offset: 0,        // adjust trigger offset if needed
    });
  }, []);

  // clear override on route change
  useEffect(() => {
    setBgOverride(null);
  }, [pathname]);

  // prime audio on user gesture
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

  // public API to start the story
  const startStory = useCallback(async () => {
    await primeAudio();
    // audioRef.current?.pause();
    // MP3 is the only soundtrack
    audioRef.current?.play().catch(() => {});
    setStoryIndex(0);
    setMode("story");
  }, [primeAudio]);

  // central video controller
  useEffect(() => {
    const v = videoRef.current;
    const a = audioRef.current;
    if (!v) return;

    // const applyAndPlay = async (src, { loop }) => {
    //   v.loop = !!loop;
    //   v.muted = true;
    //   v.setAttribute("muted", ""); // always muted

    //   const absolute = window.location.origin + src;
    //   if (v.src !== absolute) {
    //     v.src = src; // relative OK
    //     v.load(); // reset pipeline deterministically
    //   }

    //   try {
    //     await v.play();
    //   } catch {
    //     // Already muted; one safe retry is enough
    //     await v.play().catch(() => {});
    //   }
    // };
    // inside App.jsx, replace applyAndPlay with:
    const applyAndPlay = async (src, { loop }) => {
      const v = videoRef.current;
      if (!v) return;

      v.loop = !!loop;
      v.muted = true;
      v.setAttribute("muted", "");

      // Only update when different
      const absolute = new URL(src, window.location.origin).href;
      const same = v.currentSrc === absolute || v.src === absolute;

      if (!same) {
        // If you keep <source> children in VideoLayer, prefer swapping poster/route,
        // not v.src. But if you do swap v.src, await metadata once:
        v.src = src;
        await new Promise((res) => {
          const on = () => (v.removeEventListener("loadedmetadata", on), res());
          v.addEventListener("loadedmetadata", on, { once: true });
        });
      }

      try {
        await v.play();
      } catch {
        /* ignore (autoplay policies) */
      }
    };

    if (mode === "story") {
      const src = STORY_VIDEOS[storyIndex] ?? STORY_VIDEOS[0];
      // Story video stays muted; MP3 is the soundtrack
      applyAndPlay(src, { loop: false });
      if (unlocked) a?.play().catch(() => {}); // play song
    } else {
      // Background
      applyAndPlay(effectiveBg.src, { loop: effectiveBg.loop });
      if (unlocked) a?.play().catch(() => {}); // always play song
    }
  }, [mode, storyIndex, unlocked, effectiveBg]);

  // end-of-video only in story mode
  const handleEnded = useCallback(() => {
    if (mode !== "story") return;
    const next = storyIndex + 1;
    if (next < STORY_VIDEOS.length) {
      setStoryIndex(next);
    } else {
      setStoryIndex(-1);
      setMode("background");
      navigate("/home");
    }
  }, [mode, storyIndex, navigate]);

  return (
    <>
      {/* Site-wide SEO defaults (pages can override) */}
      <Seo19 />
      {/* Ambient music */}
      <audio ref={audioRef} src={BGMUSIC} preload="auto" loop hidden />

      {/* Background / Story video */}
      <VideoLayer
        videoRef={videoRef}
        poster={effectiveBg.poster}
        onEnded={mode === "story" ? handleEnded : undefined}
      />

      <Overlay />

      {/* Children get the small API */}
      <main className="relative z-20">
        <Outlet
          context={{ mode, startStory, setBackground, resetBackground }}
        />
      </main>
    </>
  );
}
