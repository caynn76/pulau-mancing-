const C='pm-v4';
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.addAll(['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'])).catch(()=>{}))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request,u=new URL(r.url);if(r.method!=='GET'||u.origin!==location.origin)return;
if(/\.(mp3|m4a|ogg|wav)$/i.test(u.pathname)||r.headers.has('range'))return;
/* selalu tanya server dulu (cache:'no-cache' = cek versi terbaru, murah kalau tidak berubah); cache dipakai hanya jika offline atau server lambat >6 detik */
e.respondWith((async()=>{try{
 const res=await Promise.race([fetch(u.href,{cache:'no-cache'}),new Promise((_,rej)=>setTimeout(rej,6000))]);
 if(res&&res.ok){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp)).catch(()=>{})}
 return res}catch(_){
 return (await caches.match(r))||(await caches.match('./index.html'))||Response.error()}})())});
