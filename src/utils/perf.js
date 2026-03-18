export const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const hasHover = window.matchMedia('(hover: hover)').matches;

let lowPerf = false;
export function detectLowPerformance() {
  let frames = 0, lastTime = performance.now(), slowFrames = 0;
  function check(now) {
    frames++;
    if (frames > 60) {
      const fps = (frames / (now - lastTime)) * 1000;
      if (fps < 40) slowFrames++;
      if (slowFrames >= 2) { lowPerf = true; return; }
      frames = 0; lastTime = now;
    }
    if (!lowPerf && frames < 300) requestAnimationFrame(check);
  }
  requestAnimationFrame(check);
}
export function isLowPerformance() { return lowPerf; }
