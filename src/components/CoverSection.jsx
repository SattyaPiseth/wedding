export default function CoverSection({ isStoryPlaying = false, onStart }) {
  return (
    <main
      className="
        flex flex-col items-center justify-center
        text-[var(--gold)] tracking-wider
      
      "
    >
      {!isStoryPlaying && (
        <>
          <img
            className="block mx-auto h-auto w-[clamp(56%,70vw,82%)] max-w-[min(300px,60%)]"
            src="/images/cover-page/name-cover.png"
            alt="Cover"
          />
          <span
            className="
              moul-regular text-center
              text-[clamp(1.15rem,3.5vw,1.75rem)]
              animate-[fade-up_700ms_ease-out_both] [animation-delay:120ms]
            "
          >
            សូមគោរពអញ្ជើញ
          </span>

          <span
            className="
              moul-regular text-center 
              text-[clamp(1.05rem,5vw,1.5rem)] py-5
              animate-[fade-up_700ms_ease-out_both] [animation-delay:240ms]
            "
          >
            លោក ពិសិដ្ឋ សត្យា
          </span>

          <button
            onClick={onStart}
            className="
              px-6 py-2 rounded-xl font-semibold moul-regular
              text-[var(--gold)] bg-white/5 backdrop-blur-sm
              border border-[var(--gold)]/60 shadow-md shadow-black/20
              hover:bg-white/10 transition duration-300 text-lg
              focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/40
              animate-[fade-up_700ms_ease-out_both] 
            "
          >
            ចូលរួមកម្មវិធី
          </button>
        </>
      )}
    </main>
  );
}
