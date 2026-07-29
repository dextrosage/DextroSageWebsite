import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { RibbonRenderer } from './components/RibbonRenderer';
import { CameraRig } from './components/CameraRig';
import { scrollStore, getMorphState } from './core/ScrollStore';

// We must animate the bloom intensity from OUTSIDE the EffectComposer.
// @react-three/postprocessing parses its children and will throw a fatal 
// Circular JSON error if it encounters a custom functional component wrapper during a re-render.
const EffectAnimator = ({ bloomRef }: { bloomRef: React.MutableRefObject<any> }) => {
  useFrame(() => {
    if (!bloomRef.current) return;
    const isStaticMode = window.location.pathname === '/login';
    const morph = getMorphState(isStaticMode ? 0 : scrollStore.smoothedProgress);
    bloomRef.current.intensity = morph.bloomIntensity;
  });
  return null;
};

const Scene = () => {
  const bloomRef = useRef<any>(null);
  
  return (
    <>
      <Suspense fallback={null}>
        <CameraRig>
          <RibbonRenderer />
        </CameraRig>
      </Suspense>
      
      {/* Pure effect components ONLY inside EffectComposer */}
      <EffectComposer>
        <Bloom ref={bloomRef} luminanceThreshold={1.2} mipmapBlur intensity={0.8} />
        <Vignette eskil={false} offset={0.15} darkness={1.0} />
      </EffectComposer>
      
      {/* Logic components outside */}
      <EffectAnimator bloomRef={bloomRef} />
    </>
  );
};

export const Background3D: React.FC = React.memo(() => {
  return (
    <div className="fixed inset-0 w-screen h-screen z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 12], fov: 45 }}>
        <Scene />
      </Canvas>
    </div>
  );
});
