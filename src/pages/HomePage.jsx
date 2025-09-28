import { DescriptionSection } from "../components/DescriptionSection";
import Heading from "../components/Heading";
import { ParentsSection } from "../components/ParentsSection";

export const HomePage = () => {
  return (
    <>
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
        <Heading />
        <ParentsSection />
        <DescriptionSection />
        {/* <div className="h-2 bg-yellow-500 sm:bg-green-400 md:bg-amber-950 lg:bg-red-700" /> */}
      </div>
    </>
  );
};
