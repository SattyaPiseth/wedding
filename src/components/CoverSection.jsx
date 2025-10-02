// pages/CoverSection.jsx
import CustomerNameInline from "./customer/CustomerNameInline";
import useCustomerByUuid from "../hook/useCustomerByUuid";

export default function CoverSection({ isStoryPlaying = false, onStart, customer }) {
  // Prefer the parent-provided customer; fall back to the hook for robustness
  const customerFromHook = useCustomerByUuid();
  const person = customer ?? customerFromHook;
  const showPersonalized = Boolean(person?.guestName);

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
        <div className="flex flex-col items-center gap-y-[5vh] sm:gap-y-[10vh] lg:gap-y-[12vh]">
          {/* Cover mark */}
          <img
            className="block mx-auto h-auto w-3/5 max-w-[300px] sm:w-3/4 sm:max-w-[330px] md:max-w-[360px] xl:max-w-[400px] 2xl:max-w-[430px]"
            src="/images/cover-page/name-cover.png"
            alt="Wedding cover"
            loading="lazy"
            decoding="async"
          />

          {/* Inner container */}
          <div className="flex flex-col items-center gap-y-4 sm:gap-y-6 lg:gap-y-8">
            {/* Khmer invitation line — only when uuid is valid */}
            {showPersonalized && (
              <span
                role="heading"
                aria-level={1}
                className="
                  moul-regular text-center
                  leading-normal lg:leading-snug
                  tracking-[0.01em]
                  text-xl sm:text-2xl lg:text-3xl xl:text-[2rem] 2xl:text-[2.125rem]
                  animate-[fade-up_700ms_ease-out_both]
                  [animation-delay:160ms]
                  motion-reduce:animate-none mb-[2vh] -mt-[3vh]
                "
              >
                សូមគោរពអញ្ជើញ
              </span>
            )}

            {/* Name line */}
            {showPersonalized ? (
              <p className="moul-regular text-center text-xl sm:text-2xl lg:text-3xl animate-[fade-up_700ms_ease-out_both] [animation-delay:360ms] motion-reduce:animate-none">
                {person.guestName}
              </p>
            ) : (
              // Fallback to your existing component if it already handles “no name”
              <CustomerNameInline />
            )}

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
              aria-label="Open invitation"
            >
              សូមចុចបើកធៀប
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
