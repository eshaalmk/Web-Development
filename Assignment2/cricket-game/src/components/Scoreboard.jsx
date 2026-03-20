import { formatOvers, calcStrikeRate } from "../utils/gameLogic";
import { TOTAL_WICKETS } from "../utils/constants";
import "../styles/Scoreboard.css";

/**
 * Scoreboard
 * Live match stats: runs/wickets, overs, strike rate, wicket pips.
 */
export default function Scoreboard({ runs, wickets, ballsBowled }) {
  const overs = formatOvers(ballsBowled);
  const sr    = calcStrikeRate(runs, ballsBowled);

  return (
    <div className="scoreboard">
      {/* Main score */}
      <div className="scoreboard-main">
        <span className="scoreboard-runs">{runs}</span>
        <span className="scoreboard-sep">/</span>
        <span className="scoreboard-wickets">{wickets}</span>
      </div>

      {/* Wicket pips */}
      <div className="scoreboard-pips">
        {Array.from({ length: TOTAL_WICKETS }).map((_, i) => (
          <div
            key={i}
            className={`scoreboard-pip ${i < wickets ? "scoreboard-pip-out" : ""}`}
          />
        ))}
        <span className="scoreboard-pip-label">WKTS</span>
      </div>

      {/* Stats */}
      <div className="scoreboard-stat">
        <span className="scoreboard-stat-val scoreboard-stat-overs">{overs}</span>
        <span className="scoreboard-stat-key">OVERS</span>
      </div>

      <div className="scoreboard-stat">
        <span className="scoreboard-stat-val scoreboard-stat-sr">{sr}</span>
        <span className="scoreboard-stat-key">S/R</span>
      </div>
    </div>
  );
}
