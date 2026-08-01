// #region agent log
// Temporary diagnostic page (session 9bf674). Served from a host the failing
// device can reach, it probes a controlled matrix of hosts sequentially and
// separates three outcomes: a readable response, a fast refusal (the
// connection worked, the response just wasn't readable cross-origin) and a
// silent timeout (nothing came back at all). Two of the hosts share an
// address with the custom domain, so a difference between them can only come
// from filtering on the name rather than the address.
export const dynamic = "force-dynamic";

export async function GET() {
  const html = `<!DOCTYPE html>
<html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>DIAG</title></head>
<body style="background:#012624;color:#fff;font:15px -apple-system,sans-serif;padding:20px">
<h1 style="font-size:24px;margin:0 0 6px">Проверка доступности</h1>
<p id="hint" style="color:#9fbdb9;margin:0 0 14px">Идёт проверка, подождите примерно минуту…</p>
<ul id="out" style="padding-left:18px;line-height:1.65"></ul>
<script>(function(){
var TIMEOUT=6000,TRIES=2;
var targets=[
{h:'ya.ru',p:'/favicon.ico',label:'ya.ru (контроль связи)'},
{h:'tochka-zreniya-production.up.railway.app',p:'/api/ping',label:'railway адрес .108'},
{h:'zktkchiv.up.railway.app',p:'/api/ping',label:'.99 под чужим именем'},
{h:'tochkazreniya-clinic.ru',p:'/api/ping',label:'наш домен (.114)'},
{h:'www.tochkazreniya-clinic.ru',p:'/api/ping',label:'наш www (.99)'}];
var out=document.getElementById('out');var summary=[];var i=0;
function log(m,d){try{
var b=JSON.stringify({sessionId:'9bf674',runId:'run5',hypothesisId:'M',location:'api/diag',message:m,data:d,timestamp:Date.now()});
var x=new XMLHttpRequest();x.open('POST','/api/debug-log',true);x.setRequestHeader('Content-Type','application/json');x.send(b);
}catch(e){}}
function attempt(t,n,cb){
  var t0=Date.now();var done=false;
  var x=new XMLHttpRequest();
  function finish(state,status){
    if(done)return;done=true;
    cb({host:t.h,tryN:n,state:state,status:status,ms:Date.now()-t0});
  }
  try{
    x.open('GET','https://'+t.h+t.p+'?d='+t0+'-'+n,true);
    x.timeout=TIMEOUT;
    x.onload=function(){finish('ОТВЕТИЛ',x.status);};
    x.onerror=function(){finish('ОТКАЗ',x.status);};
    x.ontimeout=function(){finish('ТАЙМАУТ',0);};
    x.send();
  }catch(e){finish('ИСКЛЮЧЕНИЕ',0);}
}
function runTarget(){
  if(i>=targets.length){
    document.getElementById('hint').innerHTML='Проверка закончена.';
    log('reach-summary',{ua:navigator.userAgent,from:location.host,results:summary});
    return;
  }
  var t=targets[i];
  var li=document.createElement('li');li.innerHTML=t.label+': проверяю…';out.appendChild(li);
  var got=[];
  function next(n){
    if(n>TRIES){
      var txt=[];for(var k=0;k<got.length;k++)txt.push(got[k].state+(got[k].status?' '+got[k].status:'')+' / '+got[k].ms+' мс');
      li.innerHTML=t.label+': <b>'+txt.join(' · ')+'</b>';
      i++;runTarget();return;
    }
    attempt(t,n,function(r){got.push(r);summary.push(r);log('reach-attempt',r);next(n+1);});
  }
  next(1);
}
runTarget();
})();</script>
</body></html>`;

  return new Response(html, {
    headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" },
  });
}
// #endregion
