// Fitness OS V4.4: original vector muscle maps; approximate regions, educational only.
(function(){
'use strict';
const INFO={
 bp:['chest','triceps'],inc:['chest','shoulders'],fly:['chest'],ohp:['shoulders','triceps'],pushdown:['triceps'],
 lat:['lats','biceps'],row:['back','biceps'],face:['rearDelts','back'],curl:['biceps'],rdl:['glutes','hamstrings'],
 squat:['quads','glutes'],lunge:['quads','glutes'],hip:['glutes','hamstrings'],
 lib_cable_abduct:['glutes'],lib_pallof:['core'],
 lateral:['shoulders'],row1:['back'],straight:['lats'],calf:['calves'],plank:['core'],
 wsquat:['quads'],wrow:['back'],wpress:['chest'],wbridge:['glutes'],wdead:['core'],
 whinge:['hamstrings'],wlat:['lats'],wstep:['quads'],wside:['shoulders'],wbird:['core'],
 wcsquat:['quads'],wcable:['back'],wchest:['chest'],wglute:['glutes']};
const aliases={lib_low_fly:'fly',lib_cable_press:'bp',lib_overhead_triceps:'pushdown',lib_reverse_fly:'face',lib_seated_pulley:'lat',lib_cable_pullover:'lat',lib_reverse_curl:'curl',lib_calf_seated:'calf',lib_step_up:'lunge',lib_pull_through:'rdl',lib_glute_kickback:'hip',lib_wall_pushup:'bp',lib_floor_bridge:'hip',lib_bird_dog:'plank',lib_cable_row_light:'row',lib_front_raise:'ohp'};
const MOTIONS=['bp','inc','fly','ohp','pushdown','lat','row','face','curl','rdl','squat','lunge','hip','lib_cable_abduct','lib_pallof'];
function resolve(id){let t=String(id||'').replace(/^custom_/,'').replace(/^quick_/,'');for(const base of [...Object.keys(INFO),...Object.keys(aliases)])if(t===base||t.startsWith(base+'_'))return aliases[base]||base;return t;}
function regions(ex){const id=resolve(ex.id);if(INFO[id])return INFO[id];let s=String(ex.muscle||'');const a=[];
for(const [key,re] of Object.entries({chest:/胸/,lats:/背阔/,back:/背|菱形/,rearDelts:/后束/,shoulders:/肩|三角/,triceps:/三头/,biceps:/二头/,quads:/股四|大腿前/,hamstrings:/腘绳|腿后/,glutes:/臀/,calves:/小腿/,core:/腹|核心/}))if(re.test(s))a.push(key);return a.length?a:['core'];}
const shape={
 chest:['M52 59 Q64 52 76 64 L76 83 Q63 91 50 77 Z','M82 64 Q94 52 107 59 L109 77 Q95 91 82 83 Z'],
 shoulders:['M49 50 Q34 55 33 73 L49 80 L54 65 Z','M110 50 Q125 55 127 73 L110 80 L104 65 Z'],
 triceps:['M33 72 L43 77 L39 104 L31 100 Z','M127 72 L117 77 L121 104 L129 100 Z'],
 biceps:['M37 79 Q42 78 46 86 L41 107 L32 102 Z','M123 79 Q118 78 114 86 L119 107 L128 102 Z'],
 core:['M59 88 L101 88 L99 123 L61 123 Z'],
 quads:['M57 137 L79 139 L77 173 L66 190 L54 180 Z','M81 139 L103 137 L106 180 L94 190 L83 173 Z'],
 hamstrings:['M56 141 L77 140 L74 185 L59 186 Z','M84 140 L105 141 L102 186 L87 185 Z'],
 glutes:['M55 122 Q66 116 79 128 L77 147 L57 145 Z','M82 128 Q95 116 106 122 L104 145 L84 147 Z'],
 calves:['M58 187 L76 187 L71 212 L64 212 Z','M84 187 L102 187 L96 212 L89 212 Z'],
 lats:['M51 76 L60 84 L60 119 L49 110 Z','M109 76 L100 84 L100 119 L111 110 Z'],
 back:['M60 57 L78 65 L76 105 L56 85 Z','M100 57 L82 65 L84 105 L104 85 Z'],
 rearDelts:['M49 53 L35 67 L51 77 L60 65 Z','M111 53 L125 67 L109 77 L100 65 Z']
};
const behind=new Set(['lats','back','rearDelts','hamstrings','glutes']);
function figure(regs,back=false){const active=regs.filter(x=>behind.has(x)===back||x==='glutes');
const torso='<circle cx="80" cy="19" r="14" fill="#e5ecf6" stroke="#b7c7dc" stroke-width="2"/><path d="M64 33 L50 52 L53 121 L57 136 L103 136 L107 121 L110 52 L96 33 Z" fill="#e6edf7" stroke="#b7c7dc" stroke-width="2"/><path d="M50 54 L34 70 L28 110 L34 120 L44 111 L51 78 M110 54 L126 70 L132 110 L126 120 L116 111 L109 78" fill="none" stroke="#c2d0e2" stroke-width="12" stroke-linecap="round"/><path d="M58 135 L54 185 L60 211 L71 211 L80 150 L89 211 L100 211 L106 185 L102 135" fill="#e5ecf6" stroke="#b7c7dc" stroke-width="2"/>';
const shapes=active.flatMap((n,j)=>(shape[n]||[]).map(d=>`<path d="${d}" fill="${j===0?'#2265ca':'#67b1ed'}" fill-opacity=".86" stroke="#fff" stroke-width="1.2"/>`)).join('');
return `<svg viewBox="0 0 160 222" class="muscle-figure" role="img" aria-label="${back?'背面':'正面'}目标肌群简图"><rect width="160" height="222" rx="15" fill="#f4f8fd"/>${torso}${shapes}<text x="80" y="220" text-anchor="middle" fill="#7286a2" font-size="10">${back?'背面':'正面'}</text></svg>`;}
function mapFor(ex,compact=false){const a=regions(ex);const front=a.some(n=>!behind.has(n));const rear=a.some(n=>behind.has(n));return `<div class="muscle-map ${compact?'compact':''}">${front||!rear?figure(a,false):''}${rear?figure(a,true):''}</div>`}
window.FitnessVisual44={mapFor,motionFor(ex){const id=resolve(ex.id);return MOTIONS.includes(id)?`assets/motions/${id}.svg`:null},hasMotion(ex){return !!this.motionFor(ex)},regions};
})();