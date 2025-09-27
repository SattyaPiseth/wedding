import React from "react";

export const ParentsSection = () => {
  return (
    <section
      className="
mx-auto max-w-screen-lg
        px-4 sm:px-6 md:px-8
        py-4

        grid grid-cols-2
        justify-items-start
        text-left

        text-base sm:text-lg md:text-xl lg:text-lg

        /* Gaps: base -> sm default -> md/lg override */
        gap-x-3 gap-y-3
        sm:gap-6
        md:gap-x-32 md:gap-y-6 md:py-10
        lg:gap-x-24 lg:gap-y-8

        /* Device overrides (mobile only) */
        android:gap-y-8
        android:gap-x-6
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
