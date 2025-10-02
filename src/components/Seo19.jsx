import { useLocation } from "react-router-dom";

const DEFAULTS = {
  siteName: "kim & nary wedding",
  title: "Kim & Nary Wedding — Save the Date",
  description: "Join us in celebrating love. Ceremony details, schedule, map, and RSVP.",
  image: "/images/landscape-04.jpg",
  locale: "en_US",
  themeColor: "#ffffff",
  ogType: "website",
};

const RAW_BASE_URL = import.meta.env.VITE_SITE_URL || "http://localhost:5173";
const BASE_URL = RAW_BASE_URL.replace(/\/+$/, "");

const absUrl = (path = "/") => {
  try {
    return new URL(path, BASE_URL).href;
  } catch {
    return path;
  }
};

const normalizeCanonical = (url) => {
  try {
    const u = new URL(url);
    u.search = "";
    u.hash = "";
    return u.href;
  } catch {
    return url;
  }
};

export default function Seo19({
  title,
  description,
  image = DEFAULTS.image,
  imageAlt = DEFAULTS.title,
  imageWidth = 1200,
  imageHeight = 630,
  canonical,
  noindex = false,
  noarchive = false,
  noimageindex = false,
  nosnippet = false,
  siteName = DEFAULTS.siteName,
  locale = DEFAULTS.locale,
  themeColor = DEFAULTS.themeColor,
  twitterSite,
  ogType = DEFAULTS.ogType,
  updatedTime,
  alternates,
  jsonLd,
  path,
  children,
}) {
  const loc = useLocation();
  const currentPath = path ?? loc.pathname;

  const pageUrl = normalizeCanonical(canonical || absUrl(currentPath));
  const pageTitle = title ? `${title} • ${siteName}` : DEFAULTS.title;
  const pageDesc = description || DEFAULTS.description;
  const imageUrl = absUrl(image);

  const robots = [
    noindex ? "noindex,nofollow" : "index,follow",
    noarchive && "noarchive",
    noimageindex && "noimageindex",
    nosnippet && "nosnippet",
    "max-image-preview:large",
  ]
    .filter(Boolean)
    .join(", ");

  const imageSecure = imageUrl.startsWith("https://") ? imageUrl : undefined;

  return (
    <>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDesc} />
      <meta name="robots" content={robots} />

      <link rel="canonical" href={pageUrl} />

      {Array.isArray(alternates) &&
        alternates.map((alt, i) => (
          <link key={i} rel="alternate" hrefLang={alt.hrefLang} href={alt.href} />
        ))}

      <meta property="og:type" content={ogType} />
      <meta property="og:locale" content={locale} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDesc} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:image" content={imageUrl} />
      {imageSecure && <meta property="og:image:secure_url" content={imageSecure} />}
      <meta property="og:image:alt" content={imageAlt} />
      <meta property="og:image:width" content={String(imageWidth)} />
      <meta property="og:image:height" content={String(imageHeight)} />
      {updatedTime && <meta property="og:updated_time" content={updatedTime} />}

      <meta name="twitter:card" content="summary_large_image" />
      {twitterSite && <meta name="twitter:site" content={twitterSite} />}
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDesc} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:image:alt" content={imageAlt} />

      <meta name="theme-color" content={themeColor} />

      {jsonLd &&
        (Array.isArray(jsonLd) ? jsonLd : [jsonLd]).map((obj, i) => (
          <script key={i} type="application/ld+json">
            {JSON.stringify(obj)}
          </script>
        ))}

      {children}
    </>
  );
}
