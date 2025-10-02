// src/components/Seo19.jsx
import { useLocation } from "react-router-dom";

const DEFAULTS = {
  siteName: "kim & nary wedding",
  title: "Kim & Nary Wedding — Save the Date",
  description: "Join us in celebrating love. Ceremony details, schedule, map, and RSVP.",
  image: "/images/landscape-04.jpg",
  themeColor: "#ffffff",
  ogType: "website",
  twitterCard: "summary_large_image",
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
  // content
  title,
  description,
  image = DEFAULTS.image,
  canonical,

  // indexing flags
  noindex = false,
  noarchive = false,
  noimageindex = false,
  nosnippet = false,

  // types / misc
  ogType = DEFAULTS.ogType,
  themeColor = DEFAULTS.themeColor,
  twitterCard = DEFAULTS.twitterCard,

  // JSON-LD: object or array
  jsonLd,

  // optional path override & site name
  path,
  siteName = DEFAULTS.siteName,

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

  return (
    <>
      {/* Core */}
      <title>{pageTitle}</title>
      <meta name="description" content={pageDesc} />
      <meta name="robots" content={robots} />

      {/* Canonical */}
      <link rel="canonical" href={pageUrl} />

      {/* Open Graph essentials */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDesc} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:image" content={imageUrl} />

      {/* Twitter (reuse OG values) */}
      <meta name="twitter:card" content={twitterCard} />

      {/* Theme */}
      {themeColor && <meta name="theme-color" content={themeColor} />}

      {/* JSON-LD */}
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
