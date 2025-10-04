import { list, put } from "@vercel/blob";

const BLOB_KEY = "wishes/wishes.json";
const token = process.env.BLOB_READ_WRITE_TOKEN;

async function readJsonBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw) return {};
  try { return JSON.parse(raw); } catch { const e = new Error("INVALID_JSON"); e.status = 400; throw e; }
}

async function loadWishes() {
  try {
    const { blobs } = await list({ prefix: BLOB_KEY, token }); // STAGE: LIST
    const found = blobs.find((b) => b.pathname === BLOB_KEY);
    if (!found) return [];
    const r = await fetch(found.url, { cache: "no-store" });   // STAGE: FETCH
    try { return await r.json(); } catch { return []; }
  } catch (e) {
    e.stage = e.stage || "LIST_OR_FETCH";
    throw e;
  }
}

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const data = await loadWishes();
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return res.status(200).json(data);
    }

    if (req.method === "POST") {
      const ct = (req.headers["content-type"] || "").toLowerCase();
      if (!ct.includes("application/json")) return res.status(415).send("Unsupported Media Type");
      const body = await readJsonBody(req); // STAGE: READ_BODY

      let { name, message } = body || {};
      name = String(name ?? "").trim();
      message = String(message ?? "").trim();
      if (name.length < 1 || message.length < 1) return res.status(400).send("Name and message required");
      if (name.length > 120 || message.length > 2000) return res.status(413).send("Payload too large");

      const listData = await loadWishes(); // STAGE: LOAD
      const item = { id: Date.now(), name, message, createdAt: new Date().toISOString() };
      listData.push(item);

      try {
        await put(BLOB_KEY, JSON.stringify(listData, null, 2), {
          access: "public",
          contentType: "application/json; charset=utf-8",
          addRandomSuffix: false,
          allowOverwrite: true,
          token, // STAGE: PUT
        });
      } catch (e) {
        e.stage = "PUT";
        throw e;
      }

      return res.status(200).json(item);
    }

    res.setHeader("Allow", "GET, POST");
    return res.status(405).end("Method Not Allowed");
  } catch (err) {
    const status = err.status || 500;
    const payload = {
      error: "INTERNAL_ERROR",
      stage: err.stage || "UNKNOWN",
      message: err.message || String(err)
    };
    console.error("wishes API error:", payload);
    return res.status(status).json(payload);
  }
}
