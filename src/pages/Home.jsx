import { useOutletContext } from "react-router-dom";
import Hero from "../components/Hero.jsx";

export default function Home() {
  const { isStoryPlaying, onStart } = useOutletContext();
  return <Hero isStoryPlaying={isStoryPlaying} onStart={onStart} />;
}
