import { useOutletContext } from "react-router-dom";
import Heading from "../components/Heading.jsx";
import CoverSection from "../components/CoverSection.jsx";

export default function CoverPage() {
  const { mode, startStory } = useOutletContext();
  const isStoryPlaying = mode === "story";

  return (
    <div
      className="
        relative z-10 mx-auto flex flex-col
        w-full
        max-w-[clamp(440px, 92vw, 56rem)]
        mt-[clamp(0rem, 4vw, 5rem)]
        min-h-[100dvh]
      "
      data-aos="zoom-in"
      
    >
      <Heading isStoryPlaying={isStoryPlaying} />
      <CoverSection isStoryPlaying={isStoryPlaying} onStart={startStory} />
      {/* <div className="h-2 bg-yellow-500 sm:bg-green-400 md:bg-rose-200 lg:bg-red-700 xl:bg-cyan-600 2xl:bg-black" /> */}
    </div>
          

  );
}
