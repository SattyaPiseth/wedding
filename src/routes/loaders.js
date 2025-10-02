import { redirect } from "react-router-dom";
import { findCustomerByUuid, isValidUuidFormat } from "../lib/customers";

const abs = (origin, path = "/") => {
  try {
    return new URL(path, origin).href;
  } catch {
    return path;
  }
};

const buildSeoForCustomer = (customer, uuid, origin) => {
  const couple   = customer?.coupleName ?? "Our Wedding";
  const when     = customer?.dateHuman ?? "Save the Date";
  const where    = customer?.locationShort ? ` at ${customer.locationShort}` : "";
  const invitee  = customer?.guestName ? ` — Invitation for ${customer.guestName}` : "";

  // Title: couple + date + invitee (if any)
  const title = `${couple} — ${when}${invitee}`;

  // Description: short + personalized (keeps social cards tidy)
  const baseDesc = `Join ${couple}${where}. Ceremony details, schedule, map, and RSVP.`;
  const description = customer?.guestName ? `${baseDesc} For ${customer.guestName}.` : baseDesc;

  const image     = customer?.coverImageUrl ?? "/images/landscape-04.jpg";
  const canonical = abs(origin, `/${uuid ?? ""}`);
  const locale    = customer?.locale ?? "en_US";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: couple,
    startDate: customer?.dateISO ?? undefined,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: customer?.locationFull
      ? { "@type": "Place", name: customer.locationFull }
      : undefined,
    image: [image],
    description,
    url: canonical,
  };

  return {
    title,
    description,
    canonical,
    image,
    locale,
    ogType: "event",
    updatedTime: new Date().toISOString(),
    jsonLd,
  };
};


export async function coverLoader({ params, request }) {
  const { uuid } = params || {};
  const origin = import.meta?.env?.VITE_SITE_URL || new URL(request.url).origin;

  // Index route → generic SEO
  if (!uuid) {
    return {
      isValidInvite: false,
      customer: null,
      indexable: true,
      seo: {
        title: "Kim & Nary Wedding — Save the Date",
        description:
          "Join us in celebrating love. Ceremony details, schedule, map, and RSVP.",
        canonical: abs(origin, "/"),
        image: "/images/landscape-04.jpg",
        locale: "en_US",
        ogType: "website",
        updatedTime: new Date().toISOString(),
      },
    };
  }

  if (!isValidUuidFormat(uuid)) {
    return redirect("/");
  }

  const customer = findCustomerByUuid(uuid);

  if (!customer) {
    // Soft "not found" page that won’t be indexed
    return {
      isValidInvite: false,
      customer: null,
      indexable: false,
      seo: {
        title: "Invitation not found",
        description: "This invite link is invalid or has expired.",
        canonical: abs(origin, `/${uuid}`),
        image: "/images/landscape-04.jpg",
        locale: "en_US",
        ogType: "website",
        updatedTime: new Date().toISOString(),
      },
    };
  }

  const indexable = Boolean(customer.isPublic && !customer.isExpired);
  const seo = buildSeoForCustomer(customer, uuid, origin);

  return { isValidInvite: true, customer, indexable, seo };
}
