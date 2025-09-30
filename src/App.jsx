import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useRef, useState, useEffect, useCallback } from "react";
import VideoLayer from "./components/VideoLayer.jsx";
import Overlay from "./components/Overlay.jsx";
import Aos from "aos";
import "aos/dist/aos.css";
import Seo19 from "./components/Seo19.jsx";
import PlayMusic from "./components/PlayMusic.jsx";

const STORY_VIDEOS = ["/videos/home.mp4"];
const BGMUSIC = "/audio/beautiful-in-white.mp3";

// Default + route backgrounds
const DEFAULT_BG = {
  src: "/videos/background.mp4",
  poster: "/images/background.png",
  loop: true,
};

const BG_BY_ROUTE = {
  "/": {
    src: "/videos/background.mp4",
    poster: "/images/background.png",
    loop: true,
  },
  "/home": {
    src: "/videos/bg-homepage.mp4",
    poster: "/images/home-bg.png",
    loop: false,
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

  // gate for allowing audio to auto-play after unlock
  const [allowAudio, setAllowAudio] = useState(false);

  // user mute preference (persisted)
  const [muted, setMuted] = useState(() => {
    try {
      return typeof window !== "undefined" && localStorage.getItem("bgMuted") === "1";
    } catch {
      return false;
    }
  });

  // route background + override
  const routeBg = BG_BY_ROUTE[pathname] ?? DEFAULT_BG;
  const [bgOverride, setBgOverride] = useState(null);
  const effectiveBg = bgOverride ?? routeBg;

  const setBackground = useCallback(
    (next) => setBgOverride((prev) => ({ ...(prev ?? routeBg), ...next })),
    [routeBg]
  );
  const resetBackground = useCallback(() => setBgOverride(null), []);

  // smooth volume ramp
  const fadeTo = useCallback(async (target = 1, ms = 400) => {
    const a = audioRef.current;
    if (!a) return;
    const steps = 10;
    const start = a.volume ?? 1;
    const step = (target - start) / steps;
    const dt = ms / steps;
    for (let i = 0; i < steps; i++) {
      a.volume = Math.max(0, Math.min(1, (a.volume ?? start) + step));
      // eslint-disable-next-line no-await-in-loop
      await new Promise((r) => setTimeout(r, dt));
    }
  }, []);

  // Prime audio on user gesture (idempotent)
  const primeAudio = useCallback(async () => {
    if (unlocked) return;
    const a = audioRef.current;
    if (!a) return;
    try {
      const prevMuted = a.muted;
      const prevVol = a.volume ?? 1;
      a.muted = true;
      a.volume = 0;
      await a.play(); // silent play to satisfy autoplay policies
      a.pause();
      a.currentTime = 0;
      a.muted = prevMuted || muted; // respect user mute
      a.volume = prevVol;
      setUnlocked(true);
    } catch {
      // still locked — needs another gesture
    }
  }, [unlocked, muted]);

  // One-time unlock on first user interaction
  useEffect(() => {
    const onFirstInteract = () => primeAudio();
    window.addEventListener("pointerdown", onFirstInteract, { once: true, passive: true });
    window.addEventListener("keydown", onFirstInteract, { once: true });
    return () => {
      window.removeEventListener("pointerdown", onFirstInteract);
      window.removeEventListener("keydown", onFirstInteract);
    };
  }, [primeAudio]);

  // AOS init
  useEffect(() => {
    Aos.init({ duration: 800, easing: "ease-in-out", once: true });
  }, []);

  // clear override on route change
  useEffect(() => {
    setBgOverride(null);
  }, [pathname]);

  // Enable + play immediately under the same gesture
  const enableAudioNow = useCallback(async () => {
    await primeAudio();         // satisfy autoplay policy
    setAllowAudio(true);        // open the gate
    const a = audioRef.current;
    if (a && !muted) {
      try {
        a.muted = muted;
        await a.play();
        fadeTo(1, 250);
      } catch {}
    }
  }, [primeAudio, muted, fadeTo]);

  // public API to start the story (also enables audio)
  const startStory = useCallback(async () => {
    await enableAudioNow();
    setStoryIndex(0);
    setMode("story");
  }, [enableAudioNow]);

  // central video/audio controller
  useEffect(() => {
    const v = videoRef.current;
    const a = audioRef.current;
    if (!v) return;

    const applyAndPlay = async (src, { loop }) => {
      const el = videoRef.current;
      if (!el) return;

      el.loop = !!loop;
      el.muted = true;
      el.setAttribute("muted", "");

      const absolute = new URL(src, window.location.origin).href;
      const same = el.currentSrc === absolute || el.src === absolute;

      if (!same) {
        el.src = src;
        await new Promise((res) => {
          const on = () => (el.removeEventListener("loadedmetadata", on), res());
          el.addEventListener("loadedmetadata", on, { once: true });
        });
      }

      try {
        await el.play();
      } catch {
        /* ignore autoplay failures */
      }
    };

    const ensureAudioPlaying = async () => {
      if (!a) return;
      a.muted = muted;
      if (allowAudio && unlocked && !muted && a.paused) {
        try {
          await a.play();
          fadeTo(1, 300);
        } catch {}
      }
    };

    if (mode === "story") {
      const src = STORY_VIDEOS[storyIndex] ?? STORY_VIDEOS[0];
      applyAndPlay(src, { loop: false });
      ensureAudioPlaying();
    } else {
      applyAndPlay(effectiveBg.src, { loop: effectiveBg.loop });
      ensureAudioPlaying();
    }
  }, [mode, storyIndex, unlocked, muted, effectiveBg, fadeTo, allowAudio]);

  // end-of-video only in story mode
  const handleEnded = useCallback(() => {
    if (mode !== "story") return;
    const next = storyIndex + 1;
    if (next < STORY_VIDEOS.length) {
      setStoryIndex(next);
    } else {
      setMode("background");
      setStoryIndex(0);
      if (pathname !== "/home") navigate("/home", { replace: true });
    }
  }, [mode, storyIndex, navigate, pathname]);

  // Visibility: pause when hidden, resume when visible (respect allowAudio)
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onVisibility = async () => {
      if (document.hidden) {
        try {
          await fadeTo(0, 200);
        } finally {
          a.pause();
        }
      } else if (allowAudio && unlocked && !muted) {
        try {
          await a.play();
          fadeTo(1, 250);
        } catch {}
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [unlocked, muted, fadeTo, allowAudio]);

  // pause when muted, resume when unmuted (if allowed)
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    if (muted) {
      a.pause();
    } else if (allowAudio) {
      a.play().catch(() => {});
    }
  }, [muted, allowAudio]);

  // iOS loop seam patch (respect allowAudio/muted)
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onEnded = () => {
      a.currentTime = 0;
      if (allowAudio && !muted) a.play().catch(() => {});
    };
    a.addEventListener("ended", onEnded);
    return () => a.removeEventListener("ended", onEnded);
  }, [allowAudio, muted]);

  // Persist mute preference
  useEffect(() => {
    const a = audioRef.current;
    if (a) a.muted = muted;
    try {
      localStorage.setItem("bgMuted", muted ? "1" : "0");
    } catch {}
  }, [muted]);

  // show PlayMusic ONLY on /home and NOT during the story
  const showPlayMusic = pathname === "/home" && mode !== "story";

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

      {showPlayMusic && (
        <PlayMusic
          allowAudio={allowAudio}
          setAllowAudio={setAllowAudio}
          muted={muted}
          setMuted={setMuted}
          onEnableAudio={enableAudioNow}
        />
      )}

      {/* Children get the small API */}
      <main className="relative z-20">
        <Outlet
          context={{
            mode,
            startStory,    // unlock + play + start story
            setBackground,
            resetBackground,
            setAllowAudio, // optional: enable music from routed pages
            allowAudio,
            muted,
            setMuted,
          }}
        />
      </main>
    </>
  );
}
