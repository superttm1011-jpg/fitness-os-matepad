/* Fitness OS V4.6 — privately imported, legally acquired action media.
 * No media is bundled or uploaded. Browser CacheStorage holds user-selected files locally.
 * Not a licence grant; individual users must have rights for their intended uses.
 */
(function(){'use strict';
const STORE='fitnessos-v46-user-licensed-media';
const LIMIT=25*1024*1024;
const TYPES=new Set(['image/gif','image/webp','image/png','image/jpeg','video/mp4','video/webm']);
const GUIDE={
 bp:'https://gymvisual.com/animated-gifs/2231-smith-bench-press.html',
};
const esc=s=>String(s||'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const slug=id=>String(id||'').replace(/[^A-Za-z0-9_-]/g,'').slice(0,90);
const key=ex=>slug(ex.sourceId||ex.id);
const requestUrl=k=>new URL('assets/user-imports/'+encodeURIComponent(k),document.baseURI).href;
let blobUrls=new Map();
async function cache(){if(!('caches' in window))throw new Error('当前浏览器不支持本地媒体缓存');return caches.open(STORE)}
async function readMedia(k){let c=await cache();return c.match(requestUrl(k))}
function viewHTML(file,url){const safe=esc(file.type||'');return file.type.startsWith('video/')?`<video controls muted loop playsinline preload="metadata" src="${url}" aria-label="已导入的授权动作视频" style="max-width:100%;max-height:350px"></video>`:`<img src="${url}" alt="本机导入的授权动作素材" decoding="async" style="max-width:100%;max-height:350px;object-fit:contain">`}
function panel(ex){let k=key(ex);if(!k)return '';const p=GUIDE[k]||'https://gymvisual.com/';return `<section class="v46-panel" data-v46-key="${esc(k)}"><div class="v46-heading"><div><h3>写实肌肉动作演示（本机素材）</h3><p>优先显示你合法取得的高清 GIF 或视频；不上传到 GitHub，也不上传云端。</p></div><a href="${p}" target="_blank" rel="noopener noreferrer">浏览现成动作素材</a></div><div data-v46-slot="${esc(k)}" class="v46-preview" aria-live="polite">正在检查本机是否已导入素材…</div><div class="v46-tools"><label class="v46-input-label" for="v46-media-${esc(k)}">导入已授权图片 / 动图 / 视频</label><input id="v46-media-${esc(k)}" type="file" data-v46-upload="${esc(k)}" accept="image/gif,image/webp,image/png,image/jpeg,video/mp4,video/webm"><button class="btn secondary" type="button" data-v46-remove="${esc(k)}">移除本机素材</button></div><p class="v46-note">图片支持 GIF/WebP/PNG/JPEG，视频支持 MP4/WebM；单文件不超过25MB。素材须由你自行取得使用权限。更换设备、清空网站数据或浏览器缓存时可能丢失，原始素材应自行保存。请勿将商业 GIF 上传至公开 GitHub 仓库。</p></section>`}
async function hydrateOne(node){const k=node.dataset.v46Slot;if(!k||node.dataset.v46Loading)return;node.dataset.v46Loading='1';
 try{const match=await readMedia(k);if(!node.isConnected)return;
 if(!match){node.textContent='尚未导入。可以使用下方现成动作素材入口，取得授权后导入本机。';node.classList.remove('v46-ready');}
 else{const blob=await match.blob();const old=blobUrls.get(k);if(old)URL.revokeObjectURL(old);const object=URL.createObjectURL(blob);blobUrls.set(k,object);node.innerHTML=viewHTML(blob,object)+`<span class="v46-caption">已从本机缓存加载｜${(blob.size/1024/1024).toFixed(1)} MB</span>`;node.classList.add('v46-ready')}
 }catch(e){node.textContent='本机媒体缓存不可用：'+String(e.message||e);}
 finally{delete node.dataset.v46Loading;node.dataset.v46Done='yes';}}
function hydrate(){document.querySelectorAll('[data-v46-slot]:not([data-v46-done])').forEach(n=>hydrateOne(n))}
let pending=false;
new MutationObserver(()=>{if(pending)return;pending=true;setTimeout(()=>{pending=false;hydrate()},50)}).observe(document.documentElement,{subtree:true,childList:true});
document.addEventListener('change',async event=>{
 let input=event.target.closest('[data-v46-upload]');if(!input)return;
 const k=input.dataset.v46Upload, file=input.files?.[0];if(!file)return;
 const slot=document.querySelector(`[data-v46-slot="${CSS.escape(k)}"]`);
 if(!TYPES.has(file.type)){if(slot)slot.textContent='文件格式不受支持。请使用 GIF、WebP、PNG、JPEG、MP4 或 WebM。';input.value='';return}
 if(file.size>LIMIT){if(slot)slot.textContent='素材超过25MB，请选择较小的版本。';input.value='';return}
 if(slot)slot.textContent='正在将素材保存到本机…';
 try{const c=await cache();await c.put(requestUrl(k),new Response(file,{headers:{'Content-Type':file.type}}));if(slot){delete slot.dataset.v46Done;await hydrateOne(slot)}}catch(e){if(slot)slot.textContent='保存失败：'+String(e.message||e)}finally{input.value=''}
 });
document.addEventListener('click',async event=>{const btn=event.target.closest('[data-v46-remove]');if(!btn)return;let k=btn.dataset.v46Remove;
 try{let c=await cache();await c.delete(requestUrl(k));let u=blobUrls.get(k);if(u)URL.revokeObjectURL(u);blobUrls.delete(k);const slot=document.querySelector(`[data-v46-slot="${CSS.escape(k)}"]`);if(slot){delete slot.dataset.v46Done;await hydrateOne(slot)}}catch(e){alert('移除失败：'+String(e.message||e))}});
window.FitnessPremium46={panel,hydrate,cacheName:STORE};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',hydrate,{once:true});else hydrate();
})();