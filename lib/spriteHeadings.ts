// Measured on-screen heading (degrees, clockwise from screen-up) of the vehicle body in each of the
// 48 frames of public/v/<vehicle>.webp. Derived from each frame's alpha-mask principal axis, so frame
// choice matches what the eye sees rather than assuming even 7.5° steps (which are wrong on diagonals).
// Regenerate if the sprite sheets change.
export const SPRITE_HEADINGS: Record<string, number[]> = {
  car: [0.1, 10.3, 20.8, 31.1, 40.6, 49.0, 56.6, 63.5, 69.8, 75.6, 81.1, 86.4, 91.7, 96.9, 102.2, 107.6, 113.4, 119.5, 126.1, 133.2, 141.2, 150.1, 159.6, 169.7, 180.0, 190.2, 200.3, 209.9, 218.7, 226.7, 233.9, 240.6, 246.7, 252.4, 257.8, 263.2, 268.4, 273.6, 278.9, 284.5, 290.3, 296.7, 303.5, 311.2, 319.6, 329.0, 339.1, 349.7],
};

/** Frame whose drawn heading is closest to the given on-screen travel direction. */
// All sheets were rendered on the same turntable/camera. The car's long, symmetric body gives the most
// reliable measurement; CNG canopy, bike rider and the short Car Plus hatch skew their own axes, so every
// vehicle uses the car's heading table.
export function frameFor(_vehicle: string, deg: number) {
  const t = SPRITE_HEADINGS.car;
  let best = 0;
  let bestD = 999;
  for (let i = 0; i < t.length; i++) {
    const d = Math.abs((((deg - t[i]) % 360) + 540) % 360 - 180);
    if (d < bestD) {
      bestD = d;
      best = i;
    }
  }
  return best;
}

// One tail light per vehicle per sprite frame, as an [x, y] fraction of the cell (empty = rear not visible).
// Car only: the lamp actually painted in each frame, so the light only shows when the rear faces the viewer.
// Other vehicles have no tail light.
export const TAIL_LIGHTS: Record<string, [number, number][][]> = {
  car: [[[0.402, 0.759]], [[0.36, 0.751]], [[0.316, 0.736]], [[0.277, 0.717]], [[0.414, 0.756]], [[0.208, 0.667]], [[0.331, 0.729]], [[0.294, 0.712]], [[0.262, 0.692]], [[0.232, 0.669]], [[0.212, 0.645]], [[0.195, 0.618]], [[0.183, 0.591]], [[0.172, 0.56]], [[0.169, 0.531]], [[0.17, 0.501]], [[0.178, 0.472]], [[0.19, 0.448]], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [[0.819, 0.473]], [[0.825, 0.505]], [[0.827, 0.534]], [[0.823, 0.563]], [[0.814, 0.593]], [[0.797, 0.621]], [[0.78, 0.648]], [[0.764, 0.669]], [[0.732, 0.692]], [[0.681, 0.716]], [[0.644, 0.731]], [[0.601, 0.743]], [[0.557, 0.753]], [[0.536, 0.762]], [[0.494, 0.767]], [[0.455, 0.768]]],
};
