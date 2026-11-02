// Fitness OS V4.5 — independently matched licensed three-frame exercise illustrations.
// Source: Bryl Lim's Workout Guide; visual artwork CC BY-SA 4.0.
// Licensed visuals are NOT a substitute for qualified coaching or medical evaluation.
(function(){'use strict';
const ASSET_ROOT='https://cdn.jsdelivr.net/npm/@bryllim/workout-guide@1.0.0/assets/';
const LICENSE='https://creativecommons.org/licenses/by-sa/4.0/';
const SOURCE='https://github.com/bryllim/workout-guide';
const DATA={"bp":{"slug":"smith-machine-bench-press","name":"史密斯平板卧推","variant":"完全匹配","setup":"史密斯固定轨迹；预先设置限位；在肩关节舒适范围内下放","cue":"肩胛稳定、脚掌踏实；杠落在中下胸附近","error":"弹胸或让肩膀向耳朵方向耸起"},"inc":{"slug":"incline-bench-press","name":"上斜卧推","variant":"器械变体：自由杠","setup":"示意使用自由杠；史密斯固定轨迹必须重新调整凳子位置","cue":"凳角先选约20–30°，前臂近垂直、躯干稳定","error":"把凳角设得过高导致肩前束代偿"},"fly":{"slug":"cable-fly","name":"绳索夹胸","variant":"完全匹配","setup":"滑轮高度根据肩部舒适程度调整；保持轻微屈肘","cue":"两手沿弧线在胸前靠拢，缓慢离心还原","error":"肩关节被拉到极限或依赖腰部冲力"},"ohp":{"slug":"seated-dumbbell-press","name":"坐姿肩推","variant":"适用于哑铃变式","setup":"本图展示哑铃坐姿肩推；不适用于模仿固定轨迹史密斯肩推","cue":"下肋骨收紧、手腕与前臂对齐，按个人肩活动度上推","error":"腰椎过度反弓、动作中耸肩"},"pushdown":{"slug":"rope-tricep-pushdown","name":"绳索三头下压","variant":"完全匹配","setup":"配重插销到位、绳索连接牢固；脚站稳","cue":"上臂相对固定，通过伸肘下压","error":"甩动躯干或肩膀前后大幅移动"},"lat":{"slug":"lat-pulldown","name":"高位下拉","variant":"动作同类","setup":"展示常规高位下拉；握把外形随设备变化","cue":"轻微后倾，肘向下向后；杆拉向上胸","error":"向颈后拉杆、大幅甩腰"},"row":{"slug":"seated-row","name":"坐姿划船","variant":"动作同类","setup":"确保有稳定脚撑；家用龙门架无脚撑时不要强行模仿","cue":"中立脊柱、收肩胛、手柄向肋部/腹部靠近","error":"过度腰部前后摆动"},"face":{"slug":"face-pull","name":"绳索面拉","variant":"完全匹配","setup":"滑轮设为面部附近高度；用轻重量控制","cue":"绳索向眉眼附近拉，前臂自然外展旋转","error":"用腰后仰猛拽、强行把手肘推到疼痛位置"},"curl":{"slug":"cable-curl","name":"绳索弯举","variant":"完全匹配","setup":"采用低位滑轮，身体直立","cue":"肘接近体侧，前臂屈肘完成动作","error":"摆髋把重量荡上去"},"rdl":{"slug":"romanian-deadlift","name":"罗马尼亚硬拉","variant":"杠铃版本","setup":"此图为自由杠铃RDL；史密斯版本需考虑固定轨迹","cue":"微屈膝，髋向后移，杠贴近腿，保持自然脊柱","error":"追求杠触地而弓背"},"squat":{"slug":"smith-machine-squat","name":"史密斯深蹲","variant":"完全匹配","setup":"确认锁扣、配重和安全限位；空杆试轨迹","cue":"脚掌均匀受力、膝随脚尖方向、可控深度","error":"膝明显内扣或忽视安全挡位"},"lunge":{"slug":"reverse-lunge","name":"反向箭步蹲","variant":"动作同类","setup":"展示自由负重反向箭步蹲；先徒手或借支撑","cue":"前脚稳定，后脚向后跨；蹲起时保持平衡","error":"依赖后脚猛蹬、身体失控"},"hip":{"slug":"hip-thrust","name":"臀桥／臀推","variant":"臀推变体","setup":"展示凳上臀推；与地面臀桥并不完全相同","cue":"肋骨下收、顶端夹臀、不要过度挺腰","error":"靠腰椎后仰代替髋伸"},"lib_cable_abduct":{"slug":"cable-standing-hip-abduction","name":"绳索髋外展","variant":"完全匹配","setup":"踝带牢固，站稳并扶固定支架","cue":"骨盆保持大致水平，脚向侧方缓慢外展","error":"侧弯腰部、摆动骨盆"},"lib_pallof":{"slug":"pallof-press","name":"帕洛夫抗旋转推","variant":"完全匹配","setup":"单侧拉索位于胸部高度，身体侧向滑轮","cue":"手从胸前推出并抵抗躯干旋转，平稳呼吸","error":"让身体随着拉索扭转或刻意屏气"}};
function resolve(id){let x=String(id||'');x=x.replace(/^(?:quick_|custom_)/,'');if(DATA[x])return x;
  for(const k of Object.keys(DATA))if(x.startsWith(k+'_')||x.includes('_'+k+'_'))return k;
  return x;
}
const esc=s=>String(s||'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
function entry(ex){let id=resolve(ex.id);if(!DATA[id] && ex.sourceId)id=resolve(ex.sourceId);return DATA[id]||null;}
const frame=(slug,i)=>ASSET_ROOT+slug+'/frame-'+i+'.svg';
function demo(ex, mode='detail'){
 const m=entry(ex);if(!m)return null;
 const local=window.FitnessVisual44?.motionFor(ex)||'';
 const imgs=[1,2,3].map((n)=>`<img class="v45-frame v45-frame-${n}" loading="lazy" decoding="async" crossorigin="anonymous" src="${frame(m.slug,n)}" alt="${esc(m.name)}：${['起始位','动作过程','末端位'][n-1]}" onerror="this.closest('.v45-media')?.classList.add('v45-failed')">`).join('');
 const description=mode==='compact'?`<span class="v45-media-tag">三帧动作</span>`:`<div class="v45-frame-hint">${['起始位','过程','末端位'].map((x,i)=>`<span>${i+1} · ${x}</span>`).join('')}</div>`;
 return `<div class="v45-media ${mode==='compact'?'v45-compact':''}" data-media="${esc(m.slug)}" aria-label="${esc(m.name)}分帧动作图">`+
 `<div class="v45-stage">${imgs}${description}</div><div class="v45-fallback">${local?`<img src="${local}" alt="高清帧暂不可用，显示旧版简化示意">`:'<span>暂时无法加载动作图</span>'}<span>当前离线高清资源未就绪，自动显示旧示意</span></div></div>`;
}
function detail(ex){const m=entry(ex);if(!m)return null;return `<div class="v45-detail"><div class="v45-detail-media">${demo(ex)}<div class="v45-legend"><strong>图像对应：</strong>${esc(m.variant)}。仅展示典型姿势的离散帧，<strong>不是连续人体运动捕捉</strong>，无法判断个人动作是否正确。</div></div>`+
 `<section class="v45-instruct"><h3>动作规范校核提示</h3><div class="v45-coach-row"><span>01 · 准备</span><p>${esc(m.setup)}</p></div><div class="v45-coach-row"><span>02 · 运动</span><p>${esc(m.cue)}</p></div><div class="v45-coach-row warn"><span>03 · 避免</span><p>${esc(m.error)}</p></div><p class="v45-source">动作要点依据常用力量训练规范人工交叉核对；未经实体教练逐帧认证。<a href="https://www.nasm.org/workout-exercise-guidance" target="_blank" rel="noopener noreferrer">NASM 动作库</a> · <a href="https://www.acefitness.org/resources/everyone/exercise-library/equipment/" target="_blank" rel="noopener noreferrer">ACE 动作库</a></p></section>`+
 `<p class="v45-credit">图像：Bryl Lim / Workout Guide（含 Everkinetic 衍生素材），<a href="${LICENSE}" target="_blank" rel="noopener noreferrer">CC BY-SA 4.0</a>；<a href="${SOURCE}" target="_blank" rel="noopener noreferrer">源项目与署名</a>。本网应用只组合与展示原图帧，图像原授权不变。</p></div>`;}
const entries=Object.values(DATA);
const allUrls=[...new Set(entries.flatMap(x=>[1,2,3].map(n=>frame(x.slug,n))))];
async function prefetch(onProgress){const c=await caches.open('fitnessos-v45-licensed-media');let ok=0,failed=0;
 // use a small concurrency limit to avoid locking up tablets on slow connections
 let next=0;async function worker(){while(next<allUrls.length){const url=allUrls[next++];try{let cached=await c.match(url);if(!cached){const res=await fetch(url,{mode:'cors',cache:'force-cache'});if(!res.ok)throw Error('HTTP '+res.status);await c.put(url,res.clone());}ok++}catch(e){failed++}if(onProgress)onProgress(ok,failed,allUrls.length)}}
 await Promise.all(Array.from({length:4},worker));return {ok,failed,total:allUrls.length};}
window.FitnessMedia45={entry,demo,detail,prefetch,allUrls,license:LICENSE};
document.addEventListener('click',async event=>{
 const btn=event.target.closest('[data-media-download]');if(!btn||btn.disabled)return;
 const status=document.getElementById('v45-offline-status');btn.disabled=true;btn.textContent='正在缓存动作图片…';
 try{const r=await prefetch((ok,failed,total)=>{if(status)status.textContent=`已完成 ${ok+failed}/${total} 帧 · 成功 ${ok} · 失败 ${failed}`});
  if(status)status.textContent=r.failed?`完成：已缓存 ${r.ok}/${r.total} 帧；${r.failed} 帧失败。可联网重试；旧版示意仍离线可用。`:`完成：${r.ok} 帧已缓存；之后无需网络也可查看这些动作图。`;
 }catch(e){if(status)status.textContent='下载失败，浏览器可能限制了缓存；旧版素材仍可用。'}finally{btn.disabled=false;btn.textContent='下载 / 补齐高清动作图（供离线使用）'}
});
})();