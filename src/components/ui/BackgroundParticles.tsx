import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

export const BackgroundParticles: React.FC = () => {
  const particles = useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      size: Math.random() * 4 + 1, // 1px to 5px
      x: Math.random() * 100, // 0 to 100vw
      y: Math.random() * 100, // 0 to 100vh
      duration: Math.random() * 20 + 10, // 10s to 30s
      delay: Math.random() * 5,
      isGreen: Math.random() > 0.5,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-blue-900/10 blur-[120px]" />
      <div className="absolute top-[40%] -right-[20%] w-[60vw] h-[60vw] rounded-full bg-cyan-900/10 blur-[150px]" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>

      {particles.map((p) => (
        <motion.div
          key={p.id}
          className={`absolute rounded-full blur-[1px] ${p.isGreen ? 'bg-blue-400' : 'bg-white'}`}
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}vw`,
            top: `${p.y}vh`,
          }}
          initial={{ opacity: 0, scale: 0, y: 0 }}
          animate={{
            opacity: [0, 0.8, 0],
            scale: [0, 1.5, 0],
            y: [0, -100],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};
