import { useState } from "react";
import MenuScreen    from "./components/MenuScreen";
import GameScreen    from "./components/GameScreen";
import GameOverScreen from "./components/GameOverScreen";
import "./styles/global.css";

/**
 * App
 * Top-level router: menu → game → gameover → menu
 *
 * Screens:
 *   "menu"    – style selection & how-to
 *   "game"    – live batting gameplay
 *   "over"    – end-of-innings summary
 */
export default function App() {
  const [screen,       setScreen]       = useState("menu");
  const [chosenStyle,  setChosenStyle]  = useState("aggressive");

  // Preserved for the game-over summary
  const [finalRuns,    setFinalRuns]    = useState(0);
  const [finalWickets, setFinalWickets] = useState(0);
  const [finalBalls,   setFinalBalls]   = useState(0);
  const [finalHistory, setFinalHistory] = useState([]);
  const [finalReason,  setFinalReason]  = useState("");

  // ── Handlers ──────────────────────────────────────────────────────────────

  /** Called by MenuScreen when the player hits START */
  const handleStart = (style) => {
    setChosenStyle(style);
    setScreen("game");
  };

  /** Called by GameScreen when overs finish or all wickets fall */
  const handleGameOver = (runs, wickets, balls, history, reason) => {
    setFinalRuns(runs);
    setFinalWickets(wickets);
    setFinalBalls(balls);
    setFinalHistory(history);
    setFinalReason(reason);
    setScreen("over");
  };

  /** Called by GameScreen's Menu button */
  const handleGoMenu = () => setScreen("menu");

  /** Called by GameOverScreen's Play Again */
  const handleRestart = () => setScreen("game");

  /** Called by GameOverScreen's Menu button */
  const handleOverMenu = () => setScreen("menu");

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      {screen === "menu" && (
        <MenuScreen onStart={handleStart} />
      )}

      {screen === "game" && (
        <GameScreen
          key={`game-${Date.now()}`}   /* remount on restart to reset all state */
          initialStyle={chosenStyle}
          onGameOver={handleGameOver}
          onRestart={handleGoMenu}
        />
      )}

      {screen === "over" && (
        <GameOverScreen
          runs={finalRuns}
          wickets={finalWickets}
          ballsBowled={finalBalls}
          history={finalHistory}
          reason={finalReason}
          onRestart={handleRestart}
          onMenu={handleOverMenu}
        />
      )}
    </>
  );
}
