import { useRef, useCallback } from "react";

/**
 * useHitAnimation
 * Drives the batsman's bat-swing animation (0 → 1 progress).
 * Calls onComplete when the swing finishes.
 */
export function useHitAnimation(setHitProgress, onComplete) {
  const rafRef = useRef(null);

  const stop = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const play = useCallback(() => {
    stop();
    let frame = 0;
    const totalFrames = 18;

    const tick = () => {
      frame++;
      setHitProgress(frame / totalFrames);
      if (frame < totalFrames) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setHitProgress(0);
        if (onComplete) onComplete();
      }
    };

    rafRef.current = requestAnimationFrame(tick);
  }, [stop, setHitProgress, onComplete]);

  return { play, stop };
}
