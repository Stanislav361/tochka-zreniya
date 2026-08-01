// #region agent log
// Temporary debug instrumentation collector (session 9bf674).
// Browsers on remote devices cannot reach the local debug ingest server, so
// probes post here and the entries are pulled out afterwards for analysis.
// Remove this route together with the client-side probes.

type Entry = {
  receivedAt: number;
  ua: string | null;
  payload: unknown;
};

const entries: Entry[] = [];
const MAX_ENTRIES = 400;

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const raw = await request.text().catch(() => "");
  let payload: unknown;
  try {
    payload = JSON.parse(raw);
  } catch {
    payload = { unparsed: raw.slice(0, 2000) };
  }

  entries.push({
    receivedAt: Date.now(),
    ua: request.headers.get("user-agent"),
    payload,
  });
  if (entries.length > MAX_ENTRIES) entries.splice(0, entries.length - MAX_ENTRIES);

  console.log("[debug-9bf674]", JSON.stringify(payload));

  return new Response(null, { status: 204 });
}

export async function GET(request: Request) {
  const key = new URL(request.url).searchParams.get("key");
  if (key !== "9bf674") return new Response("forbidden", { status: 403 });
  return Response.json({ count: entries.length, entries });
}
// #endregion
