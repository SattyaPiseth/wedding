export default function ParentsSection({
  title = "ឪពុកម្តាយ",
  names = [
    "លោក ស៊ឹម សារីម",
    "លោក តាំង វ៉ា",
    "លោកស្រី លី ខេង",
    "លោកស្រី ម៉ាច ប៊ុននី",
  ],
  className = "animate-[fade-up_0.6s_ease-out]",
}) {
  return (
    <section
      aria-labelledby="parents-heading"
      className={`mx-auto max-w-screen-lg px-4 sm:px-6 md:px-8 py-4 md:py-10 ${className}`}
     
    >
      {/* SR heading for screen readers */}
      <h2 id="parents-heading" className="sr-only">
        {title}
      </h2>

      <ul
        className="
          grid grid-cols-2 justify-items-start
          gap-x-8 gap-y-4
          sm:gap-x-16 sm:gap-y-4
          md:gap-x-24 md:gap-y-6
          lg:gap-x-32
          sm:text-lg
          bayon-regular text-[#bc9c22]
        "
      >
        {names.map((name) => (
          <li
            key={name}
            className="animate-[fade-up_0.6s_ease-out] motion-reduce:animate-none"
          >
            {name}
          </li>
        ))}
      </ul>
    </section>
  );
}
