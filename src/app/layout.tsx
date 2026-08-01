import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// #region agent log
import { DebugProbe } from "@/components/DebugProbe";
// #endregion

// Matter substitute per the style reference — geometric grotesk, weights 400/500 only.
const matter = Inter({
  variable: "--font-matter",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#012624",
};

export const metadata: Metadata = {
  title: "Точка Зрения — Медицинский центр и Оптика",
  description:
    "Высокоточная диагностика зрения, опытные офтальмологи и собственная оптика в медицинском центре «Точка Зрения». Онлайн-запись, детский приём с 0 лет, аппаратное лечение.",
  keywords: [
    "офтальмолог",
    "оптика",
    "точка зрения",
    "проверка зрения",
    "детский офтальмолог",
    "очки",
    "контактные линзы",
    "аппаратное лечение зрения",
  ],
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Точка Зрения",
  },
};

// #region agent log
// Temporary debug probe (session 9bf674). Deliberately ES5-only and inline so
// it still runs if the bundled chunks fail to parse on an old WebView engine.
const DEBUG_PROBE = `(function(){
var EP='/api/debug-log';
function send(m,d,h){try{
var b=JSON.stringify({sessionId:'9bf674',runId:'run1',hypothesisId:h,location:'layout-inline',message:m,data:d,timestamp:Date.now()});
if(navigator.sendBeacon){navigator.sendBeacon(EP,new Blob([b],{type:'application/json'}));return;}
var x=new XMLHttpRequest();x.open('POST',EP,true);x.setRequestHeader('Content-Type','application/json');x.send(b);
}catch(e){}}
window.__dlog=send;
var gl='no';
try{var c=document.createElement('canvas');gl=(c.getContext('webgl')||c.getContext('experimental-webgl'))?'yes':'no';}catch(e){gl='throw';}
send('html-boot',{ua:navigator.userAgent,href:location.href,ref:document.referrer,w:window.innerWidth,h:window.innerHeight,dpr:window.devicePixelRatio,webgl:gl},'A');
window.addEventListener('error',function(ev){
var t=ev.target;
if(t&&t!==window&&t.tagName&&(t.tagName==='SCRIPT'||t.tagName==='LINK'||t.tagName==='IMG')){
send('resource-error',{tag:t.tagName,url:String(t.src||t.href||'').slice(-120)},'C');
}else{
send('js-error',{msg:String(ev.message||''),src:String(ev.filename||'').slice(-120),line:ev.lineno,col:ev.colno,stack:ev.error&&ev.error.stack?String(ev.error.stack).slice(0,500):null},'B');
}},true);
window.addEventListener('unhandledrejection',function(ev){send('promise-rejection',{reason:String(ev.reason).slice(0,500)},'B');});
setTimeout(function(){try{
var b=document.body;var cs=b?getComputedStyle(b):null;
var txt=b?String(b.innerText||'').replace(/\\s+/g,' ').replace(/^ +| +$/g,''):'';
var p=document.createElement('div');p.style.color='oklch(0.55 0.12 200)';b.appendChild(p);
var ok=getComputedStyle(p).color;b.removeChild(p);
var all=b?b.querySelectorAll('*'):[];var faded=0;var lim=all.length<250?all.length:250;
for(var i=0;i<lim;i++){if(parseFloat(getComputedStyle(all[i]).opacity)<0.05)faded++;}
send('snapshot-4s',{readyState:document.readyState,bodyBg:cs?cs.backgroundColor:null,bodyColor:cs?cs.color:null,textLen:txt.length,textHead:txt.slice(0,110),sheets:document.styleSheets.length,scripts:document.querySelectorAll('script').length,oklch:ok,fadedOf:lim,faded:faded,scrollH:b?b.scrollHeight:0},'C');
}catch(e){send('snapshot-failed',{err:String(e).slice(0,300)},'C');}},4000);
})();`;
// #endregion

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${matter.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-abyss text-silver antialiased">
        {/* #region agent log */}
        <script suppressHydrationWarning dangerouslySetInnerHTML={{ __html: DEBUG_PROBE }} />
        <DebugProbe />
        {/* #endregion */}
        {children}
      </body>
    </html>
  );
}
