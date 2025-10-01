import customers from "../data/json/customer.json";

export const CUSTOMERS_INDEX = new Map(
  customers
    .filter(Boolean)
    .filter(c => c?.uuid)
    .map(c => [c.uuid.toLowerCase().trim(), c])
);

export function findCustomerByUuid(uuid) {
  if (!uuid) return undefined;
  return CUSTOMERS_INDEX.get(uuid.toLowerCase().trim());
}

// v4-ish UUID validator (loose enough for pre-generated IDs)
export function isValidUuidFormat(uuid) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uuid ?? "");
}
