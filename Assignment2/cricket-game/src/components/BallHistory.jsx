import { OUTCOME_COLOR } from "../utils/constants";
import "../styles/BallHistory.css";

/**
 * BallHistory
 * Shows a coloured circle for every ball bowled in the innings.
 */
export default function BallHistory({ history }) {
  return (
    <div className="ball-history">
      {history.length === 0 ? (
        <span className="ball-history-empty">Balls will appear here…</span>
      ) : (
        history.map((outcome, i) => (
          <div
            key={i}
            className="ball-dot"
            style={{
              background:  OUTCOME_COLOR[outcome] ?? "#555",
              boxShadow:   `0 2px 8px ${OUTCOME_COLOR[outcome] ?? "#555"}88`,
            }}
            title={outcome === "W" ? "Wicket" : `${outcome} run${outcome !== 1 ? "s" : ""}`}
          >
            {outcome === "W" ? "W" : outcome}
          </div>
        ))
      )}
    </div>
  );
}
