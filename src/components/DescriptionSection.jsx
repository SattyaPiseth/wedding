import { useState, useMemo } from "react";
import SoftCard from "./SoftCard";
import Countdown from "./Countdown";
import { MasonryGallery } from "./gallery/MasonryGallery";
import { Lightbox } from "./modal/Lightbox";

import { GALLERY_IMAGES } from "../data/galleryImages";
import google_map_icon from "/images/google-maps.png";
import morning_event_image from "/images/morning-event.png";
import afternoon_event_image from "/images/afternoon-event.png";
import { GratitudeSection } from "./GratitudeSection";
import { PromoteSection } from "./PromoteSection";
import { CommentSection } from "./comment/CommentSection";

export default function DescriptionSection({
  // Customizable props with safe defaults
  eventDateIso = "2025-11-30T07:00:00+07:00", // Cambodia +07:00
  venueName = "ភោជនីយដ្ឋាន ឡាក់គីប្រាយ",
  startTimeText = "ដែលនឹងប្រព្រឹត្តទៅ ចាប់ពីម៉ោង ៥ ល្ងាច",
  khmerDateText = "នៅថ្ងៃអាទិត្យ ទី៣០​ ខែវិច្ឆិកា ឆ្នំា ២០២៥",
  mapHref = "https://maps.app.goo.gl/usZXcfNpkuQMZxr27",
  galleryImages = GALLERY_IMAGES,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [idx, setIdx] = useState(0);

  const totalImages = galleryImages.length;
  const open = (i) => {
    setIdx(i);
    setIsOpen(true);
  };
  const close = () => setIsOpen(false);
  const prev = () => setIdx((i) => (i - 1 + totalImages) % totalImages);
  const next = () => setIdx((i) => (i + 1) % totalImages);

  // Derived values
  const countdownLabel = useMemo(() => "Wedding Countdown", []);
  const mapTitle = useMemo(() => "Lucky Bright Restaurant Map", []);

  return (
    <section
      lang="km"
      aria-labelledby="invite-title"
      className="mx-auto max-w-2xl sm:px-12 sm:py-8 md:px-28 lg:px-32" data-aos="fade-up"
    >
      <SoftCard>
        {/* Invite Heading */}
        <h2
          id="invite-title"
          className="bayon-regular text-balance text-lg sm:text-xl md:text-2xl tracking-wide"
        >
          មានកិត្តិយសសូមគោរពអញ្ជើញ
        </h2>

        {/* Intro copy */}
        <p className="siemreap-regular text-sm sm:text-base md:text-lg tracking-wide leading-relaxed">
          សម្ដេច ទ្រង់ ឯកឧត្ដម លោកឧកញ៉ា លោកជំទាវ លោក​ លោកស្រី អ្នកនាង កញ្ញា និង
          ប្រិយមិត្ត អញ្ជើញចូលរួមជាអធិបតី និង​ ជាភ្ញៀវកិត្តិយស
          ដើម្បីប្រសិទ្ធពរជ័យ សិរិសួស្ដី ជ័យមង្គល ក្នុងពិធីរៀបអាពាហ៍ពិពាហ៍
          កូនប្រុស‍‍‌-ស្រី របស់យើងខ្ញុំ។
        </p>

        {/* Couple names */}
        <section aria-labelledby="couple-title" className="mt-3">
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
                តាំង ណារី
              </dd>
            </div>
          </dl>
        </section>

        {/* Event meta */}
        <section className="mt-4 flex flex-col gap-3 sm:gap-4 md:gap-5 leading-loose">
          <p className="siemreap-regular text-sm sm:text-base md:text-lg leading-normal sm:leading-relaxed md:leading-loose">
            {startTimeText}
          </p>
          <p className="moul-regular text-[#7a6200] text-sm sm:text-base md:text-lg leading-relaxed md:leading-[1.7]">
            {khmerDateText}
          </p>
          <p className="siemreap-regular text-sm sm:text-base md:text-lg leading-normal sm:leading-relaxed md:leading-loose">
            {venueName}
          </p>

          {/* Map link */}
          <a
            href={mapHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1 m-2 p-3 moul-regular text-[#7a6200] tracking-wide hover:scale-105 hover:text-[#a07d00] transition-transform cursor-pointer"
            aria-label="បើកទីតាំងក្នុងផែនទី"
          >
            <img
              className="w-7 h-auto sm:w-8"
              src={google_map_icon}
              loading="lazy"
              alt=""
              aria-hidden="true"
            />
            <span className="text-sm hover:underline pt-2">បើកមើលទីតាំង</span>
          </a>

          {/* Responsive map embed */}
          <div
            className="w-full aspect-video rounded-b-sm overflow-hidden shadow-md"
            data-aos="flip-up"
          >
            <iframe
              title={mapTitle}
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3907.962391983032!2d104.88787669999999!3d11.6260304!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x310953f0257737cd%3A0xac98c76694cbd37c!2sLucky%20Bright%20Restaurant!5e0!3m2!1sen!2suk!4v1759070792826!5m2!1sen!2suk"
              className="w-full h-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </section>

        {/* Event posters */}
        <figure className="mt-6">
          <img
            src={morning_event_image}
            alt="Morning event"
            loading="lazy"
          />
        </figure>

        <figure className="mt-4">
          <img
            src={afternoon_event_image}
            alt="Afternoon event"
            loading="lazy"
          />
        </figure>

        {/* Countdown */}
        <section
          className="mt-6 flex flex-col items-center justify-center gap-3 text-3xl"
        >
          <h3 className="great-vibes-regular tracking-wide">Save The Date</h3>
          <p className="great-vibes-regular text-xl tracking-wider">
            K&amp;R The Wedding
          </p>
          <Countdown target={eventDateIso} ariaLabel={countdownLabel} />
        </section>

        {/* Gallery */}
        <h3
          className="moul-regular text-lg mt-6" 
        >
          កម្រងរូបភាព
        </h3>
        <MasonryGallery images={galleryImages} onOpen={open} />

        {isOpen && (
          <Lightbox
            images={galleryImages}
            index={idx}
            onClose={close}
            onPrev={prev}
            onNext={next}
          />
        )}
       <GratitudeSection/>
       <CommentSection/>
       <div data-aos="fade-up">
        <PromoteSection/>
       </div>
      </SoftCard>
    </section>
  );
}
