import { useLoaderData, useOutletContext } from "react-router-dom";
import Seo19 from "../components/Seo19.jsx";
import Heading from "../components/base/Heading.jsx";
import CoverSection from "../components/base/CoverSection.jsx";

export default function CoverPage() {
  // From App's <Outlet context>
  const outlet = useOutletContext() ?? {};
  const mode = outlet.mode ?? "background";
  const startStory = outlet.startStory ?? (() => {});
  const isStoryPlaying = mode === "story";

  // From route loader
  const data = useLoaderData() ?? {};
  const { indexable = true, seo = {}, customer = null } = data;

  return (
    <>
      <Seo19
        {...seo}
        noindex={!indexable}
        noarchive={!indexable}
        // Stronger signals to major bots when not indexable
        googleBot={!indexable ? "noindex, nofollow, noarchive" : undefined}
        bingBot={!indexable ? "noindex, nofollow, noarchive" : undefined}
      />

      <div
        className="
          relative z-10 mx-auto flex flex-col
          w-full min-h-[100dvh]
          max-w-[clamp(440px,92vw,56rem)]
          mt-[clamp(0rem,4vw,5rem)]
          px-4 sm:px-6
        "
        data-aos="zoom-in"
      >
        <Heading isStoryPlaying={isStoryPlaying} />
        <CoverSection
          isStoryPlaying={isStoryPlaying}
          onStart={startStory}
          customer={customer}
        />
      </div>
    </>
  );
}
