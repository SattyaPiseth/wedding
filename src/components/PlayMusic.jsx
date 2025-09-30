
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

  return (
    <button
      onClick={togglePlay}
      className="fixed bottom-4 right-4 z-30 rounded-lg px-3 py-2 
                 bg-black/40 text-white hover:bg-black/60 
                 focus:outline-none focus:ring-2 focus:ring-white/50"
      aria-pressed={allowAudio && !muted}
      aria-label={
        !allowAudio
          ? "Enable background music"
          : muted
          ? "Unmute background music"
          : "Mute background music"
      }
    >
      <span aria-live="polite">
        {!allowAudio ? "Play Music" : muted ? "Unmute" : "Mute"}
      </span>
    </button>
  );
}
