export default function HeroSection({ isStoryPlaying, onStart }) {
  return (
    <div
      className="
        relative z-10 mx-auto flex flex-col
        w-full min-w-[320px] max-w-[440px]            /* iOS window */
        android:min-w-[360px] android:max-w-[412px]   /* Android window */
        md:max-w-[42rem] lg:max-w-[56rem]
        min-h-[clamp(568px,100dvh,956px)]
        android:min-h-[clamp(772px,100dvh,916px)]
      "
    >
      <header
        className="
          p-4 flex items-center justify-center text-[var(--gold)] tracking-wide
          pt-[calc(var(--safe-top)+var(--pad-top-dynamic)+var(--pad-top-extra))]
        "
      >
        {!isStoryPlaying && (
          <h1
            className="
              font-semibold moul-regular text-center
              text-[clamp(1.20rem,4vw,1.75rem)]
              animate-[pop_650ms_cubic-bezier(0.22,1,0.36,1)_both]
            "
          >
            សិរីមង្គលអាពាហ៍ពិពាហ៍
          </h1>
        )}
      </header>

      <main
        className="
          flex-1 flex flex-col items-center justify-center
          text-[var(--gold)] tracking-wider
          gap-3 ios:gap-4 android:gap-3
          pb-[calc(env(safe-area-inset-bottom,0px)+16px)]
        "
      >
        {!isStoryPlaying && (
          <>
            <span
              className="
                moul-regular text-center
                text-[clamp(1.15rem,4vw,1.75rem)]
                animate-[fade-up_700ms_ease-out_both] [animation-delay:120ms]
              "
            >
              សូមគោរពអញ្ជើញ
            </span>
            <span
              className="
                moul-regular text-center
                text-[clamp(1.05rem,3.2vw,1.5rem)] py-5
                animate-[fade-up_700ms_ease-out_both] [animation-delay:240ms]
              "
            >
              លោក ពិសិដ្ឋ សត្យា
            </span>
            <button
              onClick={onStart}
              className="
                px-6 py-2 ios:px-7 ios:py-3 rounded-xl font-semibold moul-regular
                text-[var(--gold)] bg-white/5 backdrop-blur-sm text-sm
                border border-[var(--gold)]/60 shadow-md shadow-black/20
                hover:bg-white/10 transition duration-300
                focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/40
                animate-[fade-up_700ms_ease-out_both]
              "
            >
              ចូលរួមកម្មវិធី
            </button>
          </>
        )}
      </main>
    </div>
  );
}
