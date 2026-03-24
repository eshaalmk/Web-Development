import { COMMENTARY } from "./constants";

/**
 * Given a slider position (0–1) and a probability array,
 * returns the outcome whose cumulative range contains pos.
 * Outcome is determined STRICTLY by slider position — no randomness.
 */
export function getOutcomeFromSlider(sliderPos, probs) {
  let cumulative = 0;
  for (const p of probs) {
    cumulative += p.prob;
    if (sliderPos <= cumulative) return p.outcome;
  }
  // Fallback to last segment (handles floating-point edge at 1.0)
  return probs[probs.length - 1].outcome;
}

/**
 * Randomly pick one commentary line for a given outcome.
 * Falls back to dot-ball commentary if outcome not found.
 */
export function pickCommentary(outcome) {
  const lines = COMMENTARY[outcome] ?? COMMENTARY[0];
  return lines[Math.floor(Math.random() * lines.length)];
}

/**
 * Format balls bowled into overs notation  e.g. 7 → "1.1"
 */
export function formatOvers(ballsBowled) {
  const completedOvers = Math.floor(ballsBowled / 6);
  const remainder      = ballsBowled % 6;
  return `${completedOvers}.${remainder}`;
}

/**
 * Calculate strike rate (runs per 100 balls).
 */
export function calcStrikeRate(runs, ballsFaced) {
  if (ballsFaced === 0) return "—";
  return ((runs / ballsFaced) * 100).toFixed(1);
}

/**
 * Build cumulative segment boundaries for the power bar.
 * Returns array of { ...prob, start, end } objects.
 */
export function buildSegments(probs) {
  let cum = 0;
  return probs.map((p) => {
    const start = cum;
    cum += p.prob;
    return { ...p, start, end: cum };
  });
}

/**
 * Easing function: ease-in-out quad
 */
export function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}
