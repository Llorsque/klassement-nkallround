"use strict";
// ════════════════════════════════════════════════════════
// NK Allround 2026
// ════════════════════════════════════════════════════════
const EVENT_ID = "2026_NED_0004";
const LIVE_BASE = "https://liveresults.schaatsen.nl/events/" + EVENT_ID + "/competition";
const POLL_MS = 15_000;
const DISTANCES = {
  v: [
    { key:"d1_500",  label:"500m",  meters:500,  divisor:1  },
    { key:"d1_3000", label:"3000m", meters:3000, divisor:6  },
    { key:"d1_1500", label:"1500m", meters:1500, divisor:3  },
    { key:"d1_5000", label:"5000m", meters:5000, divisor:10 },
  ],
  m: [
    { key:"d1_500",   label:"500m",    meters:500,   divisor:1  },
    { key:"d1_5000",  label:"5000m",   meters:5000,  divisor:10 },
    { key:"d1_1500",  label:"1500m",   meters:1500,  divisor:3  },
    { key:"d1_10000", label:"10.000m", meters:10000, divisor:20 },
  ],
};
const COMP_IDS = {
  v:{ d1_500:1, d1_3000:3, d1_1500:5, d1_5000:7 },
  m:{ d1_500:2, d1_5000:4, d1_1500:6, d1_10000:8 },
};
const PARTICIPANTS = {
  v:[
    {nr:1,name:"Merel Conijn",cat:"DSA",qual:"EK Allround"},
    {nr:2,name:"Marijke Groenewoud",cat:"DSA",qual:"EK Allround"},
    {nr:3,name:"Jade Groenewoud",cat:"DN3",qual:"Gruno Bokaal"},
    {nr:4,name:"Maud Blokhorst",cat:"DA1",qual:"Kraantje Lek"},
    {nr:5,name:"Evelien Vijn",cat:"DN4",qual:"Gruno Bokaal"},
    {nr:6,name:"Naomi van der Werf",cat:"DSA",qual:"Gruno Bokaal"},
    {nr:7,name:"Nynke Tinga",cat:"DN1",qual:"Gruno Bokaal"},
    {nr:8,name:"Melissa Wijfje",cat:"DSA",qual:"WC"},
    {nr:9,name:"Sanne in 't Hof",cat:"DSA",qual:"WC"},
    {nr:10,name:"Kim Talsma",cat:"DSA",qual:"WC"},
    {nr:11,name:"Meike Veen",cat:"DN2",qual:"WC"},
    {nr:12,name:"Gioya Lancee",cat:"DSA",qual:"Kraantje Lek"},
    {nr:13,name:"Hilde Noppert",cat:"DSA",qual:"Kraantje Lek"},
    {nr:14,name:"Sanne Westra",cat:"DN4",qual:"Kraantje Lek"},
    {nr:15,name:"Rosalie van Vliet",cat:"DN1",qual:"Kraantje Lek"},
    {nr:16,name:"Evi de Ruijter",cat:"DA2",qual:"Kraantje Lek"},
    {nr:17,name:"Lieke Huizink",cat:"DA2",qual:"Kraantje Lek"},
    {nr:18,name:"Tosca Mulder",cat:"DN3",qual:"Kraantje Lek"},
    {nr:19,name:"Amy van der Meer",cat:"DSA",qual:"Kraantje Lek"},
    {nr:20,name:"Britt Breider",cat:"DA2",qual:"Kraantje Lek"},
  ],
  m:[
    {nr:1,name:"Beau Snellink",cat:"HSA",qual:"EK Allround"},
    {nr:2,name:"Loek van Vilsteren",cat:"HN3",qual:"Eindhoven Trofee"},
    {nr:3,name:"Marcel Bosker",cat:"HSA",qual:"EK Allround"},
    {nr:4,name:"Jasper Krommenhoek",cat:"HN3",qual:"EK Allround"},
    {nr:5,name:"Jur Veenje",cat:"HSA",qual:"Gruno Bokaal"},
    {nr:6,name:"Chris Brommersma",cat:"HN2",qual:"Gruno Bokaal"},
    {nr:7,name:"Michiel de Groot",cat:"HN2",qual:"Gruno Bokaal"},
    {nr:8,name:"Louis Hollaar",cat:"HSA",qual:"WC"},
    {nr:9,name:"Jasper Tinga",cat:"HN3",qual:"Eindhoven Trofee"},
    {nr:10,name:"Remco Stam",cat:"HN3",qual:"Eindhoven Trofee"},
    {nr:11,name:"Remo Slotegraaf",cat:"HSA",qual:"Eindhoven Trofee"},
    {nr:12,name:"Jelle Koeleman",cat:"HN3",qual:"Eindhoven Trofee"},
    {nr:13,name:"Yves Vergeer",cat:"HSA",qual:"Eindhoven Trofee"},
    {nr:14,name:"Niels van Reeuwijk",cat:"HN2",qual:"Eindhoven Trofee"},
    {nr:15,name:"Ties van Seumeren",cat:"HN2",qual:"Eindhoven Trofee"},
    {nr:16,name:"Jorrit Bergsma",cat:"H40",qual:"Aanwijsplek"},
    {nr:17,name:"Edsger van Felius",cat:"HA2",qual:"Eindhoven Trofee"},
    {nr:18,name:"Mathijs van Zwieten",cat:"HSA",qual:"Eindhoven Trofee"},
    {nr:19,name:"Hidde Westra",cat:"HN3",qual:"Eindhoven Trofee"},
    {nr:20,name:"Pelle Bolsius",cat:"HA2",qual:"Eindhoven Trofee"},
  ],
};

// ── UTILS ───────────────────────────────────────────────
function norm(n){return String(n??"").trim().toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu,"").replace(/[\u2018\u2019\u201A\u201B`\u00B4\u2032\u02BC\u02BB\u2060']/g,"'").replace(/[\u2010-\u2015]/g,"-").replace(/\s+/g," ").trim()}
function esc(s){return String(s??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}
function sleep(ms){return new Promise(r=>setTimeout(r,ms))}
function parseTime(raw){if(!raw||typeof raw!=="string")return null;const s=raw.trim().replace(",",".");const mc=s.match(/^(\d{1,2}):(\d{2}(?:\.\d{1,3})?)$/);if(mc)return parseFloat(mc[1])*60+parseFloat(mc[2]);const n=parseFloat(s);return Number.isFinite(n)&&n>0?n:null}
function fmtTime(sec){if(!Number.isFinite(sec)||sec<=0)return"—";const m=Math.floor(sec/60),s=sec-m*60;const str=s.toFixed(2).padStart(5,"0");return m>0?`${m}:${str.replace(".",",")}`  :str.replace(".",",")}
function fmtDelta(sec){if(!Number.isFinite(sec))return"—";const r3=Math.round(sec*1000)/1000;const sign=r3<0?"−":"+",abs=Math.abs(r3);const m=Math.floor(abs/60);const r2=Math.round((abs-m*60)*100)/100;const str=r2.toFixed(2);return m>0?`${sign}${m}:${str.padStart(5,"0").replace(".",",")}`:`${sign}${str.replace(".",",")}`}
function fmtPts(p){return Number.isFinite(p)?p.toFixed(3):"—"}
function trunc3(n){return Math.floor(n*1000)/1000}
function round3(n){return Math.round(n*1000)/1000}
function medal(r){return{1:"🥇",2:"🥈",3:"🥉"}[r]??""}
function podCls(r){return r>=1&&r<=3?` row--${["","gold","silver","bronze"][r]}`:"";}

// ── STATE ───────────────────────────────────────────────
const state={gender:"v",view:"klassement",distKey:null,h2h:{riderA:null,riderB:null,target:null,calcDist:null}};
const inactive={v:new Set(),m:new Set()};
function loadInactive(){try{const d=JSON.parse(localStorage.getItem("nk_allround_inactive")??"{}");if(d.v)inactive.v=new Set(d.v);if(d.m)inactive.m=new Set(d.m)}catch(_){}}
function saveInactive(){try{localStorage.setItem("nk_allround_inactive",JSON.stringify({v:[...inactive.v],m:[...inactive.m]}))}catch(_){}}
function isActive(name){return!inactive[state.gender].has(name)}
const dataCache={v:null,m:null};const lastFetch={v:null,m:null};
let standings=null,dataSource="waiting";
function getDists(){return DISTANCES[state.gender]}

// ── FETCH ───────────────────────────────────────────────
async function fetchPageText(compId){
  const url=`${LIVE_BASE}/${compId}/results`,cb=Date.now();
  const cands=[{n:"jina",u:`https://r.jina.ai/${url}?_=${cb}`},{n:"allorigins",u:`https://api.allorigins.win/get?url=${encodeURIComponent(url)}&cache=${cb}`}];
  for(const c of cands){try{const r=await fetch(c.u,{cache:"no-store"});if(!r.ok)continue;let t;if(c.n==="allorigins"){const d=await r.json();t=String(d?.contents??"")}else t=await r.text();if(t.length>100){console.log(`[NK] C${compId} ${c.n}: ✅`);return t}}catch(_){}}
  return null;
}
function extractTimes(text,parts){
  const nt=norm(text),results=new Map(),re=/(\d{1,2}:\d{2}[\.,]\d{2,3}|\d{1,3}[\.,]\d{2,3})/g;
  for(const p of parts){const k=norm(p.name);if(!k)continue;let s=0;while(true){const i=nt.indexOf(k,s);if(i===-1)break;const w=nt.slice(i,Math.min(nt.length,i+300));re.lastIndex=0;const m=re.exec(w);if(m){const raw=m[1].replace(",",".");if(parseTime(raw)!=null){results.set(k,raw);break}}s=i+k.length}}
  return results;
}
async function fetchGender(g){
  const ds=DISTANCES[g],cs=COMP_IDS[g],ps=PARTICIPANTS[g],all={};
  for(const d of ds){const t=await fetchPageText(cs[d.key]);all[d.key]=[];if(!t){await sleep(300);continue}const tm=extractTimes(t,ps);for(const p of ps){const v=tm.get(norm(p.name));if(v){const sec=parseTime(v);if(sec!=null)all[d.key].push({name:p.name,time:v,seconds:sec})}}console.log(`[NK] ${g} ${d.label}: ${all[d.key].length}`);await sleep(400)}
  dataCache[g]=all;lastFetch[g]=new Date();
}

// ── COMPUTE ─────────────────────────────────────────────
function computeStandings(){
  const ds=getDists(),ps=PARTICIPANTS[state.gender],ld=dataCache[state.gender]??{};
  const athletes=ps.map(p=>{
    const a={name:p.name,nr:p.nr,cat:p.cat,qual:p.qual,active:isActive(p.name),times:{},seconds:{},points:{},distRanks:{}};
    for(const d of ds){const r=(ld[d.key]??[]).find(x=>x.name===p.name);if(r){a.times[d.key]=r.time;a.seconds[d.key]=r.seconds;a.points[d.key]=trunc3(r.seconds/d.divisor)}}
    return a;
  });
  // Dist ranks
  for(const d of ds){const s=athletes.filter(a=>Number.isFinite(a.seconds[d.key])).sort((x,y)=>x.seconds[d.key]-y.seconds[d.key]);s.forEach((a,i)=>a.distRanks[d.key]=i+1)}
  // Points
  for(const a of athletes){let sum=0,cnt=0;for(const d of ds){const p=a.points[d.key];if(Number.isFinite(p)){sum+=p;cnt++}}a.completedCount=cnt;const clean=Math.round(sum*1e6)/1e6;a.totalPoints=cnt===ds.length?clean:null;a.partialPoints=cnt>0?clean:null;a.currentPoints=a.totalPoints??a.partialPoints}
  // Rank: MOST DISTANCES FIRST → then LOWEST POINTS
  const ranked=athletes.filter(a=>a.active&&a.completedCount>0).sort((a,b)=>{
    if(b.completedCount!==a.completedCount)return b.completedCount-a.completedCount;
    const ap=a.currentPoints,bp=b.currentPoints;
    if(ap==null&&bp==null)return 0;if(ap==null)return 1;if(bp==null)return -1;
    return ap-bp;
  });
  ranked.forEach((a,i)=>a.rank=i+1);
  const leader=ranked[0],lPts=leader?.currentPoints??null;
  for(const a of ranked)a.delta=Number.isFinite(lPts)&&Number.isFinite(a.currentPoints)?a.currentPoints-lPts:null;
  for(const a of athletes)if(!a.active)a.rank=null;
  standings={all:athletes,ranked,leader};
  dataSource=athletes.some(a=>a.completedCount>0)?"live":"waiting";
}
/** Calculate time needed on distKey to reach targetPoints */
function neededTime(athlete,distKey,targetPts){
  if(!Number.isFinite(targetPts))return null;
  const ds=getDists(),dist=ds.find(d=>d.key===distKey);if(!dist)return null;
  let other=0,oc=0;
  for(const d of ds){if(d.key===distKey)continue;const p=athlete.points[d.key];if(Number.isFinite(p)){other+=p;oc++}}
  if(oc<ds.length-1)return null;
  const need=targetPts-other;
  if(need<=0)return 0.01;
  return need*dist.divisor;
}

// ── DOM ─────────────────────────────────────────────────
const el={};
function cacheEls(){for(const id of["statusBadge","statusText","genderTabs","navButtons","debugBtn","contentArea","overlay","menuBtn","sidebar","mobileMenu","mobileNav"])el[id]=document.getElementById(id)}
function setStatus(){if(!el.statusBadge)return;el.statusBadge.className=`badge badge--${dataSource}`;el.statusText.textContent=dataSource==="live"?"Live":"Laden..."}

// ── RENDER ──────────────────────────────────────────────
function render(){
  computeStandings();setStatus();
  const ds=getDists();
  const views=[{key:"klassement",icon:"📊",label:"Klassement"},...ds.map(d=>({key:`dist_${d.key}`,icon:"⏱",label:d.label})),{key:"h2h",icon:"⚔️",label:"Head to Head"},{key:"deelnemers",icon:"👥",label:"Deelnemers"},{key:"kwalificatie",icon:"⭐",label:"Kwalificatie"}];
  const navHtml=views.map(v=>`<button class="nav-btn ${state.view===v.key?'active':''}" data-view="${v.key}"><span class="nav-btn__icon">${v.icon}</span>${esc(v.label)}</button>`).join("");
  el.navButtons.innerHTML=navHtml;
  el.mobileNav.innerHTML=navHtml;
  el.genderTabs.querySelectorAll(".tab").forEach(b=>b.classList.toggle("active",b.dataset.gender===state.gender));
  if(state.view==="klassement")return renderKlassement();
  if(state.view.startsWith("dist_")){state.distKey=state.view.replace("dist_","");return renderDistance()}
  if(state.view==="h2h")return renderH2H();
  if(state.view==="deelnemers")return renderDeelnemers();
  if(state.view==="kwalificatie")return renderKwalificatie();
  renderKlassement();
}

// ── KLASSEMENT ──────────────────────────────────────────
function renderKlassement(){
  const ds=getDists();if(!standings)return;
  const ndKey=state.distKey??ds[ds.length-1]?.key;
  const nd=ds.find(d=>d.key===ndKey)??ds[ds.length-1];
  const active=standings.all.filter(a=>a.active).sort((a,b)=>{if(a.rank!=null&&b.rank!=null)return a.rank-b.rank;if(a.rank!=null)return-1;if(b.rank!=null)return 1;return 0});
  const hdr=ds.map(d=>`<th>${esc(d.label)}</th>`).join("");
  const rows=active.map(a=>{
    const cells=ds.map(d=>{const t=a.seconds[d.key],dr=a.distRanks[d.key];const m=dr?`<span class="dist-medal">${medal(dr)}</span>`:"";return Number.isFinite(t)?`<td class="mono">${fmtTime(t)}${m}</td>`:`<td class="mono" style="color:var(--text-muted)">—</td>`}).join("");
    const pts=a.currentPoints,dim=a.totalPoints==null&&a.completedCount>0?' style="opacity:.5"':"";
    let dStr="";if(a.delta===0)dStr='<span class="delta delta--leader">Leader</span>';else if(Number.isFinite(a.delta)&&nd)dStr=`<span class="delta">${fmtDelta(a.delta*nd.divisor)}</span>`;
    return`<tr class="${podCls(a.rank)}"><td>${a.rank?`<strong>${a.rank}</strong>`:"—"}</td><td><span class="athlete" data-name="${esc(a.name)}">${esc(a.name)}</span></td>${cells}<td class="mono"${dim}><strong>${fmtPts(pts)}</strong></td><td>${dStr}</td></tr>`;
  }).join("");
  const opts=ds.map(d=>`<option value="${d.key}" ${d.key===ndKey?"selected":""}>${esc(d.label)}</option>`).join("");
  const cc=ds.filter(d=>standings.all.some(a=>a.times[d.key])).length;
  el.contentArea.innerHTML=`
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;flex-wrap:wrap;gap:8px">
      <div><h2 style="font-size:18px;font-weight:800;margin-bottom:2px">Algemeen Klassement</h2><span style="font-size:12px;color:var(--text-dim)">Na ${cc}/${ds.length} afstanden${lastFetch[state.gender]?` · ${lastFetch[state.gender].toLocaleTimeString("nl-NL")}`:""}</span></div>
      <div style="display:flex;align-items:center;gap:8px"><span style="font-size:11px;color:var(--text-dim)">Δ op:</span><select id="ndSel" class="h2h-sel" style="font-size:12px">${opts}</select></div>
    </div>
    <div class="table-wrap"><table class="table"><thead><tr><th>#</th><th>Naam</th>${hdr}<th>Punten</th><th>Δ</th></tr></thead><tbody>${rows}</tbody></table></div>
    <div class="info-box"><strong>Sortering:</strong> meeste afstanden gereden → laagste punten. Punten = tijd(s) ÷ afstandsfactor, afgekapt op 3 decimalen.</div>`;
  document.getElementById("ndSel")?.addEventListener("change",e=>{state.distKey=e.target.value;render()});
}

// ── AFSTAND + SIDEBAR ───────────────────────────────────
function renderDistance(){
  const ds=getDists(),dist=ds.find(d=>d.key===state.distKey)??ds[0];if(!dist||!standings)return;
  let nextDist=null;for(const d of ds){if(!standings.all.some(a=>a.active&&Number.isFinite(a.seconds[d.key]))){nextDist=d;break}}
  if(!nextDist)nextDist=dist;
  const lPts=standings.leader?.currentPoints;
  const withT=standings.all.filter(a=>a.active&&Number.isFinite(a.seconds[dist.key])).sort((a,b)=>a.seconds[dist.key]-b.seconds[dist.key]);
  const noT=standings.all.filter(a=>a.active&&!Number.isFinite(a.seconds[dist.key]));
  const fastest=withT[0]?.seconds[dist.key]??null;

  const mainR=withT.map((a,i)=>{const rk=i+1;const d=Number.isFinite(fastest)?a.seconds[dist.key]-fastest:null;const ds2=d===0?'<span class="delta delta--leader">Snelst</span>':Number.isFinite(d)?`<span class="delta">${fmtDelta(d)}</span>`:"";return`<tr class="${podCls(rk)}"><td><strong>${rk}</strong> ${medal(rk)}</td><td><span class="athlete" data-name="${esc(a.name)}">${esc(a.name)}</span></td><td class="mono">${fmtTime(a.seconds[dist.key])}</td><td class="mono">${fmtPts(a.points[dist.key])}</td><td>${ds2}</td></tr>`}).join("");
  const pendR=noT.map(a=>{const n=neededTime(a,dist.key,lPts);const ns=Number.isFinite(n)&&n>0?`<span style="color:var(--orange)">${fmtTime(n)}</span>`:"";return`<tr style="opacity:.5"><td>—</td><td>${esc(a.name)}</td><td class="mono">—</td><td class="mono">—</td><td>${ns}</td></tr>`}).join("");
  const sep=withT.length&&noT.length?`<tr><td colspan="5" style="padding:6px 12px;font-size:11px;font-weight:700;color:var(--text-muted);border-bottom:1px solid var(--border)">Nog te rijden</td></tr>`:"";

  // Sidebar
  const ranked=standings.ranked;
  const sideR=ranked.map((a,i)=>{
    const rk=i+1;let ds2="";if(rk===1)ds2='<span class="delta delta--leader" style="font-size:9px">L</span>';else if(Number.isFinite(a.delta)&&nextDist)ds2=`<span class="delta" style="font-size:10px">${fmtDelta(a.delta*nextDist.divisor)}</span>`;
    const n=neededTime(a,nextDist.key,lPts);const ns=(rk>1&&Number.isFinite(n)&&n>0)?`<span style="color:var(--orange)">${fmtTime(n)}</span>`:"";
    return`<tr><td style="width:22px;font-weight:700;font-size:12px;color:var(--text-dim)">${rk}</td><td style="white-space:nowrap"><span class="athlete" data-name="${esc(a.name)}">${esc(a.name)}</span></td><td class="mono" style="white-space:nowrap">${fmtPts(a.currentPoints)}</td><td style="white-space:nowrap">${ds2}</td><td class="mono" style="white-space:nowrap">${ns}</td></tr>`;
  }).join("");
  const cc=ds.filter(d=>standings.all.some(a=>a.times[d.key])).length;

  el.contentArea.innerHTML=`
    <h2 style="font-size:18px;font-weight:800;margin-bottom:12px">${esc(dist.label)}</h2>
    <div class="dist-layout">
      <div class="table-wrap"><table class="table"><thead><tr><th>#</th><th>Naam</th><th>Tijd</th><th>Punten</th><th>Verschil</th></tr></thead><tbody>${mainR}${sep}${pendR}</tbody></table></div>
      <div class="dist-sidebar">
        <div style="font-size:13px;font-weight:700;color:var(--accent);margin-bottom:4px">Live Klassement <span style="color:var(--text-dim);font-weight:400">(${cc}/${ds.length})</span></div>
        ${nextDist?`<div style="font-size:11px;color:var(--text-dim);margin-bottom:8px">Nodig op ${esc(nextDist.label)} voor P1</div>`:""}
        <div class="table-wrap"><table class="table"><thead><tr><th>#</th><th>Naam</th><th>Pnt</th><th>Δ</th><th>Nodig</th></tr></thead><tbody>${sideR}</tbody></table></div>
      </div>
    </div>`;
}

// ── HEAD TO HEAD ────────────────────────────────────────
function renderH2H(){
  if(!standings||!standings.ranked.length){el.contentArea.innerHTML=`<h2 style="font-size:18px;font-weight:800;margin-bottom:12px">Head to Head</h2><div class="info-box">Nog geen resultaten.</div>`;return}
  const ds=getDists(),all=standings.all.filter(a=>a.active);
  const opts=all.map(a=>`<option value="${esc(a.name)}">${esc(a.name)}</option>`).join("");
  // Unridden distances for calc selector
  const unridden=ds.filter(d=>all.some(a=>!Number.isFinite(a.seconds[d.key])));
  const calcDists=unridden.length?unridden:ds;
  const distOpts=calcDists.map(d=>`<option value="${d.key}">${esc(d.label)}</option>`).join("");

  if(!state.h2h.riderA||!all.find(a=>a.name===state.h2h.riderA))state.h2h.riderA=standings.ranked[0]?.name;
  if(!state.h2h.riderB||!all.find(a=>a.name===state.h2h.riderB))state.h2h.riderB=standings.ranked[1]?.name??standings.ranked[0]?.name;
  if(!state.h2h.target||!all.find(a=>a.name===state.h2h.target))state.h2h.target=standings.leader?.name;
  if(!state.h2h.calcDist||!calcDists.find(d=>d.key===state.h2h.calcDist))state.h2h.calcDist=calcDists[0]?.key;

  el.contentArea.innerHTML=`
    <h2 style="font-size:18px;font-weight:800;margin-bottom:12px">Head to Head</h2>
    <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-bottom:14px">
      <select id="h2hA" class="h2h-sel">${opts}</select>
      <span style="font-weight:800;color:var(--text-muted)">VS</span>
      <select id="h2hB" class="h2h-sel">${opts}</select>
    </div>
    <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-bottom:16px">
      <span style="font-size:12px;color:var(--text-dim)">Target:</span>
      <select id="h2hT" class="h2h-sel">${opts}</select>
      <span style="font-size:12px;color:var(--text-dim);margin-left:10px">Bereken op:</span>
      <select id="h2hD" class="h2h-sel">${distOpts}</select>
    </div>
    <div id="h2hContent"></div>`;

  const sA=document.getElementById("h2hA"),sB=document.getElementById("h2hB"),sT=document.getElementById("h2hT"),sD=document.getElementById("h2hD");
  sA.value=state.h2h.riderA;sB.value=state.h2h.riderB;sT.value=state.h2h.target;sD.value=state.h2h.calcDist;
  const up=()=>{state.h2h.riderA=sA.value;state.h2h.riderB=sB.value;state.h2h.target=sT.value;state.h2h.calcDist=sD.value;renderH2HContent()};
  sA.onchange=sB.onchange=sT.onchange=sD.onchange=up;
  renderH2HContent();
}

function renderH2HContent(){
  const ds=getDists(),cont=document.getElementById("h2hContent");if(!cont)return;
  const rA=standings.all.find(a=>a.name===state.h2h.riderA);
  const rB=standings.all.find(a=>a.name===state.h2h.riderB);
  const tgt=standings.all.find(a=>a.name===state.h2h.target);
  const leader=standings.leader;
  if(!rA||!rB){cont.innerHTML="";return}
  const calcDist=ds.find(d=>d.key===state.h2h.calcDist)??ds[0];
  const nameA=rA.name.split(" ").pop(),nameB=rB.name.split(" ").pop();

  // Comparison table
  const rows=ds.map(d=>{
    const sA2=rA.seconds[d.key],sB2=rB.seconds[d.key];
    const tA=Number.isFinite(sA2)?fmtTime(sA2):"—",tB=Number.isFinite(sB2)?fmtTime(sB2):"—";
    let diff="";
    if(Number.isFinite(sA2)&&Number.isFinite(sB2)){const dd=sA2-sB2;if(Math.abs(dd)<0.005)diff='<span style="color:var(--text-dim)">gelijk</span>';else diff=dd<0?`<span style="color:var(--green)">${fmtDelta(dd)}</span>`:`<span style="color:var(--red)">${fmtDelta(dd)}</span>`}
    return`<tr><td class="mono" style="text-align:right">${tA}</td><td style="text-align:center;font-weight:600;color:var(--text-dim)">${esc(d.label)}</td><td class="mono">${tB}</td><td style="text-align:center">${diff}</td></tr>`;
  }).join("");

  const pA=rA.currentPoints,pB=rB.currentPoints;
  let ptsDiff="";
  if(Number.isFinite(pA)&&Number.isFinite(pB)){const dd=pA-pB;ptsDiff=Math.abs(dd)<0.001?"gelijk":dd<0?`<span style="color:var(--green)">${nameA} ${fmtPts(Math.abs(dd))}</span>`:`<span style="color:var(--red)">${nameB} ${fmtPts(dd)}</span>`}

  // Tile calculations
  const lPts=leader?.currentPoints;
  const tPts=tgt?.currentPoints;
  const nAL=neededTime(rA,calcDist.key,lPts);
  const nBL=neededTime(rB,calcDist.key,lPts);
  const nAT=neededTime(rA,calcDist.key,tPts);
  const nBT=neededTime(rB,calcDist.key,tPts);

  function mkTile(rider,label,targetName,needed,targetPts2,cls){
    const rPts=rider.currentPoints;
    const diff2=Number.isFinite(rPts)&&Number.isFinite(targetPts2)?rPts-targetPts2:null;
    const diffStr=Number.isFinite(diff2)?`${diff2>0?"+":""}${diff2.toFixed(3)} pnt`:"—";
    const timeStr=Number.isFinite(needed)&&needed>0?fmtTime(needed):(Number.isFinite(needed)?"Al voor":"—");
    const timeColor=Number.isFinite(needed)&&needed>0?cls:"var(--green)";
    return`<div class="tile">
      <div class="tile__label">${esc(label)}</div>
      <div class="tile__name">${esc(rider.name)} <span style="color:var(--text-dim)">#${rider.rank??"—"}</span></div>
      <div class="tile__time" style="color:${timeColor}">${timeStr}</div>
      <div class="tile__sub">op ${esc(calcDist.label)} · achterstand ${esc(targetName)}: <strong>${diffStr}</strong></div>
    </div>`;
  }

  cont.innerHTML=`
    <div class="table-wrap" style="margin-bottom:18px"><table class="table">
      <thead><tr><th style="text-align:right">${esc(rA.name)} #${rA.rank??"—"}</th><th style="text-align:center">Afstand</th><th>${esc(rB.name)} #${rB.rank??"—"}</th><th style="text-align:center">${esc(nameA)} vs ${esc(nameB)}</th></tr></thead>
      <tbody>${rows}
        <tr style="border-top:2px solid var(--border);font-weight:700"><td class="mono" style="text-align:right">${fmtPts(pA)}</td><td style="text-align:center;color:var(--text-dim)">Punten</td><td class="mono">${fmtPts(pB)}</td><td style="text-align:center">${ptsDiff}</td></tr>
      </tbody>
    </table></div>

    <div style="font-size:13px;font-weight:700;margin-bottom:10px">Benodigde tijden op <span style="color:var(--accent)">${esc(calcDist.label)}</span></div>
    <div class="tiles-grid">
      ${mkTile(rA,"🏆 Nodig voor P1",leader?.name??"Leider",nAL,lPts,"var(--orange)")}
      ${mkTile(rB,"🏆 Nodig voor P1",leader?.name??"Leider",nBL,lPts,"var(--orange)")}
      ${mkTile(rA,`🎯 Nodig om ${esc(tgt?.name?.split(" ").pop()??"Target")} te verslaan`,tgt?.name??"Target",nAT,tPts,"var(--accent)")}
      ${mkTile(rB,`🎯 Nodig om ${esc(tgt?.name?.split(" ").pop()??"Target")} te verslaan`,tgt?.name??"Target",nBT,tPts,"var(--accent)")}
    </div>`;
}

// ── DEELNEMERS ──────────────────────────────────────────
function renderDeelnemers(){
  const ps=PARTICIPANTS[state.gender];
  const rows=ps.map(p=>{const act=isActive(p.name);return`<tr${!act?' style="opacity:.45"':""}><td>${p.nr}</td><td><span class="athlete" data-name="${esc(p.name)}">${esc(p.name)}</span></td><td>${esc(p.cat)}</td><td>${esc(p.qual)}</td><td><button class="btn ${act?"btn--ghost":"btn--danger"}" data-toggle="${esc(p.name)}" style="font-size:11px;padding:3px 10px">${act?"Actief":"Inactief"}</button></td></tr>`}).join("");
  const ac=ps.filter(p=>isActive(p.name)).length;
  el.contentArea.innerHTML=`
    <h2 style="font-size:18px;font-weight:800;margin-bottom:4px">Deelnemers — ${state.gender==="v"?"Vrouwen":"Mannen"}</h2>
    <p style="font-size:12px;color:var(--text-dim);margin-bottom:12px">${ac}/${ps.length} actief</p>
    <div class="table-wrap"><table class="table"><thead><tr><th>Nr</th><th>Naam</th><th>Cat</th><th>Kwalificatie</th><th>Status</th></tr></thead><tbody>${rows}</tbody></table></div>
    <div class="info-box">Klik <strong>Actief/Inactief</strong> om rijders uit het klassement te halen.</div>`;
  el.contentArea.addEventListener("click",e=>{const b=e.target.closest("[data-toggle]");if(!b)return;const n=b.dataset.toggle;inactive[state.gender].has(n)?inactive[state.gender].delete(n):inactive[state.gender].add(n);saveInactive();render()});
}

// ── KWALIFICATIE ────────────────────────────────────────
function renderKwalificatie(){
  const QC={v:{qualDist:"d1_3000",finalDist:"d1_5000",first3:["d1_500","d1_3000","d1_1500"],first2:["d1_500","d1_3000"]},m:{qualDist:"d1_5000",finalDist:"d1_10000",first3:["d1_500","d1_5000","d1_1500"],first2:["d1_500","d1_5000"]}};
  let html=`<h2 style="font-size:18px;font-weight:800;margin-bottom:16px">Kwalificatie Slotafstand</h2>`;
  for(const gen of["v","m"]){
    const q=QC[gen],ds=DISTANCES[gen],ps=PARTICIPANTS[gen],ld=dataCache[gen]??{};
    const gL=gen==="v"?"♀ Vrouwen":"♂ Mannen";const fd=ds.find(d=>d.key===q.finalDist);
    const aths=ps.filter(p=>!inactive[gen].has(p.name)).map(p=>{const a={name:p.name,points:{},seconds:{}};for(const d of ds){const r=(ld[d.key]??[]).find(x=>x.name===p.name);if(r){a.seconds[d.key]=r.seconds;a.points[d.key]=trunc3(r.seconds/d.divisor)}}return a});
    const comp=q.first3.filter(dk=>aths.some(a=>Number.isFinite(a.seconds[dk])));
    const use3=comp.length>=3,useD=use3?q.first3:q.first2;
    const kR=aths.map(a=>{let s=0,c=0;for(const dk of useD){const p=a.points[dk];if(Number.isFinite(p)){s+=p;c++}}return{...a,kSum:c===useD.length?Math.round(s*1e6)/1e6:null}}).filter(a=>a.kSum!=null).sort((a,b)=>a.kSum-b.kSum);
    const dR=aths.filter(a=>Number.isFinite(a.seconds[q.qualDist])).sort((a,b)=>a.seconds[q.qualDist]-b.seconds[q.qualDist]);
    const kT=new Set(kR.slice(0,8).map(a=>a.name)),dT=new Set(dR.slice(0,8).map(a=>a.name));
    const qual=[];for(const n of[...kT].filter(n=>dT.has(n)))qual.push({name:n,via:"Klass + Afstand"});const kO=[...kT].filter(n=>!dT.has(n)),dO=[...dT].filter(n=>!kT.has(n));for(const n of dO.slice(0,kO.length))qual.push({name:n,via:"Via afstand"});
    if(!qual.length&&!kR.length){html+=`<div style="margin-bottom:20px"><div style="font-size:14px;font-weight:700;color:var(--accent)">${gL}</div><div class="info-box">Nog geen resultaten.</div></div>`;continue}
    const qRows=qual.map((q2,i)=>{const a=kR.find(x=>x.name===q2.name);return`<tr><td><strong>${i+1}</strong></td><td>${esc(q2.name)}</td><td class="mono">${a?.kSum!=null?a.kSum.toFixed(3):"—"}</td><td><span style="font-size:11px;padding:2px 8px;border-radius:4px;background:rgba(52,211,153,.12);color:var(--green)">${q2.via}</span></td></tr>`}).join("");
    html+=`<div style="margin-bottom:24px"><div style="font-size:14px;font-weight:700;color:var(--accent);margin-bottom:4px">${gL} — ${fd?.label??""}</div><div style="font-size:11px;color:var(--text-dim);margin-bottom:8px">${use3?"Definitief (3 afstanden)":`Voorlopig (${comp.length})`}</div><div class="table-wrap"><table class="table"><thead><tr><th>#</th><th>Naam</th><th>Punten</th><th>Via</th></tr></thead><tbody>${qRows}</tbody></table></div></div>`;
  }
  el.contentArea.innerHTML=html;
}

// ── POPUP ───────────────────────────────────────────────
function openPopup(name){
  if(!standings)return;const a=standings.all.find(x=>x.name===name);if(!a)return;const ds=getDists();
  const rowed=ds.filter(d=>a.times[d.key]);
  let h=`<div class="panel"><div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:14px"><div><div style="font-size:18px;font-weight:800">${esc(name)}</div><div style="font-size:12px;color:var(--text-dim)">${esc(a.cat)} · ${esc(a.qual)}</div></div><button id="closePopup" style="background:none;border:none;color:var(--text-dim);font-size:20px;cursor:pointer">✕</button></div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:14px">
      <div style="background:var(--surface-2);padding:10px;border-radius:var(--radius);text-align:center"><div style="font-size:10px;color:var(--text-muted)">Klassement</div><div style="font-size:20px;font-weight:800">#${a.rank??"—"}</div></div>
      <div style="background:var(--surface-2);padding:10px;border-radius:var(--radius);text-align:center"><div style="font-size:10px;color:var(--text-muted)">Punten</div><div style="font-size:20px;font-weight:800">${fmtPts(a.currentPoints)}</div></div>
      <div style="background:var(--surface-2);padding:10px;border-radius:var(--radius);text-align:center"><div style="font-size:10px;color:var(--text-muted)">Afstanden</div><div style="font-size:20px;font-weight:800">${a.completedCount}/${ds.length}</div></div>
    </div>`;
  if(rowed.length)h+=`<div class="table-wrap"><table class="table"><thead><tr><th>Afstand</th><th>Tijd</th><th>Pos</th><th>Punten</th></tr></thead><tbody>${rowed.map(d=>{const dr=a.distRanks[d.key];return`<tr class="${podCls(dr)}"><td>${esc(d.label)}</td><td class="mono">${fmtTime(a.seconds[d.key])}</td><td>${dr?`${dr} ${medal(dr)}`:"—"}</td><td class="mono">${fmtPts(a.points[d.key])}</td></tr>`}).join("")}</tbody></table></div>`;
  h+=`</div>`;el.overlay.innerHTML=h;el.overlay.hidden=false;
  document.getElementById("closePopup")?.addEventListener("click",()=>{el.overlay.hidden=true});
}

// ── EVENTS ──────────────────────────────────────────────
function bindEvents(){
  el.genderTabs?.addEventListener("click",async e=>{const b=e.target.closest(".tab");if(!b?.dataset.gender)return;state.gender=b.dataset.gender;render();if(!dataCache[state.gender]){await fetchGender(state.gender);render()}});

  function navClick(e){const b=e.target.closest(".nav-btn");if(!b?.dataset.view)return;state.view=b.dataset.view;el.mobileMenu.hidden=true;render()}
  el.navButtons?.addEventListener("click",navClick);
  el.mobileNav?.addEventListener("click",navClick);

  el.menuBtn?.addEventListener("click",()=>{el.mobileMenu.hidden=!el.mobileMenu.hidden});
  document.addEventListener("click",e=>{if(!el.mobileMenu?.hidden&&!e.target.closest(".mobile-menu")&&!e.target.closest("#menuBtn"))el.mobileMenu.hidden=true});
  document.addEventListener("click",e=>{const a=e.target.closest(".athlete");if(a?.dataset.name)openPopup(a.dataset.name)});
  el.overlay?.addEventListener("click",e=>{if(e.target===el.overlay)el.overlay.hidden=true});
  document.addEventListener("keydown",e=>{if(e.key==="Escape"){el.overlay.hidden=true;el.mobileMenu.hidden=true}});
  el.debugBtn?.addEventListener("click",()=>{const ds=getDists(),ld=dataCache[state.gender]??{};alert(`${state.gender}: ${ds.map(x=>`${x.label}: ${(ld[x.key]??[]).length}`).join(", ")}\nCache: v=${dataCache.v?"✅":"—"} m=${dataCache.m?"✅":"—"}`)});
}

// ── POLL ────────────────────────────────────────────────
let pollT=null;
function startPoll(){if(pollT)clearInterval(pollT);pollT=setInterval(async()=>{try{await fetchGender(state.gender);render()}catch(e){console.warn("[NK] poll:",e)}},POLL_MS)}

// ── BOOT ────────────────────────────────────────────────
async function boot(){
  try{cacheEls();loadInactive();bindEvents();render();await fetchGender(state.gender);render();console.log("[NK] Live ✅");startPoll()}
  catch(e){console.error("[NK] Boot:",e);if(el.contentArea)el.contentArea.innerHTML=`<div style="color:var(--red);padding:20px"><pre>${e.message}\n${e.stack}</pre></div>`}
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot);else boot();
