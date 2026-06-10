import { useCallback, useEffect, useRef } from 'react';
import { useVisualizerStore } from '../store/useVisualizerStore.js';

export const DEFAULT_ANIMATION_DURATION_MS = 1600;

export function useVisualizerAnimation() {
  const animSpeed = useVisualizerStore((s) => s.animSpeed);
  const setT = useVisualizerStore((s) => s.setT);
  const speedRef = useRef(animSpeed);
  const animationRef = useRef(null);

  useEffect(() => {
    speedRef.current = animSpeed;
  }, [animSpeed]);

  useEffect(() => () => cancelAnimationFrame(animationRef.current), []);

  const runAnimation = useCallback((options = {}) => {
    cancelAnimationFrame(animationRef.current);

    const durationMs = options.durationMs || DEFAULT_ANIMATION_DURATION_MS;
    const speedAtStart = Number(options.speed || speedRef.current || 1);
    const remoteStartedAt = Number(options.startedAt || 0);
    const elapsedFromRemoteStart = remoteStartedAt ? Math.max(0, Date.now() - remoteStartedAt) : 0;
    const startedAtPerf = performance.now() - (elapsedFromRemoteStart / Math.max(speedAtStart, 0.001));

    const tick = (now) => {
      const elapsed = (now - startedAtPerf) * speedAtStart;
      const p = Math.min(1, elapsed / durationMs);
      const eased = p < 0.5 ? 2 * p * p : 1 - ((-2 * p + 2) ** 2) / 2;
      setT(eased);

      if (p < 1) {
        animationRef.current = requestAnimationFrame(tick);
      } else {
        setT(1);
      }
    };

    setT(0);
    animationRef.current = requestAnimationFrame(tick);
  }, [setT]);

  const stopAnimation = useCallback(() => {
    cancelAnimationFrame(animationRef.current);
  }, []);

  return { runAnimation, stopAnimation, durationMs: DEFAULT_ANIMATION_DURATION_MS };
}
