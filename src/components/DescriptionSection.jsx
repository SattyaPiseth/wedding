import SoftCard from "./SoftCard";
import { MasonryGallery } from "./gallery/MasonryGallery";
import { GALLERY_IMAGES } from "./../data/galleryImages";
import google_map_icon from "/images/google-maps.png";
import morning_event_image from "/images/morning-event.png";
import afternoon_event_image from "/images/afternoon-event.png";
import Countdown from "./Countdown";

export const DescriptionSection = () => {
  return (
    <section
      lang="km"
      aria-labelledby="invite-title"
      className="mx-auto max-w-2xl px-4 sm:px-12 sm:py-8 md:px-28 lg:px-32"
    >
      <SoftCard>
        {/* InviteHeading */}
        <h2
          id="invite-title"
          className="bayon-regular text-balance text-lg sm:text-xl md:text-2xl tracking-wide"
        >
          សូមគោរពអញ្ជើញ
        </h2>
        <p className="siemreap-regular text-sm sm:text-base md:text-lg tracking-wide leading-relaxed">
          សម្ដេច ទ្រង់ ឯកឧត្ដម អ្នកឧកញ៉ា ឧកញ៉ា លោកជំទាវ លោក​ លោកស្រី
          អ្នកនាងកញ្ញា អញ្ជើញចូលរួមជាអធិបតី និងជាភៀវកិត្តិយស ដើម្បីប្រសិទ្ធពរជ័យ
          សិរិសួស្ដី ជ័យមង្គល ក្នុងពិធីរៀបអាពាហ៍ពិពាហ៍ កូនប្រុស‍‍‌-ស្រី
          របស់យើងខ្ញុំ
        </p>

        {/* CoupleNames */}
        <section aria-labelledby="couple-title">
          <h3 id="couple-title" className="sr-only">
            ឈ្មោះកូនប្រុស និងកូនស្រី
          </h3>
          <dl className="mx-auto max-w-screen-md grid grid-cols-2 gap-4 sm:gap-6">
            <div className="flex flex-col items-center gap-3">
              <dt className="bayon-regular tracking-wide text-base sm:text-lg">
                កូនប្រុសនាម
              </dt>
              <dd className="moul-regular text-[#7a6200] text-lg sm:text-xl">
                ស៊ឹម ហុងគីម
              </dd>
            </div>
            <div className="flex flex-col items-center gap-3">
              <dt className="bayon-regular tracking-wide text-base sm:text-lg">
                កូនស្រីនាម
              </dt>
              <dd className="moul-regular text-[#7a6200] text-lg sm:text-xl">
                តំាង ណារី
              </dd>
            </div>
          </dl>
        </section>

        {/* EventMeta */}
        {/* <section className="flex flex-col gap-3 sm:gap-4 md:gap-5 leading-loose">
          <p className="siemreap-regular text-sm sm:text-base md:text-lg leading-normal sm:leading-relaxed md:leading-loose">
            ដែលនឹងប្រព្រឹត្តទៅ ចាប់ពីម៉ោង ៥ ល្ងាច
          </p>
          <p className="moul-regular text-[#7a6200] text-sm sm:text-base md:text-lg leading-relaxed md:leading-[1.7]">
            នៅថ្ងៃអាទិត្យ ទី៣០​ខែវិច្ឆិកា ឆ្នំា ២០២៥
          </p>
          <p className="siemreap-regular text-sm sm:text-base md:text-lg leading-normal sm:leading-relaxed md:leading-loose">
            ភោជនីយដ្ឋាន ឡាក់គីប្រាយ
          </p>
          <a
            href="https://maps.app.goo.gl/usZXcfNpkuQMZxr27"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1 m-2 p-3 moul-regular text-[#7a6200] tracking-wide hover:scale-105 hover:text-[#a07d00] transition-transform cursor-pointer"
          >
            <img
              className="w-7 h-auto sm:w-8"
              src={google_map_icon}
              loading="lazy"
              alt="location"
            />
            <span className="text-sm hover:underline pt-2">បើកមើលទីតាំង</span>
          </a>
        </section> */}
        <section className="flex flex-col gap-3 sm:gap-4 md:gap-5 leading-loose">
          <p className="siemreap-regular text-sm sm:text-base md:text-lg leading-normal sm:leading-relaxed md:leading-loose">
            ដែលនឹងប្រព្រឹត្តទៅ ចាប់ពីម៉ោង ៥ ល្ងាច
          </p>
          <p className="moul-regular text-[#7a6200] text-sm sm:text-base md:text-lg leading-relaxed md:leading-[1.7]">
            នៅថ្ងៃអាទិត្យ ទី៣០​ខែវិច្ឆិកា ឆ្នំា ២០២៥
          </p>
          <p className="siemreap-regular text-sm sm:text-base md:text-lg leading-normal sm:leading-relaxed md:leading-loose">
            ភោជនីយដ្ឋាន ឡាក់គីប្រាយ
          </p>

          {/* Map link button */}
          <a
            href="https://maps.app.goo.gl/usZXcfNpkuQMZxr27"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1 m-2 p-3 moul-regular text-[#7a6200] tracking-wide hover:scale-105 hover:text-[#a07d00] transition-transform cursor-pointer"
          >
            <img
              className="w-7 h-auto sm:w-8"
              src={google_map_icon}
              loading="lazy"
              alt="location"
            />
            <span className="text-sm hover:underline pt-2">បើកមើលទីតាំង</span>
          </a>

          {/* Responsive iframe with Tailwind v4 aspect-video */}
          <div className="w-full aspect-video rounded-b-sm overflow-hidden shadow-md">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3907.962391983032!2d104.88787669999999!3d11.6260304!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x310953f0257737cd%3A0xac98c76694cbd37c!2sLucky%20Bright%20Restaurant!5e0!3m2!1sen!2suk!4v1759070792826!5m2!1sen!2suk"
              className="w-full h-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </section>

        <img
          src={morning_event_image}
          alt="morning event image"
          loading="lazy"
          data-aos="fade-up"
          data-aos-anchor-placement="top-bottom"
        />
        <img
          src={afternoon_event_image}
          alt="afternoon event image"
          loading="lazy"
          data-aos="fade-up"
          data-aos-anchor-placement="top-bottom"
        />

        <section
          className=" flex flex-col items-center justify-center gap-3 text-3xl"
          data-aos="fade-up"
          data-aos-anchor-placement="top-bottom"
        >
          <h1 className="great-vibes-regular tracking-wide">Save The Date</h1>
          <h2 className="great-vibes-regular text-xl tracking-wider">
            K&R The Weeding
          </h2>

          {/* Example: target date with +07:00 offset for Cambodia */}
          <Countdown
            target="2025-11-30T07:00:00+07:00"
            ariaLabel="Wedding Countdown"
          />
        </section>
        <h3
          className="moul-regular text-lg"
          data-aos="fade-up"
          data-aos-anchor-placement="top-bottom"
        >
          កម្រងរូបភាព
        </h3>
        {/* Gallery */}
        <MasonryGallery images={GALLERY_IMAGES} />
      </SoftCard>
    </section>
  );
};
