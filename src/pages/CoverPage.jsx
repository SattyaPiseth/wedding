import { useLoaderData, useOutletContext } from "react-router-dom";
import Heading from "../components/Heading.jsx";
import CoverSection from "../components/CoverSection.jsx";
import Seo19 from "../components/Seo19.jsx";

export default function CoverPage() {
  const { mode, startStory } = useOutletContext();
  const isStoryPlaying = mode === "story";

  // ⬇️ include customer
  const { indexable, seo, customer } = useLoaderData();

  return (
    <>
      <Seo19
        {...seo}
        noindex={!indexable}
        noarchive={!indexable}
        // 🔹 Stronger signals to major bots
        googleBot={!indexable ? "noindex, nofollow, noarchive" : undefined}
        bingBot={!indexable ? "noindex, nofollow, noarchive" : undefined}
      />
      <div
        className="
          relative z-10 mx-auto flex flex-col
          w-full
          max-w-[clamp(440px,92vw,56rem)]
          mt-[clamp(0rem,4vw,5rem)]
          min-h-[100dvh]
        "
        data-aos="zoom-in"
      >
        <Heading isStoryPlaying={isStoryPlaying} />
        <CoverSection isStoryPlaying={isStoryPlaying} onStart={startStory} customer={customer} />
      </div>
    </>
  );
}
