import { useState, useRef, useCallback, useEffect } from "react";
import CricketField        from "./CricketField";
import PowerBar            from "./PowerBar";
import Scoreboard          from "./Scoreboard";
import BallHistory         from "./BallHistory";
import { useSlider }       from "../hooks/useSlider";
import { useBowlingAnimation } from "../hooks/useBowlingAnimation";
import { useHitAnimation } from "../hooks/useHitAnimation";
import { BATTING_STYLES, TOTAL_BALLS, TOTAL_WICKETS } from "../utils/constants";
import { getOutcomeFromSlider, pickCommentary } from "../utils/gameLogic";
import "../styles/GameScreen.css";

/**
 * GameScreen
 * Main gameplay view. Orchestrates:
 *  – bowling animation → slider active → player clicks → hit animation → outcome
 *
 * Props:
 *   initialStyle  – "aggressive" | "defensive"
 *   onGameOver    – callback(runs, wickets, ballsBowled, history, reason)
 *   onRestart     – callback()  (go back to menu)
 */
export default function GameScreen({ initialStyle, onGameOver, onRestart }) {
  // ── State ─────────────────────────────────────────────────────────────────
  const [battingStyle,  setBattingStyle]  = useState(initialStyle || "aggressive");
  const [runs,          setRuns]          = useState(0);
  const [wickets,       setWickets]       = useState(0);
  const [ballsBowled,   setBallsBowled]   = useState(0);
  const [history,       setHistory]       = useState([]);
  const [sliderPct,     setSliderPct]     = useState(0);
  const [canPlay,       setCanPlay]       = useState(false);
  const [isBowling,     setIsBowling]     = useState(false);
  const [hitProgress,   setHitProgress]   = useState(0);
  const [ballPos,       setBallPos]       = useState(null);
  const [lastOutcome,   setLastOutcome]   = useState(null);
  const [showOutcome,   setShowOutcome]   = useState(false);
  const [commentary,    setCommentary]    = useState("");
  const [locked,        setLocked]        = useState(false); // prevent double-fire

  // ── Refs ──────────────────────────────────────────────────────────────────
  const barRef            = useRef(null);
  const canvasContainerRef = useRef(null);

  // Keep a ref copy of mutable game state for use inside RAF callbacks
  const runsRef       = useRef(0);
  const wicketsRef    = useRef(0);
  const ballsRef      = useRef(0);
  const historyRef    = useRef([]);
  const styleRef      = useRef(battingStyle);

  useEffect(() => { runsRef.current    = runs;       }, [runs]);
  useEffect(() => { wicketsRef.current = wickets;    }, [wickets]);
  useEffect(() => { ballsRef.current   = ballsBowled;}, [ballsBowled]);
  useEffect(() => { historyRef.current = history;    }, [history]);
  useEffect(() => { styleRef.current   = battingStyle;}, [battingStyle]);

  // ── Slider hook ───────────────────────────────────────────────────────────
  const onSliderTick = useCallback((pos) => setSliderPct(pos), []);
  const slider = useSlider(barRef, onSliderTick);

  // ── Forward-declare startBowl so hit-animation callback can reference it ──
  const startBowlRef = useRef(null);

  // ── Hit animation hook ────────────────────────────────────────────────────
  // Called when swing completes → show outcome, schedule next bowl
  const onHitComplete = useCallback(() => {
    const outcome   = lastOutcomeRef.current;
    const newBalls  = ballsRef.current + 1;
    const isWicket  = outcome === "W";

    const newRuns    = isWicket ? runsRef.current : runsRef.current + outcome;
    const newWickets = isWicket ? wicketsRef.current + 1 : wicketsRef.current;
    const newHistory = [...historyRef.current, outcome];

    setRuns(newRuns);
    setWickets(newWickets);
    setBallsBowled(newBalls);
    setHistory(newHistory);
    setShowOutcome(true);
    setCommentary(pickCommentary(outcome));

    // Check game-over conditions
    const gameOver = newWickets >= TOTAL_WICKETS || newBalls >= TOTAL_BALLS;
    if (gameOver) {
      const reason = newWickets >= TOTAL_WICKETS ? "All wickets lost!" : "Overs completed!";
      setTimeout(() => onGameOver(newRuns, newWickets, newBalls, newHistory, reason), 1600);
    } else {
      // Next delivery after a short pause
      setTimeout(() => {
        setShowOutcome(false);
        setLocked(false);
        if (startBowlRef.current) startBowlRef.current();
      }, 1700);
    }
  }, [onGameOver]);

  const hitAnim = useHitAnimation(setHitProgress, onHitComplete);

  // Store pending outcome in a ref (needed inside async animation callback)
  const lastOutcomeRef = useRef(null);

  // ── Bowling animation hook ────────────────────────────────────────────────
  // Called when ball reaches batsman → enable play button
  const onBowlComplete = useCallback(() => {
    setIsBowling(false);
    setCanPlay(true);
    slider.start();
  }, [slider]);

  const bowlAnim = useBowlingAnimation(canvasContainerRef, setBallPos, onBowlComplete);

  // Expose startBowl via ref so hit callback can call it
  const startBowl = useCallback(() => {
    setCanPlay(false);
    setIsBowling(true);
    setShowOutcome(false);
    setLastOutcome(null);
    setCommentary("");
    setHitProgress(0);
    bowlAnim.play();
  }, [bowlAnim]);

  useEffect(() => { startBowlRef.current = startBowl; }, [startBowl]);

  // Kick off first delivery on mount
  useEffect(() => {
    const t = setTimeout(() => startBowl(), 700);
    return () => {
      clearTimeout(t);
      slider.stop();
      bowlAnim.stop();
      hitAnim.stop();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Play shot handler ─────────────────────────────────────────────────────
  const playShot = useCallback(() => {
    if (!canPlay || locked) return;

    // Freeze slider
    slider.stop();
    setCanPlay(false);
    setLocked(true);

    // Determine outcome from frozen slider position
    const pos     = slider.posRef.current;
    const probs   = BATTING_STYLES[styleRef.current].probs;
    const outcome = getOutcomeFromSlider(pos, probs);

    lastOutcomeRef.current = outcome;
    setLastOutcome(outcome);

    // Trigger batting animation → onHitComplete fires at end
    hitAnim.play();
  }, [canPlay, locked, slider, hitAnim]);

  // Space-bar support
  useEffect(() => {
    const handler = (e) => {
      if (e.code === "Space" || e.key === " ") {
        e.preventDefault();
        playShot();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [playShot]);

  // ── Derived UI values ─────────────────────────────────────────────────────
  const ballsLeft    = TOTAL_BALLS - ballsBowled;
  const btnReady     = canPlay && !locked;
  const currentStyle = BATTING_STYLES[battingStyle];
  const controlsDisabled = canPlay || isBowling || locked;

  // Commentary colour class
  let commentaryClass = "game-commentary-idle";
  if (commentary) {
    if (lastOutcome === "W")    commentaryClass = "game-commentary-wicket";
    else if (lastOutcome >= 4)  commentaryClass = "game-commentary-boundary";
    else                        commentaryClass = "game-commentary-normal";
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="game-layout">

      {/* ── SCOREBOARD ── */}
      <Scoreboard runs={runs} wickets={wickets} ballsBowled={ballsBowled} />

      {/* ── BALL HISTORY ── */}
      <BallHistory history={history} />

      {/* ── CRICKET CANVAS ── */}
      <div ref={canvasContainerRef} className="game-canvas-container">
        <CricketField
          ballPos={ballPos}
          isBowling={isBowling}
          hitProgress={hitProgress}
          outcome={lastOutcome}
          showOutcome={showOutcome}
        />
      </div>

      {/* ── COMMENTARY ── */}
      <div className="game-commentary">
        <p className={commentaryClass}>
          {commentary
            ? commentary
            : isBowling
              ? "🎯 Ball incoming…"
              : canPlay
                ? "⚡ Pick your moment — click or press SPACE!"
                : "—"}
        </p>
      </div>

      {/* ── CONTROLS ── */}
      <div className="game-controls">

        {/* Batting style toggle */}
        <div className="style-toggle">
          {Object.entries(BATTING_STYLES).map(([key, s]) => (
            <button
              key={key}
              className={`style-btn ${battingStyle === key ? "style-btn-active" : ""}`}
              style={{ "--accent": s.accent }}
              disabled={controlsDisabled}
              onClick={() => setBattingStyle(key)}
            >
              {s.icon} {s.label.toUpperCase()}
            </button>
          ))}

          {/* Restart shortcut */}
          <button className="restart-btn" onClick={onRestart}>
            🏠 Menu
          </button>
        </div>

        {/* Power bar label */}
        <div className="powerbar-header">
          <span className="powerbar-header-label">
            Power Bar · {currentStyle.label} Mode
          </span>
          <span className="powerbar-header-pos">
            pos: {sliderPct.toFixed(3)}
          </span>
        </div>

        {/* POWER BAR */}
        <div ref={barRef}>
          <PowerBar
            probs={currentStyle.probs}
            sliderPct={sliderPct}
            active={canPlay}
          />
        </div>

        {/* Ball pips */}
        <div className="ball-pips">
          {Array.from({ length: TOTAL_BALLS }).map((_, i) => (
            <div
              key={i}
              className={`ball-pip ${i < ballsBowled ? "ball-pip-bowled" : "ball-pip-remaining"}`}
            />
          ))}
        </div>

        {/* PLAY SHOT BUTTON */}
        <button
          className={`play-btn ${btnReady ? "play-btn-ready" : "play-btn-disabled"}`}
          style={{ "--btn-color": currentStyle.accent }}
          disabled={!btnReady}
          onClick={playShot}
        >
          {isBowling
            ? "⏳  BALL INCOMING…"
            : canPlay
              ? "🏏  PLAY SHOT!  [SPACE]"
              : locked
                ? "⚡  PROCESSING…"
                : "⏳  WAIT…"}
        </button>

        <p className="play-btn-footer">
          {ballsLeft} ball{ballsLeft !== 1 ? "s" : ""} remaining
        </p>
      </div>
    </div>
  );
}
