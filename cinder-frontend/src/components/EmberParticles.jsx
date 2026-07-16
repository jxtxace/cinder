import React, { useState, useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';

export default function EmberParticles() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { manualReducedMotion } = useSettings();

  useEffect(() => {
    setIsClient(true);
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const listener = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  // Avoid hydration mismatch and respect reduced motion dynamically
  if (!isClient || prefersReducedMotion || manualReducedMotion) return null;

  // Render particles statically based on array index to avoid layout thrashing
  const particles = Array.from({ length: 45 }).map((_, i) => {
    // Generate pseudo-random deterministic values so they don't jump around on re-renders
    const randomSeed = (i * 12345) % 100;
    const randomSeed2 = (i * 54321) % 100;
    
    const left = randomSeed; 
    const animDuration = 8 + (randomSeed2 / 100) * 12; 
    const animDelay = (randomSeed / 100) * 15;
    const size = 3 + (randomSeed2 % 6); 
    const opacity = 0.2 + (randomSeed % 5) / 5;
    
    return (
      <div 
        key={i}
        className="absolute rounded-full bg-flame-orange mix-blend-screen pointer-events-none"
        style={{
          left: `${left}%`,
          bottom: '-20px',
          width: `${size}px`,
          height: `${size}px`,
          '--particle-opacity': opacity,
          animation: `floatUp ${animDuration}s linear infinite`,
          animationDelay: `${animDelay}s`,
          boxShadow: `0 0 ${size * 2}px rgba(255,107,26,0.6)`
        }}
      />
    );
  });

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {particles}
    </div>
  );
}
