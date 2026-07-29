import * as THREE from 'three';

class ScrollStore {
  public progress = 0;
  public smoothedProgress = 0;
  
  public update() {
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    this.progress = maxScroll > 0 ? Math.min(window.scrollY / maxScroll, 1.0) : 0;
    this.smoothedProgress = THREE.MathUtils.lerp(this.smoothedProgress, this.progress, 0.04);
  }
}

export const scrollStore = new ScrollStore();

export const getMorphState = (p: number) => {
  let explode = 0;
  let flatten = 0;
  let spread = 0;
  let paletteBlend = 0;
  let bloomIntensity = 1.0;
  let opacityMultiplier = 1.0;
  let cameraZ = 0; // Relative z movement
  let cameraY = 0;
  let cameraX = 0;
  
  if (p < 0.2) {
    // 0 - 20%: Hero
    // Fully intact sphere.
  } else if (p < 0.4) {
    // 20 - 40%: Expansion
    const t = (p - 0.2) / 0.2;
    explode = t; // 0 to 1
    bloomIntensity = 1.0 - (t * 0.2);
    cameraZ = -t * 2; // move slightly closer
  } else if (p < 0.6) {
    // 40 - 60%: Transformation
    const t = (p - 0.4) / 0.2;
    explode = 1.0 - (t * 0.2);
    flatten = t;
    spread = t * 0.6;
    paletteBlend = t;
    bloomIntensity = 0.8 - (t * 0.4);
    cameraZ = -2 - (t * 3);
    cameraY = -t * 2;
  } else if (p < 0.85) {
    // 60 - 85%: Landscape
    const t = (p - 0.6) / 0.25;
    explode = 0.8 - (t * 0.5);
    flatten = 1.0 + (t * 0.8);
    spread = 0.6 + (t * 0.6);
    paletteBlend = 1.0;
    bloomIntensity = 0.4 - (t * 0.2);
    cameraZ = -5 - (t * 1);
    cameraY = -2 - (t * 1.5);
  } else {
    // 85 - 100%: Fade
    const t = Math.min((p - 0.85) / 0.15, 1.0);
    explode = 0.3;
    flatten = 1.8;
    spread = 1.2;
    paletteBlend = 1.0;
    bloomIntensity = 0.2 * (1 - t);
    opacityMultiplier = 1.0 - t;
    cameraZ = -6 + (t * 3); // move away slightly
    cameraY = -3.5 - (t * 1);
  }
  
  return { explode, flatten, spread, paletteBlend, bloomIntensity, opacityMultiplier, cameraX, cameraY, cameraZ };
};
