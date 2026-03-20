import { useRef, useEffect } from "react";
import {
  drawSky, drawStars, drawFloodlights, drawStands,
  drawOutfield, drawPitch, drawStumps,
  drawBatsman, drawBowler, drawBall, drawOutcomeFlash,
} from "../utils/drawField";

/**
 * CricketField
 * Renders the entire 2D cricket scene onto an HTML5 Canvas.
 *
 * Props:
 *   ballPos      – { x, y } or null
 *   isBowling    – boolean (bowler arm raised)
 *   hitProgress  – 0–1 bat swing progress
 *   outcome      – last shot outcome (number | "W" | null)
 *   showOutcome  – boolean (flash the result)
 */
export default function CricketField({ ballPos, isBowling, hitProgress, outcome, showOutcome }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr  = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    // HiDPI scaling
    canvas.width  = rect.width  * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
    const W = rect.width;
    const H = rect.height;

    // ── Layer 1: Sky & atmosphere ──
    drawSky(ctx, W, H);
    drawStars(ctx, W, H);
    drawFloodlights(ctx, W, H);

    // ── Layer 2: Stands & crowd ──
    drawStands(ctx, W, H);

    // ── Layer 3: Outfield & grass ──
    drawOutfield(ctx, W, H);

    // ── Layer 4: Pitch ──
    const { pX, pW, pY, pH } = drawPitch(ctx, W, H);

    // ── Layer 5: Stumps ──
    // Batting end stumps
    const batStumpX = pX + pW * 0.40;
    const batStumpY = pY + pH * 0.90;
    drawStumps(ctx, batStumpX, batStumpY, 1);

    // Bowling end stumps (slightly smaller for perspective)
    const bowlStumpX = pX + pW * 0.60;
    const bowlStumpY = pY + pH * 0.10;
    drawStumps(ctx, bowlStumpX, bowlStumpY, 0.85);

    // ── Layer 6: Players ──
    // Batsman — positioned near batting stumps
    const batsmanX = pX + pW * 0.33;
    const batsmanY = batStumpY - 14;
    drawBatsman(ctx, batsmanX, batsmanY, hitProgress);

    // Bowler — positioned near bowling stumps
    const bowlerX = pX + pW * 0.67;
    const bowlerY = bowlStumpY - 10;
    drawBowler(ctx, bowlerX, bowlerY, isBowling);

    // ── Layer 7: Ball ──
    if (ballPos && isBowling) {
      drawBall(ctx, ballPos.x, ballPos.y, 7);
    }

    // ── Layer 8: Outcome overlay ──
    if (showOutcome && outcome !== null) {
      drawOutcomeFlash(ctx, W, H, outcome);
    }
  });

  return (
    <canvas
      ref={canvasRef}
      style={{ width: "100%", height: "100%", display: "block" }}
      aria-label="Cricket field"
    />
  );
}
