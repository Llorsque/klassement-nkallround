"use strict";
// ════════════════════════════════════════════════════════
// NK Allround 2026 — Step 1: Foundation
// ════════════════════════════════════════════════════════

// ── CONFIG ──────────────────────────────────────────────
const EVENT_ID = "2026_NED_0004";
const API = "https://live-api.schaatsen.nl";

const DISTANCES = {
  v: [
    { key: "d1_500",  label: "500m",    meters: 500,   divisor: 1  },
    { key: "d1_3000", label: "3000m",   meters: 3000,  divisor: 6  },
    { key: "d1_1500", label: "1500m",   meters: 1500,  divisor: 3  },
    { key: "d1_5000", label: "5000m",   meters: 5000,  divisor: 10 },
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

// ── PARTICIPANTS ────────────────────────────────────────
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
    .replace(/[\u2018\u2019\u201A\u201B`\u00B4\u2032\u02BC\u02BB\u2060']/g, "'")
    .replace(/[\u2010-\u2015]/g, "-")
    .replace(/\s+/g, " ")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function lev(a, b) {
  const m = a.length, n = b.length;
  const d = Array.from({ length: m + 1 }, (_, i) => {
    const r = new Array(n + 1); r[0] = i; return r;
  });
  for (let j = 1; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      d[i][j] = Math.min(d[i-1][j]+1, d[i][j-1]+1, d[i-1][j-1]+(a[i-1]!==b[j-1]?1:0));
  return d[m][n];
}

function esc(s) {
  return String(s ?? "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ── STATE ───────────────────────────────────────────────
const state = {
  gender: "v",
  view: "klassement",
  distKey: null,
};

function getDists() { return DISTANCES[state.gender]; }
function getComps() { return COMP_IDS[state.gender]; }
function getParticipants() { return PARTICIPANTS[state.gender]; }

// ── FETCH ───────────────────────────────────────────────
const CACHE = {};
const CACHE_TTL = 10_000;
const fetchLog = []; // { compId, proxy, status, size, ms }

function tFetch(url, ms) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  return fetch(url, { signal: ctrl.signal }).finally(() => clearTimeout(t));
}

function isValidData(d) {
  if (Array.isArray(d) && d.length > 0) return true;
  if (d && typeof d === "object") {
    const r = d.results ?? d.Results ?? d.competitors ?? d.Competitors ?? d.data?.results;
    if (Array.isArray(r)) return true;
  }
  return false;
}

async function fetchComp(compId) {
  const k = `${EVENT_ID}_${compId}`;
  const c = CACHE[k];
  if (c && Date.now() - c.ts < CACHE_TTL) return c.data;

  const url = `${API}/events/${EVENT_ID}/competitions/${compId}/results/?inSeconds=1`;
  const t0 = Date.now();

  const proxies = [
    { name: "corsproxy", url: `https://corsproxy.io/?${encodeURIComponent(url)}` },
    { name: "allorigins", url: `https://api.allorigins.win/get?url=${encodeURIComponent(url)}` },
    { name: "codetabs", url: `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}` },
  ];

  for (const proxy of proxies) {
    try {
      const r = await tFetch(proxy.url, 8000);
      if (!r.ok) {
        fetchLog.push({ compId, proxy: proxy.name, status: `HTTP ${r.status}`, size: 0, ms: Date.now() - t0 });
        continue;
      }
      const txt = await r.text();
      if (!txt || txt.length < 20) {
        fetchLog.push({ compId, proxy: proxy.name, status: "empty", size: txt?.length ?? 0, ms: Date.now() - t0 });
        continue;
      }

      let d;
      try {
        d = JSON.parse(txt);
        // allorigins wraps response in {"contents":"..."}
        if (d && typeof d.contents === "string") {
          d = JSON.parse(d.contents);
        }
      } catch (_) {
        fetchLog.push({ compId, proxy: proxy.name, status: "not JSON", size: txt.length, ms: Date.now() - t0 });
        continue;
      }

      if (isValidData(d)) {
        CACHE[k] = { data: d, ts: Date.now() };
        fetchLog.push({ compId, proxy: proxy.name, status: "✅", size: txt.length, ms: Date.now() - t0 });
        return d;
      } else {
        fetchLog.push({ compId, proxy: proxy.name, status: "no results", size: txt.length, ms: Date.now() - t0 });
      }
    } catch (e) {
      fetchLog.push({ compId, proxy: proxy.name, status: e.name === "AbortError" ? "timeout" : e.message, size: 0, ms: Date.now() - t0 });
    }
  }
  return null;
}

async function fetchGender(gender) {
  const comps = COMP_IDS[gender];
  const ids = Object.values(comps);
  const missing = ids.filter(c => {
    const k = `${EVENT_ID}_${c}`;
    return !CACHE[k] || Date.now() - CACHE[k].ts >= CACHE_TTL;
  });
  if (!missing.length) return;

  console.log(`[NK] Fetching ${gender} comps [${missing.join(",")}]`);
  for (const c of missing) {
    await fetchComp(c);
    if (missing.indexOf(c) < missing.length - 1) await sleep(400);
  }
  const ok = ids.filter(c => CACHE[`${EVENT_ID}_${c}`]?.data).length;
  console.log(`[NK] ${gender}: ${ok}/${ids.length} cached`);
}

// ── PARSE API ───────────────────────────────────────────
function parseApi(data) {
  if (!data) return [];
  let res = data.results ?? data.Results ?? data.competitors ?? data.Competitors ?? data.data?.results ?? null;
  if (!Array.isArray(res)) { if (Array.isArray(data)) res = data; else return []; }

  return res.map((r, i) => {
    const sk = r.competitor?.skater ?? r.skater ?? null;
    const name = (sk?.firstName && sk?.lastName)
      ? `${sk.firstName} ${sk.lastName}`
      : (sk?.name ?? r.name ?? r.Name ?? `Skater ${i + 1}`);
    const time = r.time ?? r.Time ?? r.result ?? null;

    let status = "OK";
    const st = r.status ?? 0;
    if (typeof st === "number") {
      if (st === 1) status = "DNS";
      else if (st === 2) status = "DNF";
      else if (st === 3) status = "DQ";
      else if (st !== 0 && !time) status = "DNS";
    }
    if (!time && status === "OK") status = "DNS";

    let pb = false;
    const pbf = r.pb ?? r.PB ?? r.personalBest ?? r.isPB ?? null;
    if (pbf === true || pbf === 1) pb = true;
    if (!pb && r.medal && /PB|PR/i.test(String(r.medal))) pb = true;

    return { name: String(name), time: time ? String(time) : null, status, pb };
  });
}

// ── NAME MATCHING ───────────────────────────────────────
function matchName(apiName, participants) {
  const n = norm(apiName);
  // 1. Exact
  const exact = participants.find(p => norm(p.name) === n);
  if (exact) return exact;
  // 2. Levenshtein ≤ 2
  let best = null, bestDist = 999;
  for (const p of participants) {
    const d = lev(n, norm(p.name));
    if (d < bestDist && d <= 2) { bestDist = d; best = p; }
  }
  if (best) return best;
  // 3. Last name match
  const ln = n.split(" ").pop();
  if (ln.length >= 3) {
    const found = participants.find(p => norm(p.name).split(" ").pop() === ln);
    if (found) return found;
  }
  return null;
}

// ── DOM ─────────────────────────────────────────────────
const el = {};
function cacheEls() {
  for (const id of [
    "statusBadge", "statusText", "genderTabs", "navButtons",
    "entryBtn", "debugBtn", "main", "contentArea", "overlay",
  ]) {
    el[id] = document.getElementById(id);
  }
}

function setStatus(src) {
  if (!el.statusBadge) return;
  el.statusBadge.className = `badge badge--${src}`;
  el.statusText.textContent = src === "live" ? "Live" : src === "manual" ? "Handmatig" : "Wachten op data";
}

// ── RENDER: STEP 1 — Data proof ─────────────────────────
function render() {
  // Build nav
  const dists = getDists();
  el.navButtons.innerHTML = [
    { key: "klassement", icon: "📊", label: "Klassement" },
    ...dists.map(d => ({ key: `dist_${d.key}`, icon: "⏱", label: d.label })),
    { key: "h2h", icon: "⚔️", label: "Head to Head" },
    { key: "deelnemers", icon: "👥", label: "Deelnemers" },
    { key: "kwalificatie", icon: "⭐", label: "Kwalificatie" },
  ].map(v => `<button class="nav-btn ${state.view === v.key ? 'active' : ''}" data-view="${v.key}"><span class="nav-btn__icon">${v.icon}</span>${esc(v.label)}</button>`).join("");

  // Gender tabs
  el.genderTabs.querySelectorAll(".tab").forEach(b =>
    b.classList.toggle("active", b.dataset.gender === state.gender));

  // For Step 1: show data fetch status
  renderDataProof();
}

function renderDataProof() {
  const dists = getDists();
  const comps = getComps();
  const parts = getParticipants();

  // Check what data we have
  let totalResults = 0;
  const distStatus = dists.map(d => {
    const compId = comps[d.key];
    const cached = CACHE[`${EVENT_ID}_${compId}`];
    const parsed = cached?.data ? parseApi(cached.data) : [];

    // Match names
    let matched = 0;
    for (const r of parsed) {
      if (r.time && r.status === "OK" && matchName(r.name, parts)) matched++;
    }
    totalResults += matched;

    return {
      label: d.label,
      compId,
      apiCount: parsed.length,
      matched,
      hasTimes: parsed.filter(r => r.time && r.status === "OK").length,
    };
  });

  const dataSource = totalResults > 0 ? "live" : "waiting";
  setStatus(dataSource);

  // Build table
  const rows = distStatus.map(d => `
    <tr>
      <td>C${d.compId}</td>
      <td>${esc(d.label)}</td>
      <td class="mono">${d.apiCount}</td>
      <td class="mono">${d.hasTimes}</td>
      <td class="mono">${d.matched}</td>
      <td>${d.matched > 0 ? '<span style="color:var(--green)">✅</span>' : d.apiCount > 0 ? '<span style="color:var(--orange)">⚠️ namen</span>' : '<span style="color:var(--text-muted)">—</span>'}</td>
    </tr>
  `).join("");

  // Fetch log (last 20 entries)
  const logLines = fetchLog.slice(-20).map(l => {
    const cls = l.status === "✅" ? "ok" : l.status.includes("timeout") ? "warn" : "fail";
    return `<span class="${cls}">C${l.compId} ${l.proxy}: ${l.status} (${l.size}b, ${l.ms}ms)</span>`;
  }).join("\n");

  el.contentArea.innerHTML = `
    <h2 style="font-size:18px;font-weight:800;margin-bottom:4px">${state.gender === "v" ? "♀ Vrouwen" : "♂ Mannen"} — Data Status</h2>
    <p style="font-size:12px;color:var(--text-dim);margin-bottom:16px">${parts.length} deelnemers · ${totalResults} resultaten geladen</p>

    <div class="table-wrap">
      <table class="table">
        <thead><tr><th>Comp</th><th>Afstand</th><th>API</th><th>Tijden</th><th>Match</th><th>Status</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>

    <div style="margin-top:16px">
      <button id="refreshBtn" class="btn btn--primary">🔄 Opnieuw laden</button>
    </div>

    <div class="info-box">
      <strong>Step 1:</strong> Data fetch proof. Als je hier ✅ ziet bij afstanden met resultaten,
      werkt de proxy chain. De getallen tonen: API = totaal in response, Tijden = met geldige tijd,
      Match = succesvol gekoppeld aan deelnemers.
    </div>

    ${logLines ? `<div class="debug-log">${logLines}</div>` : ""}
  `;

  document.getElementById("refreshBtn")?.addEventListener("click", async () => {
    // Clear cache for current gender
    const ids = Object.values(comps);
    for (const c of ids) delete CACHE[`${EVENT_ID}_${c}`];
    fetchLog.length = 0;
    el.contentArea.innerHTML = '<div class="info-box">⏳ Laden...</div>';
    await fetchGender(state.gender);
    render();
  });
}

// ── EVENTS ──────────────────────────────────────────────
function bindEvents() {
  // Gender tabs
  el.genderTabs?.addEventListener("click", async e => {
    const b = e.target.closest(".tab");
    if (!b?.dataset.gender) return;
    state.gender = b.dataset.gender;
    render(); // Show immediately with cached data
    await fetchGender(state.gender);
    render(); // Update with new data
  });

  // Nav buttons
  el.navButtons?.addEventListener("click", e => {
    const b = e.target.closest(".nav-btn");
    if (!b?.dataset.view) return;
    state.view = b.dataset.view;
    render();
  });
}

// ── BOOT ────────────────────────────────────────────────
async function boot() {
  try {
    cacheEls();
    bindEvents();

    // 1. Render immediately (empty state)
    render();
    console.log("[NK] Step 1: rendered (no data)");

    // 2. Fetch data
    await fetchGender(state.gender);

    // 3. Re-render with data
    render();
    console.log("[NK] Step 1: data loaded ✅");

  } catch (e) {
    console.error("[NK] Boot error:", e);
    if (el.contentArea) {
      el.contentArea.innerHTML = `<div style="color:var(--red);padding:20px;font-family:var(--font-mono)">
        <h3>⚠️ Boot Error</h3><pre>${e.message}\n${e.stack}</pre>
      </div>`;
    }
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
