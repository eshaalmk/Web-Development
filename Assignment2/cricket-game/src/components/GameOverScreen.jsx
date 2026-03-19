import { formatOvers, calcStrikeRate } from "../utils/gameLogic";
import { TOTAL_WICKETS, OUTCOME_COLOR } from "../utils/constants";
import "../styles/GameOverScreen.css";

/**
 * GameOverScreen
 * End-of-innings summary with full stats and ball-by-ball recap.
 */
export default function GameOverScreen({ runs, wickets, ballsBowled, history, reason, onRestart, onMenu }) {
  const sr    = calcStrikeRate(runs, ballsBowled);
  const overs = formatOvers(ballsBowled);
  const fours = history.filter(h => h === 4).length;
  const sixes = history.filter(h => h === 6).length;
  const dots  = history.filter(h => h === 0).length;
  const allOut = wickets >= TOTAL_WICKETS;

  return (
    <div className="gameover-screen">
      <div className="gameover-card">
        {/* Trophy / heartbreak */}
        <div className="gameover-emoji">{allOut ? "💔" : "🏆"}</div>
        <h2 className={`gameover-title ${allOut ? "gameover-title-out" : "gameover-title-win"}`}>
          {allOut ? "ALL OUT!" : "INNINGS OVER!"}
        </h2>
        <p className="gameover-reason">{reason}</p>

        {/* Main scorecard */}
        <div className="gameover-scorecard">
          <div className="gameover-stat-big">
            <span className="gameover-runs">{runs}</span>
            <span className="gameover-runs-label">RUNS</span>
          </div>
          <div className="gameover-divider" />
          <div className="gameover-grid">
            {[
              { label: "WICKETS",  val: `${wickets}/${TOTAL_WICKETS}`, col: "#e74c3c" },
              { label: "OVERS",    val: overs,                          col: "#3498db" },
              { label: "S / R",    val: sr,                             col: "#2ecc71" },
              { label: "4s",       val: fours,                          col: "#d4ac0d" },
              { label: "6s",       val: sixes,                          col: "#27ae60" },
              { label: "DOTS",     val: dots,                           col: "#4a5568" },
            ].map((s, i) => (
              <div key={i} className="gameover-grid-item">
                <span className="gameover-grid-val" style={{ color: s.col }}>{s.val}</span>
                <span className="gameover-grid-key">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Ball-by-ball */}
        <div className="gameover-balls">
          <p className="gameover-balls-label">BALL BY BALL</p>
          <div className="gameover-balls-row">
            {history.map((h, i) => (
              <div
                key={i}
                className="gameover-ball-dot"
                style={{
                  background: OUTCOME_COLOR[h] ?? "#555",
                  boxShadow:  `0 2px 6px ${OUTCOME_COLOR[h] ?? "#555"}88`,
                }}
              >
                {h === "W" ? "W" : h}
              </div>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="gameover-actions">
          <button className="gameover-btn-primary" onClick={onRestart}>
            🔄 PLAY AGAIN
          </button>
          <button className="gameover-btn-secondary" onClick={onMenu}>
            🏠 MENU
          </button>
        </div>
      </div>
    </div>
  );
}
