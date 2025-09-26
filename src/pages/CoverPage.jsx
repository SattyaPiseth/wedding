import { useOutletContext } from "react-router-dom";
import HeroSection from "../components/HeroSection.jsx";

export default function CoverPage() {
  const { mode, startStory } = useOutletContext();
  return <HeroSection isStoryPlaying={mode === "story"} onStart={startStory} />;
}
