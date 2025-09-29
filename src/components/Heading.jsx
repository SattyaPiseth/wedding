// export default function Heading({ isStoryPlaying = false }) {
//   return (
//     <header
//       className="
//         p-4 flex items-center justify-center text-[var(--gold)] tracking-wide
//         pt-[calc(var(--safe-top)+var(--pad-top-dynamic)+var(--pad-top-extra))]
//       "
//     >
//       {!isStoryPlaying && (
//         <h1
//           className="
//             font-semibold moul-regular text-center
//             text-[clamp(1.20rem,4vw,1.75rem)]
//             animate-[pop_650ms_cubic-bezier(0.22,1,0.36,1)_both]
//           "
//         >
//           សិរីមង្គលអាពាហ៍ពិពាហ៍
//         </h1>
//       )}
//     </header>
//   );
// }

export default function Heading({ isStoryPlaying = false }) {
  return (
    <header
      className="
        p-4 flex items-center justify-center tracking-wide text-[var(--gold)]
        pt-[calc(var(--safe-top)+var(--pad-top-dynamic)+var(--pad-top-extra))]
      "
    >
      {/* Keep semantic h1 for a11y/SEO */}
      <h1 className="sr-only">សិរីមង្គលអាពាហ៍ពិពាហ៍</h1>

      {!isStoryPlaying && (
        <img
          src="/images/cover-page/heading-cover-page.png"
          alt=""
          width={1982}
          height={520}
          className="
            block mx-auto h-auto aspect-[1982/520]
            w-[400px] sm:w-[240px] md:w-[520px] md:-mt-10 lg:w-[350px]
            animate-[pop_650ms_cubic-bezier(0.22,1,0.36,1)_both]
            select-none
          "
          loading="eager"
        />
      )}
    </header>
  );
}
