import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useRef, useState, useEffect, useCallback } from "react";

import Overlay from "./components/base/Overlay.jsx";
import Seo19 from "./components/Seo19.jsx";
import PlayMusic from "./components/PlayMusic.jsx";
import VideoLayer from "./components/video/VideoLayer.jsx";

const STORY_VIDEOS = ["/videos/home.mp4"];
const BGMUSIC = "/audio/beautiful-in-white.mp3";

const DEFAULT_BG = {
  src: "/videos/background.mp4",
  poster: "/images/background.png",
  loop: true,
};

const BG_BY_ROUTE = {
  "/": { src: "/videos/background.mp4", poster: "/images/background.png", loop: true },
  "/home": { src: "/videos/bg-homepage.mp4", poster: "/images/home-bg.png", loop: false },
};

export default function App() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const audioRef = useRef(null);
  const videoRef = useRef(null);

  // AOS refs
  const aosRef = useRef(null);
  const aosReadyRef = useRef(false);

  // App state
  const [mode, setMode] = useState("background"); // 'background' | 'story'
  const [storyIndex, setStoryIndex] = useState(-1);
  const [unlocked, setUnlocked] = useState(false);
  const [allowAudio, setAllowAudio] = useState(false);

  // Persisted mute preference
  const [muted, setMuted] = useState(() => {
    try {
      return typeof window !== "undefined" && localStorage.getItem("bgMuted") === "1";
    } catch {
      return false;
    }
  });

  // Background management
  const routeBg = BG_BY_ROUTE[pathname] ?? DEFAULT_BG;
  const [bgOverride, setBgOverride] = useState(null);
  const effectiveBg = bgOverride ?? routeBg;

  const setBackground = useCallback(
    (next) =>
      setBgOverride((prev) => {
        const base = prev ?? routeBg;
        return { ...base, ...next, poster: next?.poster ?? base.poster };
      }),
    [routeBg]
  );
  const resetBackground = useCallback(() => setBgOverride(null), []);

  // Smooth volume ramp
  const fadeTo = useCallback(async (target = 1, ms = 400) => {
    const a = audioRef.current;
    if (!a) return;
    const steps = Math.max(2, Math.floor(ms / 25));
    const start = a.volume ?? 1;
    const step = (target - start) / steps;
    for (let i = 0; i < steps; i++) {
      a.volume = Math.min(1, Math.max(0, (a.volume ?? start) + step));
      // eslint-disable-next-line no-await-in-loop
      await new Promise((r) => setTimeout(r, ms / steps));
    }
  }, []);

  // Prime audio on user gesture (idempotent)
  const primeAudio = useCallback(async () => {
    if (unlocked) return;
    const a = audioRef.current;
    if (!a) return;
    try {
      const prevVol = a.volume ?? 1;
      a.muted = true;
      a.volume = 0;
      await a.play(); // silent play to satisfy autoplay
      a.pause();
      a.currentTime = 0;
      a.muted = muted;
      a.volume = prevVol;
      setUnlocked(true);
    } catch {
      // needs another gesture
    }
  }, [unlocked, muted]);

  // One-time unlock on first interaction
  useEffect(() => {
    const onFirstInteract = () => primeAudio();
    window.addEventListener("pointerdown", onFirstInteract, { once: true, passive: true });
    window.addEventListener("keydown", onFirstInteract, { once: true });
    return () => {
      window.removeEventListener("pointerdown", onFirstInteract);
      window.removeEventListener("keydown", onFirstInteract);
    };
  }, [primeAudio]);

  // ✅ AOS: lazy-load lib, defer init to next frame, then extra refreshHard
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!aosRef.current) {
        const { default: AOS } = await import("aos");
        aosRef.current = AOS;
      }
      // wait for first paint to avoid measuring mid-layout
      requestAnimationFrame(() => {
        if (!mounted) return;
        aosRef.current.init({
          duration: 800,
          easing: "ease-in-out",
          once: true,
          disable: () =>
            typeof window !== "undefined" &&
            window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
        });
        aosReadyRef.current = true;
        // one more hard refresh after CSS/fonts/images likely settle
        setTimeout(() => {
          try {
            aosRef.current.refreshHard();
          } catch {}
        }, 200);
      });
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // refresh HARD on route change after paint
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      if (aosReadyRef.current) {
        try {
          aosRef.current.refreshHard();
        } catch {}
      }
    });
    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  // keep offsets fresh if content resizes after load
  useEffect(() => {
    if (!("ResizeObserver" in window)) return;
    const ro = new ResizeObserver(() => {
      if (aosReadyRef.current) {
        try {
          aosRef.current.refreshHard();
        } catch {}
      }
    });
    ro.observe(document.body);
    return () => ro.disconnect();
  }, []);

  // Clear background override on route change
  useEffect(() => setBgOverride(null), [pathname]);

  // Enable + play immediately under same gesture
  const enableAudioNow = useCallback(async () => {
    await primeAudio();
    setAllowAudio(true);
    const a = audioRef.current;
    if (a && !muted) {
      try {
        a.muted = muted;
        await a.play();
        fadeTo(1, 250);
      } catch {}
    }
  }, [primeAudio, muted, fadeTo]);

  // Public API to start the story (also enables audio)
  const startStory = useCallback(async () => {
    await enableAudioNow();
    setStoryIndex(0);
    setMode("story");
  }, [enableAudioNow]);

  // Guard story index for safe bounds
  useEffect(() => {
    if (mode === "story" && (storyIndex < 0 || storyIndex >= STORY_VIDEOS.length)) {
      setStoryIndex(0);
    }
  }, [mode, storyIndex]);

  // Central video/audio controller
  useEffect(() => {
    if (!videoRef.current) return;
    const a = audioRef.current;

    const applyAndPlay = async (src, { loop }) => {
      const el = videoRef.current;
      if (!el) return;

      el.loop = !!loop;
      el.muted = true;
      el.setAttribute("muted", "");
      el.setAttribute("playsinline", "");
      el.srcObject = null;

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
        /* autoplay failures are fine */
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

  // ✅ AOS: refresh HARD when the active video stabilizes (reduces jank on first load)
  useEffect(() => {
    const el = videoRef.current;
    if (!el || !aosReadyRef.current) return;
    const onLoaded = () => {
      try {
        aosRef.current.refreshHard();
      } catch {}
    };
    el.addEventListener("loadeddata", onLoaded);
    el.addEventListener("loadedmetadata", onLoaded);
    return () => {
      el.removeEventListener("loadeddata", onLoaded);
      el.removeEventListener("loadedmetadata", onLoaded);
    };
  }, [effectiveBg.src, mode, storyIndex]);

  // End-of-video only in story mode
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

  // Visibility: fade/pause when hidden, resume when visible (respect allowAudio)
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

  // Pause when muted, resume when unmuted (if allowed)
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

  // Only show PlayMusic on /home and NOT during the story
  const showPlayMusic = pathname === "/home" && mode !== "story";

  return (
    <>
      {/* Site-wide SEO defaults (pages can override) */}
      <Seo19 />

      {/* Skip link for keyboard users */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:bg-white/90 focus:text-black focus:p-2 focus:rounded"
      >
        Skip to content
      </a>

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
      <main id="main" className="relative z-20">
        <Outlet
          context={{
            mode,
            startStory,
            setBackground,
            resetBackground,
            setAllowAudio,
            allowAudio,
            muted,
            setMuted,
          }}
        />
      </main>
    </>
  );
}
