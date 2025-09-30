// src/components/Seo19.jsx
import { useLocation } from "react-router-dom";

const DEFAULTS = {
  siteName: "kim & nary wedding",
  title: "Kim & Nary Wedding — Save the Date",
  description:
    "Join us in celebrating love. Ceremony details, schedule, map, and RSVP.",
  image: "/images/landscape-04.jpg", // 1200x630 recommended
  locale: "en_US",              // set to "km_KH" if Khmer-first
  themeColor: "#ffffff",
  twitterSite: "",              // e.g. "@yourhandle"
};

const BASE_URL = import.meta.env.VITE_SITE_URL || "http://localhost:5173";

function absUrl(path = "/") {
  try {
    return new URL(path, BASE_URL).href;
  } catch {
    return path;
  }
}

function normalizeCanonical(url) {
  // strip query/hash for a clean canonical
  try {
    const u = new URL(url);
    u.search = "";
    u.hash = "";
    return u.href;
  } catch {
    return url;
  }
}

export default function Seo19({
  // overrides
  title,
  description,
  image = DEFAULTS.image,
  imageAlt = DEFAULTS.title,
  imageWidth = 1200,
  imageHeight = 630,
  canonical,
  noindex = false,
  noarchive = false,
  siteName = DEFAULTS.siteName,
  locale = DEFAULTS.locale,
  themeColor = DEFAULTS.themeColor,
  twitterSite = DEFAULTS.twitterSite,
  children, // e.g., <script type="application/ld+json">{...}</script>
}) {
  const { pathname } = useLocation();

  const pageUrl = normalizeCanonical(canonical || absUrl(pathname));
  const pageTitle = title ? `${title} • ${siteName}` : DEFAULTS.title;
  const pageDesc = description || DEFAULTS.description;
  const imageUrl = absUrl(image);

  // robots value
  const robots = [
    noindex ? "noindex,nofollow" : "index,follow",
    noarchive ? "noarchive" : null,
    "max-image-preview:large",
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <>
      {/* Core */}
      <title>{pageTitle}</title>
      <meta name="description" content={pageDesc} />
      <meta name="robots" content={robots} />

      {/* Canonical */}
      <link rel="canonical" href={pageUrl} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:locale" content={locale} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDesc} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:alt" content={imageAlt} />
      <meta property="og:image:width" content={String(imageWidth)} />
      <meta property="og:image:height" content={String(imageHeight)} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      {twitterSite && <meta name="twitter:site" content={twitterSite} />}
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDesc} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:image:alt" content={imageAlt} />

      {/* Theme */}
      <meta name="theme-color" content={themeColor} />

      {children}
    </>
  );
}
