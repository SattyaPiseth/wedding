export default function Heading({ isStoryPlaying = false }) {
  return (
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
  );
}
