"use strict";
// ════════════════════════════════════════════════════════
// NK Allround 2026 — Klassement
// ════════════════════════════════════════════════════════

// ── CONFIG ──────────────────────────────────────────────
const TOURNAMENT = "NK Allround";
const EVENT_ID = "2026_NED_0004";

const DISTANCES = {
  v: [
    { key: "d1_500",  meters: 500,  label: "500m",  divisor: 1  },
    { key: "d1_3000", meters: 3000, label: "3000m", divisor: 6  },
    { key: "d1_1500", meters: 1500, label: "1500m", divisor: 3  },
    { key: "d1_5000", meters: 5000, label: "5000m", divisor: 10 },
  ],
  m: [
    { key: "d1_500",   meters: 500,   label: "500m",    divisor: 1  },
    { key: "d1_5000",  meters: 5000,  label: "5000m",   divisor: 10 },
    { key: "d1_1500",  meters: 1500,  label: "1500m",   divisor: 3  },
    { key: "d1_10000", meters: 10000, label: "10.000m", divisor: 20 },
  ],
};

// Comp ID per distance per gender (from live-api.schaatsen.nl)
const COMP_IDS = {
  v: { d1_500: 1, d1_3000: 3, d1_1500: 5, d1_5000: 7 },
  m: { d1_500: 2, d1_5000: 4, d1_1500: 6, d1_10000: 8 },
};

const QUAL_CONFIG = {
  v: { qualDist: "d1_3000", finalDist: "d1_5000", first3: ["d1_500","d1_3000","d1_1500"], first2: ["d1_500","d1_3000"] },
  m: { qualDist: "d1_5000", finalDist: "d1_10000", first3: ["d1_500","d1_5000","d1_1500"], first2: ["d1_500","d1_5000"] },
};

// ── PARTICIPANTS ────────────────────────────────────────
const PARTICIPANTS = {
  v: [
    { nr:1,  name:"Merel Conijn",           cat:"DSA", qual:"EK Allround" },
    { nr:2,  name:"Marijke Groenewoud",      cat:"DSA", qual:"EK Allround" },
    { nr:3,  name:"Jade Groenewoud",         cat:"DN3", qual:"Gruno Bokaal" },
    { nr:4,  name:"Maud Blokhorst",         cat:"DA1", qual:"Kraantje Lek" },
    { nr:5,  name:"Evelien Vijn",           cat:"DN4", qual:"Gruno Bokaal" },
    { nr:6,  name:"Naomi van der Werf",     cat:"DSA", qual:"Gruno Bokaal" },
    { nr:7,  name:"Nynke Tinga",            cat:"DN1", qual:"Gruno Bokaal" },
    { nr:8,  name:"Melissa Wijfje",         cat:"DSA", qual:"WC" },
    { nr:9,  name:"Sanne in 't Hof",        cat:"DSA", qual:"WC" },
    { nr:10, name:"Kim Talsma",             cat:"DSA", qual:"WC" },
    { nr:11, name:"Meike Veen",             cat:"DN2", qual:"WC" },
    { nr:12, name:"Gioya Lancee",           cat:"DSA", qual:"Kraantje Lek" },
    { nr:13, name:"Hilde Noppert",           cat:"DSA", qual:"Kraantje Lek" },
    { nr:14, name:"Sanne Westra",           cat:"DN4", qual:"Kraantje Lek" },
    { nr:15, name:"Rosalie van Vliet",      cat:"DN1", qual:"Kraantje Lek" },
    { nr:16, name:"Evi de Ruijter",         cat:"DA2", qual:"Kraantje Lek" },
    { nr:17, name:"Lieke Huizink",          cat:"DA2", qual:"Kraantje Lek" },
    { nr:18, name:"Tosca Mulder",           cat:"DN3", qual:"Kraantje Lek" },
    { nr:19, name:"Amy van der Meer",         cat:"DSA", qual:"Kraantje Lek" },
    { nr:20, name:"Britt Breider",          cat:"DA2", qual:"Kraantje Lek" },
  ],
  m: [
    { nr:1,  name:"Beau Snellink",          cat:"HSA", qual:"EK Allround" },
    { nr:2,  name:"Loek van Vilsteren",    cat:"HN3", qual:"Eindhoven Trofee" },
    { nr:3,  name:"Marcel Bosker",          cat:"HSA", qual:"EK Allround" },
    { nr:4,  name:"Jasper Krommenhoek",     cat:"HN3", qual:"EK Allround" },
    { nr:5,  name:"Jur Veenje",             cat:"HSA", qual:"Gruno Bokaal" },
    { nr:6,  name:"Chris Brommersma",       cat:"HN2", qual:"Gruno Bokaal" },
    { nr:7,  name:"Michiel de Groot",        cat:"HN2", qual:"Gruno Bokaal" },
    { nr:8,  name:"Louis Hollaar",          cat:"HSA", qual:"WC" },
    { nr:9,  name:"Jasper Tinga",           cat:"HN3", qual:"Eindhoven Trofee" },
    { nr:10, name:"Remco Stam",             cat:"HN3", qual:"Eindhoven Trofee" },
    { nr:11, name:"Remo Slotegraaf",        cat:"HSA", qual:"Eindhoven Trofee" },
    { nr:12, name:"Jelle Koeleman",         cat:"HN3", qual:"Eindhoven Trofee" },
    { nr:13, name:"Yves Vergeer",           cat:"HSA", qual:"Eindhoven Trofee" },
    { nr:14, name:"Niels van Reeuwijk",     cat:"HN2", qual:"Eindhoven Trofee" },
    { nr:15, name:"Ties van Seumeren",      cat:"HN2", qual:"Eindhoven Trofee" },
    { nr:16, name:"Jorrit Bergsma",         cat:"H40", qual:"Aanwijsplek" },
    { nr:17, name:"Edsger van Felius",      cat:"HA2", qual:"Eindhoven Trofee" },
    { nr:18, name:"Mathijs van Zwieten",    cat:"HSA", qual:"Eindhoven Trofee" },
    { nr:19, name:"Hidde Westra",           cat:"HN3", qual:"Eindhoven Trofee" },
    { nr:20, name:"Pelle Bolsius",          cat:"HA2", qual:"Eindhoven Trofee" },
  ],
};

// ── STARTLISTS (Sportity PDFs 27-02-2026) ───────────────
const STARTLISTS = {
  v_d1_500: [
    "Sanne in 't Hof","Lieke Huizink","Maud Blokhorst","Tosca Mulder",
    "Evelien Vijn","Naomi van der Werf","Britt Breider","Evi de Ruijter",
    "Kim Talsma","Sanne Westra","Hilde Noppert","Merel Conijn",
    "Rosalie van Vliet","Nynke Tinga","Jade Groenewoud","Amy van der Meer",
    "Melissa Wijfje","Gioya Lancee","Meike Veen","Marijke Groenewoud",
  ],
  v_d1_3000: [
    "Britt Breider","Amy van der Meer","Tosca Mulder","Maud Blokhorst",
    "Nynke Tinga","Evi de Ruijter","Sanne Westra","Kim Talsma",
    "Hilde Noppert","Lieke Huizink","Evelien Vijn","Rosalie van Vliet",
    "Naomi van der Werf","Sanne in 't Hof","Gioya Lancee","Meike Veen",
    "Jade Groenewoud","Melissa Wijfje","Merel Conijn","Marijke Groenewoud",
  ],
  m_d1_500: [
    "Edsger van Felius","Pelle Bolsius","Hidde Westra","Mathijs van Zwieten",
    "Jelle Koeleman","Niels van Reeuwijk","Remco Stam","Remo Slotegraaf",
    "Jasper Tinga","Yves Vergeer","Chris Brommersma","Loek van Vilsteren",
    "Ties van Seumeren","Michiel de Groot","Louis Hollaar","Jur Veenje",
    "Jasper Krommenhoek","Jorrit Bergsma","Marcel Bosker","Beau Snellink",
  ],
  m_d1_5000: [
    "Pelle Bolsius","Edsger van Felius","Mathijs van Zwieten","Hidde Westra",
    "Niels van Reeuwijk","Jelle Koeleman","Remo Slotegraaf","Remco Stam",
    "Yves Vergeer","Jasper Tinga","Loek van Vilsteren","Chris Brommersma",
    "Michiel de Groot","Ties van Seumeren","Jur Veenje","Louis Hollaar",
    "Jorrit Bergsma","Jasper Krommenhoek","Beau Snellink","Marcel Bosker",
  ],
};

// ── UTILITIES ───────────────────────────────────────────
const API = "https://live-api.schaatsen.nl";

function norm(n) {
  return String(n??"").trim().toLowerCase()
    .replace(/[\u2018\u2019\u201A\u201B`\u00B4\u2032\u02BC\u02BB\u2060']/g,"'")
    .replace(/[\u2010-\u2015]/g,"-").replace(/\s+/g," ")
    .normalize("NFD").replace(/[\u0300-\u036f]/g,"").trim();
}
function lev(a,b){const m=a.length,n=b.length,d=Array.from({length:m+1},(_,i)=>{const r=new Array(n+1);r[0]=i;return r});for(let j=1;j<=n;j++)d[0][j]=j;for(let i=1;i<=m;i++)for(let j=1;j<=n;j++)d[i][j]=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+(a[i-1]!==b[j-1]?1:0));return d[m][n]}
function parseTime(s){if(!s||typeof s!=="string")return null;const t=s.trim().replace(",",".");const mc=t.match(/^(\d{1,2}):(\d{2}(?:\.\d+)?)$/);if(mc)return parseFloat(mc[1])*60+parseFloat(mc[2]);const n=parseFloat(t);return Number.isFinite(n)&&n>0?n:null}
function fmtTime(sec){if(!Number.isFinite(sec)||sec<0)return"—";const m=Math.floor(sec/60),s=sec-m*60,str=s.toFixed(2).padStart(5,"0");return m>0?`${m}:${str.replace(".",",")}`  :str}
function fmtDelta(sec){if(!Number.isFinite(sec))return"—";const sign=sec<0?"-":"+",abs=Math.abs(sec),m=Math.floor(abs/60),s=abs-m*60,str=s.toFixed(2).padStart(5,"0");return m>0?`${sign}${m}:${str.replace(".",",")}`:`${sign}${str}`}
function fmtRaw(t){if(!t||t==="—")return"—";const sec=parseTime(t);if(!Number.isFinite(sec))return t;const dc=t.includes(".")?Math.min(t.split(".").pop().length,3):2;const m=Math.floor(sec/60),s=sec-m*60,str=s.toFixed(Math.max(2,dc)).padStart(Math.max(2,dc)+3,"0");return m>0?`${m}:${str.replace(".",",")}`  :str}
function fmtPts(p){return Number.isFinite(p)?p.toFixed(3):"—"}
function trunc(n,d){const f=10**d;return Math.floor(n*f)/f}
function esc(s){return String(s??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}
function getStartlist(gen,dk){return STARTLISTS[`${gen}_${dk}`]??null}
function getPairNr(sl,name){if(!sl)return null;const n=norm(name);const i=sl.findIndex(s=>norm(s)===n);return i>=0?Math.floor(i/2)+1:null}
function sleep(ms){return new Promise(r=>setTimeout(r,ms))}

// ── STATE ───────────────────────────────────────────────
const state = { gender:"v", view:"klassement", distKey:null, nextDistKey:null, standings:null,
  h2h:{riderA:null,riderB:null} };
let dataSource = "waiting";

function saveHash(){const p=[state.gender,state.view];if(state.view==="distance"&&state.distKey)p.push(state.distKey);history.replaceState(null,"",`#${p.join("-")}`)}
function loadHash(){const h=location.hash.replace("#","");if(!h)return;const p=h.split("-");if(p[0]==="v"||p[0]==="m")state.gender=p[0];const vs=["klassement","distance","headToHead","kwalificatie"];if(p[1]&&vs.includes(p[1]))state.view=p[1];if(p[2]&&state.view==="distance")state.distKey=p.slice(2).join("-")}
function getDists(){return DISTANCES[state.gender]}

// ── FETCH ───────────────────────────────────────────────
const CACHE={};
const CACHE_TTL=10_000; // 10s cache

async function fetchComp(compId){
  const k=`${EVENT_ID}_${compId}`;
  const c=CACHE[k];if(c&&Date.now()-c.ts<CACHE_TTL)return c.data;
  const url=`${API}/events/${EVENT_ID}/competitions/${compId}/results/?inSeconds=1`;
  function tFetch(u,ms){const ctrl=new AbortController();const t=setTimeout(()=>ctrl.abort(),ms);return fetch(u,{signal:ctrl.signal,headers:{Accept:"application/json"}}).finally(()=>clearTimeout(t))}
  // Direct
  try{const r=await tFetch(url,4000);if(r.ok){const d=await r.json();CACHE[k]={data:d,ts:Date.now()};return d}}catch(_){}
  // Proxies
  for(const p of[
    `https://corsproxy.io/?${encodeURIComponent(url)}`,
    `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
    `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
  ]){try{const r=await tFetch(p,7000);if(!r.ok)continue;const txt=await r.text();if(!txt||txt.length<10)continue;const d=JSON.parse(txt);CACHE[k]={data:d,ts:Date.now()};return d}catch(_){}}
  return null;
}

async function fetchAll(){
  const compIds = COMP_IDS[state.gender];
  const ids = Object.values(compIds);
  // Also fetch other gender's comps for kwalificatie view
  const otherIds = Object.values(COMP_IDS[state.gender==="v"?"m":"v"]);
  const allIds = [...new Set([...ids,...otherIds])];
  const missing = allIds.filter(c=>!CACHE[`${EVENT_ID}_${c}`]||Date.now()-CACHE[`${EVENT_ID}_${c}`].ts>=CACHE_TTL);
  if(missing.length===0)return;
  console.log(`[NK] Fetching [${missing.join(",")}]`);
  for(const c of missing){await fetchComp(c);await sleep(250)}
  // Retry failures
  const failed=missing.filter(c=>!CACHE[`${EVENT_ID}_${c}`]?.data);
  if(failed.length>0){console.log(`[NK] Retry [${failed.join(",")}]`);await sleep(600);for(const c of failed){await fetchComp(c);await sleep(300)}}
  const ok=allIds.filter(c=>CACHE[`${EVENT_ID}_${c}`]?.data).length;
  console.log(`[NK] Cache: ${ok}/${allIds.length}`);
}

function parseApi(data){
  if(!data)return[];
  let res=data.results??data.Results??data.competitors??data.Competitors??data.data?.results??null;
  if(!Array.isArray(res)){if(Array.isArray(data))res=data;else return[]}
  return res.map((r,i)=>{
    const sk=r.competitor?.skater??r.skater??null;
    let name=sk?.firstName&&sk?.lastName?`${sk.firstName} ${sk.lastName}`:(sk?.name??r.name??r.Name??`Skater ${i+1}`);
    const time=r.time??r.Time??r.result??null;
    let status="OK";const st=r.status??0;
    if(typeof st==="number"){if(st===1)status="DNS";else if(st===2)status="DNF";else if(st===3)status="DQ";else if(st!==0&&!time)status="DNS"}
    if(!time&&status==="OK")status="DNS";
    let pb=false;const pbf=r.pb??r.PB??r.personalBest??r.isPB??null;
    if(pbf===true||pbf===1)pb=true;if(!pb&&r.medal&&/PB|PR/i.test(String(r.medal)))pb=true;
    return{name:String(name),time:time?String(time):null,status,pb};
  });
}

// ── MANUAL TIMES ────────────────────────────────────────
let MANUAL={};
function loadManual(){try{const r=localStorage.getItem("nk_allround_manual");if(r)MANUAL=JSON.parse(r)}catch(_){}}
function saveManual(){try{localStorage.setItem("nk_allround_manual",JSON.stringify(MANUAL))}catch(_){}}
function setManual(dk,name,time){const k=`${state.gender}_${dk}`;if(!MANUAL[k])MANUAL[k]={};if(time&&time.trim()&&time.trim()!=="—")MANUAL[k][norm(name)]=time.trim();else delete MANUAL[k][norm(name)];saveManual()}
function getManual(dk,name){return MANUAL[`${state.gender}_${dk}`]?.[norm(name)]??null}

// ── DATA ────────────────────────────────────────────────
function loadData(){
  try{
  const dists=getDists();
  const parts=PARTICIPANTS[state.gender]??[];
  const compIds=COMP_IDS[state.gender]??{};
  const athletes=parts.map(p=>({name:p.name,nr:p.nr,times:{},seconds:{},points:{},status:{},pb:{}}));
  let liveN=0,manN=0;

  for(const d of dists){
    const compId=compIds[d.key];if(!compId)continue;
    const cached=CACHE[`${EVENT_ID}_${compId}`];
    const parsed=cached?.data?parseApi(cached.data):[];
    const apiMap=new Map();for(const r of parsed)apiMap.set(norm(r.name),r);

    // Capture startlist
    if(parsed.length>0&&!STARTLISTS[`${state.gender}_${d.key}`])
      STARTLISTS[`${state.gender}_${d.key}`]=parsed.map(r=>r.name);

    for(const a of athletes){
      const n=norm(a.name);
      let match=apiMap.get(n);
      // Fuzzy
      if(!match){let bk=null,bd=999;for(const[k]of apiMap){const dd=lev(n,k);if(dd<bd&&dd<=2){bd=dd;bk=k}}
        if(!bk){const ln=n.split(" ").pop();if(ln.length>=3)for(const[k]of apiMap)if(k.split(" ").pop()===ln){bk=k;break}}
        if(bk)match=apiMap.get(bk)}
      if(match?.time&&match.status==="OK"){
        a.times[d.key]=match.time;a.seconds[d.key]=parseTime(match.time);
        a.status[d.key]="OK";a.pb[d.key]=match.pb;liveN++;apiMap.delete(norm(match.name))}
    }
    // Manual overlay
    for(const a of athletes){const mt=getManual(d.key,a.name);if(mt){a.times[d.key]=mt;a.seconds[d.key]=parseTime(mt);a.status[d.key]="OK";manN++}}
    if(parsed.length>0)console.log(`[NK] C${compId}→${d.key}: ${parsed.length} api, ${athletes.filter(a=>a.times[d.key]).length} matched`);
  }

  dataSource=manN>0?"manual":liveN>0?"live":"waiting";
  state.standings=computeStandings(athletes,dists);
  console.log(`[NK] ${state.gender}: ${liveN} live, ${manN} manual, ${athletes.length} athletes`);
  }catch(e){console.error("[NK] loadData:",e);state.standings={all:[],full:[],partial:[]}}
}

function computeStandings(athletes,dists){
  const comp=athletes.map(a=>{
    let tot=0,cnt=0;const pts={};
    for(const d of dists){const sec=a.seconds[d.key];if(Number.isFinite(sec)){const p=trunc(sec/d.divisor,3);pts[d.key]=p;tot+=p;cnt++}}
    return{...a,points:pts,totalPoints:cnt===dists.length?trunc(tot,3):null,completedCount:cnt};
  });
  // Sort: most dists first, then lowest points
  comp.sort((a,b)=>{
    if(a.completedCount!==b.completedCount)return b.completedCount-a.completedCount;
    const ap=a.totalPoints??partial(a,dists),bp=b.totalPoints??partial(b,dists);
    if(ap===null&&bp===null)return 0;if(ap===null)return 1;if(bp===null)return -1;return ap-bp;
  });
  let rank=1;for(const a of comp)a.rank=a.completedCount>0?rank++:null;
  const leader=comp[0]?.totalPoints??partial(comp[0],dists);
  for(const a of comp){const p=a.totalPoints??partial(a,dists);a.pointsDelta=Number.isFinite(leader)&&Number.isFinite(p)&&a.completedCount>0?trunc(p-leader,3):null}
  // Dist ranks
  for(const d of dists){const s=comp.filter(a=>Number.isFinite(a.seconds?.[d.key])).sort((a,b)=>a.seconds[d.key]-b.seconds[d.key]);s.forEach((a,i)=>{if(!a.distRanks)a.distRanks={};a.distRanks[d.key]=i+1})}
  for(const a of comp)if(!a.distRanks)a.distRanks={};
  return{all:comp,full:comp.filter(x=>x.totalPoints!==null),partial:comp.filter(x=>x.totalPoints===null)};
}
function partial(a,dists){if(!a)return null;let s=0,c=0;for(const d of dists){const p=a.points?.[d.key];if(Number.isFinite(p)){s+=p;c++}}return c>0?trunc(s,3):null}

// ── DOM ─────────────────────────────────────────────────
const el={};
function cacheEls(){for(const id of["genderTabs","viewButtons","viewTitle","viewMeta","contentArea","h2hForm","h2hRiderA","h2hRiderB","exportBtn","entryBtn","entryModal","entryModalContent","athletePopup","popupContent","debugPanel","debugContent","debugBtn","statusBadge","toast"])el[id]=document.getElementById(id)}

// ── RENDER HELPERS ──────────────────────────────────────
function rankH(r){if(!r)return'<span class="rank">—</span>';const m={1:"🥇",2:"🥈",3:"🥉"};return m[r]?`<span class="rank rank--${r}">${m[r]}</span>`:`<span class="rank">${r}</span>`}
function distRankH(p){if(!p)return"";const m={1:"🥇",2:"🥈",3:"🥉"};return m[p]?`<span class="dist-rank dist-rank--${p}">${m[p]}</span>`:`<span class="dist-rank">#${p}</span>`}
function podCls(r){return r===1?"row--gold":r===2?"row--silver":r===3?"row--bronze":""}
function pbB(isPb){return isPb?'<span class="pb-badge">PB</span>':""}
function toast(msg){el.toast.textContent=msg;el.toast.hidden=false;setTimeout(()=>el.toast.hidden=true,2500)}
function updateStatus(){const b=el.statusBadge;if(!b)return;const t=b.querySelector(".status-badge__text");if(!t)return;b.className=`status-badge status-badge--${dataSource}`;t.textContent=dataSource==="live"?"Live":dataSource==="manual"?"Handmatig":"Wachten"}
function setActive(c,attr,val){if(!c)return;for(const b of c.querySelectorAll(".tab"))b.classList.toggle("active",b.dataset[attr]===val)}

// ── VIEW: KLASSEMENT ────────────────────────────────────
function renderKlassement(){
  const dists=getDists(),st=state.standings;if(!st)return;
  el.viewTitle.textContent="Klassement";
  if(!state.nextDistKey||!dists.find(d=>d.key===state.nextDistKey))state.nextDistKey=dists[dists.length-1]?.key;
  const nd=dists.find(d=>d.key===state.nextDistKey);
  const opts=dists.map(d=>`<option value="${d.key}" ${d.key===state.nextDistKey?"selected":""}>${esc(d.label)}</option>`).join("");
  const hdr=dists.map(d=>`<th>${esc(d.label)}</th>`).join("");
  const rows=st.all.map(a=>{
    const cells=dists.map(d=>{const t=a.times?.[d.key],p=a.distRanks?.[d.key];return t?`<td class="mono">${fmtRaw(t)}${distRankH(p)}</td>`:`<td class="mono">—</td>`}).join("");
    let dH="";if(a.pointsDelta===0)dH='<span class="delta delta--leader">Leader</span>';
    else if(Number.isFinite(a.pointsDelta)&&nd)dH=`<span class="delta">${fmtDelta(a.pointsDelta*nd.divisor)}</span>`;
    const pts=a.totalPoints??partial(a,dists),pS=Number.isFinite(pts)?pts.toFixed(3):"—";
    const dim=a.totalPoints===null&&a.completedCount>0?' style="opacity:.5"':"";
    return`<tr class="${podCls(a.rank)}"><td>${rankH(a.rank)}</td><td><span class="athlete-name" data-name="${esc(a.name)}">${esc(a.name)}</span></td>${cells}<td class="mono mono--bold"${dim}>${pS}</td><td>${dH}</td></tr>`;
  }).join("");
  el.contentArea.innerHTML=`<div class="inline-controls"><span class="inline-controls__label">Δ op:</span><div class="select-wrap"><select id="ndSel">${opts}</select></div></div>
    <div class="table-wrap"><table class="table"><thead><tr><th>#</th><th>Naam</th>${hdr}<th>Punten</th><th>Δ</th></tr></thead><tbody>${rows}</tbody></table></div>
    <div class="info-box"><strong>Leeswijzer:</strong> Rangschikking: meeste afstanden eerst, dan laagste punten. Punten = tijd ÷ (meters ÷ 500).${dataSource==="live"?"<br>📡 Live data — elke 15s bijgewerkt.":""}</div>`;
  document.getElementById("ndSel")?.addEventListener("change",e=>{state.nextDistKey=e.target.value;render()});
}

// ── VIEW: DISTANCE ──────────────────────────────────────
function renderDistance(){
  const dists=getDists(),dist=dists.find(d=>d.key===state.distKey)??dists[0];
  if(!dist)return;state.distKey=dist.key;el.viewTitle.textContent=dist.label;
  const st=state.standings;if(!st)return;
  const sl=getStartlist(state.gender,dist.key);
  const wT=[],woT=[];
  for(const a of st.all){const t=a.times?.[dist.key],sec=a.seconds?.[dist.key];
    if(t&&a.status?.[dist.key]==="OK"&&Number.isFinite(sec))wT.push({name:a.name,time:t,sec,pb:a.pb?.[dist.key]});
    else woT.push({name:a.name})}
  wT.sort((a,b)=>a.sec-b.sec);const fast=wT[0]?.sec??null;
  wT.forEach((r,i)=>{r.rank=i+1;r.delta=Number.isFinite(fast)?r.sec-fast:null});
  if(sl){const om=new Map();sl.forEach((n,i)=>om.set(norm(n),i));woT.sort((a,b)=>(om.get(norm(a.name))??999)-(om.get(norm(b.name))??999))}
  let rows="";
  for(const r of wT){const dS=r.delta===0?'<span class="delta delta--leader">Snelst</span>':Number.isFinite(r.delta)?`<span class="delta">${fmtDelta(r.delta)}</span>`:"";
    rows+=`<tr class="${podCls(r.rank)}"><td>${rankH(r.rank)}</td><td><span class="athlete-name" data-name="${esc(r.name)}">${esc(r.name)}</span></td><td class="mono">${fmtRaw(r.time)}${pbB(r.pb)}</td><td>${dS}</td></tr>`}
  if(wT.length>0&&woT.length>0)rows+=`<tr class="table-sep"><td colspan="4"><span class="table-sep__label">Nog te rijden</span></td></tr>`;
  for(const r of woT){const pn=getPairNr(sl,r.name);rows+=`<tr class="row--pending"><td>${pn?`<span class="pair-nr">Rit ${pn}</span>`:"—"}</td><td><span class="athlete-name" data-name="${esc(r.name)}">${esc(r.name)}</span></td><td class="mono">—</td><td></td></tr>`}
  const sidebar=buildSidebar(dists,st);
  el.contentArea.innerHTML=`<div class="dist-split"><div class="dist-split__main"><div class="table-wrap"><table class="table"><thead><tr><th>${wT.length>0?"#":"Rit"}</th><th>Naam</th><th>Tijd</th><th>Verschil</th></tr></thead><tbody>${rows}</tbody></table></div></div><div class="dist-split__sidebar">${sidebar}</div></div>`;
}

function buildSidebar(dists,st){
  let nd=null;for(const d of dists)if(!st.all.some(a=>a.times?.[d.key]&&a.status?.[d.key]==="OK")){nd=d;break}
  if(!nd)nd=dists[dists.length-1];
  const ranked=st.all.filter(a=>a.completedCount>0).sort((a,b)=>{
    if(a.totalPoints!==null&&b.totalPoints!==null)return a.totalPoints-b.totalPoints;
    if(a.totalPoints!==null)return-1;if(b.totalPoints!==null)return 1;return(partial(a,dists)??999)-(partial(b,dists)??999)});
  if(!ranked.length)return`<div class="klass-sidebar"><div class="klass-sidebar__header"><span class="klass-sidebar__title">Live Klassement</span></div><div style="padding:12px;color:var(--text-dim);font-size:12px">Nog geen resultaten</div></div>`;
  const lp=partial(ranked[0],dists);const cc=dists.filter(d=>st.all.some(a=>a.times?.[d.key])).length;
  const rows=ranked.map((a,i)=>{const rk=i+1,pts=partial(a,dists);let dS="";if(rk===1)dS='<span class="delta delta--leader">Leader</span>';else if(Number.isFinite(pts)&&Number.isFinite(lp)&&nd)dS=`<span class="delta">${fmtDelta((pts-lp)*nd.divisor)}</span>`;
    return`<tr><td style="width:28px;font-weight:700;color:var(--text-dim)">${rk}</td><td><span class="athlete-name" data-name="${esc(a.name)}" style="font-size:12px">${esc(a.name)}</span></td><td class="mono" style="font-size:11px">${Number.isFinite(pts)?pts.toFixed(3):"—"}</td><td style="font-size:11px">${dS}</td></tr>`}).join("");
  return`<div class="klass-sidebar"><div class="klass-sidebar__header"><span class="klass-sidebar__title">Live Klassement</span><span class="klass-sidebar__status">Na ${cc}/${dists.length}</span></div><div class="klass-sidebar__sub">Δ op ${esc(nd.label)}</div><div class="table-wrap" style="border:none"><table class="table table--compact"><thead><tr><th>#</th><th>Naam</th><th>Pnt</th><th>Δ</th></tr></thead><tbody>${rows}</tbody></table></div></div>`;
}

// ── VIEW: HEAD-TO-HEAD ──────────────────────────────────
function renderH2H(){
  el.viewTitle.textContent="Head to Head";const dists=getDists(),st=state.standings;if(!st)return;
  const opts=st.all.map(a=>`<option value="${esc(a.name)}">${esc(a.name)}</option>`).join("");
  el.h2hRiderA.innerHTML=opts;el.h2hRiderB.innerHTML=opts;
  if(!state.h2h.riderA&&st.all.length>=2){state.h2h.riderA=st.all[0]?.name;state.h2h.riderB=st.all[1]?.name}
  if(state.h2h.riderA)el.h2hRiderA.value=state.h2h.riderA;if(state.h2h.riderB)el.h2hRiderB.value=state.h2h.riderB;
  el.h2hForm.hidden=false;
  const rA=st.all.find(x=>x.name===(state.h2h.riderA??el.h2hRiderA.value)),rB=st.all.find(x=>x.name===(state.h2h.riderB??el.h2hRiderB.value));
  if(!rA||!rB){el.contentArea.innerHTML='<div class="info-box">Selecteer twee rijders.</div>';return}
  const mirrorRows=dists.map(d=>{const sA=rA.seconds?.[d.key],sB=rB.seconds?.[d.key],tA=rA.times?.[d.key]??"—",tB=rB.times?.[d.key]??"—";
    let cA="",cB="";if(Number.isFinite(sA)&&Number.isFinite(sB)){if(sA<sB){cA="mirror-cell--win";cB="mirror-cell--lose"}else if(sB<sA){cB="mirror-cell--win";cA="mirror-cell--lose"}}
    let diff="";if(Number.isFinite(sA)&&Number.isFinite(sB)){const dd=sA-sB;if(dd<0)diff=`<span class="mirror-center__diff mirror-center__diff--neg">◀ ${Math.abs(dd).toFixed(2)}s</span>`;else if(dd>0)diff=`<span class="mirror-center__diff mirror-center__diff--pos">${dd.toFixed(2)}s ▶</span>`}
    return`<div class="mirror-row"><div class="mirror-cell ${cA}">${fmtRaw(tA)}</div><div class="mirror-center"><span class="mirror-center__dist">${esc(d.label)}</span>${diff}</div><div class="mirror-cell mirror-cell--right ${cB}">${fmtRaw(tB)}</div></div>`}).join("");
  const tA=partial(rA,dists),tB=partial(rB,dists);let tcA="",tcB="";
  if(Number.isFinite(tA)&&Number.isFinite(tB)){if(tA<tB){tcA="mirror-cell--win";tcB="mirror-cell--lose"}else if(tB<tA){tcB="mirror-cell--win";tcA="mirror-cell--lose"}}
  el.contentArea.innerHTML=`<div class="mirror"><div class="mirror-header"><div class="mirror-header__rider">${esc(rA.name)}<div class="mirror-header__rank">#${rA.rank??"—"} · ${fmtPts(rA.totalPoints)} pnt</div></div><div class="mirror-header__vs">VS</div><div class="mirror-header__rider mirror-header__rider--right">${esc(rB.name)}<div class="mirror-header__rank">#${rB.rank??"—"} · ${fmtPts(rB.totalPoints)} pnt</div></div></div>${mirrorRows}<div class="mirror-row mirror-row--total"><div class="mirror-cell mirror-cell--total ${tcA}">${fmtPts(tA)} pnt</div><div class="mirror-center"><span class="mirror-center__dist">Totaal</span></div><div class="mirror-cell mirror-cell--right mirror-cell--total ${tcB}">${fmtPts(tB)} pnt</div></div></div>`;
}

// ── VIEW: KWALIFICATIE ──────────────────────────────────
function renderKwalificatie(){
  el.viewTitle.textContent="Kwalificatie Slotafstand";
  let html="";
  for(const gen of["v","m"]){
    const q=QUAL_CONFIG[gen],dists=DISTANCES[gen],parts=PARTICIPANTS[gen]??[],compIds=COMP_IDS[gen]??{};
    const aths=parts.map(p=>({name:p.name,times:{},seconds:{},points:{},status:{}}));
    for(const d of dists){const cid=compIds[d.key];if(!cid)continue;const cached=CACHE[`${EVENT_ID}_${cid}`];const parsed=cached?.data?parseApi(cached.data):[];
      const am=new Map();for(const r of parsed)am.set(norm(r.name),r);
      for(const a of aths){const m=am.get(norm(a.name));if(m?.time&&m.status==="OK"){a.times[d.key]=m.time;a.seconds[d.key]=parseTime(m.time);a.status[d.key]="OK"}
        const mt=MANUAL[`${gen}_${d.key}`]?.[norm(a.name)];if(mt){a.times[d.key]=mt;a.seconds[d.key]=parseTime(mt);a.status[d.key]="OK"}}}
    for(const a of aths){let tot=0,cnt=0;a.points={};for(const d of dists){const sec=a.seconds[d.key];if(Number.isFinite(sec)){const p=trunc(sec/d.divisor,3);a.points[d.key]=p;tot+=p;cnt++}}a.completedCount=cnt}
    const cdists=q.first3.filter(dk=>aths.some(a=>Number.isFinite(a.seconds?.[dk])));const use3=cdists.length>=3;
    const kd=use3?q.first3:q.first2;const mode=use3?"Definitief":"Voorlopig";
    const wK=aths.map(a=>{let s=0,c=0;for(const dk of kd){const p=a.points?.[dk];if(Number.isFinite(p)){s+=p;c++}}return{...a,kSum:c===kd.length?trunc(s,3):null}}).filter(a=>a.kSum!==null).sort((a,b)=>a.kSum-b.kSum);
    const wD=aths.filter(a=>Number.isFinite(a.seconds?.[q.qualDist])).sort((a,b)=>a.seconds[q.qualDist]-b.seconds[q.qualDist]);
    const kt8=new Set(wK.slice(0,8).map(a=>a.name)),dt8=new Set(wD.slice(0,8).map(a=>a.name));
    const qual=[],nq=[];const both=[...kt8].filter(n=>dt8.has(n));const ko=[...kt8].filter(n=>!dt8.has(n));const don=[...dt8].filter(n=>!kt8.has(n));
    for(const n of both)qual.push({name:n,st:"both"});for(const n of don.slice(0,ko.length))qual.push({name:n,st:"dist_swap"});for(const n of don.slice(ko.length))nq.push({name:n,st:"out"});for(const n of ko)nq.push({name:n,st:"klass_only"});
    for(const a of aths)if(!qual.find(q2=>q2.name===a.name)&&!nq.find(q2=>q2.name===a.name))nq.push({name:a.name,st:"out"});
    const sB=s=>({both:["Klass+Afstand","qual-badge--both"],dist_swap:["Via afstand","qual-badge--dist"],klass_only:["Alleen klass","qual-badge--klass"],out:["Niet gekwal.","qual-badge--out"]}[s]??["",""]);
    const gL=gen==="v"?"♀ Vrouwen":"♂ Mannen",fd=dists.find(d=>d.key===q.finalDist);
    html+=`<div class="qual-section"><div class="section-label">${gL} — ${fd?.label??""}</div><div style="font-size:11px;color:var(--text-dim);margin-bottom:8px">${mode}</div>
      <div class="table-wrap"><table class="table"><thead><tr><th>#</th><th>Naam</th><th>Punten</th><th>Status</th></tr></thead>
      <tbody>${qual.map((q2,i)=>{const a=wK.find(x=>x.name===q2.name);const[lb,cl]=sB(q2.st);return`<tr><td>${i+1}</td><td><span class="athlete-name" data-name="${esc(q2.name)}">${esc(q2.name)}</span></td><td class="mono">${a?.kSum!=null?a.kSum.toFixed(3):"—"}</td><td><span class="qual-badge ${cl}">${lb}</span></td></tr>`}).join("")}</tbody></table></div></div>`;
  }
  el.contentArea.innerHTML=html;
}

// ── ATHLETE POPUP ───────────────────────────────────────
function openPopup(name){
  const dists=getDists(),a=state.standings?.all?.find(x=>x.name===name);if(!a)return;
  const p=PARTICIPANTS[state.gender]?.find(x=>x.name===name);
  const skated=dists.filter(d=>a.times?.[d.key]),notS=dists.filter(d=>!a.times?.[d.key]);
  const pts=a.totalPoints??partial(a,dists),pbN=dists.filter(d=>a.pb?.[d.key]).length;
  let html=`<div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:14px"><div><div style="font-size:18px;font-weight:800">${esc(name)}</div>${p?`<div style="font-size:12px;color:var(--text-dim);margin-top:2px"><span class="source-tag">${esc(p.cat)}</span> <span style="color:var(--text-muted)">${esc(p.qual)}</span></div>`:""}</div><button onclick="el.athletePopup.hidden=true" style="background:none;border:none;color:var(--text-dim);font-size:20px;cursor:pointer">✕</button></div>`;
  html+=`<div class="kpi-row"><div class="kpi-card"><div class="kpi-card__label">Klassement</div><div class="kpi-card__value">#${a.rank??"—"}</div></div><div class="kpi-card"><div class="kpi-card__label">Punten</div><div class="kpi-card__value">${Number.isFinite(pts)?pts.toFixed(3):"—"}</div></div><div class="kpi-card"><div class="kpi-card__label">PB's</div><div class="kpi-card__value">${pbN}</div><div class="kpi-card__sub">${pbN} van ${skated.length} ritten</div></div><div class="kpi-card"><div class="kpi-card__label">Afstanden</div><div class="kpi-card__value">${skated.length}/${dists.length}</div></div></div>`;
  if(skated.length>0){const lt={};for(const d of dists){const b=state.standings.all.filter(x=>Number.isFinite(x.seconds?.[d.key])).sort((x,y)=>x.seconds[d.key]-y.seconds[d.key])[0];lt[d.key]=b?.seconds?.[d.key]??null}
    html+=`<div class="popup-section-label">Resultaten</div><div class="table-wrap"><table class="table"><thead><tr><th>Afstand</th><th>Tijd</th><th>Pos</th><th>Verschil</th></tr></thead><tbody>${skated.map(d=>{const pos=a.distRanks?.[d.key],leader=lt[d.key],delta=Number.isFinite(a.seconds[d.key])&&Number.isFinite(leader)?a.seconds[d.key]-leader:null;return`<tr class="${podCls(pos)}"><td>${esc(d.label)}</td><td class="mono">${fmtRaw(a.times[d.key])}${pbB(a.pb?.[d.key])}</td><td>${pos?rankH(pos):"—"}</td><td>${delta===0?'<span class="delta delta--leader">Snelst</span>':Number.isFinite(delta)?`<span class="delta">+${fmtDelta(delta).slice(1)}</span>`:""}</td></tr>`}).join("")}</tbody></table></div>`}
  if(notS.length>0)html+=`<div class="popup-section-label" style="margin-top:12px">Nog te rijden</div><div style="display:flex;gap:6px;flex-wrap:wrap">${notS.map(d=>`<span style="padding:4px 10px;border:1px dashed var(--border);border-radius:6px;font-size:12px;color:var(--text-dim)">${esc(d.label)}</span>`).join("")}</div>`;
  el.popupContent.innerHTML=html;el.athletePopup.hidden=false;
}

// ── ENTRY MODAL ─────────────────────────────────────────
let entryDK=null,entryMode="fields";
function openEntry(dk){entryDK=dk??getDists()[0]?.key;renderEntry();el.entryModal.hidden=false}
function renderEntry(){
  const dists=getDists(),dist=dists.find(d=>d.key===entryDK)??dists[0];if(!dist)return;
  const parts=PARTICIPANTS[state.gender]??[],sl=getStartlist(state.gender,dist.key);
  let ordered=[...parts];if(sl){const om=new Map();sl.forEach((n,i)=>om.set(norm(n),i));ordered.sort((a,b)=>(om.get(norm(a.name))??999)-(om.get(norm(b.name))??999))}
  const tabs=dists.map(d=>{const has=parts.some(p=>getManual(d.key,p.name))||state.standings?.all?.some(a=>a.times?.[d.key]);return`<button class="entry-tab ${d.key===entryDK?"active":""} ${has?"has-data":""}" data-dk="${d.key}">${esc(d.label)}<span class="entry-tab__dot"></span></button>`}).join("");
  let body="";
  if(entryMode==="fields")body=`<div class="entry-fields">${ordered.map(p=>{const pn=getPairNr(sl,p.name),ex=getManual(dist.key,p.name)??"";return`<div class="entry-row"><div class="entry-row__pair">${pn?`Rit ${pn}`:""}</div><div>${esc(p.name)}</div><input class="entry-row__input" data-name="${esc(p.name)}" value="${esc(ex)}" placeholder="mm:ss.xx"></div>`}).join("")}</div>`;
  else body=`<div><div style="font-size:11px;color:var(--text-dim);margin-bottom:6px">Plak resultaten (Naam + Tijd per regel):</div><textarea id="pasteArea" class="entry-paste__area" rows="12"></textarea><button id="pasteBtn" class="cta cta--primary" style="margin-top:8px;width:100%">Verwerk</button></div>`;
  const entered=parts.filter(p=>getManual(dist.key,p.name)).length;
  el.entryModalContent.innerHTML=`<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px"><div><div style="font-size:15px;font-weight:800">⚡ Invoer</div><div style="font-size:11px;color:var(--text-dim)">${TOURNAMENT} · ${state.gender==="v"?"Vrouwen":"Mannen"} · ${esc(dist.label)}</div></div><div style="display:flex;gap:8px;align-items:center"><span class="mono" style="font-size:12px;color:var(--accent)">${entered}/${parts.length}</span><button onclick="el.entryModal.hidden=true" style="background:none;border:none;color:var(--text-dim);font-size:18px;cursor:pointer">✕</button></div></div>
    <div class="entry-tabs" id="eTabs">${tabs}</div>
    <div class="entry-modes"><button class="entry-mode ${entryMode==="fields"?"active":""}" data-mode="fields">Per rijder</button><button class="entry-mode ${entryMode==="paste"?"active":""}" data-mode="paste">Plak resultaten</button></div>${body}
    <div class="entry-footer"><button class="btn btn--danger" id="eClear">Wis afstand</button><button class="cta cta--entry" onclick="el.entryModal.hidden=true">Sluiten</button></div>`;
  document.getElementById("eTabs")?.addEventListener("click",e=>{const b=e.target.closest(".entry-tab");if(b?.dataset.dk){entryDK=b.dataset.dk;renderEntry()}});
  el.entryModalContent.querySelector(".entry-modes")?.addEventListener("click",e=>{const b=e.target.closest(".entry-mode");if(b?.dataset.mode){entryMode=b.dataset.mode;renderEntry()}});
  for(const inp of el.entryModalContent.querySelectorAll(".entry-row__input")){
    inp.addEventListener("blur",()=>{setManual(entryDK,inp.dataset.name,inp.value);loadData();render()});
    inp.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();inp.blur();const nx=inp.closest(".entry-row")?.nextElementSibling?.querySelector(".entry-row__input");if(nx)nx.focus()}})}
  document.getElementById("pasteBtn")?.addEventListener("click",()=>{const txt=document.getElementById("pasteArea")?.value??"";const res=[];for(const ln of txt.split("\n").map(l=>l.trim()).filter(Boolean)){const m=ln.match(/(\d{1,2}[:.]\d{2}[:.]\d{2}|\d{1,2}[:.]\d{2,3}|\d{2}[,.]\d{2,3})$/);if(!m)continue;const time=m[1].replace(",",".");let name=ln.slice(0,m.index).trim().replace(/^\d+[\s.)\-]+/,"").trim();if(name.length>2)res.push({name,time})}
    let matched=0;for(const{name,time}of res){const n=norm(name);const p=(PARTICIPANTS[state.gender]??[]).find(x=>{const pn=norm(x.name);return pn===n||pn.split(" ").pop()===n.split(" ").pop()});if(p){setManual(entryDK,p.name,time);matched++}}
    toast(`${matched}/${res.length} verwerkt`);loadData();render();renderEntry()});
  document.getElementById("eClear")?.addEventListener("click",()=>{delete MANUAL[`${state.gender}_${entryDK}`];saveManual();loadData();render();renderEntry();toast("Gewist")});
  setTimeout(()=>{const f=el.entryModalContent.querySelector('.entry-row__input[value=""]');if(f)f.focus()},50);
}

// ── DEBUG ───────────────────────────────────────────────
async function openDebug(){
  el.debugPanel.hidden=false;el.debugContent.innerHTML='<div style="color:var(--orange)">⏳ Loading...</div>';
  await fetchAll();
  const now=Date.now();let html=`<div style="font-size:14px;font-weight:700;margin-bottom:8px">🔍 Debug — ${TOURNAMENT}</div>`;
  html+=`<div style="font-size:12px;margin-bottom:8px">Source: <b>${dataSource}</b> | ${state.gender} | ${state.standings?.all?.filter(a=>a.completedCount>0).length??0}/${state.standings?.all?.length??0} met tijden</div>`;
  html+=`<div style="font-size:10px;font-family:var(--font-mono);margin-bottom:10px">`;
  for(let c=1;c<=8;c++){const ca=CACHE[`${EVENT_ID}_${c}`];const p=ca?.data?parseApi(ca.data):[];const age=ca?Math.round((now-ca.ts)/1000):-1;const col=p.length>0?"var(--green)":ca?"var(--orange)":"var(--red)";html+=`<span style="color:${col}">C${c}:${p.length}(${age}s) </span>`}
  html+=`</div>`;
  // Per-distance mapping
  for(const gen of["v","m"]){const ci=COMP_IDS[gen];const label=gen==="v"?"♀":"♂";
    html+=`<div style="font-weight:700;color:var(--accent);margin:6px 0 4px">${label}</div>`;
    for(const d of DISTANCES[gen]){const cid=ci[d.key];const ca=CACHE[`${EVENT_ID}_${cid}`];const p=ca?.data?parseApi(ca.data):[];
      html+=`<div style="font-size:11px">${esc(d.label)} → C${cid}: ${p.length} results ${p.length>0?"✅":"❌"}</div>`}}
  // Name match
  const parts=PARTICIPANTS[state.gender]??[];const ci=COMP_IDS[state.gender]??{};const apiN=new Set();
  for(const[dk,cid]of Object.entries(ci)){const ca=CACHE[`${EVENT_ID}_${cid}`];const p=ca?.data?parseApi(ca.data):[];for(const r of p)apiN.add(norm(r.name))}
  const matched=parts.filter(p=>apiN.has(norm(p.name)));const unmatched=parts.filter(p=>!apiN.has(norm(p.name)));
  html+=`<div style="border-top:1px solid var(--border);padding-top:8px;margin-top:8px"><div style="font-weight:700;color:var(--accent)">Match: ${matched.length}/${parts.length}</div>${unmatched.length?`<div style="font-size:11px;color:var(--red)">Unmatched: ${unmatched.map(p=>esc(p.name)).join(", ")}</div>`:""}</div>`;
  html+=`<div style="margin-top:12px"><button id="dRefresh" style="padding:6px 14px;background:var(--orange);color:#000;border:none;border-radius:6px;font-weight:700;font-size:12px;cursor:pointer">🔄 Refresh</button> <button onclick="el.debugPanel.hidden=true" style="padding:6px 14px;background:var(--surface-2);color:var(--text-dim);border:1px solid var(--border);border-radius:6px;font-size:12px;cursor:pointer">Sluiten</button></div>`;
  el.debugContent.innerHTML=html;
  document.getElementById("dRefresh")?.addEventListener("click",async()=>{for(const k of Object.keys(CACHE))delete CACHE[k];await fetchAll();loadData();render();openDebug()});
}

// ── CSV EXPORT ──────────────────────────────────────────
function exportCSV(){const dists=getDists();if(!state.standings)return;const rows=[["#","Naam",...dists.map(d=>d.label),"Punten"].join(";")];for(const a of state.standings.all)rows.push([a.rank??"",a.name,...dists.map(d=>a.times?.[d.key]??""),a.totalPoints??partial(a,dists)??""].join(";"));const b=new Blob([rows.join("\n")],{type:"text/csv"});const u=URL.createObjectURL(b);const a2=document.createElement("a");a2.href=u;a2.download=`NK_Allround_${state.gender}_klassement.csv`;a2.click();URL.revokeObjectURL(u);toast("CSV geëxporteerd")}

// ── VIEW NAV + RENDER ───────────────────────────────────
function renderViewBtns(){const dists=getDists();const vs=[{key:"klassement",icon:"📊",label:"Klassement"},...dists.map(d=>({key:"distance",dk:d.key,icon:"⏱",label:d.label})),{key:"headToHead",icon:"⚔️",label:"Head to Head"},{key:"kwalificatie",icon:"⭐",label:"Kwalificatie"}];
  el.viewButtons.innerHTML=vs.map(v=>{const act=v.key===state.view&&(!v.dk||v.dk===state.distKey);return`<button class="tab ${act?"active":""}" data-view="${v.key}" ${v.dk?`data-dk="${v.dk}"`:""}>${v.icon} ${esc(v.label)}</button>`}).join("")}

function render(){try{setActive(el.genderTabs,"gender",state.gender);saveHash();updateStatus();renderViewBtns();
  if(el.h2hForm)el.h2hForm.hidden=state.view!=="headToHead";
  if(el.viewMeta)el.viewMeta.textContent=`${TOURNAMENT} · ${state.gender==="v"?"Vrouwen":"Mannen"}`;
  if(state.view==="distance"){if(!state.distKey)state.distKey=getDists()[0]?.key;return renderDistance()}
  if(state.view==="headToHead")return renderH2H();if(state.view==="kwalificatie")return renderKwalificatie();return renderKlassement();
  }catch(e){console.error("[NK] RENDER:",e);if(el.contentArea)el.contentArea.innerHTML=`<div style="color:#f87171;padding:20px;font-family:monospace"><h3>⚠️ Error</h3><pre>${e.message}\n${e.stack}</pre></div>`}}

// ── EVENTS ──────────────────────────────────────────────
function bind(){
  el.genderTabs?.addEventListener("click",e=>{const b=e.target.closest(".tab");if(b?.dataset.gender){state.gender=b.dataset.gender;loadData();render()}});
  el.viewButtons?.addEventListener("click",e=>{const b=e.target.closest(".tab");if(!b)return;state.view=b.dataset.view;if(b.dataset.dk)state.distKey=b.dataset.dk;render()});
  el.h2hRiderA?.addEventListener("change",()=>{state.h2h.riderA=el.h2hRiderA.value;render()});
  el.h2hRiderB?.addEventListener("change",()=>{state.h2h.riderB=el.h2hRiderB.value;render()});
  el.exportBtn?.addEventListener("click",exportCSV);
  el.entryBtn?.addEventListener("click",()=>openEntry());
  el.debugBtn?.addEventListener("click",openDebug);
  document.addEventListener("click",e=>{const n=e.target.closest(".athlete-name");if(n?.dataset.name)openPopup(n.dataset.name)});
  for(const ov of[el.athletePopup,el.entryModal,el.debugPanel])ov?.addEventListener("click",e=>{if(e.target===ov)ov.hidden=true});
  document.addEventListener("keydown",e=>{if(e.key==="Escape"){el.athletePopup.hidden=true;el.entryModal.hidden=true;el.debugPanel.hidden=true}});
}

// ── POLLING ─────────────────────────────────────────────
let pollT=null;
function startPoll(){stopPoll();async function tick(){try{for(let c=1;c<=8;c++)delete CACHE[`${EVENT_ID}_${c}`];await fetchAll();loadData();render()}catch(e){console.warn("[NK] poll:",e)}pollT=setTimeout(tick,15_000)}pollT=setTimeout(tick,15_000)}
function stopPoll(){if(pollT){clearTimeout(pollT);pollT=null}}

// ── BOOT ────────────────────────────────────────────────
async function boot(){
  try{cacheEls();loadHash();loadManual();bind();
  loadData();render();console.log("[NK] Rendered (no data)");
  await fetchAll();loadData();render();console.log("[NK] Live ✅");
  }catch(e){console.error("[NK] BOOT:",e);const ca=document.getElementById("contentArea");if(ca)ca.innerHTML=`<div style="color:#f87171;padding:20px;font-family:monospace"><h3>⚠️ Boot Error</h3><pre>${e.message}\n${e.stack}</pre></div>`}
  startPoll();
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot);else boot();
