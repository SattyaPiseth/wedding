import { useOutletContext } from "react-router-dom";
import Hero from "../components/Hero.jsx";

export default function Home() {
  const { mode, startStory } = useOutletContext();
  return <Hero isStoryPlaying={mode === "story"} onStart={startStory} />;
}
