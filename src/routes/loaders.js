// routes/loaders.js
import { redirect } from "react-router-dom";
import { findCustomerByUuid, isValidUuidFormat } from "../lib/customers";

export async function coverLoader({ params }) {
  const { uuid } = params || {};

  // Index route → generic cover allowed
  if (!uuid) return { isValidInvite: false, customer: null };

  // Obviously invalid UUID → redirect home (or throw 404)
  if (!isValidUuidFormat(uuid)) {
    return redirect("/"); // cleaner than passing redirectTo
  }

  const customer = findCustomerByUuid(uuid);
  if (!customer) {
    // If you prefer a 404 instead:
    // throw new Response("Invite not found", { status: 404 });
    return { isValidInvite: false, customer: null };
  }

  return { isValidInvite: true, customer };
}
