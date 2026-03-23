import { useRef, useCallback } from "react";
import { SLIDER_SPEED } from "../utils/constants";

/**
 * useSlider
 * Manages the continuously bouncing power-bar slider.
 * Returns controls to start/stop the slider and a ref for reading current pos.
 */
export function useSlider(barRef, onTick) {
  const posRef   = useRef(0);   // 0–1 current position
  const dirRef   = useRef(1);   // +1 or -1 direction
  const rafRef   = useRef(null);

  const stop = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    stop();
    const barW      = barRef.current?.offsetWidth || 520;
    const speedPct  = SLIDER_SPEED / barW;

    const tick = () => {
      posRef.current += speedPct * dirRef.current;
      if (posRef.current >= 1) { posRef.current = 1; dirRef.current = -1; }
      if (posRef.current <= 0) { posRef.current = 0; dirRef.current =  1; }
      onTick(posRef.current);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [stop, barRef, onTick]);

  const reset = useCallback(() => {
    stop();
    posRef.current = 0;
    dirRef.current = 1;
    onTick(0);
  }, [stop, onTick]);

  return { start, stop, reset, posRef };
}
