const CACHE='servigo-estudio-v1';
const SHELL=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./apple-touch-icon.png'];
self.addEventListener('install',e=>{ e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting())); });
self.addEventListener('activate',e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch',e=>{ const u=new URL(e.request.url);
  if(e.request.method!=='GET' || u.hostname.endsWith('supabase.co')) return;
  if(u.origin===location.origin){ // red primero para tener siempre la última versión; caché si no hay internet
    e.respondWith(fetch(e.request).then(r=>{ const c=r.clone(); caches.open(CACHE).then(x=>x.put(e.request,c)); return r; }).catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html')))); return; }
  if(u.hostname.includes('fonts.g')){ e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{ const c=res.clone(); caches.open(CACHE).then(x=>x.put(e.request,c)); return res; }))); }
});
