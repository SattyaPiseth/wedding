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
        max-w-[440px]
        sm:max-w-[42rem]
        lg:max-w-[56rem]
        min-h-[100dvh]
      "
    >
      <Heading isStoryPlaying={isStoryPlaying} />
      <CoverSection isStoryPlaying={isStoryPlaying} onStart={startStory} />
    </div>
  );
}
