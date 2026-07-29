import { createNoise3D } from 'simplex-noise';
import * as THREE from 'three';

// --- Noise Field ---
const noise3D = createNoise3D();

export const NoiseField = {
  get: (x: number, y: number, z: number, time: number = 0): number => {
    return noise3D(x, y, z + time);
  }
};

// --- Density Field ---
export const DensityField = {
  getDensity: (x: number, y: number, z: number, Rx: number, Ry: number, Rz: number): number => {
    const nx = x / Rx;
    const ny = y / Ry;
    const nz = z / Rz;
    const distSq = nx * nx + ny * ny + nz * nz;
    
    if (distSq > 1.0) return 0;
    
    const dist = Math.sqrt(distSq);
    // Smooth volumetric falloff. Dense at center, drops to 0 at edges.
    return Math.max(0, 1.0 - Math.pow(dist, 2.5));
  }
};

// --- Light Field ---
export const LightField = {
  getBrightness: (x: number, y: number, z: number, core: THREE.Vector3): number => {
    // Reduce bright core size so it doesn't blow out the whole object
    const dist = core.distanceTo(new THREE.Vector3(x, y, z));
    return 1.5 / (1.0 + Math.pow(dist * 1.8, 2));
  }
};

// --- Color Field ---
const cWhite = new THREE.Color('#ffffff');
const cGreenCyan = new THREE.Color('#34d399'); // Minty cyan from the image core
const cCyan = new THREE.Color('#0ea5e9'); // Light blue/cyan
const cBlue = new THREE.Color('#2563eb'); // Deep blue
const cNavy = new THREE.Color('#0f172a');

// Palette 2: Landscape
const cLandWhite = new THREE.Color('#a7f3d0'); // Soft emerald white
const cLandEmerald = new THREE.Color('#059669'); // Deep emerald
const cLandDarkCyan = new THREE.Color('#0e7490'); // Dark cyan
const cLandDeepNavy = new THREE.Color('#020617'); // Very deep navy

export const ColorField = {
  getColor: (intensity: number, paletteBlend: number = 0): THREE.Color => {
    const color = new THREE.Color();
    
    const heroColor = new THREE.Color();
    if (intensity > 0.85) {
      heroColor.lerpColors(cGreenCyan, cWhite, (intensity - 0.85) / 0.15);
    } else if (intensity > 0.5) {
      heroColor.lerpColors(cCyan, cGreenCyan, (intensity - 0.5) / 0.35);
    } else if (intensity > 0.2) {
      heroColor.lerpColors(cBlue, cCyan, (intensity - 0.2) / 0.3);
    } else {
      heroColor.lerpColors(cNavy, cBlue, Math.max(0, intensity) / 0.2);
    }
    
    if (paletteBlend <= 0.01) {
      return heroColor;
    }

    const landColor = new THREE.Color();
    if (intensity > 0.85) {
      landColor.lerpColors(cLandEmerald, cLandWhite, (intensity - 0.85) / 0.15);
    } else if (intensity > 0.5) {
      landColor.lerpColors(cLandDarkCyan, cLandEmerald, (intensity - 0.5) / 0.35);
    } else if (intensity > 0.2) {
      landColor.lerpColors(cLandDeepNavy, cLandDarkCyan, (intensity - 0.2) / 0.3);
    } else {
      landColor.lerpColors(cNavy, cLandDeepNavy, Math.max(0, intensity) / 0.2);
    }
    
    color.lerpColors(heroColor, landColor, paletteBlend);
    return color;
  }
};
