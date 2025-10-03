export default function Heading({ isStoryPlaying = false }) {
  return (
    <header
      className="
        p-4 flex items-center justify-center tracking-wide text-[var(--gold)]
        pt-[calc(var(--safe-top)+var(--pad-top-dynamic)+var(--pad-top-extra))]
      "
      aria-label="សិរីមង្គលអាពាហ៍ពិពាហ៍"
      data-aos="fade-down"
      data-aos-easing="linear"
      data-aos-duration="400"
    >
      {/* Primary semantic h1 (screen reader only) */}
      <h1 className="sr-only">សិរីមង្គលអាពាហ៍ពិពាហ៍</h1>

      {!isStoryPlaying && (
        <img
          src="/images/cover-page/heading-cover-page.png"
          alt=""
          width={1982}
          height={520}
          className="
            block mx-auto h-auto select-none aspect-[1982/520]
            w-[clamp(420px,52vw,600px)] -mt-[clamp(0px,1.8vw,12px)]
            sm:w-[460px] sm:-mt-12
            md:w-[clamp(520px,45vw,640px)] md:-mt-[clamp(6px,1.2vw,16px)]
            lg:w-[min(52vw,680px)] lg:-mt-[clamp(8px,1vw,20px)]
            xl:w-[min(38vw,720px)] 2xl:w-[550px]
          "
          sizes="(max-width: 768px) 48vw, (max-width: 1024px) 45vw, (max-width: 1280px) 42vw, 720px"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          draggable={false}
          aria-hidden="true"
        />
      )}
    </header>
  );
}
