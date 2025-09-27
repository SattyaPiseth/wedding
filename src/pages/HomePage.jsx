import Heading from "../components/Heading";
import { ParentsSection } from "../components/ParentsSection";

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
        <ParentsSection />
        <section
          lang="km"
          aria-labelledby="invite-title"
          className="mx-auto max-w-[42rem] p-4 sm:px-6 lg:px-8 text-center space-y-3 sm:space-y-5 "
        >
          <h2
            id="invite-title"
            className="bayon-regular text-[#bc9c22] text-lg sm:text-xl leading-[1.15] tracking-wide"
          >
            សូមគោរពអញ្ជើញ
          </h2>

          <p className="siemreap-regular text-[#bc9c22] text-pretty text-sm/7 sm:text-base/8 md:text-lg/8 tracking-wide">
            សម្ដេច ទ្រង់ ឯកឧត្ដម អ្នកឧកញ៉ា ឧកញ៉ា លោកជំទាវ លោក​ លោកស្រី
            អ្នកនាងកញ្ញា អញ្ជើញចូលរួមជាអធិបតី និងជាភៀវកិត្តិយស
            ដើម្បីប្រសិទ្ធពរជ័យ សិរិសួស្ដី ជ័យមង្គល ក្នុងពិធីរៀបអាពាហ៍ពិពាហ៍
            កូនប្រុស‍‍‌-ស្រី របស់យើងខ្ញុំ
          </p>
        </section>
      </div>
    </>
  );
};
