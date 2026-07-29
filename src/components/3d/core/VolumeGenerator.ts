import * as THREE from 'three';
import { NoiseField, LightField } from './fields';

export interface RibbonData {
  position: THREE.Vector3;
  scale: THREE.Vector3;
  baseBrightness: number;
  phase: number;
  noiseOffset: THREE.Vector3;
  life: number;
  nx: number;
  ny: number;
  nz: number;
  dist: number;
}

export const VolumeGenerator = {
  generate: (): RibbonData[] => {
    const slabs: RibbonData[] = [];
    
    // Core object bounds
    const Rx = 5.5;
    const Ry = 4.2;
    const Rz = 3.5;
    
    const core = new THREE.Vector3(-1.5, 0.5, 1.0);
    
    // Column grid spacing
    const xStep = 0.5;
    const zStep = 0.5;
    // Slab vertical spacing (height of brick + gap)
    const yStep = 0.12;
    const brickHeight = 0.08; 

    // Generate columns
    for (let x = -Rx; x <= Rx; x += xStep) {
      for (let z = -Rz; z <= Rz; z += zStep) {
        
        // Base column properties driven by noise
        const colNoise = NoiseField.get(x * 0.3, 0, z * 0.3);
        const colHeight = Ry * (0.6 + colNoise * 0.4); 
        const yStart = -colHeight;
        const yEnd = colHeight;

        for (let y = yStart; y <= yEnd; y += yStep) {
          // Columns are perfectly straight vertically, no jitter on x, y, z.
          const ox = x;
          const oy = y;
          const oz = z;

          // Slab widths vary drastically to create the jagged edges seen in the image
          const widthNoise = NoiseField.get(ox * 1.2, oy * 1.5, oz * 1.2);
          const width = 0.4 + widthNoise * 0.4; // varies from 0.0 to 0.8

          // Distance for organic masking
          const nx = ox / Rx;
          const ny = oy / Ry;
          const nz = oz / Rz;
          const dist = Math.sqrt(nx*nx + ny*ny + nz*nz);
          
          const shapeNoise = NoiseField.get(nx * 2, ny * 2, nz * 2, 5.0);
          const distortedDist = dist + shapeNoise * 0.3;
          
          if (distortedDist > 1.0) continue; 
          
          // Softer edge falloff for a more integrated, atmospheric feel
          const densityProb = 1.0 - Math.pow(distortedDist, 1.5);
          if (Math.random() > densityProb) continue;
          
          // Occasional missing bricks in the column
          if (Math.random() < 0.1) continue;

          // Center of energy is on the left
          const baseBrightness = LightField.getBrightness(ox, oy, oz, core);

          slabs.push({
            position: new THREE.Vector3(ox, oy, oz),
            // Noticeable thickness to match the "stacked bricks" in the image
            scale: new THREE.Vector3(width, brickHeight, 0.4), 
            baseBrightness,
            phase: Math.random() * Math.PI * 2,
            noiseOffset: new THREE.Vector3(ox * 0.4, oy * 0.4, oz * 0.4),
            life: Math.random(),
            nx, ny, nz, dist
          });
        }
      }
    }
    
    return slabs;
  }
};
