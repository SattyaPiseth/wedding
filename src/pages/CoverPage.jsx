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
        w-full min-w-[320px] max-w-[440px]            /* iOS window */
        android:min-w-[360px] android:max-w-[412px]   /* Android window */
        md:max-w-[42rem] lg:max-w-[56rem]
        min-h-[clamp(568px,100dvh,956px)]
        android:min-h-[clamp(772px,100dvh,916px)]
      "
    >
      <Heading isStoryPlaying={isStoryPlaying} />
      <CoverSection isStoryPlaying={isStoryPlaying} onStart={startStory} />
    </div>
  );
}
