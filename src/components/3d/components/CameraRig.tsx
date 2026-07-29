import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { scrollStore, getMorphState } from '../core/ScrollStore';

interface CameraRigProps {
  children: React.ReactNode;
}

export const CameraRig: React.FC<CameraRigProps> = ({ children }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  // Track mouse for subtle parallax
  const mouse = useRef({ x: 0, y: 0 });

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    
    const isStaticMode = window.location.pathname === '/login';
    const time = state.clock.getElapsedTime();
    
    // Read centralized morph state
    const morph = getMorphState(scrollStore.smoothedProgress);
    
    // Base layout (Hero)
    const baseScale = isStaticMode ? 1.6 : 1.25;
    const baseX = isStaticMode ? 0 : 3.2;
    const baseY = isStaticMode ? 0 : -0.6;
    
    // Apply state offsets
    // When spread is high, scale down slightly so the landscape fits better
    const targetScale = baseScale - (morph.spread * 0.2);
    const targetX = baseX + (isStaticMode ? 0 : morph.cameraX - (morph.spread * 2.0)); 
    const targetY = baseY + (isStaticMode ? 0 : morph.cameraY);
    const targetZ = isStaticMode ? 0 : morph.cameraZ;

    // Slow organic drift
    const timeSpeed = isStaticMode ? 0.05 : 0.1;
    const driftX = Math.sin(time * timeSpeed) * 0.2;
    const driftY = Math.cos(time * (timeSpeed * 1.5)) * 0.2;
    const breathe = 1.0 + Math.sin(time * (timeSpeed * 5)) * 0.01;

    // Mouse Parallax
    // Reduce parallax when morphed into landscape to keep it feeling massive and rooted
    const parallaxStrength = 0.5 * (1.0 - morph.spread * 0.8);
    const parallaxX = mouse.current.x * parallaxStrength;
    const parallaxY = mouse.current.y * parallaxStrength;

    // Smooth position interpolation
    const finalX = targetX + driftX + parallaxX;
    const finalY = targetY + driftY + parallaxY;
    
    // We apply Z to position and not scale to physically move camera/object
    groupRef.current.position.lerp(new THREE.Vector3(finalX, finalY, targetZ), 0.05);
    
    const finalScale = targetScale * breathe;
    groupRef.current.scale.lerp(new THREE.Vector3(finalScale, finalScale, finalScale), 0.05);
    
    // Subdued rotation when turning into landscape
    const rotSpeed = 1.0 - morph.spread;
    groupRef.current.rotation.y = Math.sin(time * 0.05) * 0.05 * rotSpeed;
    groupRef.current.rotation.x = Math.cos(time * 0.03) * 0.02 * rotSpeed;
  });

  return <group ref={groupRef}>{children}</group>;
};
