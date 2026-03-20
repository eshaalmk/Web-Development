import { buildSegments } from "../utils/gameLogic";
import "../styles/PowerBar.css";

/**
 * PowerBar
 * Displays probability segments as coloured zones.
 * A white slider marker moves across showing current position.
 *
 * Props:
 *   probs      – probability array from BATTING_STYLES config
 *   sliderPct  – current slider position (0–1)
 *   active     – boolean: is the slider currently moving?
 */
export default function PowerBar({ probs, sliderPct, active }) {
  const segments = buildSegments(probs);

  return (
    <div className="powerbar-wrapper">
      {/* Segments bar */}
      <div className={`powerbar-track ${active ? "powerbar-active" : ""}`}>
        {segments.map((seg, i) => (
          <div
            key={i}
            className="powerbar-segment"
            style={{
              width:       `${seg.prob * 100}%`,
              background:  seg.color,
              borderRight: i < segments.length - 1 ? "1px solid rgba(0,0,0,0.38)" : "none",
              filter:      active ? "brightness(1.12)" : "brightness(0.78)",
            }}
            title={`${seg.label}: ${(seg.prob * 100).toFixed(0)}%`}
          >
            {/* Gloss shine */}
            <div className="powerbar-gloss" />
            {/* Label — only visible when segment is wide enough */}
            {seg.prob >= 0.07 && (
              <span className="powerbar-label">
                {seg.label}
              </span>
            )}
          </div>
        ))}

        {/* Slider vertical line */}
        <div
          className={`powerbar-slider ${active ? "powerbar-slider-glow" : ""}`}
          style={{ left: `${sliderPct * 100}%` }}
        />
        {/* Arrow above slider */}
        <div
          className="powerbar-arrow"
          style={{ left: `${sliderPct * 100}%` }}
        />
      </div>

      {/* Probability scale beneath bar */}
      <div className="powerbar-scale">
        {segments.map((seg, i) => (
          <div
            key={i}
            className="powerbar-scale-tick"
            style={{ width: `${seg.prob * 100}%` }}
          >
            {seg.prob >= 0.08 ? seg.start.toFixed(2) : ""}
          </div>
        ))}
        <span className="powerbar-scale-end">1.0</span>
      </div>
    </div>
  );
}
