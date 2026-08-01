// #region agent log
// Temporary debug instrumentation (session 9bf674).
// Kept on globalThis so the proxy bundle and the route handler bundle append to
// the same buffer inside one server process. Remove with /api/debug-log.

export type SinkEntry = {
  receivedAt: number;
  source: "server" | "client";
  payload: unknown;
};

const KEY = "__debugSink9bf674" as const;
const MAX_ENTRIES = 600;

type SinkHost = typeof globalThis & { [KEY]?: SinkEntry[] };

export function sinkEntries(): SinkEntry[] {
  const host = globalThis as SinkHost;
  if (!host[KEY]) host[KEY] = [];
  return host[KEY];
}

export function sinkPush(source: SinkEntry["source"], payload: unknown) {
  const entries = sinkEntries();
  entries.push({ receivedAt: Date.now(), source, payload });
  if (entries.length > MAX_ENTRIES) entries.splice(0, entries.length - MAX_ENTRIES);
}
// #endregion
