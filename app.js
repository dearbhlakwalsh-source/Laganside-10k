// ============================================
// STATE (localStorage-backed)
// ============================================
const STORE_KEY = "sub50_app_state_v1";

function loadState() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return { checks: {}, pain: {}, raceDate: CONFIG.raceDate };
}
function saveState() {
  localStorage.setItem(STORE_KEY, JSON.stringify(state));
}
let state = loadState();

// ============================================
// UTILS
// ============================================
function todayISO() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}
function fmtDateLong(iso) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
}
function fmtDateShort(iso) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}
function daysUntil(iso) {
  const today = new Date(todayISO() + "T00:00:00");
  const target = new Date(iso + "T00:00:00");
  return Math.round((target - today) / 86400000);
}
function checkKey(dateISO, sessionIdx, itemIdx) {
  return `${dateISO}__${sessionIdx}__${itemIdx}`;
}
function isChecked(dateISO, sessionIdx, itemIdx) {
  return !!state.checks[checkKey(dateISO, sessionIdx, itemIdx)];
}
function toggleCheck(dateISO, sessionIdx, itemIdx) {
  const k = checkKey(dateISO, sessionIdx, itemIdx);
  state.checks[k] = !state.checks[k];
  saveState();
}
function getPain(dateISO) {
  return state.pain[dateISO] || { knee: null, achilles: null };
}
function setPain(dateISO, field, value) {
  if (!state.pain[dateISO]) state.pain[dateISO] = { knee: null, achilles: null };
  state.pain[dateISO][field] = value;
  saveState();
}

function typeIcon(type) {
  switch (type) {
    case "run": return "ti-run";
    case "quality": return "ti-flame";
    case "strength": return "ti-barbell";
    case "rehab": return "ti-first-aid-kit";
    case "rest": return "ti-moon";
    case "race": return "ti-flag-3";
    case "skipped": return "ti-x";
    default: return "ti-point";
  }
}
function typeLabel(type) {
  switch (type) {
    case "run": return "Run";
    case "quality": return "Quality";
    case "strength": return "Strength";
    case "rehab": return "Rehab";
    case "rest": return "Rest";
    case "race": return "Race";
    case "skipped": return "Skipped";
    default: return type;
  }
}

// ============================================
// SESSION RENDERING (shared between Today + Week)
// ============================================
function resolveSessionItems(session) {
  if (session.lib && STRENGTH_LIBRARY[session.lib]) {
    return STRENGTH_LIBRARY[session.lib].exercises.map(e => ({ name: e.name, detail: e.detail }));
  }
  return session.items || [];
}

function renderSessionBlock(session, dateISO, sessionIdx) {
  const items = resolveSessionItems(session);
  const itemsHtml = items.map((item, itemIdx) => {
    const checked = isChecked(dateISO, sessionIdx, itemIdx);
    return `
      <div class="exercise-row">
        <div>
          <div class="exercise-name">${item.name}</div>
          <div class="exercise-detail">${item.detail}</div>
        </div>
        <button class="exercise-check ${checked ? 'checked' : ''}" data-check="${checkKey(dateISO, sessionIdx, itemIdx)}" aria-label="Mark done">
          ${checked ? '<i class="ti ti-check"></i>' : ''}
        </button>
      </div>
    `;
  }).join("");

  const noteHtml = session.note ? `
    <div class="note-callout ${session.warn ? 'warn' : ''}">
      <i class="ti ${session.warn ? 'ti-alert-triangle' : 'ti-info-circle'}"></i>
      <span>${session.note}</span>
    </div>
  ` : "";

  const fuelKey = session.type === "quality" ? "quality" : (session.type === "run" && /long/i.test(session.title) ? "long" : (session.type === "strength" ? "strength" : (session.type === "run" ? "run" : null)));
  const fuel = fuelKey ? FUEL_NOTES[fuelKey] : null;
  const fuelHtml = fuel ? `
    <div class="fuel-card">
      <i class="ti ti-bolt"></i>
      <div>
        <div class="fuel-card-title">${fuel.title}</div>
        <div class="fuel-card-detail">${fuel.detail}</div>
      </div>
    </div>
  ` : "";

  return `
    <div class="day-block">
      <div class="day-block-head">
        <span class="tag tag-${session.type}"><i class="ti ${typeIcon(session.type)}"></i> ${session.tag}</span>
      </div>
      <div class="day-block-title" style="margin-bottom:8px;">${session.title}</div>
      ${items.length ? `<div>${itemsHtml}</div>` : ""}
      ${noteHtml}
      ${fuelHtml}
    </div>
  `;
}

function renderDailyRehabCard(dateISO) {
  const items = DAILY_REHAB.map((ex, idx) => {
    const checked = isChecked(dateISO, "daily", idx);
    return `
      <div class="exercise-row">
        <div>
          <div class="exercise-name">${ex.name}</div>
          <div class="exercise-detail">${ex.detail}</div>
        </div>
        <button class="exercise-check ${checked ? 'checked' : ''}" data-check="${checkKey(dateISO, 'daily', idx)}" aria-label="Mark done">
          ${checked ? '<i class="ti ti-check"></i>' : ''}
        </button>
      </div>
    `;
  }).join("");

  return `
    <div class="card">
      <div class="day-block-head">
        <span class="tag tag-rehab"><i class="ti ti-first-aid-kit"></i> Daily</span>
      </div>
      <div class="day-block-title" style="margin-bottom:4px;">Knee & Achilles maintenance</div>
      <div class="page-sub" style="margin-bottom:6px;">5 minutes, any time of day</div>
      ${items}
    </div>
  `;
}

// ============================================
// TAB: TODAY
// ============================================
function renderToday() {
  const iso = todayISO();
  let day = findDayByDate(iso);
  let isPreview = false;

  if (!day) {
    // Find the next upcoming day in the plan
    const upcoming = ALL_DAYS.filter(d => d.date > iso).sort((a,b) => a.date.localeCompare(b.date));
    if (upcoming.length) {
      day = upcoming[0];
      isPreview = true;
    }
  }

  if (!day) {
    return `
      <h1 class="page-title">Today</h1>
      <p class="page-sub">${fmtDateLong(iso)}</p>
      <div class="empty-state">
        <i class="ti ti-calendar-off"></i>
        <p>No plan loaded for today yet.<br>Check the Plan tab, or share this week's Runna sessions to add it.</p>
      </div>
      ${renderDailyRehabCard(iso)}
    `;
  }

  const primarySession = day.sessions.find(s => s.type !== "skipped") || day.sessions[0];
  const heroType = primarySession.type === "quality" ? "quality" : (primarySession.type === "rest" ? "rest" : "run");

  const sessionsHtml = day.sessions.map((s, idx) => renderSessionBlock(s, day.date, idx)).join("");

  return `
    ${isPreview ? `<div class="note-callout" style="margin-bottom:14px;"><i class="ti ti-clock"></i><span>Nothing scheduled today — here's your next session, on ${fmtDateLong(day.date)}.</span></div>` : ""}
    <div class="hero-card type-${heroType}">
      <span class="hero-tag type-${heroType}"><i class="ti ${typeIcon(primarySession.type)}"></i> ${typeLabel(primarySession.type)}</span>
      <div class="hero-title">${primarySession.title}</div>
      <div class="hero-meta">${fmtDateLong(day.date)} · Week ${day.weekNum}</div>
    </div>

    <div class="section-label">${isPreview ? "Upcoming session" : "Today's sessions"}</div>
    <div class="card">${sessionsHtml}</div>

    <div class="section-label">Daily rehab</div>
    ${renderDailyRehabCard(iso)}
  `;
}

// ============================================
// TAB: WEEK
// ============================================
function renderWeek() {
  const iso = todayISO();
  const currentWeek = PLAN.find(w => w.days.some(d => d.date === iso)) || PLAN[0];

  const daysHtml = currentWeek.days.map(day => {
    const isToday = day.date === iso;
    const tags = day.sessions.filter(s => s.type !== "skipped").map(s =>
      `<span class="tag tag-${s.type}">${typeLabel(s.type)}</span>`
    ).join("");
    const sessionsHtml = day.sessions.map((s, idx) => renderSessionBlock(s, day.date, idx)).join("");

    return `
      <div class="day-card">
        <div class="day-header ${isToday ? 'today' : ''}" data-toggle-day="${day.date}">
          <span class="day-name">${day.day}</span>
          <span class="day-date">${fmtDateShort(day.date)}</span>
          <div class="day-header-tags">${tags}</div>
          <i class="ti ti-chevron-down day-chevron" id="chev-${day.date}"></i>
        </div>
        <div class="day-body ${isToday ? 'open' : ''}" id="body-${day.date}">
          ${sessionsHtml}
        </div>
      </div>
    `;
  }).join("");

  return `
    <h1 class="page-title">Week ${currentWeek.weekNum}</h1>
    <p class="page-sub">${currentWeek.dateRange}</p>
    ${daysHtml}
  `;
}

// ============================================
// TAB: PLAN (full multi-week archive)
// ============================================
function renderPlan() {
  const iso = todayISO();
  const phasesHtml = PLAN.map((week, wi) => {
    const isCurrent = week.days.some(d => d.date === iso);
    const daysHtml = week.days.map(day => {
      const tags = day.sessions.filter(s => s.type !== "skipped").map(s =>
        `<span class="tag tag-${s.type}">${typeLabel(s.type)}</span>`
      ).join("");
      const sessionsHtml = day.sessions.map((s, idx) => renderSessionBlock(s, day.date, idx)).join("");
      return `
        <div class="week-card">
          <div class="week-card-header" data-toggle-plan-day="${week.weekNum}-${day.date}">
            <span class="day-name" style="font-size:13px;">${day.day}</span>
            <span class="week-card-dates">${fmtDateShort(day.date)}</span>
            <div class="day-header-tags">${tags}</div>
            <i class="ti ti-chevron-down day-chevron" id="pchev-${week.weekNum}-${day.date}"></i>
          </div>
          <div class="week-card-body" id="pbody-${week.weekNum}-${day.date}">
            ${sessionsHtml}
          </div>
        </div>
      `;
    }).join("");

    return `
      <div class="phase-card">
        <div class="phase-header" data-toggle-phase="${week.weekNum}">
          <div style="flex:1;">
            <div class="phase-title">Week ${week.weekNum}</div>
            <div class="phase-meta">${week.dateRange}${isCurrent ? ' · current week' : ''}</div>
          </div>
          <i class="ti ti-chevron-down day-chevron" id="phasechev-${week.weekNum}"></i>
        </div>
        <div class="phase-weeks ${isCurrent ? 'open' : ''}" id="phasebody-${week.weekNum}">
          ${daysHtml}
        </div>
      </div>
    `;
  }).join("");

  return `
    <h1 class="page-title">Full plan</h1>
    <p class="page-sub">Weeks 14–17 · Runna runs stay as written, gym sessions replaced with rehab-focused strength work</p>
    ${phasesHtml}
  `;
}

// ============================================
// TAB: REHAB (reference library)
// ============================================
function renderRehab() {
  const knee = REHAB_LIBRARY.knee;
  const achilles = REHAB_LIBRARY.achilles;

  function libCard(lib) {
    const exHtml = lib.exercises.map(e => `
      <div class="exercise-row">
        <div>
          <div class="exercise-name">${e.name}</div>
          <div class="exercise-detail">${e.detail}</div>
          ${e.note ? `<div class="exercise-detail" style="margin-top:3px;font-style:italic;">${e.note}</div>` : ""}
        </div>
      </div>
    `).join("");
    return `
      <div class="card">
        <div class="phase-title" style="margin-bottom:8px;">${lib.label}</div>
        <p class="page-sub" style="margin-bottom:10px;">${lib.summary}</p>
        ${exHtml}
        <div class="note-callout warn" style="margin-top:14px;">
          <i class="ti ti-stethoscope"></i>
          <span>${lib.redFlags}</span>
        </div>
      </div>
    `;
  }

  return `
    <h1 class="page-title">Rehab library</h1>
    <p class="page-sub">Reference exercises for your current niggles. Daily basics live on the Today tab — this is the full detail.</p>
    <div class="section-label">Knee</div>
    ${libCard(knee)}
    <div class="section-label">Achilles</div>
    ${libCard(achilles)}
  `;
}

// ============================================
// TAB: STRENGTH (reference library)
// ============================================
function renderStrength() {
  function libCard(lib) {
    const exHtml = lib.exercises.map(e => `
      <div class="exercise-row">
        <div>
          <div class="exercise-name">${e.name}</div>
          <div class="exercise-detail">${e.detail}</div>
          ${e.note ? `<div class="exercise-detail" style="margin-top:3px;font-style:italic;">${e.note}</div>` : ""}
        </div>
      </div>
    `).join("");
    return `
      <div class="card">
        <div class="phase-title" style="margin-bottom:6px;">${lib.label}</div>
        <p class="page-sub" style="margin-bottom:10px;">${lib.purpose}</p>
        ${exHtml}
      </div>
    `;
  }

  return `
    <h1 class="page-title">Strength library</h1>
    <p class="page-sub">Performance and injury-prevention focused — not weight loss. Two sessions a week, plus a rehab-only option when there's no run that day.</p>
    <div class="section-label">Gym sessions</div>
    ${libCard(STRENGTH_LIBRARY.gymA)}
    ${libCard(STRENGTH_LIBRARY.gymB)}
    <div class="section-label">No-run-day alternative</div>
    ${libCard(STRENGTH_LIBRARY.rehabFocus)}
  `;
}

// ============================================
// TAB: PROGRESS
// ============================================
function renderProgress() {
  const iso = todayISO();
  const pain = getPain(iso);
  const days = daysUntil(state.raceDate || CONFIG.raceDate);

  // Build last 14 days for trend chart
  const trendDays = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dISO = d.toISOString().slice(0, 10);
    trendDays.push(dISO);
  }

  function trendChart(field, label) {
    const bars = trendDays.map(d => {
      const p = state.pain[d] ? state.pain[d][field] : null;
      const val = p === null || p === undefined ? 0 : p;
      const heightPct = p === null || p === undefined ? 4 : Math.max(8, (val / 10) * 100);
      const cls = p === null || p === undefined ? "" : `pain-${val}`;
      const dayNum = new Date(d + "T00:00:00").getDate();
      return `
        <div class="trend-bar-wrap">
          <div class="trend-bar ${cls}" style="height:${heightPct}%;" title="${val}"></div>
          <div class="trend-bar-day">${dayNum}</div>
        </div>
      `;
    }).join("");
    return `
      <div class="card">
        <div class="phase-title" style="font-size:13px;margin-bottom:2px;">${label}</div>
        <div class="trend-chart">${bars}</div>
        <div class="trend-legend">
          <div class="trend-legend-item"><span class="trend-dot" style="background:var(--signal-rehab);"></span>0–2 mild</div>
          <div class="trend-legend-item"><span class="trend-dot" style="background:var(--signal-race);"></span>3–5 moderate</div>
          <div class="trend-legend-item"><span class="trend-dot" style="background:var(--signal-quality);"></span>6+ sharp</div>
        </div>
      </div>
    `;
  }

  function painScale(field, currentVal) {
    const btns = Array.from({ length: 11 }, (_, i) => i).map(i => `
      <button class="painscale-btn ${currentVal === i ? 'selected' : ''}" data-pain="${field}" data-val="${i}">${i}</button>
    `).join("");
    return `
      <div class="pain-row">
        <div class="pain-row-label">
          <span>${field === 'knee' ? 'Right knee' : 'Right Achilles'}</span>
          <span class="val">${currentVal === null || currentVal === undefined ? '—' : currentVal + '/10'}</span>
        </div>
        <div class="painscale">${btns}</div>
      </div>
    `;
  }

  return `
    <h1 class="page-title">Progress</h1>
    <p class="page-sub">${fmtDateLong(iso)}</p>

    <div class="stat-grid">
      <div class="stat-box">
        <div class="num">${days}</div>
        <div class="lbl">Days to race</div>
      </div>
      <div class="stat-box">
        <div class="num">${CONFIG.goalTime}</div>
        <div class="lbl">Goal time</div>
      </div>
      <div class="stat-box">
        <div class="num">${CONFIG.goalPace}</div>
        <div class="lbl">Goal pace</div>
      </div>
    </div>

    <div class="section-label">Today's check-in</div>
    <div class="card">
      <p class="page-sub" style="margin-bottom:4px;">0 = no pain, 10 = worst pain. Be honest — this is just for you.</p>
      ${painScale('knee', pain.knee)}
      ${painScale('achilles', pain.achilles)}
    </div>

    <div class="section-label">14-day trend</div>
    ${trendChart('knee', 'Right knee')}
    ${trendChart('achilles', 'Right Achilles')}
  `;
}

// ============================================
// ROUTING
// ============================================
const RENDERERS = {
  today: renderToday,
  week: renderWeek,
  plan: renderPlan,
  rehab: renderRehab,
  strength: renderStrength,
  progress: renderProgress,
};

let currentTab = "today";

function renderTab(tab) {
  currentTab = tab;
  const main = document.getElementById("main-content");
  main.innerHTML = RENDERERS[tab]();
  attachContentListeners();
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.tab === tab);
  });
  window.scrollTo(0, 0);
}

function attachContentListeners() {
  // Exercise checkboxes
  document.querySelectorAll("[data-check]").forEach(btn => {
    btn.addEventListener("click", () => {
      const [dateISO, sessionIdx, itemIdx] = btn.dataset.check.split("__");
      toggleCheck(dateISO, sessionIdx, itemIdx);
      renderTab(currentTab);
    });
  });

  // Day accordion toggles (Week tab)
  document.querySelectorAll("[data-toggle-day]").forEach(header => {
    header.addEventListener("click", () => {
      const date = header.dataset.toggleDay;
      const body = document.getElementById(`body-${date}`);
      const chev = document.getElementById(`chev-${date}`);
      body.classList.toggle("open");
      chev.classList.toggle("open");
    });
  });

  // Plan tab: phase (week) toggles
  document.querySelectorAll("[data-toggle-phase]").forEach(header => {
    header.addEventListener("click", () => {
      const wk = header.dataset.togglePhase;
      const body = document.getElementById(`phasebody-${wk}`);
      const chev = document.getElementById(`phasechev-${wk}`);
      body.classList.toggle("open");
      chev.classList.toggle("open");
    });
  });

  // Plan tab: individual day toggles within a week
  document.querySelectorAll("[data-toggle-plan-day]").forEach(header => {
    header.addEventListener("click", (e) => {
      e.stopPropagation();
      const key = header.dataset.togglePlanDay;
      const body = document.getElementById(`pbody-${key}`);
      const chev = document.getElementById(`pchev-${key}`);
      body.classList.toggle("open");
      chev.classList.toggle("open");
    });
  });

  // Pain scale buttons
  document.querySelectorAll("[data-pain]").forEach(btn => {
    btn.addEventListener("click", () => {
      const field = btn.dataset.pain;
      const val = parseInt(btn.dataset.val, 10);
      setPain(todayISO(), field, val);
      renderTab(currentTab);
    });
  });
}

// ============================================
// SETTINGS MODAL
// ============================================
function renderSettingsModal() {
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  overlay.innerHTML = `
    <div class="modal-sheet">
      <div class="modal-handle"></div>
      <div class="modal-title">Settings</div>
      <div class="settings-row">
        <label>Race date</label>
        <input type="date" id="race-date-input" value="${state.raceDate || CONFIG.raceDate}">
      </div>
      <div class="settings-row" style="border-bottom:none;">
        <label>Reset all check-ins & pain data</label>
        <button class="btn btn-sm" id="reset-data-btn">Reset</button>
      </div>
      <button class="btn btn-primary btn-block" id="close-settings-btn" style="margin-top:18px;">Done</button>
    </div>
  `;
  document.body.appendChild(overlay);

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) document.body.removeChild(overlay);
  });
  document.getElementById("close-settings-btn").addEventListener("click", () => {
    document.body.removeChild(overlay);
  });
  document.getElementById("race-date-input").addEventListener("change", (e) => {
    state.raceDate = e.target.value;
    saveState();
    updateRaceCountdown();
  });
  document.getElementById("reset-data-btn").addEventListener("click", () => {
    if (confirm("Reset all check-ins and pain check-in history? This can't be undone.")) {
      state.checks = {};
      state.pain = {};
      saveState();
      document.body.removeChild(overlay);
      renderTab(currentTab);
    }
  });
}

// ============================================
// RACE COUNTDOWN (topbar)
// ============================================
function updateRaceCountdown() {
  const raceDate = state.raceDate || CONFIG.raceDate;
  const days = daysUntil(raceDate);
  const el = document.getElementById("race-countdown");
  if (days > 0) {
    el.textContent = `${days} days to race day`;
  } else if (days === 0) {
    el.textContent = `Race day`;
  } else {
    el.textContent = `Race complete`;
  }
}

// ============================================
// INIT
// ============================================
document.addEventListener("DOMContentLoaded", () => {
  updateRaceCountdown();
  renderTab("today");

  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => renderTab(btn.dataset.tab));
  });

  document.getElementById("settings-btn").addEventListener("click", renderSettingsModal);
});
