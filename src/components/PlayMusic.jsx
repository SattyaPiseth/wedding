export default function PlayMusic({
  allowAudio,
  setAllowAudio,
  muted,
  setMuted,
  onEnableAudio, // optional helper to unlock + play immediately
}) {
  const togglePlay = async () => {
    if (!allowAudio) {
      if (onEnableAudio) await onEnableAudio(); // single click: unlock + play
      else setAllowAudio(true);
    } else {
      setMuted((m) => !m);
    }
  };

  const ariaLabel = !allowAudio
    ? "Enable background music"
    : muted
    ? "Unmute background music"
    : "Mute background music";

  // for screen readers to announce changes
  const liveText = !allowAudio ? "Play Music" : muted ? "Muted" : "Unmuted";

  return (
    <button
      type="button"
      onClick={togglePlay}
      className="fixed bottom-4 right-4 z-30 inline-flex items-center justify-center
                 h-11 w-11 rounded-xl px-0
                 bg-black/15 hover:bg-black/25 backdrop-blur
                 text-white shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-white/50"
      aria-pressed={allowAudio && !muted}
      aria-label={ariaLabel}
      title={ariaLabel}
      data-state={!allowAudio ? "locked" : muted ? "muted" : "unmuted"}
    >
      {!allowAudio ? (
        <img
          src="/images/svg/play-music.svg"
          alt=""
          aria-hidden="true"
          className="h-5 w-5"
          decoding="async"
          loading="eager"
        />
      ) : (
        <img
          src={muted ? "/images/svg/sound-off.svg" : "/images/svg/sound-on.svg"}
          alt=""
          aria-hidden="true"
          className="h-5 w-5"
          decoding="async"
          loading="eager"
        />
      )}

      {/* SR-only live region so the state change is announced */}
      <span className="sr-only" aria-live="polite">
        {liveText}
      </span>
    </button>
  );
}
