// ─── GAME RULES ──────────────────────────────────────────────────────────────
export const TOTAL_BALLS    = 12;   // 2 overs
export const TOTAL_WICKETS  = 3;
export const SLIDER_SPEED   = 1.6;  // px per frame (scaled to bar width)

// ─── BATTING STYLE PROBABILITY DISTRIBUTIONS ────────────────────────────────
// Each style's probs must sum exactly to 1.00
export const BATTING_STYLES = {
  aggressive: {
    label:   "Aggressive",
    icon:    "⚡",
    accent:  "#ff4d4d",
    desc:    "High risk, high reward",
    // Wicket: 40%  |  6s: 15%  |  Boundaries possible
    probs: [
      { outcome: "W", label: "Wicket", prob: 0.40, color: "#c0392b" },
      { outcome: 0,   label: "Dot",    prob: 0.10, color: "#4a5568" },
      { outcome: 1,   label: "1",      prob: 0.10, color: "#2980b9" },
      { outcome: 2,   label: "2",      prob: 0.10, color: "#8e44ad" },
      { outcome: 3,   label: "3",      prob: 0.05, color: "#16a085" },
      { outcome: 4,   label: "4",      prob: 0.10, color: "#d4ac0d" },
      { outcome: 6,   label: "6",      prob: 0.15, color: "#27ae60" },
    ],
  },
  defensive: {
    label:   "Defensive",
    icon:    "🛡",
    accent:  "#4db8ff",
    desc:    "Low risk, steady runs",
    // Wicket: 15%  |  6s: 2%  |  Lots of singles
    probs: [
      { outcome: "W", label: "Wicket", prob: 0.15, color: "#c0392b" },
      { outcome: 0,   label: "Dot",    prob: 0.30, color: "#4a5568" },
      { outcome: 1,   label: "1",      prob: 0.25, color: "#2980b9" },
      { outcome: 2,   label: "2",      prob: 0.15, color: "#8e44ad" },
      { outcome: 3,   label: "3",      prob: 0.08, color: "#16a085" },
      { outcome: 4,   label: "4",      prob: 0.05, color: "#d4ac0d" },
      { outcome: 6,   label: "6",      prob: 0.02, color: "#27ae60" },
    ],
  },
};

// ─── COMMENTARY LINES ────────────────────────────────────────────────────────
// At least 3–4 per outcome for variety
export const COMMENTARY = {
  W: [
    "Bowled him! Timber! 💔",
    "OUT! He walks back in silence... 😱",
    "That's plumb! The finger goes up!",
    "Clean bowled! The stumps are shattered!",
    "He's gone! What a delivery!",
  ],
  0: [
    "Solid defence. Dot ball.",
    "Nothing doing there. Good length.",
    "Blocked! No run scored.",
    "Back on the crease — dot ball.",
    "The pressure mounts... dot ball.",
  ],
  1: [
    "Nudged for a single!",
    "Clever placement, one run.",
    "Quick single — smart cricket!",
    "Worked to leg, one run.",
  ],
  2: [
    "Driven into the gap — two runs!",
    "Good placement, they run two!",
    "Two more on the board!",
    "Punched through covers, two!",
  ],
  3: [
    "Three! Excellent running between the wickets!",
    "They sprint hard — three runs!",
    "Great effort, three on the board!",
  ],
  4: [
    "FOUR! Cracking shot to the boundary! 🔥",
    "BOUNDARY! Beautiful timing! 🏏",
    "FOUR RUNS! The fielder had no chance!",
    "Creamed through the covers — FOUR!",
    "That races away to the fence! FOUR!",
  ],
  6: [
    "SIX!!! OUT OF THE PARK! 🚀",
    "MAXIMUM! That's absolutely colossal! 💥",
    "SIX! The crowd goes WILD! 🎉",
    "TOWERING SIX! He's in the zone!",
    "Over the ropes! Into the stands! SIX!",
  ],
};

// ─── OUTCOME COLOURS (for history dots etc.) ─────────────────────────────────
export const OUTCOME_COLOR = {
  W: "#e74c3c",
  0: "#4a5568",
  1: "#2980b9",
  2: "#8e44ad",
  3: "#16a085",
  4: "#d4ac0d",
  6: "#27ae60",
};
