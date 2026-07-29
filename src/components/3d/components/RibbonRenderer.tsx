import React, { useRef, useMemo, useLayoutEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { VolumeGenerator } from '../core/VolumeGenerator';
import { NoiseField, ColorField } from '../core/fields';
import { scrollStore, getMorphState } from '../core/ScrollStore';

export const RibbonRenderer: React.FC = () => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  // Generate base geometry data once
  const ribbons = useMemo(() => VolumeGenerator.generate(), []);
  const count = ribbons.length;

  useLayoutEffect(() => {
    if (meshRef.current) {
      // Initialize matrices to prevent empty first frame
      ribbons.forEach((ribbon, i) => {
        dummy.position.copy(ribbon.position);
        dummy.scale.copy(ribbon.scale);
        dummy.updateMatrix();
        meshRef.current!.setMatrixAt(i, dummy.matrix);
        meshRef.current!.setColorAt(i, new THREE.Color(0,0,0));
      });
      meshRef.current.instanceMatrix.needsUpdate = true;
      if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
    }
  }, [ribbons, dummy]);

  // Main scroll-driven morphing and rendering loop
  useFrame((state) => {
    if (!meshRef.current || !meshRef.current.instanceColor) return;
    
    const isStaticMode = window.location.pathname === '/login';
    // 1. Update Global Scroll State
    scrollStore.update();
    const morph = getMorphState(isStaticMode ? 0 : scrollStore.smoothedProgress);
    
    const time = state.clock.getElapsedTime();
    const timeSlow = time * (isStaticMode ? 0.15 : 0.3);

    // 2. Interpolate Material Properties
    if (materialRef.current) {
      materialRef.current.opacity = 0.8 * morph.opacityMultiplier;
    }
    
    // 3. Morph Geometry & Interpolate Colors
    for (let i = 0; i < count; i++) {
      const ribbon = ribbons[i];
      
      let mx = ribbon.position.x;
      let my = ribbon.position.y;
      let mz = ribbon.position.z;

      // State 2: Expansion (slabs slide apart)
      if (morph.explode > 0) {
        const pushX = (ribbon.nx > 0 ? 1 : -1) * morph.explode * Math.abs(ribbon.nx) * 4.0;
        const pushZ = (ribbon.nz > 0 ? 1 : -1) * morph.explode * Math.abs(ribbon.nz) * 4.0;
        mx += pushX;
        mz += pushZ;
      }
      
      // State 3 & 4: Transformation into Landscape (flatten Y, stretch X/Z, add terrain waves)
      if (morph.flatten > 0) {
        my *= (1.0 - Math.min(morph.flatten, 0.98)); // compress Y heavily
        // Procedural terrain waves
        const wave = NoiseField.get(mx * 0.1, 0, mz * 0.1, time * 0.05);
        my += wave * morph.flatten * 2.5; 
      }
      
      if (morph.spread > 0) {
        mx *= (1.0 + morph.spread * 5.0);
        mz *= (1.0 + morph.spread * 5.0);
      }
      
      // Apply transforms
      dummy.position.set(mx, my, mz);
      dummy.scale.copy(ribbon.scale);
      
      // Stretch instances slightly so they blend together into a terrain
      if (morph.spread > 0) {
         dummy.scale.x = ribbon.scale.x * (1.0 + morph.spread * 3.5);
         dummy.scale.z = ribbon.scale.z * (1.0 + morph.spread * 3.5);
      }

      // Add tiny organic flickering motion
      const tinyBreathe = Math.sin(ribbon.phase + time * 2.0) * 0.02;
      dummy.scale.y = ribbon.scale.y * (1.0 + tinyBreathe);

      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
      
      // Interpolate Colors
      const n = NoiseField.get(ribbon.noiseOffset.x, ribbon.noiseOffset.y, ribbon.noiseOffset.z, timeSlow);
      const pulse = Math.sin(ribbon.phase + time * 1.5) * 0.15;
      const currentIntensity = Math.max(0, ribbon.baseBrightness + (n * 0.3) + pulse);
      
      const c = ColorField.getColor(currentIntensity, morph.paletteBlend);
      
      // Apply variable bloom boost based on state
      const boost = 1.0 + Math.pow(currentIntensity, 3) * (3.0 * morph.bloomIntensity);
      c.multiplyScalar(boost);
      
      meshRef.current.setColorAt(i, c);
    }
    
    // Batch upload to GPU
    meshRef.current.instanceMatrix.needsUpdate = true;
    meshRef.current.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} frustumCulled={false}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial 
        ref={materialRef}
        transparent={true} 
        depthWrite={false} 
        blending={THREE.AdditiveBlending} 
        toneMapped={false} 
        opacity={0.8}
      />
    </instancedMesh>
  );
};
