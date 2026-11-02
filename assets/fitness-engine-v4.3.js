/* Fitness OS v4.3 deterministic, device-local training calculations.
 * Suggestions are planning heuristics, not diagnosis or prescribed loads. */
(function(root,factory){const api=factory();if(typeof module!=='undefined'&&module.exports)module.exports=api;if(root)root.Fitness43=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const number=x=>x===null||x===undefined||x===''||!Number.isFinite(Number(x))?null:Number(x);
 const rounded=(n,p=1)=>Math.round((n+Number.EPSILON)*10**p)/10**p;
 const dateKey=d=>{const q=new Date(d.getFullYear(),d.getMonth(),d.getDate());return `${q.getFullYear()}-${String(q.getMonth()+1).padStart(2,'0')}-${String(q.getDate()).padStart(2,'0')}`};
 const monday=d=>{const q=new Date(d+'T12:00:00');q.setDate(q.getDate()-(q.getDay()+6)%7);return dateKey(q)};
 const plusDays=(d,n)=>{const q=new Date(d+'T12:00:00');q.setDate(q.getDate()+n);return dateKey(q)};
 const activeSets=w=>(w.sets||[]).flatMap(e=>(e.rows||[]).filter(r=>r.done&&number(r.reps)!==null));
 function weekly(profile,now=dateKey(new Date())){
   const start=monday(now),prevStart=plusDays(start,-7),prevEnd=plusDays(now,-7);
   function sum(from,to){const matches=(profile.workouts||[]).filter(w=>typeof w.date==='string'&&w.date>=from&&w.date<=to&&w.mode!=='legacy');const strength=matches.filter(w=>w.key&&!['walk','rest'].includes(w.key)&&activeSets(w).length>0);const sets=strength.reduce((v,w)=>v+activeSets(w).length,0);const tonnage=strength.reduce((v,w)=>v+activeSets(w).reduce((v,r)=>v+(number(r.weight)??0)*(number(r.reps)??0),0),0);return {strength:strength.length,sets,tonnage:rounded(tonnage),days:new Set(matches.map(w=>w.date)).size}}
   const thisWeek=sum(start,now),previousWeek=sum(prevStart,prevEnd);
   return {start,prevStart,prevEnd,thisWeek,previousWeek,changePct:previousWeek.sets&&thisWeek.sets?rounded((thisWeek.sets-previousWeek.sets)/previousWeek.sets*100,0):null};
 }
 function plannedSets(sets,phase,deload){const n=Math.max(1,Math.min(8,number(sets)??2));const base=phase==='adapt'?Math.min(n,2):n;return deload?Math.max(1,Math.ceil(base*0.6)):base}
 function suggest({workouts=[],exercise,readiness=null,step=2.5,pregnancyStatus='planning',deload=false}){
  const nullResult=(kind,text,nextWeight=null)=>({kind,text,nextWeight});
  if(pregnancyStatus&&pregnancyStatus!=='planning')return nullResult('medical','可能或已怀孕：原力量计划及进阶建议暂不适用；请先由产科/医生确认合适运动方案。');
  if(readiness?.pain==='yes')return nullResult('medical','今日记录有疼痛或不适：停止相关负重练习并评估原因，必要时就医。');
  if(deload)return nullResult('deload','当前启用自选减量模式：组数已减少，重量可适当降低，RPE建议保持约5–6；不进行加重。');
  const sessions=workouts.filter(w=>w&&Array.isArray(w.sets)&&typeof w.date==='string'&&w.sets.some(e=>e.id===exercise.id&&e.rows?.some(r=>r.done))).slice().sort((a,b)=>(b.savedAt||b.date).localeCompare(a.savedAt||a.date)).slice(0,2).map(w=>{
   const item=w.sets.find(e=>e.id===exercise.id);const all=item.rows||[];const done=all.filter(r=>r.done);const good=done.every(r=>number(r.reps)!==null&&number(r.weight)!==null&&number(r.rpe)!==null&&number(r.reps)>0);
   const weights=done.map(r=>number(r.weight));return {done,good:good&&done.length===all.length&&all.length>=2,weight:weights.length?weights[0]:null,uniform:weights.every(x=>x===weights[0]),repHi:done.every(r=>number(r.reps)!==null&&number(r.reps)>=exercise.hi),repLo:done.every(r=>number(r.reps)!==null&&number(r.reps)>=exercise.lo),rpe:Math.max(...done.map(r=>number(r.rpe)??10))};
  });
  if(!sessions.length)return nullResult('start','暂无该动作有效历史：先以轻重量练习，完整记录重量、次数和RPE。');
  const last=sessions[0],base=(last.weight!==null&&last.uniform&&last.weight>0)?last.weight:null;
  if(readiness&&number(readiness.score)!==null&&readiness.score<2.5)return nullResult('reduce','今日恢复评分偏低：建议减量或改低强度活动；不要加重。',base);
  if(last.rpe>=9)return nullResult('reduce','上次至少一组RPE≥9：优先控制动作、充分恢复，必要时适度降重。',base);
  if(!last.good||!last.uniform||base===null)return nullResult('hold','上次组数或重量/RPE记录不完整，或属于自重动作：本次先保持可控强度，补全训练记录。',base);
  if(!last.repLo)return nullResult('hold','上次有工作组未达目标次数下限：先保持重量并完善动作，必要时小幅降低负重。',base);
  const second=sessions[1];
  if(second?.good&&second.uniform&&second.weight===base&&second.repHi&&second.rpe<=8&&last.repHi&&last.rpe<=8){const increment=number(step)>0?number(step):2.5;return nullResult('increase',`连续两次同重量、各组达到${exercise.hi}次且RPE≤8：下次可尝试加最小可用档位（示例 +${increment}kg），仍须保证动作质量。`,rounded(base+increment,2))}
  return nullResult('hold','先维持当前重量，待连续两次工作组全部达到上限、RPE≤8且恢复良好后再考虑增加。',base);
 }
 return Object.freeze({weekly,plannedSets,suggest,number,dateKey,monday});
});
