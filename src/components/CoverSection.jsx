export default function CoverSection({ isStoryPlaying = false, onStart }) {
  return (
    <main
      className="
        flex flex-col items-center justify-center
        text-[var(--gold)] tracking-wide
        px-4 sm:px-6 lg:px-8
      "
      aria-label="Wedding cover section"
    >
      {!isStoryPlaying && (
        <>
          {/* Outer container: image + text block with unified vertical rhythm */}
          <div className="flex flex-col items-center gap-y-8 sm:gap-y-10 lg:gap-y-12">

            {/* Cover mark */}
            <img
              className="
                block mx-auto h-auto
                w-3/5 max-w-[300px]
                sm:w-3/4 sm:max-w-[330px]
                md:max-w-[360px]
                xl:max-w-[400px]
                2xl:max-w-[430px]
              "
              src="/images/cover-page/name-cover.png"
              alt="Piseth Sattya wedding cover"
              loading="lazy"
              decoding="async"
            />

            {/* Inner container: invitation line, name line, CTA */}
            <div className="flex flex-col items-center gap-y-4 sm:gap-y-6 lg:gap-y-8">

              {/* Khmer invitation line */}
              <span
                role="heading" aria-level={1}
                className="
                  moul-regular text-center
                  leading-normal lg:leading-snug
                  tracking-[0.01em]
                  text-xl sm:text-2xl lg:text-3xl xl:text-[2rem] 2xl:text-[2.125rem]
                  animate-[fade-up_700ms_ease-out_both]
                  [animation-delay:160ms]
                  motion-reduce:animate-none
                "
              >
                សូមគោរពអញ្ជើញ
              </span>

              {/* Name line */}
              <span
                role="heading" aria-level={2}
                className="
                  moul-regular text-center
                  leading-normal lg:leading-tight
                  tracking-[0.005em]
                  text-lg sm:text-2xl lg:text-3xl xl:text-[1.875rem] 2xl:text-[2rem]
                  animate-[fade-up_700ms_ease-out_both]
                  [animation-delay:360ms]
                  motion-reduce:animate-none
                "
              >
                លោក ពិសិដ្ឋ សត្យា
              </span>

              {/* CTA */}
              <button
                onClick={onStart}
                className="
                  px-6 py-2 sm:px-7 sm:py-2.5 2xl:px-8 2xl:py-3
                  rounded-xl font-semibold moul-regular
                  text-[var(--gold)]
                  bg-white/5 hover:bg-white/10
                  backdrop-blur-sm
                  border border-[var(--gold)]/60
                  shadow-md shadow-black/20
                  transition duration-300
                  focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/40
                  text-sm sm:text-base lg:text-lg 2xl:text-xl
                  animate-[fade-up_700ms_ease-out_both]
                  [animation-delay:560ms]
                  motion-reduce:animate-none
                "
                aria-label="Join the program"
              >
                ចូលរួមកម្មវិធី
              </button>

            </div>
          </div>
        </>
      )}
    </main>
  );
}
