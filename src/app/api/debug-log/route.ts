// #region agent log
// Temporary debug instrumentation collector (session 9bf674).
// Browsers on remote devices cannot reach the local debug ingest server, so
// probes post here and the entries are pulled out afterwards for analysis.
// Remove this route together with the client-side probes.
import { sinkEntries, sinkPush } from "@/lib/debugSink";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const raw = await request.text().catch(() => "");
  let payload: unknown;
  try {
    payload = JSON.parse(raw);
  } catch {
    payload = { unparsed: raw.slice(0, 2000) };
  }

  sinkPush("client", payload);
  console.log("[debug-9bf674]", JSON.stringify(payload));

  return new Response(null, { status: 204 });
}

export async function GET(request: Request) {
  const key = new URL(request.url).searchParams.get("key");
  if (key !== "9bf674") return new Response("forbidden", { status: 403 });
  const entries = sinkEntries();
  return Response.json(
    { count: entries.length, entries },
    { headers: { "cache-control": "no-store" } }
  );
}
// #endregion
