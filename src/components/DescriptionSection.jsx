import React from "react";

export const DescriptionSection = () => {
  return (
    <section
      lang="km"
      aria-labelledby="invite-title"
      className="mx-auto max-w-[42rem] px-4 py-6 sm:px-12 sm:py-8 md:px-28 lg:px-32 text-center flex flex-col gap-3 sm:gap-4 md:gap-6  animate-[fade-up_700ms_ease-out_both] [animation-delay:120ms]"
    >
      <h2
        id="invite-title"
        className="bayon-regular text-[#bc9c22] text-balance text-lg tracking-wide sm:text-xl "
      >
        សូមគោរពអញ្ជើញ
      </h2>

      <p className="siemreap-regular text-[#bc9c22] text-pretty text-sm/7 sm:text-base/8 md:text-lg/8 tracking-wide">
        សម្ដេច ទ្រង់ ឯកឧត្ដម អ្នកឧកញ៉ា ឧកញ៉ា លោកជំទាវ លោក​ លោកស្រី អ្នកនាងកញ្ញា
        អញ្ជើញចូលរួមជាអធិបតី និងជាភៀវកិត្តិយស ដើម្បីប្រសិទ្ធពរជ័យ សិរិសួស្ដី
        ជ័យមង្គល ក្នុងពិធីរៀបអាពាហ៍ពិពាហ៍ កូនប្រុស‍‍‌-ស្រី របស់យើងខ្ញុំ
      </p>
    </section>
  );
};
