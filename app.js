"use strict";
// ════════════════════════════════════════════════════════
// NK Allround 2026 — Volledig Klassement
// Fetch via Jina Reader (r.jina.ai)
// ════════════════════════════════════════════════════════

// ── CONFIG ──────────────────────────────────────────────
const EVENT_ID = "2026_NED_0004";
const LIVE_BASE = "https://liveresults.schaatsen.nl/events/" + EVENT_ID + "/competition";
const POLL_MS = 15_000;

const DISTANCES = {
  v: [
    { key: "d1_500",  label: "500m",  meters: 500,  divisor: 1  },
    { key: "d1_3000", label: "3000m", meters: 3000, divisor: 6  },
    { key: "d1_1500", label: "1500m", meters: 1500, divisor: 3  },
    { key: "d1_5000", label: "5000m", meters: 5000, divisor: 10 },
  ],
  m: [
    { key: "d1_500",   label: "500m",    meters: 500,   divisor: 1  },
    { key: "d1_5000",  label: "5000m",   meters: 5000,  divisor: 10 },
    { key: "d1_1500",  label: "1500m",   meters: 1500,  divisor: 3  },
    { key: "d1_10000", label: "10.000m", meters: 10000, divisor: 20 },
  ],
};
const COMP_IDS = {
  v: { d1_500: 1, d1_3000: 3, d1_1500: 5, d1_5000: 7 },
  m: { d1_500: 2, d1_5000: 4, d1_1500: 6, d1_10000: 8 },
};
const QUAL_CONFIG = {
  v: { qualDist: "d1_3000", finalDist: "d1_5000", first3: ["d1_500","d1_3000","d1_1500"], first2: ["d1_500","d1_3000"] },
  m: { qualDist: "d1_5000", finalDist: "d1_10000", first3: ["d1_500","d1_5000","d1_1500"], first2: ["d1_500","d1_5000"] },
};
const PARTICIPANTS = {
  v: [
    { nr:1,  name:"Merel Conijn",       cat:"DSA", qual:"EK Allround" },
    { nr:2,  name:"Marijke Groenewoud", cat:"DSA", qual:"EK Allround" },
    { nr:3,  name:"Jade Groenewoud",    cat:"DN3", qual:"Gruno Bokaal" },
    { nr:4,  name:"Maud Blokhorst",     cat:"DA1", qual:"Kraantje Lek" },
    { nr:5,  name:"Evelien Vijn",       cat:"DN4", qual:"Gruno Bokaal" },
    { nr:6,  name:"Naomi van der Werf", cat:"DSA", qual:"Gruno Bokaal" },
    { nr:7,  name:"Nynke Tinga",        cat:"DN1", qual:"Gruno Bokaal" },
    { nr:8,  name:"Melissa Wijfje",     cat:"DSA", qual:"WC" },
    { nr:9,  name:"Sanne in 't Hof",    cat:"DSA", qual:"WC" },
    { nr:10, name:"Kim Talsma",         cat:"DSA", qual:"WC" },
    { nr:11, name:"Meike Veen",         cat:"DN2", qual:"WC" },
    { nr:12, name:"Gioya Lancee",       cat:"DSA", qual:"Kraantje Lek" },
    { nr:13, name:"Hilde Noppert",      cat:"DSA", qual:"Kraantje Lek" },
    { nr:14, name:"Sanne Westra",       cat:"DN4", qual:"Kraantje Lek" },
    { nr:15, name:"Rosalie van Vliet",  cat:"DN1", qual:"Kraantje Lek" },
    { nr:16, name:"Evi de Ruijter",     cat:"DA2", qual:"Kraantje Lek" },
    { nr:17, name:"Lieke Huizink",      cat:"DA2", qual:"Kraantje Lek" },
    { nr:18, name:"Tosca Mulder",       cat:"DN3", qual:"Kraantje Lek" },
    { nr:19, name:"Amy van der Meer",   cat:"DSA", qual:"Kraantje Lek" },
    { nr:20, name:"Britt Breider",      cat:"DA2", qual:"Kraantje Lek" },
  ],
  m: [
    { nr:1,  name:"Beau Snellink",        cat:"HSA", qual:"EK Allround" },
    { nr:2,  name:"Loek van Vilsteren",   cat:"HN3", qual:"Eindhoven Trofee" },
    { nr:3,  name:"Marcel Bosker",         cat:"HSA", qual:"EK Allround" },
    { nr:4,  name:"Jasper Krommenhoek",    cat:"HN3", qual:"EK Allround" },
    { nr:5,  name:"Jur Veenje",            cat:"HSA", qual:"Gruno Bokaal" },
    { nr:6,  name:"Chris Brommersma",      cat:"HN2", qual:"Gruno Bokaal" },
    { nr:7,  name:"Michiel de Groot",      cat:"HN2", qual:"Gruno Bokaal" },
    { nr:8,  name:"Louis Hollaar",         cat:"HSA", qual:"WC" },
    { nr:9,  name:"Jasper Tinga",          cat:"HN3", qual:"Eindhoven Trofee" },
    { nr:10, name:"Remco Stam",            cat:"HN3", qual:"Eindhoven Trofee" },
    { nr:11, name:"Remo Slotegraaf",       cat:"HSA", qual:"Eindhoven Trofee" },
    { nr:12, name:"Jelle Koeleman",        cat:"HN3", qual:"Eindhoven Trofee" },
    { nr:13, name:"Yves Vergeer",          cat:"HSA", qual:"Eindhoven Trofee" },
    { nr:14, name:"Niels van Reeuwijk",    cat:"HN2", qual:"Eindhoven Trofee" },
    { nr:15, name:"Ties van Seumeren",     cat:"HN2", qual:"Eindhoven Trofee" },
    { nr:16, name:"Jorrit Bergsma",        cat:"H40", qual:"Aanwijsplek" },
    { nr:17, name:"Edsger van Felius",     cat:"HA2", qual:"Eindhoven Trofee" },
    { nr:18, name:"Mathijs van Zwieten",   cat:"HSA", qual:"Eindhoven Trofee" },
    { nr:19, name:"Hidde Westra",          cat:"HN3", qual:"Eindhoven Trofee" },
    { nr:20, name:"Pelle Bolsius",         cat:"HA2", qual:"Eindhoven Trofee" },
  ],
};

// ── UTILITIES ───────────────────────────────────────────
function norm(n) {
  return String(n ?? "").trim().toLowerCase()
    .normalize("NFD").replace(/\p{Diacritic}/gu, "")
    .replace(/[\u2018\u2019\u201A\u201B`\u00B4\u2032\u02BC\u02BB\u2060']/g, "'")
    .replace(/[\u2010-\u2015]/g, "-").replace(/\s+/g, " ").trim();
}
function esc(s) { return String(s??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function parseTime(raw) {
  if (!raw || typeof raw !== "string") return null;
  const s = raw.trim().replace(",", ".");
  const mc = s.match(/^(\d{1,2}):(\d{2}(?:\.\d{1,3})?)$/);
  if (mc) return parseFloat(mc[1]) * 60 + parseFloat(mc[2]);
  const n = parseFloat(s);
  return Number.isFinite(n) && n > 0 ? n : null;
}
function fmtTime(sec) {
  if (!Number.isFinite(sec) || sec < 0) return "—";
  const m = Math.floor(sec / 60), s = sec - m * 60;
  const str = s.toFixed(2).padStart(5, "0");
  return m > 0 ? `${m}:${str.replace(".",",")}` : str;
}
function fmtDelta(sec) {
  if (!Number.isFinite(sec)) return "—";
  const sign = sec < 0 ? "-" : "+", abs = Math.abs(sec);
  const m = Math.floor(abs / 60), s = abs - m * 60;
  const str = s.toFixed(2).padStart(5, "0");
  return m > 0 ? `${sign}${m}:${str.replace(".",",")}` : `${sign}${str}`;
}
function fmtPts(p) { return Number.isFinite(p) ? p.toFixed(3) : "—"; }

/** ROUND UP to 3 decimals (ceiling) — official allround rule */
function ceil3(n) { return Math.ceil(n * 1000) / 1000; }

function medal(r) { return { 1: "🥇", 2: "🥈", 3: "🥉" }[r] ?? ""; }
function podCls(r) { return r >= 1 && r <= 3 ? ` row--${["","gold","silver","bronze"][r]}` : ""; }

// ── STATE ───────────────────────────────────────────────
const state = {
  gender: "v",
  view: "klassement",
  distKey: null,
  h2h: { riderA: null, riderB: null, target: null },
};

const inactive = { v: new Set(), m: new Set() };
function loadInactive() { try { const d = JSON.parse(localStorage.getItem("nk_allround_inactive") ?? "{}"); if (d.v) inactive.v = new Set(d.v); if (d.m) inactive.m = new Set(d.m); } catch(_){} }
function saveInactive() { try { localStorage.setItem("nk_allround_inactive", JSON.stringify({ v: [...inactive.v], m: [...inactive.m] })); } catch(_){} }
function isActive(name) { return !inactive[state.gender].has(name); }

// ── DATA CACHE (per gender) ─────────────────────────────
const dataCache = { v: null, m: null }; // { distKey → [{ name, time, seconds }] }
const lastFetch = { v: null, m: null }; // Date

let standings = null;
let dataSource = "waiting";

function getDists() { return DISTANCES[state.gender]; }
function getLiveData() { return dataCache[state.gender] ?? {}; }

// ── FETCH (Jina Reader) ────────────────────────────────
async function fetchPageText(compId) {
  const pageUrl = `${LIVE_BASE}/${compId}/results`;
  const cb = Date.now();
  const candidates = [
    { name: "jina", url: `https://r.jina.ai/${pageUrl}?_=${cb}` },
    { name: "allorigins", url: `https://api.allorigins.win/get?url=${encodeURIComponent(pageUrl)}&cache=${cb}` },
  ];
  for (const c of candidates) {
    try {
      const res = await fetch(c.url, { cache: "no-store" });
      if (!res.ok) continue;
      let text;
      if (c.name === "allorigins") { const d = await res.json(); text = String(d?.contents ?? ""); }
      else text = await res.text();
      if (text.length > 100) { console.log(`[NK] C${compId} ${c.name}: ✅`); return text; }
    } catch(_){}
  }
  return null;
}

function extractTimes(text, participants) {
  const normText = norm(text);
  const results = new Map();
  const timeRe = /(\d{1,2}:\d{2}[\.,]\d{2,3}|\d{1,3}[\.,]\d{2,3})/g;
  for (const p of participants) {
    const key = norm(p.name); if (!key) continue;
    let start = 0;
    while (true) {
      const idx = normText.indexOf(key, start);
      if (idx === -1) break;
      const win = normText.slice(idx, Math.min(normText.length, idx + 300));
      timeRe.lastIndex = 0;
      const m = timeRe.exec(win);
      if (m) { const raw = m[1].replace(",", "."); if (parseTime(raw) != null) { results.set(key, raw); break; } }
      start = idx + key.length;
    }
  }
  return results;
}

async function fetchGender(gender) {
  const dists = DISTANCES[gender], comps = COMP_IDS[gender], parts = PARTICIPANTS[gender];
  const all = {};
  for (const d of dists) {
    const text = await fetchPageText(comps[d.key]);
    all[d.key] = [];
    if (!text) continue;
    const tm = extractTimes(text, parts);
    for (const p of parts) {
      const t = tm.get(norm(p.name));
      if (t) { const sec = parseTime(t); if (sec != null) all[d.key].push({ name: p.name, time: t, seconds: sec }); }
    }
    console.log(`[NK] ${gender} ${d.label}: ${all[d.key].length} times`);
    await sleep(400);
  }
  dataCache[gender] = all;
  lastFetch[gender] = new Date();
}

/** Fetch current gender, use cache if available */
async function ensureData(gender) {
  if (dataCache[gender]) return; // Already loaded
  await fetchGender(gender);
}

// ── COMPUTE STANDINGS ───────────────────────────────────
function computeStandings() {
  const dists = getDists(), parts = PARTICIPANTS[state.gender], ld = getLiveData();
  const athletes = parts.map(p => {
    const a = { name: p.name, nr: p.nr, cat: p.cat, qual: p.qual, active: isActive(p.name),
      times: {}, seconds: {}, points: {}, distRanks: {} };
    for (const d of dists) {
      const res = (ld[d.key] ?? []).find(r => r.name === p.name);
      if (res) { a.times[d.key] = res.time; a.seconds[d.key] = res.seconds; a.points[d.key] = ceil3(res.seconds / d.divisor); }
    }
    return a;
  });

  // Dist ranks
  for (const d of dists) {
    const sorted = athletes.filter(a => Number.isFinite(a.seconds[d.key])).sort((x, y) => x.seconds[d.key] - y.seconds[d.key]);
    sorted.forEach((a, i) => { a.distRanks[d.key] = i + 1; });
  }

  // Points
  for (const a of athletes) {
    let sum = 0, cnt = 0;
    for (const d of dists) { const p = a.points[d.key]; if (Number.isFinite(p)) { sum += p; cnt++; } }
    a.completedCount = cnt;
    a.totalPoints = cnt === dists.length ? ceil3(sum) : null;
    a.partialPoints = cnt > 0 ? ceil3(sum) : null;
    a.currentPoints = a.totalPoints ?? a.partialPoints;
  }

  // Rank active only
  const ranked = athletes.filter(a => a.active && a.completedCount > 0)
    .sort((a, b) => {
      if (a.completedCount !== b.completedCount) return b.completedCount - a.completedCount;
      const ap = a.currentPoints, bp = b.currentPoints;
      if (ap == null && bp == null) return 0; if (ap == null) return 1; if (bp == null) return -1;
      return ap - bp;
    });
  ranked.forEach((a, i) => a.rank = i + 1);

  const leader = ranked[0];
  const leaderPts = leader?.currentPoints ?? null;
  for (const a of ranked) {
    a.delta = Number.isFinite(leaderPts) && Number.isFinite(a.currentPoints) ? ceil3(a.currentPoints - leaderPts) : null;
  }
  for (const a of athletes) if (!a.active) a.rank = null;

  standings = { all: athletes, ranked, leader };
  dataSource = athletes.some(a => a.completedCount > 0) ? "live" : "waiting";
}

/**
 * Calculate what time athlete needs on a given distance to reach targetPoints total.
 * Returns seconds needed, or null if impossible/not applicable.
 */
function neededTime(athlete, distKey, targetPoints) {
  if (!Number.isFinite(targetPoints)) return null;
  const dists = getDists();
  const dist = dists.find(d => d.key === distKey);
  if (!dist) return null;
  // Sum of points on OTHER distances
  let otherSum = 0, otherCount = 0;
  for (const d of dists) {
    if (d.key === distKey) continue;
    const p = athlete.points[d.key];
    if (Number.isFinite(p)) { otherSum += p; otherCount++; }
  }
  // Need all other distances completed
  if (otherCount < dists.length - 1) return null;
  // pointsNeeded = targetPoints - otherSum → time = pointsNeeded * divisor
  const ptsNeeded = targetPoints - otherSum;
  if (ptsNeeded <= 0) return 0.01; // Already ahead
  return ptsNeeded * dist.divisor;
}

// ── DOM ─────────────────────────────────────────────────
const el = {};
function cacheEls() {
  for (const id of ["statusBadge","statusText","genderTabs","navButtons","entryBtn","debugBtn","contentArea","overlay"])
    el[id] = document.getElementById(id);
}
function setStatus() {
  if (!el.statusBadge) return;
  el.statusBadge.className = `badge badge--${dataSource}`;
  el.statusText.textContent = dataSource === "live" ? "Live" : "Wachten op data";
}

// ── RENDER ROUTER ───────────────────────────────────────
function render() {
  computeStandings();
  setStatus();
  renderNav();
  el.genderTabs.querySelectorAll(".tab").forEach(b => b.classList.toggle("active", b.dataset.gender === state.gender));
  if (state.view === "klassement") return renderKlassement();
  if (state.view.startsWith("dist_")) { state.distKey = state.view.replace("dist_", ""); return renderDistance(); }
  if (state.view === "h2h") return renderH2H();
  if (state.view === "deelnemers") return renderDeelnemers();
  if (state.view === "kwalificatie") return renderKwalificatie();
  renderKlassement();
}

function renderNav() {
  const dists = getDists();
  const views = [
    { key: "klassement", icon: "📊", label: "Klassement" },
    ...dists.map(d => ({ key: `dist_${d.key}`, icon: "⏱", label: d.label })),
    { key: "h2h", icon: "⚔️", label: "Head to Head" },
    { key: "deelnemers", icon: "👥", label: "Deelnemers" },
    { key: "kwalificatie", icon: "⭐", label: "Kwalificatie" },
  ];
  el.navButtons.innerHTML = views.map(v =>
    `<button class="nav-btn ${state.view === v.key ? 'active' : ''}" data-view="${v.key}"><span class="nav-btn__icon">${v.icon}</span>${esc(v.label)}</button>`
  ).join("");
}

// ── MODULE: KLASSEMENT ──────────────────────────────────
function renderKlassement() {
  const dists = getDists();
  if (!standings) return;
  const ndKey = state.distKey ?? dists[dists.length - 1]?.key;
  const nd = dists.find(d => d.key === ndKey) ?? dists[dists.length - 1];
  const distHdr = dists.map(d => `<th>${esc(d.label)}</th>`).join("");

  const active = standings.all.filter(a => a.active).sort((a, b) => {
    if (a.rank != null && b.rank != null) return a.rank - b.rank;
    if (a.rank != null) return -1; if (b.rank != null) return 1; return 0;
  });

  const rows = active.map(a => {
    const cells = dists.map(d => {
      const t = a.seconds[d.key], dr = a.distRanks[d.key];
      const m = dr ? `<span class="dist-medal">${medal(dr)}</span>` : "";
      return Number.isFinite(t) ? `<td class="mono">${fmtTime(t)}${m}</td>` : `<td class="mono" style="color:var(--text-muted)">—</td>`;
    }).join("");
    const pts = a.currentPoints, pStr = fmtPts(pts);
    const dim = a.totalPoints == null && a.completedCount > 0 ? ' style="opacity:.55"' : "";
    let deltaStr = "";
    if (a.delta === 0) deltaStr = '<span class="delta delta--leader">Leader</span>';
    else if (Number.isFinite(a.delta) && nd) deltaStr = `<span class="delta">${fmtDelta(a.delta * nd.divisor)}</span>`;
    return `<tr class="${podCls(a.rank)}"><td>${a.rank ? `<strong>${a.rank}</strong>` : "—"}</td><td><span class="athlete" data-name="${esc(a.name)}">${esc(a.name)}</span></td>${cells}<td class="mono"${dim}><strong>${pStr}</strong></td><td>${deltaStr}</td></tr>`;
  }).join("");

  const opts = dists.map(d => `<option value="${d.key}" ${d.key === ndKey ? "selected" : ""}>${esc(d.label)}</option>`).join("");
  const cc = dists.filter(d => standings.all.some(a => a.times[d.key])).length;
  const ts = lastFetch[state.gender]?.toLocaleTimeString("nl-NL") ?? "";

  el.contentArea.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
      <div><h2 style="font-size:18px;font-weight:800;margin-bottom:2px">Algemeen Klassement</h2>
        <span style="font-size:12px;color:var(--text-dim)">Na ${cc}/${dists.length} afstanden${ts ? ` · ${ts}` : ""}</span></div>
      <div style="display:flex;align-items:center;gap:8px">
        <span style="font-size:11px;color:var(--text-dim)">Δ op:</span>
        <select id="ndSel" style="padding:4px 8px;background:var(--surface-2);border:1px solid var(--border);color:var(--text);border-radius:var(--radius-sm);font-size:12px">${opts}</select></div>
    </div>
    <div class="table-wrap"><table class="table">
      <thead><tr><th>#</th><th>Naam</th>${distHdr}<th>Punten</th><th>Δ</th></tr></thead>
      <tbody>${rows}</tbody>
    </table></div>
    <div class="info-box" style="margin-top:12px"><strong>Punten</strong> = tijd ÷ (meters ÷ 500), afgerond naar boven op 3 decimalen. Laagste totaal wint.</div>`;

  document.getElementById("ndSel")?.addEventListener("change", e => { state.distKey = e.target.value; render(); });
}

// ── MODULE: AFSTAND + LIVE SIDEBAR ──────────────────────
function renderDistance() {
  const dists = getDists();
  const dist = dists.find(d => d.key === state.distKey) ?? dists[0];
  if (!dist || !standings) return;

  // Find next unfinished distance for target calc
  let nextDist = null;
  for (const d of dists) { if (!standings.all.some(a => a.active && Number.isFinite(a.seconds[d.key]))) { nextDist = d; break; } }
  if (!nextDist) nextDist = dist; // All done, use current

  const leaderPts = standings.leader?.currentPoints;

  // --- Main table: distance results ---
  const withTime = standings.all.filter(a => a.active && Number.isFinite(a.seconds[dist.key]))
    .sort((a, b) => a.seconds[dist.key] - b.seconds[dist.key]);
  const noTime = standings.all.filter(a => a.active && !Number.isFinite(a.seconds[dist.key]));
  const fastest = withTime[0]?.seconds[dist.key] ?? null;

  const mainRows = withTime.map((a, i) => {
    const rk = i + 1;
    const delta = Number.isFinite(fastest) ? a.seconds[dist.key] - fastest : null;
    const deltaStr = delta === 0 ? '<span class="delta delta--leader">Snelst</span>' :
      Number.isFinite(delta) ? `<span class="delta">${fmtDelta(delta)}</span>` : "";
    return `<tr class="${podCls(rk)}"><td><strong>${rk}</strong> ${medal(rk)}</td><td><span class="athlete" data-name="${esc(a.name)}">${esc(a.name)}</span></td><td class="mono">${fmtTime(a.seconds[dist.key])}</td><td class="mono">${fmtPts(a.points[dist.key])}</td><td>${deltaStr}</td></tr>`;
  }).join("");

  const pendingRows = noTime.map(a => {
    // Calculate needed time to beat leader on next distance
    const needed = neededTime(a, dist.key, leaderPts);
    const needStr = Number.isFinite(needed) && needed > 0 ? `<span style="font-size:11px;color:var(--orange)" title="Tijd nodig voor P1">${fmtTime(needed)}</span>` : "";
    return `<tr style="opacity:.5"><td>—</td><td>${esc(a.name)}</td><td class="mono">—</td><td class="mono">—</td><td>${needStr}</td></tr>`;
  }).join("");

  const sep = withTime.length > 0 && noTime.length > 0 ?
    `<tr><td colspan="5" style="padding:6px 14px;font-size:11px;font-weight:700;color:var(--text-muted);border-bottom:1px solid var(--border)">Nog te rijden ${noTime.length > 0 && Number.isFinite(leaderPts) ? "(nodig voor P1)" : ""}</td></tr>` : "";

  // --- Sidebar: live klassement ---
  const ranked = standings.ranked;
  const sideRows = ranked.map((a, i) => {
    const rk = i + 1;
    let deltaStr = "";
    if (rk === 1) deltaStr = '<span class="delta delta--leader" style="font-size:9px">L</span>';
    else if (Number.isFinite(a.delta) && nextDist) deltaStr = `<span class="delta" style="font-size:10px">${fmtDelta(a.delta * nextDist.divisor)}</span>`;

    // Needed time on next distance for P1
    const needed = neededTime(a, nextDist.key, leaderPts);
    const needStr = (rk > 1 && Number.isFinite(needed) && needed > 0) ?
      `<span style="font-size:10px;color:var(--orange)">${fmtTime(needed)}</span>` : "";

    return `<tr><td style="width:24px;font-weight:700;font-size:11px;color:var(--text-dim)">${rk}</td><td style="font-size:11px"><span class="athlete" data-name="${esc(a.name)}">${esc(a.name)}</span></td><td class="mono" style="font-size:11px">${fmtPts(a.currentPoints)}</td><td style="font-size:10px">${deltaStr}</td><td>${needStr}</td></tr>`;
  }).join("");

  const cc = dists.filter(d => standings.all.some(a => a.times[d.key])).length;

  el.contentArea.innerHTML = `
    <h2 style="font-size:18px;font-weight:800;margin-bottom:12px">${esc(dist.label)}</h2>
    <div style="display:grid;grid-template-columns:1fr 320px;gap:16px">
      <div class="table-wrap"><table class="table">
        <thead><tr><th>#</th><th>Naam</th><th>Tijd</th><th>Punten</th><th>Verschil</th></tr></thead>
        <tbody>${mainRows}${sep}${pendingRows}</tbody>
      </table></div>
      <div>
        <div style="font-size:12px;font-weight:700;color:var(--accent);margin-bottom:6px">Live Klassement <span style="color:var(--text-dim);font-weight:400">(${cc}/${dists.length})</span></div>
        ${nextDist ? `<div style="font-size:10px;color:var(--text-dim);margin-bottom:6px">Nodig op ${esc(nextDist.label)} voor P1</div>` : ""}
        <div class="table-wrap" style="max-height:500px;overflow-y:auto"><table class="table">
          <thead><tr><th>#</th><th>Naam</th><th>Pnt</th><th>Δ</th><th>Nodig</th></tr></thead>
          <tbody>${sideRows}</tbody>
        </table></div>
      </div>
    </div>`;
}

// ── MODULE: HEAD TO HEAD (compact) ──────────────────────
function renderH2H() {
  if (!standings || !standings.ranked.length) {
    el.contentArea.innerHTML = `<h2 style="font-size:18px;font-weight:800;margin-bottom:12px">Head to Head</h2><div class="info-box">Nog geen resultaten.</div>`;
    return;
  }
  const dists = getDists();
  const all = standings.all.filter(a => a.active);
  const opts = all.map(a => `<option value="${esc(a.name)}">${esc(a.name)}</option>`).join("");

  if (!state.h2h.riderA || !all.find(a => a.name === state.h2h.riderA)) state.h2h.riderA = standings.ranked[0]?.name;
  if (!state.h2h.riderB || !all.find(a => a.name === state.h2h.riderB)) state.h2h.riderB = standings.ranked[1]?.name ?? standings.ranked[0]?.name;
  if (!state.h2h.target || !all.find(a => a.name === state.h2h.target)) state.h2h.target = standings.leader?.name;

  el.contentArea.innerHTML = `
    <h2 style="font-size:18px;font-weight:800;margin-bottom:12px">Head to Head</h2>
    <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-bottom:14px">
      <select id="h2hA" class="h2h-sel">${opts}</select>
      <span style="font-size:12px;font-weight:800;color:var(--text-muted)">VS</span>
      <select id="h2hB" class="h2h-sel">${opts}</select>
      <span style="margin-left:16px;font-size:11px;color:var(--text-dim)">Target:</span>
      <select id="h2hT" class="h2h-sel">${opts}</select>
    </div>
    <div id="h2hContent"></div>`;

  const selA = document.getElementById("h2hA"), selB = document.getElementById("h2hB"), selT = document.getElementById("h2hT");
  selA.value = state.h2h.riderA; selB.value = state.h2h.riderB; selT.value = state.h2h.target;
  const update = () => { state.h2h.riderA = selA.value; state.h2h.riderB = selB.value; state.h2h.target = selT.value; renderH2HContent(); };
  selA.onchange = selB.onchange = selT.onchange = update;
  renderH2HContent();
}

function renderH2HContent() {
  const dists = getDists();
  const rA = standings.all.find(a => a.name === state.h2h.riderA);
  const rB = standings.all.find(a => a.name === state.h2h.riderB);
  const tgt = standings.all.find(a => a.name === state.h2h.target);
  const cont = document.getElementById("h2hContent");
  if (!cont || !rA || !rB) return;

  const nameA = rA.name.split(" ").pop(), nameB = rB.name.split(" ").pop();
  const nameTgt = tgt ? tgt.name.split(" ").pop() : "";

  // Single compact table: A time | dist | B time | vs each other | vs target
  const rows = dists.map(d => {
    const sA = rA.seconds[d.key], sB = rB.seconds[d.key], sT = tgt?.seconds[d.key];

    const tA = Number.isFinite(sA) ? fmtTime(sA) : "—";
    const tB = Number.isFinite(sB) ? fmtTime(sB) : "—";

    // A vs B
    let abDiff = "";
    if (Number.isFinite(sA) && Number.isFinite(sB)) {
      const dd = sA - sB;
      if (dd < 0) abDiff = `<span style="color:var(--green)">${nameA} ${Math.abs(dd).toFixed(2)}s</span>`;
      else if (dd > 0) abDiff = `<span style="color:var(--green)">${nameB} ${dd.toFixed(2)}s</span>`;
      else abDiff = `<span style="color:var(--text-dim)">gelijk</span>`;
    }

    // A vs Target
    let atDiff = "", btDiff = "";
    if (tgt && tgt.name !== rA.name && tgt.name !== rB.name && Number.isFinite(sT)) {
      if (Number.isFinite(sA)) { const dd = sA - sT; atDiff = dd <= 0 ? `<span style="color:var(--green)">${fmtDelta(dd)}</span>` : `<span style="color:var(--red)">${fmtDelta(dd)}</span>`; }
      if (Number.isFinite(sB)) { const dd = sB - sT; btDiff = dd <= 0 ? `<span style="color:var(--green)">${fmtDelta(dd)}</span>` : `<span style="color:var(--red)">${fmtDelta(dd)}</span>`; }
    }

    return `<tr>
      <td class="mono" style="text-align:right">${tA}</td>
      <td style="text-align:center;font-size:12px;color:var(--text-dim);font-weight:600">${esc(d.label)}</td>
      <td class="mono">${tB}</td>
      <td style="font-size:11px">${abDiff}</td>
      <td style="font-size:11px">${atDiff}</td>
      <td style="font-size:11px">${btDiff}</td>
    </tr>`;
  }).join("");

  // Totals
  const pA = rA.currentPoints, pB = rB.currentPoints, pT = tgt?.currentPoints;
  let totalAB = "";
  if (Number.isFinite(pA) && Number.isFinite(pB)) {
    const dd = pA - pB;
    totalAB = dd < 0 ? `<span style="color:var(--green)">${nameA} ${Math.abs(dd).toFixed(3)}</span>` :
      dd > 0 ? `<span style="color:var(--green)">${nameB} ${dd.toFixed(3)}</span>` : "gelijk";
  }

  const tgtLabel = tgt && tgt.name !== rA.name && tgt.name !== rB.name ? esc(nameTgt) : "";

  cont.innerHTML = `
    <div class="table-wrap"><table class="table">
      <thead><tr>
        <th style="text-align:right">${esc(rA.name)} <span style="color:var(--text-muted)">#${rA.rank ?? "—"}</span></th>
        <th style="text-align:center">Afstand</th>
        <th>${esc(rB.name)} <span style="color:var(--text-muted)">#${rB.rank ?? "—"}</span></th>
        <th>Snelste</th>
        ${tgtLabel ? `<th>${esc(nameA)} vs ${tgtLabel}</th><th>${esc(nameB)} vs ${tgtLabel}</th>` : "<th></th><th></th>"}
      </tr></thead>
      <tbody>
        ${rows}
        <tr style="border-top:2px solid var(--border);font-weight:700">
          <td class="mono" style="text-align:right">${fmtPts(pA)}</td>
          <td style="text-align:center;font-size:12px;color:var(--text-dim)">Punten</td>
          <td class="mono">${fmtPts(pB)}</td>
          <td style="font-size:11px">${totalAB}</td>
          <td></td><td></td>
        </tr>
      </tbody>
    </table></div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:14px">
      ${renderH2HTile(rA, standings.leader)}
      ${renderH2HTile(rB, standings.leader)}
    </div>`;
}

function renderH2HTile(rider, leader) {
  if (!rider || !leader) return "";
  const dists = getDists();
  const isLeader = rider.name === leader.name;
  const pR = rider.currentPoints, pL = leader.currentPoints;
  const diff = Number.isFinite(pR) && Number.isFinite(pL) ? ceil3(pR - pL) : null;

  // Find next dist where rider has no time
  let nextD = null;
  for (const d of dists) { if (!Number.isFinite(rider.seconds[d.key])) { nextD = d; break; } }
  const needed = nextD ? neededTime(rider, nextD.key, pL) : null;

  return `<div style="background:var(--surface-2);border:1px solid var(--border);border-radius:var(--radius);padding:12px">
    <div style="font-size:13px;font-weight:700;margin-bottom:6px">${esc(rider.name)} <span style="color:var(--text-dim)">#${rider.rank ?? "—"}</span></div>
    <div style="font-size:24px;font-weight:800;font-family:var(--font-mono)">${fmtPts(pR)} <span style="font-size:12px;font-weight:400;color:var(--text-dim)">pnt</span></div>
    ${isLeader ? '<div style="margin-top:4px"><span class="delta delta--leader">Leader</span></div>' :
      `<div style="margin-top:4px;font-size:12px;color:var(--text-dim)">Verschil: <span class="mono">${Number.isFinite(diff) ? `+${diff.toFixed(3)} pnt` : "—"}</span></div>
      ${nextD && Number.isFinite(needed) && needed > 0 ? `<div style="margin-top:4px;font-size:12px;color:var(--orange)">Nodig op ${esc(nextD.label)}: <strong class="mono">${fmtTime(needed)}</strong></div>` : ""}`}
  </div>`;
}

// ── MODULE: DEELNEMERS ──────────────────────────────────
function renderDeelnemers() {
  const parts = PARTICIPANTS[state.gender];
  const rows = parts.map(p => {
    const act = isActive(p.name);
    return `<tr${!act ? ' style="opacity:.45"' : ""}>
      <td>${p.nr}</td><td><span class="athlete" data-name="${esc(p.name)}">${esc(p.name)}</span></td>
      <td>${esc(p.cat)}</td><td>${esc(p.qual)}</td>
      <td><button class="btn ${act ? "btn--ghost" : "btn--danger"}" data-toggle="${esc(p.name)}" style="font-size:11px;padding:3px 10px">${act ? "Actief" : "Inactief"}</button></td>
    </tr>`;
  }).join("");
  const activeCount = parts.filter(p => isActive(p.name)).length;
  el.contentArea.innerHTML = `
    <h2 style="font-size:18px;font-weight:800;margin-bottom:4px">Deelnemers — ${state.gender === "v" ? "Vrouwen" : "Mannen"}</h2>
    <p style="font-size:12px;color:var(--text-dim);margin-bottom:12px">${activeCount}/${parts.length} actief</p>
    <div class="table-wrap"><table class="table">
      <thead><tr><th>Nr</th><th>Naam</th><th>Cat</th><th>Kwalificatie</th><th>Status</th></tr></thead>
      <tbody>${rows}</tbody>
    </table></div>
    <div class="info-box" style="margin-top:12px">Klik <strong>Actief/Inactief</strong> om rijders uit het klassement te halen (bijv. bij opgave).</div>`;

  el.contentArea.addEventListener("click", e => {
    const btn = e.target.closest("[data-toggle]");
    if (!btn) return;
    const name = btn.dataset.toggle;
    if (inactive[state.gender].has(name)) inactive[state.gender].delete(name);
    else inactive[state.gender].add(name);
    saveInactive(); render();
  });
}

// ── MODULE: KWALIFICATIE ────────────────────────────────
function renderKwalificatie() {
  let html = `<h2 style="font-size:18px;font-weight:800;margin-bottom:16px">Kwalificatie Slotafstand</h2>`;
  for (const gen of ["v", "m"]) {
    const q = QUAL_CONFIG[gen], dists = DISTANCES[gen], parts = PARTICIPANTS[gen];
    const gLabel = gen === "v" ? "♀ Vrouwen" : "♂ Mannen";
    const finalDist = dists.find(d => d.key === q.finalDist);
    const ld = dataCache[gen] ?? {};
    const athletes = parts.filter(p => !inactive[gen].has(p.name)).map(p => {
      const a = { name: p.name, points: {}, seconds: {} };
      for (const d of dists) { const res = (ld[d.key] ?? []).find(r => r.name === p.name); if (res) { a.seconds[d.key] = res.seconds; a.points[d.key] = ceil3(res.seconds / d.divisor); } }
      return a;
    });
    const completed = q.first3.filter(dk => athletes.some(a => Number.isFinite(a.seconds[dk])));
    const use3 = completed.length >= 3, useDists = use3 ? q.first3 : q.first2;
    const mode = use3 ? "Definitief (3 afstanden)" : `Voorlopig (${completed.length})`;
    const klassRanked = athletes.map(a => { let sum = 0, cnt = 0; for (const dk of useDists) { const p = a.points[dk]; if (Number.isFinite(p)) { sum += p; cnt++; } } return { ...a, kSum: cnt === useDists.length ? ceil3(sum) : null }; }).filter(a => a.kSum != null).sort((a, b) => a.kSum - b.kSum);
    const distRanked = athletes.filter(a => Number.isFinite(a.seconds[q.qualDist])).sort((a, b) => a.seconds[q.qualDist] - b.seconds[q.qualDist]);
    const kTop8 = new Set(klassRanked.slice(0, 8).map(a => a.name)), dTop8 = new Set(distRanked.slice(0, 8).map(a => a.name));
    const qualified = [];
    for (const n of [...kTop8].filter(n => dTop8.has(n))) qualified.push({ name: n, via: "Klass + Afstand" });
    const klassOnly = [...kTop8].filter(n => !dTop8.has(n)), distOnly = [...dTop8].filter(n => !kTop8.has(n));
    for (const n of distOnly.slice(0, klassOnly.length)) qualified.push({ name: n, via: "Via afstand" });
    if (!qualified.length && !klassRanked.length) { html += `<div style="margin-bottom:20px"><div style="font-size:14px;font-weight:700;color:var(--accent)">${gLabel} — ${finalDist?.label ?? ""}</div><div class="info-box">Nog geen resultaten.</div></div>`; continue; }
    const qRows = qualified.map((q2, i) => { const a = klassRanked.find(x => x.name === q2.name); return `<tr><td><strong>${i + 1}</strong></td><td>${esc(q2.name)}</td><td class="mono">${a?.kSum != null ? a.kSum.toFixed(3) : "—"}</td><td><span style="font-size:11px;padding:2px 8px;border-radius:4px;background:rgba(52,211,153,.12);color:var(--green)">${q2.via}</span></td></tr>`; }).join("");
    html += `<div style="margin-bottom:24px"><div style="font-size:14px;font-weight:700;color:var(--accent);margin-bottom:4px">${gLabel} — ${finalDist?.label ?? ""}</div><div style="font-size:11px;color:var(--text-dim);margin-bottom:8px">${mode}</div><div class="table-wrap"><table class="table"><thead><tr><th>#</th><th>Naam</th><th>Punten</th><th>Kwalificatie</th></tr></thead><tbody>${qRows}</tbody></table></div></div>`;
  }
  el.contentArea.innerHTML = html;
}

// ── ATHLETE POPUP ───────────────────────────────────────
function openPopup(name) {
  if (!standings) return;
  const a = standings.all.find(x => x.name === name); if (!a) return;
  const dists = getDists();
  const rowed = dists.filter(d => a.times[d.key]);
  let html = `<div class="panel"><div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:14px"><div><div style="font-size:18px;font-weight:800">${esc(name)}</div><div style="font-size:12px;color:var(--text-dim)">${esc(a.cat)} · ${esc(a.qual)}</div></div><button id="closePopup" style="background:none;border:none;color:var(--text-dim);font-size:20px;cursor:pointer">✕</button></div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:14px">
      <div style="background:var(--surface-2);padding:10px;border-radius:var(--radius);text-align:center"><div style="font-size:10px;color:var(--text-muted)">Klassement</div><div style="font-size:20px;font-weight:800">#${a.rank ?? "—"}</div></div>
      <div style="background:var(--surface-2);padding:10px;border-radius:var(--radius);text-align:center"><div style="font-size:10px;color:var(--text-muted)">Punten</div><div style="font-size:20px;font-weight:800">${fmtPts(a.currentPoints)}</div></div>
      <div style="background:var(--surface-2);padding:10px;border-radius:var(--radius);text-align:center"><div style="font-size:10px;color:var(--text-muted)">Afstanden</div><div style="font-size:20px;font-weight:800">${a.completedCount}/${dists.length}</div></div>
    </div>`;
  if (rowed.length) {
    html += `<div class="table-wrap"><table class="table"><thead><tr><th>Afstand</th><th>Tijd</th><th>Pos</th><th>Punten</th></tr></thead><tbody>${rowed.map(d => {
      const dr = a.distRanks[d.key]; return `<tr class="${podCls(dr)}"><td>${esc(d.label)}</td><td class="mono">${fmtTime(a.seconds[d.key])}</td><td>${dr ? `${dr} ${medal(dr)}` : "—"}</td><td class="mono">${fmtPts(a.points[d.key])}</td></tr>`;
    }).join("")}</tbody></table></div>`;
  }
  html += `</div>`;
  el.overlay.innerHTML = html; el.overlay.hidden = false;
  document.getElementById("closePopup")?.addEventListener("click", () => { el.overlay.hidden = true; });
}

// ── EVENTS ──────────────────────────────────────────────
function bindEvents() {
  el.genderTabs?.addEventListener("click", async e => {
    const b = e.target.closest(".tab"); if (!b?.dataset.gender) return;
    state.gender = b.dataset.gender;
    render(); // Instant render with cached data
    if (!dataCache[state.gender]) {
      await fetchGender(state.gender);
      render();
    }
  });
  el.navButtons?.addEventListener("click", e => {
    const b = e.target.closest(".nav-btn"); if (!b?.dataset.view) return;
    state.view = b.dataset.view; render();
  });
  document.addEventListener("click", e => { const a = e.target.closest(".athlete"); if (a?.dataset.name) openPopup(a.dataset.name); });
  el.overlay?.addEventListener("click", e => { if (e.target === el.overlay) el.overlay.hidden = true; });
  document.addEventListener("keydown", e => { if (e.key === "Escape") el.overlay.hidden = true; });
  el.debugBtn?.addEventListener("click", () => {
    const d = getDists(); const ld = getLiveData();
    alert(`${state.gender}: ${d.map(x => `${x.label}: ${(ld[x.key]??[]).length}`).join(", ")}\nLaatst: ${lastFetch[state.gender]?.toLocaleTimeString("nl-NL") ?? "—"}\nCache: v=${dataCache.v ? "✅" : "—"} m=${dataCache.m ? "✅" : "—"}`);
  });
}

// ── POLL ────────────────────────────────────────────────
let pollTimer = null;
function startPoll() {
  if (pollTimer) clearInterval(pollTimer);
  pollTimer = setInterval(async () => {
    try { await fetchGender(state.gender); render(); } catch (e) { console.warn("[NK] poll:", e); }
  }, POLL_MS);
}

// ── BOOT ────────────────────────────────────────────────
async function boot() {
  try {
    cacheEls(); loadInactive(); bindEvents();
    render();
    await fetchGender(state.gender);
    render();
    console.log("[NK] Live ✅");
    startPoll();
  } catch (e) {
    console.error("[NK] Boot:", e);
    if (el.contentArea) el.contentArea.innerHTML = `<div style="color:var(--red);padding:20px;font-family:var(--font-mono)"><h3>⚠️ Error</h3><pre>${e.message}\n${e.stack}</pre></div>`;
  }
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
