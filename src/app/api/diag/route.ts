// #region agent log
// Temporary diagnostic page (session 9bf674). Served from a host the failing
// device can reach, it probes both custom-domain hosts with plain <img> loads
// (no CORS involved) and reports whether the device can resolve/connect to
// them, plus how long each attempt took — an instant failure means the name
// does not resolve, a long stall means the connection blackholes.
export const dynamic = "force-dynamic";

export async function GET() {
  const html = `<!DOCTYPE html>
<html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>DIAG</title></head>
<body style="background:#012624;color:#fff;font:15px -apple-system,sans-serif;padding:20px">
<h1 style="font-size:26px;margin:0 0 16px">Проверка доступности</h1>
<ul id="out" style="padding-left:18px;line-height:1.7"></ul>
<script>(function(){
var hosts=[
'tochka-zreniya-production.up.railway.app',
'zktkchiv.up.railway.app',
'69.46.46.114',
'tochkazreniya-clinic.ru',
'www.tochkazreniya-clinic.ru'];
var out=document.getElementById('out');var results=[];var left=hosts.length;
function log(m,d){try{
var b=JSON.stringify({sessionId:'9bf674',runId:'run4',hypothesisId:'L-vs-M',location:'api/diag',message:m,data:d,timestamp:Date.now()});
var x=new XMLHttpRequest();x.open('POST','/api/debug-log',true);x.setRequestHeader('Content-Type','application/json');x.send(b);
}catch(e){}}
function test(h){
  var li=document.createElement('li');li.innerHTML=h+': проверяю…';out.appendChild(li);
  var t0=Date.now();var done=false;
  var img=new Image();
  function finish(state){
    if(done)return;done=true;var ms=Date.now()-t0;
    li.innerHTML=h+': <b>'+state+'</b> ('+ms+' мс)';
    results.push({host:h,state:state,ms:ms});
    if(--left===0)log('diag-result',{ua:navigator.userAgent,from:location.host,results:results});
  }
  img.onload=function(){finish('ДОСТУПЕН');};
  img.onerror=function(){finish('НЕДОСТУПЕН');};
  setTimeout(function(){finish('ТАЙМАУТ');},12000);
  img.src='https://'+h+'/favicon.ico?d='+t0;
}
for(var i=0;i<hosts.length;i++)test(hosts[i]);
})();</script>
</body></html>`;

  return new Response(html, {
    headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" },
  });
}
// #endregion
