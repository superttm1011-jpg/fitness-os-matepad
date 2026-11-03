// Fitness OS V4.7 — same existing IndexedDB storage key. RepDB free WebP only; no user data cached here.
const CACHE='fitnessos-duo-shell-v4.7-20261102';
const PREFIX='fitnessos-duo-shell-';
const MEDIA_CACHE='fitnessos-repdb-visuals-v4.7';
const APP_SHELL=new URL('./index.html',self.registration.scope).href;
const STATIC_FILES=['./','./index.html','./manifest.webmanifest','./assets/fitness-engine-v4.3.js','./assets/fitness-repdb-v4.7.js','./icons/icon-192.png','./icons/icon-512.png','./assets/overview.webp','./assets/push.webp','./assets/pull.webp','./assets/legs.webp','./assets/food.webp'];
self.addEventListener('install',event=>event.waitUntil((async()=>{const cache=await caches.open(CACHE);await cache.addAll(STATIC_FILES);await self.skipWaiting()})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{const keys=await caches.keys();await Promise.all(keys.filter(k=>k.startsWith(PREFIX)&&k!==CACHE).map(k=>caches.delete(k)));await self.clients.claim()})()));
self.addEventListener('fetch',event=>{const req=event.request;if(req.method!=='GET')return;const url=new URL(req.url);
const repdb=(url.origin==='https://cdn.jsdelivr.net'&&url.pathname.startsWith('/gh/RepDB/exercise-dataset@main/images/flat/'))||(url.origin==='https://raw.githubusercontent.com'&&url.pathname.startsWith('/RepDB/exercise-dataset/main/images/flat/'));
if(repdb){event.respondWith((async()=>{let cache=await caches.open(MEDIA_CACHE);let hit=await cache.match(req.url);if(hit)return hit;try{let r=await fetch(req);if(r.ok && r.type!=='opaque')await cache.put(req.url,r.clone());return r}catch{return Response.error()}})());return}
if(url.origin!==self.location.origin||!url.pathname.startsWith(new URL(self.registration.scope).pathname))return;
if(req.mode==='navigate'){event.respondWith((async()=>{try{let r=await fetch(req);if(r.ok){let c=await caches.open(CACHE);await c.put(APP_SHELL,r.clone())}return r}catch{return await caches.match(APP_SHELL)||Response.error()}})());return}
event.respondWith((async()=>{let hit=await caches.match(req);if(hit)return hit;try{let r=await fetch(req);if(r.ok){let c=await caches.open(CACHE);await c.put(req,r.clone())}return r}catch{return Response.error()}})());});
