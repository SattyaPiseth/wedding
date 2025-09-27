import React from "react";

export const ParentsSection = () => {
  return (
    <section
      className="
        mx-auto max-w-screen-lg
        px-4 sm:px-6 md:px-8
        py-4 md:py-10

        grid grid-cols-2 text-left justify-items-start
        sm:text-lg 

        gap-x-8 gap-y-4
        sm:gap-x-16 sm:gap-y-4
        md:gap-x-24 md:gap-y-6
        lg:gap-x-32
        
        bayon-regular text-[#bc9c22]
  "
    >
      <div className="animate-[fade-up_0.6s_ease-out]">លោក ស៊ីម សារីម</div>
      <div className="animate-[fade-up_0.6s_ease-out]">លោក តាំង វ៉ា</div>
      <div className="animate-[fade-up_0.6s_ease-out]">លោកស្រី លី ខេង</div>
      <div className="animate-[fade-up_0.6s_ease-out]">លោកស្រី ម៉ាច ប៊ុននី</div>
    </section>
  );
};
