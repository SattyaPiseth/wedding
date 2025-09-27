import React from "react";

export const DescriptionSection = () => {
  return (
    <section
      lang="km"
      aria-labelledby="invite-title"
      className="mx-auto max-w-2xl px-4 py-6 sm:px-12 sm:py-8 md:px-28 lg:px-32"
    >
      {/* soft glass card */}
      <div
        className="
          text-center text-[#bc9c22]
          rounded-xl p-5 sm:p-7 md:p-8
          bg-white/10 backdrop-blur-sm
          border border-white/20
          shadow-sm
          animate-[fade-up_700ms_ease-out_both] [animation-delay:120ms]
        "
      >
        <h2
          id="invite-title"
          className="bayon-regular text-balance text-lg sm:text-xl md:text-2xl tracking-wide"
        >
          សូមគោរពអញ្ជើញ
        </h2>

        <p className="mt-3 sm:mt-4 md:mt-5 siemreap-regular text-sm sm:text-base md:text-lg tracking-wide leading-relaxed">
          សម្ដេច ទ្រង់ ឯកឧត្ដម អ្នកឧកញ៉ា ឧកញ៉ា លោកជំទាវ លោក​ លោកស្រី
          អ្នកនាងកញ្ញា អញ្ជើញចូលរួមជាអធិបតី និងជាភៀវកិត្តិយស ដើម្បីប្រសិទ្ធពរជ័យ
          សិរិសួស្ដី ជ័យមង្គល ក្នុងពិធីរៀបអាពាហ៍ពិពាហ៍ កូនប្រុស‍‍‌-ស្រី
          របស់យើងខ្ញុំ
        </p>

        <div className="my-5 sm:my-6 md:my-8 h-px bg-white/10" />

        <section lang="km" aria-labelledby="couple-title">
          <h3 id="couple-title" className="sr-only">
            ឈ្មោះកូនប្រុស និងកូនស្រី
          </h3>

          <dl className="mx-auto max-w-screen-md grid grid-cols-2 gap-4 sm:gap-6">
            <div className="flex flex-col items-center gap-3">
              <dt className="bayon-regular tracking-wide text-base sm:text-lg">
                កូនប្រុសនាម
              </dt>
              <dd className="moul-regular text-[#7a6200] text-lg sm:text-xl">ស៊ឹម ហុងគីម</dd>
            </div>

            <div className="flex flex-col items-center gap-3">
              <dt className="bayon-regular tracking-wide text-base sm:text-lg">
                កូនស្រីនាម
              </dt>
              <dd className="moul-regular text-[#7a6200] text-lg sm:text-xl">តំាង ណារី</dd>
            </div>
          </dl>
        </section>

        <div className="my-5 sm:my-6 md:my-8 h-px bg-white/10" />

        <section className="flex flex-col gap-3 sm:gap-4 md:gap-5 leading-loose">
          <p className="siemreap-regular text-sm sm:text-base md:text-lg leading-normal sm:leading-relaxed md:leading-loose">
            ដែលនឹងប្រព្រឹត្តទៅ ចាប់ពីម៉ោង ៥ ល្ងាច
          </p>
          <p className="moul-regular text-[#7a6200] text-sm sm:text-base md:text-lg leading-relaxed md:leading-[1.7]">
            នៅថ្ងៃអាទិត្យ ទី៣០ ខែវិច្ឆិកា ឆ្នំា២០២៥
          </p>
          <p className="siemreap-regular text-sm sm:text-base md:text-lg leading-normal sm:leading-relaxed md:leading-loose">
            ភោជនីយដ្ឋាន ឡាក់គីប្រាយ
          </p>
        </section>
      </div>
    </section>
  );
};
