import React from "react";

export const ParentsSection = () => {
  return (
    <section
      className="

    mx-auto max-w-screen-lg
    px-4 sm:px-6 md:px-8
    py-4

    grid grid-cols-2                      /* mobile: 2 columns */
    gap-x-3 gap-y-3                       /* base gaps */
    sm:gap-x-6 sm:gap-y-4                 /* tablet */
    md:gap-x-32
    md:gap-y-6 md:py-10                           /* desktop md */
    md:text-2xl
    lg:gap-x-24                           /* desktop lg */
    lg:text-xl
    lg:gap-y-4 lg:py-6
    android:gap-x-6                       /* device-window overrides */
    ios:gap-x-12
    bayon-regular
    text-[#bc9c22]
  "
    >
      <div className="animate-[fade-up_0.6s_ease-out]">លោក ស៊ីម សារីម</div>
      <div className="animate-[fade-up_0.6s_ease-out]">លោក តាំងវ៉ា</div>
      <div className="animate-[fade-up_0.6s_ease-out]">លោកស្រី លី ខេង</div>
      <div className="animate-[fade-up_0.6s_ease-out]">លោកស្រី ម៉ាច ប៊ុននី</div>
    </section>
  );
};
