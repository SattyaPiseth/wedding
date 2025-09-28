export default function SoftCard({ className = "", children }) {
  return (
    <div
      className={[
        "rounded-xl p-5 sm:p-7 md:p-8 text-center text-[#bc9c22]",
        "bg-white/15 backdrop-blur-[2px] border border-white/20 shadow-sm",
        "motion-safe:animate-[fade-up_700ms_ease-out_both] motion-safe:[animation-delay:120ms]",
        "space-y-6 sm:space-y-8 md:space-y-10", // unified vertical rhythm
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}
