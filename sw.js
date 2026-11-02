// Fitness OS v4.6 — GitHub Pages sub-path safe, offline-capable static shell.
// No user data, health metrics, or form submissions are cached by the service worker.
const CACHE='fitnessos-duo-shell-v4.6-20261102';
const PREFIX='fitnessos-duo-shell-';
const APP_SHELL=new URL('./index.html',self.registration.scope).href;
const STATIC_FILES=['./','./index.html','./manifest.webmanifest','./assets/fitness-engine-v4.3.js','./assets/fitness-visuals-v4.4.js','./assets/fitness-media-v4.5.js','./assets/fitness-premium-v4.6.js','./assets/motions/bp.svg','./assets/motions/inc.svg','./assets/motions/fly.svg','./assets/motions/ohp.svg','./assets/motions/pushdown.svg','./assets/motions/lat.svg','./assets/motions/row.svg','./assets/motions/face.svg','./assets/motions/curl.svg','./assets/motions/rdl.svg','./assets/motions/squat.svg','./assets/motions/lunge.svg','./assets/motions/hip.svg','./assets/motions/lib_cable_abduct.svg','./assets/motions/lib_pallof.svg','./icons/icon-192.png','./icons/icon-512.png','./assets/overview.webp','./assets/push.webp','./assets/pull.webp','./assets/legs.webp','./assets/food.webp'];
self.addEventListener('install',event=>event.waitUntil((async()=>{
  const cache=await caches.open(CACHE);
  await cache.addAll(STATIC_FILES);
  await self.skipWaiting();
})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{
  const keys=await caches.keys();
  await Promise.all(keys.filter(key=>key.startsWith(PREFIX)&&key!==CACHE).map(key=>caches.delete(key)));
  await self.clients.claim();
})()));
self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET')return;
  const url=new URL(request.url);
  // CC BY-SA visual frames are optional cross-origin assets; cached after first successful load/download.
  if(url.origin==='https://cdn.jsdelivr.net' && url.pathname.includes('/@bryllim/workout-guide@1.0.0/assets/')){
    event.respondWith((async()=>{const mediaCache=await caches.open('fitnessos-v45-licensed-media');const hit=await mediaCache.match(request.url);if(hit)return hit;
    try{const response=await fetch(request);if(response.ok||response.type==='opaque')await mediaCache.put(request.url,response.clone());return response}catch{return Response.error()}})());
    return;
  }
  if(url.origin!==self.location.origin||!url.pathname.startsWith(new URL(self.registration.scope).pathname))return;
  if(request.mode==='navigate'){
    // Network first so next launch sees newer versions; use cached app shell offline.
    event.respondWith((async()=>{
      try{
        const response=await fetch(event.request);
        if(response.ok){const cache=await caches.open(CACHE);await cache.put(APP_SHELL,response.clone())}
        return response;
      }catch{
        return (await caches.match(APP_SHELL)) || Response.error();
      }
    })());
    return;
  }
  event.respondWith((async()=>{
    const hit=await caches.match(request);
    if(hit)return hit;
    try{
      const response=await fetch(request);
      if(response.ok){const cache=await caches.open(CACHE);await cache.put(request,response.clone())}
      return response;
    }catch{return Response.error()}
  })());
});
