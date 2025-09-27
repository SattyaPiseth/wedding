import Heading from "../components/Heading";

export const HomePage = () => {
  return (
    <>
      <div
        className="relative z-10 mx-auto flex flex-col
        w-full min-w-[320px] max-w-[440px]            /* iOS window */
        android:min-w-[360px] android:max-w-[412px]   /* Android window */
        md:max-w-[42rem] lg:max-w-[56rem]
        min-h-[clamp(568px,100dvh,956px)]
        android:min-h-[clamp(772px,100dvh,916px)]"
      >
        <Heading />

        <section
          className="

    mx-auto max-w-screen-lg
    px-4 sm:px-6 md:px-8
    py-4

    grid grid-cols-2                      /* mobile: 2 columns */
    gap-x-3 gap-y-3                       /* base gaps */
    sm:gap-x-6 sm:gap-y-4                 /* tablet */
    md:gap-x-10                           /* desktop md */
    lg:gap-x-16                           /* desktop lg */

    android:gap-x-6                       /* device-window overrides */
    ios:gap-x-12
    bayon-regular
    text-lg
    text-[#bc9c22]
  "
        >
          <div className="animate-[fade-up_0.6s_ease-out]">លោក ស៊ីម សារីម</div>
          <div className="animate-[fade-up_0.6s_ease-out]">លោក តាំងវ៉ា</div>
          <div className="animate-[fade-up_0.6s_ease-out]">លោកស្រី លី ខេង</div>
          <div className="animate-[fade-up_0.6s_ease-out]">
            លោកស្រី ម៉ាច ប៊ុននី
          </div>
        </section>
      </div>
    </>
  );
};
