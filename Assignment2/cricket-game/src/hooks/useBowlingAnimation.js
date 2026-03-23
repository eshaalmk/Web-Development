import { useRef, useCallback } from "react";
import { easeInOut } from "../utils/gameLogic";

/**
 * useBowlingAnimation
 * Animates the cricket ball from bowler to batsman end.
 * Calls onComplete when the ball reaches the batsman.
 */
export function useBowlingAnimation(canvasContainerRef, setBallPos, onComplete) {
  const rafRef = useRef(null);

  const stop = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const play = useCallback(() => {
    stop();

    const el  = canvasContainerRef.current;
    const elW = el ? el.offsetWidth  : 620;
    const elH = el ? el.offsetHeight : 320;

    // Start: near bowling stumps; End: near batting stumps
    // These fractions mirror where the stumps are drawn in drawField.js
    const startX = elW * (0.35 + 0.30 * 0.65);
    const startY = elH * (0.50 + 0.44 * 0.10);
    const endX   = elW * (0.35 + 0.30 * 0.38);
    const endY   = elH * (0.50 + 0.44 * 0.90) - 12;

    let frame = 0;
    const totalFrames = 42;

    const tick = () => {
      frame++;
      const progress = easeInOut(frame / totalFrames);
      setBallPos({
        x: startX + (endX - startX) * progress,
        y: startY + (endY - startY) * progress,
      });

      if (frame < totalFrames) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setBallPos(null);   // hide ball once it reaches bat
        if (onComplete) onComplete();
      }
    };

    rafRef.current = requestAnimationFrame(tick);
  }, [stop, canvasContainerRef, setBallPos, onComplete]);

  return { play, stop };
}
