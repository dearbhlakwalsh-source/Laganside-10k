// ============================================
// CONFIG
// ============================================
const CONFIG = {
  raceDate: "2026-09-06",
  raceName: "Sub-50 10K",
  goalTime: "49:00",
  goalPace: "7:53/mi",
};

// ============================================
// DAILY REHAB (every single day, regardless of session)
// ============================================
const DAILY_REHAB = [
  {
    id: "d1",
    name: "Isometric wall sit",
    detail: "3 × 30–45s hold, mid-range angle (~60° knee bend)",
    note: "Stop if sharp pain — dull ache is fine.",
    target: "knee"
  },
  {
    id: "d2",
    name: "Straight-leg calf raise",
    detail: "3 × 12–15, slow 3-second lower",
    note: "Do after morning stiffness has eased, not first thing out of bed.",
    target: "achilles"
  },
  {
    id: "d3",
    name: "Bent-knee calf raise",
    detail: "3 × 12–15, slow 3-second lower",
    note: "Targets soleus — complements the straight-leg version.",
    target: "achilles"
  }
];

// ============================================
// REHAB EXERCISE LIBRARY (reference tab)
// ============================================
const REHAB_LIBRARY = {
  knee: {
    label: "Knee — patellofemoral pain",
    summary: "Sharp pain worse on downhills, constant low-level niggle. This pattern usually means the kneecap is tracking slightly off-centre under load. The fix is hip/glute strength plus pain-relieving isometric work — not rest alone.",
    exercises: [
      { name: "Isometric wall sit", detail: "3 × 30–45s, ~60° knee bend", note: "Do daily. Reduces pain via isometric loading — research-backed for patellofemoral pain." },
      { name: "Single-leg balance", detail: "3 × 30s each leg, eyes open then closed", note: "Restores proprioception/control around the knee joint." },
      { name: "Controlled step-down", detail: "3 × 8 each leg, low step, slow descent", note: "Directly retrains the movement pattern causing downhill pain." },
      { name: "Single-leg RDL", detail: "3 × 8 each", note: "Builds hip control that prevents knee valgus (inward collapse)." },
      { name: "Clamshell (resistance band)", detail: "3 × 15 each", note: "Glute medius — swap for glute bridge if this irritates the knee." },
      { name: "Lateral band walk", detail: "3 × 12 each direction", note: "Hip abductor strength, low knee stress." },
      { name: "Bulgarian split squat", detail: "3 × 8 each", note: "Swap for rear-foot-flat reverse lunge if sharp pain appears." }
    ],
    redFlags: "See a physio if: pain doesn't trend better after 2 weeks of consistent rehab, pain appears at rest, swelling develops, or the knee gives way."
  },
  achilles: {
    label: "Right Achilles — tendinopathy pattern",
    summary: "Morning stiffness that eases with movement is a classic tendinopathy pattern. Eccentric loading (slow lowering) is the single best-evidenced rehab approach.",
    exercises: [
      { name: "Eccentric calf lower off step", detail: "3 × 10 each leg, slow 4-second lower only", note: "Gold-standard Achilles rehab exercise. Use the other leg to help back up." },
      { name: "Straight-leg calf raise", detail: "3 × 12–15, slow 3-second lower", note: "Targets gastrocnemius." },
      { name: "Bent-knee calf raise", detail: "3 × 12–15, slow 3-second lower", note: "Targets soleus." },
      { name: "Standing Achilles isometric hold", detail: "3 × 30s on tiptoes", note: "Pain-relieving hold, good pre-run primer." },
      { name: "Seated calf raise (machine)", detail: "3 × 15", note: "Loads soleus through a different angle." }
    ],
    redFlags: "See a physio if: pain becomes sharp during running rather than just stiff, you notice swelling or a lump on the tendon, or pain doesn't improve after 2 weeks."
  }
};

// ============================================
// STRENGTH SESSION LIBRARY (reference tab)
// ============================================
const STRENGTH_LIBRARY = {
  gymA: {
    label: "Gym A — glute & hip focus",
    purpose: "Targets the knee issue directly: hip and glute strength controls kneecap tracking.",
    exercises: [
      { name: "Single-leg RDL", detail: "3 × 8 each", note: "Slow and controlled, weight in hand opposite to working leg." },
      { name: "Clamshell (band)", detail: "3 × 15 each", note: "Don't let your pelvis rock." },
      { name: "Lateral band walk", detail: "3 × 12 each way", note: "Small steps, stay low." },
      { name: "Seated calf raise (machine)", detail: "3 × 15", note: "Soleus strength for the Achilles." },
      { name: "Eccentric calf lower off step", detail: "3 × 10 each, slow 4s lower only", note: "Core Achilles rehab movement." },
      { name: "Dead bug", detail: "3 × 8 each side", note: "Low-back-friendly core work." }
    ]
  },
  gymB: {
    label: "Gym B — posterior chain",
    purpose: "Builds the strength base that protects against future injury as mileage increases.",
    exercises: [
      { name: "Bulgarian split squat", detail: "3 × 8 each", note: "Swap for rear-foot-flat reverse lunge if sharp knee pain." },
      { name: "Standing single-leg calf raise", detail: "3 × 15 each, free-standing", note: "Full range." },
      { name: "Eccentric calf lower off step", detail: "3 × 10 each, slow 4s lower only", note: "" },
      { name: "Pallof press", detail: "3 × 10 each side", note: "Rotational core stability." },
      { name: "Back extension", detail: "3 × 10", note: "Lower back strength without compression." }
    ]
  },
  rehabFocus: {
    label: "Rehab focus session",
    purpose: "Used on days with no Runna gym session — keeps rehab progressing without adding fatigue before hard runs.",
    exercises: [
      { name: "Single-leg balance", detail: "3 × 30s each leg, eyes open then closed", note: "" },
      { name: "Controlled step-down", detail: "3 × 8 each, low step, slow and controlled", note: "" },
      { name: "Standing Achilles isometric hold", detail: "3 × 30s on tiptoes", note: "" },
      { name: "Glute bridge (double leg)", detail: "3 × 15", note: "Low-irritation glute work." }
    ]
  }
};

// ============================================
// FUEL NOTES (light touch — performance/recovery only)
// ============================================
const FUEL_NOTES = {
  quality: { title: "Fuel for today", detail: "Quality session — make sure you've eaten 2–3 hours before, and get carbs + protein in within an hour after." },
  long: { title: "Fuel for today", detail: "Long run — carry water/fuel if 7mi+. Refuel with carbs + protein within an hour of finishing." },
  strength: { title: "Recovery fuel", detail: "MyProtein Salted Caramel Whey post-session, as usual." },
  rest: null,
  run: { title: "Recovery fuel", detail: "Easy run — normal eating, no special fuelling needed." }
};

// ============================================
// LEAD-IN DAY (today, before week 14 officially starts Monday)
// ============================================
const LEAD_IN_DAY = {
  day: "Sun", date: "2026-06-21", weekNum: 14, isLeadIn: true, sessions: [
    { type: "rest", tag: "Rest", title: "Rest day", items: [
      { name: "Foam roll calves & quads", detail: "2 min each area" },
      { name: "Gentle walk", detail: "20–30 min if it feels good" }
    ], note: "Lead-in day before week 14 starts tomorrow. Good day to do the daily knee/Achilles rehab and nothing else." }
  ]
};

// ============================================
// TRAINING PLAN — Weeks 14-17
// Each session: { tag, title, items: [{name, detail}], note, warn (bool) }
// Each week's days array is ordered Sun -> Sat for display, but actual
// session content stays attached to its real calendar date (long run = Sunday,
// tempo = Wednesday, gym = Tue/Fri, exactly as originally built).
// ============================================
const PLAN = [
  {
    weekNum: 14,
    dateRange: "21–28 June 2026",
    startDate: "2026-06-21",
    days: [
      { day: "Sun", date: "2026-06-21", sessions: LEAD_IN_DAY.sessions },
      { day: "Mon", date: "2026-06-22", sessions: [
        { type: "run", tag: "Runna", title: "5mi easy run", items: [
          { name: "Conversational pace", detail: "Max 9:30/mi" }
        ], note: "Pre-run: 5 min dynamic warm-up (leg swings, walking lunges, ankle circles). Non-negotiable with the Achilles niggle." },
        { type: "rehab", tag: "Mobility", title: "Post-run cooldown", items: [
          { name: "Calf stretch (gastrocnemius)", detail: "30s each leg, knee straight" },
          { name: "Calf stretch (soleus)", detail: "30s each leg, knee bent" },
          { name: "Hip flexor stretch", detail: "30s each side" }
        ] }
      ]},
      { day: "Tue", date: "2026-06-23", sessions: [
        { type: "strength", tag: "Gym A", title: "Glute & hip focus", lib: "gymA" }
      ]},
      { day: "Wed", date: "2026-06-24", sessions: [
        { type: "quality", tag: "Runna", title: "Tempo 2-1, 4.5mi", items: [
          { name: "Warm-up", detail: "1mi conversational, max 9:30/mi" },
          { name: "2mi @ 8:15/mi", detail: "then 120s walking rest" },
          { name: "1mi @ 8:00/mi", detail: "then 90s walking rest" },
          { name: "Cool-down", detail: "0.5mi conversational or slower" }
        ], note: "Your hardest knee-loading day this week. If sharp pain shows up in the 8:00/mi mile, ease to easy pace and finish conversationally — don't force it.", warn: true }
      ]},
      { day: "Thu", date: "2026-06-25", sessions: [
        { type: "rehab", tag: "Rehab", title: "Active recovery + rehab focus", lib: "rehabFocus",
          note: "Runna had a 3.75mi easy run scheduled today — your coach's own note says it's fine to swap for rest if things are piling up. With two new niggles, today's a good day to take that and do rehab only." }
      ]},
      { day: "Fri", date: "2026-06-26", sessions: [
        { type: "strength", tag: "Gym B", title: "Posterior chain", lib: "gymB" }
      ]},
      { day: "Sat", date: "2026-06-27", sessions: [
        { type: "rest", tag: "Rest", title: "Rest day", items: [
          { name: "Foam roll calves & quads", detail: "2 min each area" },
          { name: "Gentle walk", detail: "20–30 min if it feels good" }
        ], note: "Full rest ahead of tomorrow's long run." }
      ]},
      { day: "Sun", date: "2026-06-28", sessions: [
        { type: "run", tag: "Runna", title: "6.5mi long run", items: [
          { name: "Conversational pace", detail: "Steady effort throughout" }
        ], note: "Watch the knee on downhills — shorten your stride slightly on descents, it reduces kneecap load significantly." }
      ]},
    ]
  },
  {
    weekNum: 15,
    dateRange: "29 June – 5 July 2026",
    startDate: "2026-06-29",
    days: [
      { day: "Mon", date: "2026-06-29", sessions: [
        { type: "rest", tag: "Rest", title: "Rest day (per Runna)", items: [
          { name: "Foam roll calves & quads", detail: "2 min each area" },
          { name: "Gentle walk", detail: "20–30 min if it feels good" }
        ] }
      ]},
      { day: "Tue", date: "2026-06-30", sessions: [
        { type: "run", tag: "Runna", title: "5.5mi easy run", items: [
          { name: "Conversational pace", detail: "Max 9:30/mi" }
        ] },
        { type: "strength", tag: "Gym A · replaces Lower Body Supersets", title: "Glute & hip focus", lib: "gymA" }
      ]},
      { day: "Wed", date: "2026-07-01", sessions: [
        { type: "rehab", tag: "Rehab · replaces Endurance Supersets", title: "Rehab focus session", lib: "rehabFocus",
          note: "No run today — keep load fully on rehab before tomorrow's intervals." }
      ]},
      { day: "Thu", date: "2026-07-02", sessions: [
        { type: "quality", tag: "Runna", title: "1km repeats, 4.6mi", items: [
          { name: "Warm-up", detail: "1.3mi conversational, max 9:30/mi, then 90s walking rest" },
          { name: "4 × 0.62mi @ 7:45/mi", detail: "range 7:30–8:00/mi, 90s walking rest between reps" },
          { name: "Cool-down", detail: "0.8mi conversational or slower" }
        ], note: "Highest knee-load session this week. Proper dynamic warm-up first. If sharp pain shows in any rep, stop there and walk/jog home rather than pushing through.", warn: true },
        { type: "skipped", tag: "Skipped", title: "Legs & Core Supersets — not doing this", items: [], note: "Legs need to recover from intervals — no extra strength session today." }
      ]},
      { day: "Fri", date: "2026-07-03", sessions: [
        { type: "run", tag: "Runna", title: "3.5mi easy run", items: [
          { name: "Conversational pace", detail: "Max 9:30/mi" }
        ] },
        { type: "strength", tag: "Gym B", title: "Posterior chain", lib: "gymB" }
      ]},
      { day: "Sat", date: "2026-07-04", sessions: [
        { type: "rehab", tag: "Mobility · replaces Stretch & Stability", title: "Stretch & mobility", items: [
          { name: "Calf stretch (gastrocnemius)", detail: "30s each leg, knee straight" },
          { name: "Calf stretch (soleus)", detail: "30s each leg, knee bent" },
          { name: "Hip flexor stretch", detail: "30s each side" },
          { name: "Foam roll quads, calves, IT band", detail: "2 min each area" }
        ] }
      ]},
      { day: "Sun", date: "2026-07-05", sessions: [
        { type: "run", tag: "Runna", title: "7mi long run", items: [
          { name: "Conversational pace", detail: "Steady effort throughout" }
        ], note: "Longest run since the niggles started. Shorten stride on downhills. Fine to walk a section if either niggle flares — resume after." }
      ]},
    ]
  },
  {
    weekNum: 16,
    dateRange: "6–12 July 2026",
    startDate: "2026-07-06",
    days: [
      { day: "Mon", date: "2026-07-06", sessions: [
        { type: "rest", tag: "Rest", title: "Rest day (per Runna)", items: [
          { name: "Foam roll calves & quads", detail: "2 min each area" },
          { name: "Gentle walk", detail: "20–30 min if it feels good" }
        ] }
      ]},
      { day: "Tue", date: "2026-07-07", sessions: [
        { type: "run", tag: "Runna", title: "3.75mi easy run", items: [
          { name: "Conversational pace", detail: "Max 9:30/mi" }
        ] },
        { type: "strength", tag: "Gym A · replaces Legs & Core Endurance", title: "Glute & hip focus", lib: "gymA" }
      ]},
      { day: "Wed", date: "2026-07-08", sessions: [
        { type: "rehab", tag: "Rehab · replaces Full Body Endurance", title: "Rehab focus session", lib: "rehabFocus",
          note: "No run today — keep load on rehab before Thursday's intervals." }
      ]},
      { day: "Thu", date: "2026-07-09", sessions: [
        { type: "quality", tag: "Runna", title: "Mile repeats, 3.2mi", items: [
          { name: "Warm-up", detail: "0.75mi conversational, max 9:25/mi, then 90s walking rest" },
          { name: "2 × 1mi @ 7:50/mi", detail: "range 7:35–8:05/mi, 120s walking rest between reps" },
          { name: "Cool-down", detail: "0.5mi conversational or slower" }
        ], note: "Lighter interval load than week 15 (only 2 reps). Still: proper warm-up, stop at first sign of sharp knee pain.", warn: true },
        { type: "skipped", tag: "Skipped", title: "Lower Body Endurance — not doing this", items: [], note: "Legs recover instead — no extra strength session today." }
      ]},
      { day: "Fri", date: "2026-07-10", sessions: [
        { type: "run", tag: "Runna", title: "3.5mi easy run", items: [
          { name: "Conversational pace", detail: "Max 9:30/mi" }
        ] },
        { type: "strength", tag: "Gym B", title: "Posterior chain", lib: "gymB" }
      ]},
      { day: "Sat", date: "2026-07-11", sessions: [
        { type: "rehab", tag: "Mobility · replaces Stretch & Stability", title: "Stretch & mobility", items: [
          { name: "Calf stretch (gastrocnemius)", detail: "30s each leg, knee straight" },
          { name: "Calf stretch (soleus)", detail: "30s each leg, knee bent" },
          { name: "Hip flexor stretch", detail: "30s each side" },
          { name: "Foam roll quads, calves, IT band", detail: "2 min each area" }
        ] }
      ]},
      { day: "Sun", date: "2026-07-12", sessions: [
        { type: "run", tag: "Runna", title: "4.5mi long run", items: [
          { name: "Conversational pace", detail: "Steady effort throughout" }
        ], note: "Shorten stride slightly on downhills to reduce knee load." }
      ]},
    ]
  },
  {
    weekNum: 17,
    dateRange: "13–19 July 2026",
    startDate: "2026-07-13",
    days: [
      { day: "Mon", date: "2026-07-13", sessions: [
        { type: "rest", tag: "Rest", title: "Rest day (per Runna)", items: [
          { name: "Foam roll calves & quads", detail: "2 min each area" },
          { name: "Gentle walk", detail: "20–30 min if it feels good" }
        ] }
      ]},
      { day: "Tue", date: "2026-07-14", sessions: [
        { type: "run", tag: "Runna", title: "4.5mi easy run", items: [
          { name: "Conversational pace", detail: "Max 9:30/mi" }
        ] },
        { type: "strength", tag: "Gym A · replaces Lower Body Endurance", title: "Glute & hip focus", lib: "gymA" }
      ]},
      { day: "Wed", date: "2026-07-15", sessions: [
        { type: "rehab", tag: "Rehab · replaces Full Body Supersets", title: "Rehab focus session", lib: "rehabFocus",
          note: "No run today — keep load on rehab before Thursday's session." }
      ]},
      { day: "Thu", date: "2026-07-16", sessions: [
        { type: "quality", tag: "Runna", title: "Over & unders, 5mi", items: [
          { name: "Session detail", detail: "Check Runna directly for exact pace splits — not fully captured from screenshots." }
        ], note: "Apply the same rule: dynamic warm-up first, stop if sharp knee pain appears.", warn: true },
        { type: "skipped", tag: "Skipped", title: "Lower Body Supersets — not doing this", items: [], note: "No extra strength session — legs recover instead." }
      ]},
      { day: "Fri", date: "2026-07-17", sessions: [
        { type: "run", tag: "Runna", title: "4.5mi easy run", items: [
          { name: "Conversational pace", detail: "Max 9:30/mi" }
        ] },
        { type: "strength", tag: "Gym B", title: "Posterior chain", lib: "gymB" }
      ]},
      { day: "Sat", date: "2026-07-18", sessions: [
        { type: "rehab", tag: "Mobility · replaces Stretch & Stability", title: "Stretch & mobility", items: [
          { name: "Calf stretch (gastrocnemius)", detail: "30s each leg, knee straight" },
          { name: "Calf stretch (soleus)", detail: "30s each leg, knee bent" },
          { name: "Hip flexor stretch", detail: "30s each side" },
          { name: "Foam roll quads, calves, IT band", detail: "2 min each area" }
        ] }
      ]},
      { day: "Sun", date: "2026-07-19", sessions: [
        { type: "quality", tag: "Runna", title: "7.5mi progressive repeats long run", items: [
          { name: "Progressive effort", detail: "Follow Runna's exact structure — effort builds across the run" }
        ], note: "Highest knee-load session across these weeks: longest run plus a faster finish when already fatigued. Shorten stride on downhills. If sharp pain appears in the faster section, ease back to conversational pace and finish there.", warn: true }
      ]},
    ]
  }
];

// Flatten all days for easy lookup by date
const ALL_DAYS = PLAN.flatMap(w => w.days.map(d => ({ ...d, weekNum: w.weekNum })));

function findDayByDate(isoDate) {
  return ALL_DAYS.find(d => d.date === isoDate);
}
