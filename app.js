"use strict";
// ════════════════════════════════════════════════════════
// NK Allround 2026 — Step 1: Foundation + Data Fetch
// Fetch via Jina Reader (r.jina.ai) — proven approach
// ════════════════════════════════════════════════════════

// ── CONFIG ──────────────────────────────────────────────
const EVENT_ID = "2026_NED_0004";
const LIVE_BASE = "https://liveresults.schaatsen.nl/events/" + EVENT_ID + "/competition";

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
    .normalize("NFD").replace(/\p{Diacritic}/gu, "")
    .replace(/[\u2018\u2019\u201A\u201B`\u00B4\u2032\u02BC\u02BB\u2060']/g, "'")
    .replace(/[\u2010-\u2015]/g, "-")
    .replace(/\s+/g, " ").trim();
}

function esc(s) {
  return String(s ?? "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}

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
  const m = Math.floor(sec / 60);
  const s = sec - m * 60;
  const dec = (sec * 1000) % 10 === 0 ? 2 : 3;
  const str = s.toFixed(dec).padStart(dec + 3, "0");
  return m > 0 ? `${m}:${str.replace(".", ",")}` : str;
}

function trunc3(n) { return Math.floor(n * 1000) / 1000; }

// ── STATE ───────────────────────────────────────────────
const state = { gender: "v", view: "status" };
let dataSource = "waiting";
let lastUpdate = null;
let lastFetchResults = {}; // distKey → [{ name, time, seconds }]

function getDists() { return DISTANCES[state.gender]; }
function getComps() { return COMP_IDS[state.gender]; }
function getParts() { return PARTICIPANTS[state.gender]; }

// ── FETCH VIA JINA READER ───────────────────────────────
const fetchLog = [];

async function fetchPageText(compId) {
  const pageUrl = `${LIVE_BASE}/${compId}/results`;
  const cacheBust = Date.now();

  const candidates = [
    { name: "jina", url: `https://r.jina.ai/${pageUrl}?_=${cacheBust}` },
    { name: "allorigins-raw", url: `https://api.allorigins.win/raw?url=${encodeURIComponent(pageUrl)}&cache=${cacheBust}` },
    { name: "allorigins-get", url: `https://api.allorigins.win/get?url=${encodeURIComponent(pageUrl)}&cache=${cacheBust}` },
  ];

  for (const c of candidates) {
    const t0 = Date.now();
    try {
      const res = await fetch(c.url, { cache: "no-store" });
      if (!res.ok) {
        fetchLog.push({ compId, source: c.name, status: `HTTP ${res.status}`, ms: Date.now() - t0 });
        continue;
      }

      let text;
      if (c.name === "allorigins-get") {
        const data = await res.json();
        text = String(data?.contents ?? "");
      } else {
        text = await res.text();
      }

      if (text.length < 100) {
        fetchLog.push({ compId, source: c.name, status: `too short (${text.length}b)`, ms: Date.now() - t0 });
        continue;
      }

      fetchLog.push({ compId, source: c.name, status: "✅", ms: Date.now() - t0 });
      return text;

    } catch (e) {
      fetchLog.push({ compId, source: c.name, status: e.message?.slice(0, 40) ?? "error", ms: Date.now() - t0 });
    }
  }
  return null;
}

/**
 * Extract {name → time} from page text.
 * For each participant, find their name in the text, then look for
 * a time pattern nearby (within 300 chars).
 */
function extractTimes(text, participants) {
  const normText = norm(text);
  const results = new Map();
  const timeRe = /(\d{1,2}:\d{2}[\.,]\d{2,3}|\d{1,3}[\.,]\d{2,3})/g;

  for (const p of participants) {
    const key = norm(p.name);
    if (!key) continue;

    let start = 0;
    while (true) {
      const idx = normText.indexOf(key, start);
      if (idx === -1) break;

      const window = normText.slice(idx, Math.min(normText.length, idx + 300));
      timeRe.lastIndex = 0;
      const m = timeRe.exec(window);

      if (m) {
        const raw = m[1].replace(",", ".");
        const sec = parseTime(raw);
        if (sec != null) {
          results.set(key, raw);
          break;
        }
      }
      start = idx + key.length;
    }
  }
  return results;
}

async function fetchCompResults(compId, participants) {
  const text = await fetchPageText(compId);
  if (!text) return [];

  const timeMap = extractTimes(text, participants);
  const results = [];

  for (const p of participants) {
    const key = norm(p.name);
    const timeStr = timeMap.get(key);
    if (timeStr) {
      const sec = parseTime(timeStr);
      if (sec != null) {
        results.push({ name: p.name, time: timeStr, seconds: sec });
      }
    }
  }
  return results;
}

async function fetchAllDists(gender) {
  const dists = DISTANCES[gender];
  const comps = COMP_IDS[gender];
  const parts = PARTICIPANTS[gender];
  const all = {};

  for (const d of dists) {
    const compId = comps[d.key];
    console.log(`[NK] Fetching C${compId} (${d.label})...`);
    const results = await fetchCompResults(compId, parts);
    all[d.key] = results;
    console.log(`[NK] C${compId} ${d.label}: ${results.length} times`);
    await sleep(500);
  }
  return all;
}

// ── DOM ─────────────────────────────────────────────────
const el = {};
function cacheEls() {
  for (const id of [
    "statusBadge", "statusText", "genderTabs", "navButtons",
    "entryBtn", "debugBtn", "main", "contentArea", "overlay",
  ]) el[id] = document.getElementById(id);
}

function setStatus(src) {
  dataSource = src;
  if (!el.statusBadge) return;
  el.statusBadge.className = `badge badge--${src}`;
  el.statusText.textContent = src === "live" ? "Live" : src === "manual" ? "Handmatig" : "Wachten op data";
}

// ── RENDER ──────────────────────────────────────────────
function renderNav() {
  const dists = getDists();
  const views = [
    { key: "status", icon: "📡", label: "Data Status" },
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

function render() {
  renderNav();
  el.genderTabs.querySelectorAll(".tab").forEach(b =>
    b.classList.toggle("active", b.dataset.gender === state.gender));
  renderStatus();
}

function renderStatus() {
  const dists = getDists();
  const comps = getComps();
  const parts = getParts();

  let totalMatched = 0;
  const distRows = dists.map(d => {
    const compId = comps[d.key];
    const results = lastFetchResults[d.key] ?? [];
    totalMatched += results.length;
    const preview = results.slice(0, 3).map(r =>
      `${esc(r.name.split(" ").pop())} ${r.time}`
    ).join(" · ") || "—";

    return `<tr>
      <td>C${compId}</td>
      <td>${esc(d.label)}</td>
      <td class="mono">${results.length}/${parts.length}</td>
      <td>${results.length > 0 ? '<span style="color:var(--green)">✅</span>' : '<span style="color:var(--text-muted)">—</span>'}</td>
      <td class="mono" style="font-size:11px;color:var(--text-dim)">${preview}</td>
    </tr>`;
  }).join("");

  if (totalMatched > 0) setStatus("live");

  const logLines = fetchLog.slice(-16).map(l => {
    const cls = l.status === "✅" ? "ok" : l.status.startsWith("HTTP") ? "fail" : "warn";
    return `<span class="${cls}">C${l.compId} ${l.source}: ${l.status} (${l.ms}ms)</span>`;
  }).join("\n");

  el.contentArea.innerHTML = `
    <h2 style="font-size:18px;font-weight:800;margin-bottom:4px">${state.gender === "v" ? "♀ Vrouwen" : "♂ Mannen"} — Data Status</h2>
    <p style="font-size:12px;color:var(--text-dim);margin-bottom:16px">
      ${parts.length} deelnemers · ${totalMatched} tijden geladen
      ${lastUpdate ? ` · ${lastUpdate.toLocaleTimeString("nl-NL")}` : ""}
    </p>

    <div class="table-wrap">
      <table class="table">
        <thead><tr><th>Comp</th><th>Afstand</th><th>Match</th><th>Status</th><th>Preview (top 3)</th></tr></thead>
        <tbody>${distRows}</tbody>
      </table>
    </div>

    <div style="margin-top:16px;display:flex;gap:8px">
      <button id="refreshBtn" class="btn btn--primary">🔄 Opnieuw laden</button>
    </div>

    <div class="info-box" style="margin-top:16px">
      <strong>Stap 1 — Data proof.</strong> Fetch via Jina Reader → liveresults.schaatsen.nl.<br>
      Als je ✅ ziet en tijden in de preview, werkt de data pipeline. Dan gaan we door naar de modules.
    </div>

    ${logLines ? `<div class="debug-log">${logLines}</div>` : ""}
  `;

  document.getElementById("refreshBtn")?.addEventListener("click", async () => {
    el.contentArea.innerHTML = '<div class="info-box">⏳ Data ophalen via Jina Reader...</div>';
    fetchLog.length = 0;
    lastFetchResults = await fetchAllDists(state.gender);
    lastUpdate = new Date();
    render();
  });
}

// ── EVENTS ──────────────────────────────────────────────
function bindEvents() {
  el.genderTabs?.addEventListener("click", async e => {
    const b = e.target.closest(".tab");
    if (!b?.dataset.gender) return;
    state.gender = b.dataset.gender;
    lastFetchResults = {};
    render();
    el.contentArea.innerHTML = '<div class="info-box">⏳ Data ophalen...</div>';
    lastFetchResults = await fetchAllDists(state.gender);
    lastUpdate = new Date();
    render();
  });

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
    render();
    console.log("[NK] Rendered (waiting for data)");

    lastFetchResults = await fetchAllDists(state.gender);
    lastUpdate = new Date();
    render();
    console.log("[NK] Data loaded ✅");
  } catch (e) {
    console.error("[NK] Boot error:", e);
    if (el.contentArea) {
      el.contentArea.innerHTML = `<div style="color:var(--red);padding:20px;font-family:var(--font-mono)">
        <h3>⚠️ Boot Error</h3><pre>${e.message}\n${e.stack}</pre>
      </div>`;
    }
  }
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
else boot();
