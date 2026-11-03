/* Fitness OS v5.0 stable, local-only analytics and backup schema checks.
 * These functions never transmit health records and do not diagnose disease.
 */
(function(root,factory){
  const api=factory();
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  if(root)root.FitnessFinal5=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const n=x=>(x===null||x===undefined||x===''||!Number.isFinite(Number(x))?null:Number(x));
const dateKey=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const minusDays=(date,count)=>{const d=new Date(date+'T12:00:00');d.setDate(d.getDate()-count);return dateKey(d)};
const isDay=s=>typeof s==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(s);
const bounded=(x,min,max)=>{const v=n(x);return v!==null&&v>=min&&v<=max};
function validate(root){
  if(!root||typeof root!=='object'||Array.isArray(root)||!root.profiles||!['him','her'].every(k=>root.profiles[k]))return {ok:false,reason:'缺少本人或爱人档案'};
  let count=0;
  for(const k of ['him','her']){
    const p=root.profiles[k];
    if(!p||typeof p!=='object'||!['workouts','health','labs','meals','recovery'].every(key=>Array.isArray(p[key])))return {ok:false,reason:k+'档案记录结构不完整'};
    for(const key of ['workouts','health','labs','meals','recovery']){
      if(p[key].length>30000)return {ok:false,reason:key+'记录异常过多'};
      if(p[key].some(row=>!row||typeof row!=='object'||Array.isArray(row)))return {ok:false,reason:key+'记录中出现无效项目'};
      count+=p[key].length;
    }
    if(p.workouts.some(w=>w.sets!==undefined&&(!Array.isArray(w.sets)||w.sets.length>80||w.sets.some(e=>!e||!Array.isArray(e.rows)||e.rows.length>16))))return {ok:false,reason:'训练组数据结构异常'};
    if(p.health.some(x=>x.weight!==undefined&&!bounded(x.weight,0,500)))return {ok:false,reason:'体重出现不合理值'};
    if(p.customExercises!==undefined&&!Array.isArray(p.customExercises))return {ok:false,reason:'自定义动作结构异常'};
    if(p.foodProducts!==undefined&&!Array.isArray(p.foodProducts))return {ok:false,reason:'自建食品结构异常'};
  }
  return {ok:true,count};
}
function stats(p){return {workouts:p.workouts.length,body:p.health.length,labs:p.labs.length,meals:p.meals.length,recovery:p.recovery.length,custom:(p.customExercises||[]).length}}
function summary(p,now=dateKey(new Date())){
  const start=minusDays(now,6),priorStart=minusDays(now,13),priorEnd=minusDays(now,7);
  const meals=(p.meals||[]).filter(m=>isDay(m.date)&&m.date>=start&&m.date<=now);
  const days=[...new Set(meals.map(m=>m.date))].length;
  const total=key=>meals.reduce((v,m)=>v+(n(m[key])??0),0);
  const body=(from,to,key)=>{
    // Same-day duplicate entries are averaged so frequent weighing cannot bias a week.
    const buckets=new Map();
    for(const item of p.health||[]){if(!isDay(item.date)||item.date<from||item.date>to||n(item[key])===null)continue;const a=buckets.get(item.date)||[];a.push(n(item[key]));buckets.set(item.date,a)}
    const vals=[...buckets.values()].map(a=>a.reduce((s,x)=>s+x,0)/a.length);
    return {days:vals.length,average:vals.length?vals.reduce((s,x)=>s+x,0)/vals.length:null};
  };
  const recentW=body(start,now,'weight'),oldW=body(priorStart,priorEnd,'weight'),recentWaist=body(start,now,'waist'),oldWaist=body(priorStart,priorEnd,'waist');
  const latest=(p.workouts||[]).filter(w=>isDay(w.date)&&w.date>=start&&w.date<=now&&w.key&&!['walk','rest'].includes(w.key));
  const previous=(p.workouts||[]).filter(w=>isDay(w.date)&&w.date>=priorStart&&w.date<=priorEnd&&w.key&&!['walk','rest'].includes(w.key));
  const effective=w=>w.reduce((sum,s)=>sum+(s.sets||[]).reduce((x,e)=>x+(e.rows||[]).filter(r=>r.done&&n(r.reps)!==null).length,0),0);
  const countByExercise=new Map();
  for(const w of latest)for(const e of w.sets||[]){const c=(e.rows||[]).filter(r=>r.done&&n(r.reps)!==null).length;if(c)countByExercise.set(e.name||e.id,(countByExercise.get(e.name||e.id)||0)+c)}
  const top=[...countByExercise].sort((a,b)=>b[1]-a[1]).slice(0,6);
  return {from:start,to:now,meals:{days,recordCount:meals.length,calories:total('kcal'),protein:total('protein'),avgKcal:days?total('kcal')/days:null,avgProtein:days?total('protein')/days:null},weight:{recent:recentW,previous:oldW,change:recentW.days>=3&&oldW.days>=3?recentW.average-oldW.average:null},waist:{recent:recentWaist,previous:oldWaist,change:recentWaist.days>=2&&oldWaist.days>=2?recentWaist.average-oldWaist.average:null},training:{sessions:latest.length,priorSessions:previous.length,sets:effective(latest),priorSets:effective(previous),top}};
}
function isCompleteRecord(s){return s&&s.done&&n(s.reps)!==null&&n(s.reps)>0&&n(s.weight)!==null}
function scoreQuality(p){const x=(p.workouts||[]).slice(-20);let completed=0,total=0;for(const w of x)for(const e of w.sets||[])for(const r of e.rows||[]){total++;if(isCompleteRecord(r))completed++}return {complete:completed,total,percentage:total?Math.round(100*completed/total):null}}
function loadRule(p){const q=scoreQuality(p);const z=p.recovery?.at(-1);return {completeness:q,warning:z?.pain==='yes'?'最近一次恢复记录提示疼痛或不适，请暂停相关动作并评估。':null}}
return Object.freeze({validate,stats,summary,loadRule,dateKey,minusDays,n});
});
