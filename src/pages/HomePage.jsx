import { useMemo } from "react";
import Seo19 from "../components/Seo19";
import { DescriptionSection } from "../components/DescriptionSection";
import Heading from "../components/Heading";
import { ParentsSection } from "../components/ParentsSection";

export const HomePage = () => {
  const raw = import.meta.env.VITE_SITE_URL || "http://localhost:5173";
  const siteUrl = raw.replace(/\/+$/, "");
  const canonical = `${siteUrl}/`;
  const updatedTime = import.meta.env.VITE_BUILD_TIME || undefined;

  const jsonLd = useMemo(() => {
    const base = {
      "@context": "https://schema.org",
      name: "kim & nary wedding",
      url: canonical,
    };
    return [
      { ...base, "@type": "WebSite" },
      { ...base, "@type": "Organization", logo: `${siteUrl}/images/landscape-04.jpg` },
    ];
  }, [canonical, siteUrl]);

  return (
    <>
      <Seo19
        title="Home"
        description="Welcome to the celebration — schedule, gallery, and RSVP."
        canonical={canonical}
        ogType="website"
        jsonLd={jsonLd}
      />
      <div className="relative z-10 mx-auto flex flex-col w-full max-w-[440px] sm:max-w-[42rem] lg:max-w-[56rem] min-h-[100dvh]">
        <Heading />
        <ParentsSection />
        <DescriptionSection />
      </div>
    </>
  );
};
