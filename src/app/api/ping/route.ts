// #region agent log
// Temporary diagnostic page (session 9bf674): plain HTML with no bundle, no
// stylesheet and no webfont, so it separates "the network/TLS path to this
// server is broken" from "the app's own JS/CSS breaks on this device".
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const host = request.headers.get("host") || "unknown";
  const stamp = new Date().toISOString();
  const html = `<!DOCTYPE html>
<html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>PING</title></head>
<body style="background:#012624;color:#fff;font:16px -apple-system,sans-serif;padding:24px">
<h1 style="font-size:34px">PING OK</h1>
<p>host: ${host}</p>
<p>server time: ${stamp}</p>
<p id="s">probe: sending…</p>
<script>(function(){try{
var b=JSON.stringify({sessionId:'9bf674',runId:'run2',hypothesisId:'I',location:'api/ping',message:'ping-boot',data:{ua:navigator.userAgent,href:location.href,w:window.innerWidth,h:window.innerHeight},timestamp:Date.now()});
var x=new XMLHttpRequest();x.open('POST','/api/debug-log',true);x.setRequestHeader('Content-Type','application/json');
x.onload=function(){document.getElementById('s').innerHTML='probe: sent ('+x.status+')';};
x.onerror=function(){document.getElementById('s').innerHTML='probe: FAILED to send';};
x.send(b);
}catch(e){document.getElementById('s').innerHTML='probe: threw '+e;}})();</script>
</body></html>`;

  return new Response(html, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
      // lets the diagnostic page read the status across hosts, so a reachable
      // host is distinguishable from one that merely refused the read
      "access-control-allow-origin": "*",
    },
  });
}
// #endregion
