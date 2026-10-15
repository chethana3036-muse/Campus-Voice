import React, { useState, useEffect } from 'react';
import { playBubblePop } from '../utils/sound';

interface Bubble {
  id: number;
  size: number;
  left: number;
  duration: number;
  delay: number;
  driftX: number;
  driftEndX: number;
  opacity: number;
  popped?: boolean;
}

interface Sparkle {
  id: number;
  top: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
}

interface FloatingBubblesProps {
  soundEnabled: boolean;
  bubbleCount?: number;
  onBubblePopCount?: () => void;
}

export const FloatingBubbles: React.FC<FloatingBubblesProps> = ({
  soundEnabled,
  bubbleCount = 28,
  onBubblePopCount,
}) => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  // Generate bubbles
  useEffect(() => {
    const generated: Bubble[] = Array.from({ length: bubbleCount }, (_, i) => ({
      id: i,
      size: Math.floor(Math.random() * 55) + 18, // 18px to 73px
      left: Math.random() * 96 + 2, // 2% to 98%
      duration: Math.random() * 12 + 10, // 10s to 22s
      delay: Math.random() * 15, // 0 to 15s
      driftX: (Math.random() - 0.5) * 80,
      driftEndX: (Math.random() - 0.5) * 120,
      opacity: Math.random() * 0.4 + 0.35,
    }));
    setBubbles(generated);

    // Generate random starry sparkles
    const generatedSparkles: Sparkle[] = Array.from({ length: 45 }, (_, i) => ({
      id: i,
      top: Math.random() * 98,
      left: Math.random() * 98,
      size: Math.random() * 5 + 3, // 3px to 8px
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 4,
    }));
    setSparkles(generatedSparkles);
  }, [bubbleCount]);

  const handlePop = (id: number) => {
    playBubblePop(soundEnabled);
    if (onBubblePopCount) {
      onBubblePopCount();
    }
    setBubbles((prev) =>
      prev.map((b) => (b.id === id ? { ...b, popped: true } : b))
    );

    // Re-spawn bubble after animation
    setTimeout(() => {
      setBubbles((prev) =>
        prev.map((b) =>
          b.id === id
            ? {
                ...b,
                popped: false,
                left: Math.random() * 96 + 2,
                size: Math.floor(Math.random() * 55) + 18,
                delay: 0,
              }
            : b
        )
      );
    }, 400);
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {/* Deep Sparkly Blue Base Gradient */}
      <div className="absolute inset-0 bg-linear-to-b from-[#060e22] via-[#091b3e] to-[#040a18]" />

      {/* Radiant Glowing Nebula Blurs for depth */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-cyan-500/15 blur-[120px] animate-pulse-glow" />
      <div className="absolute top-1/3 -right-32 w-[32rem] h-[32rem] rounded-full bg-blue-600/20 blur-[140px] animate-pulse-glow" />
      <div className="absolute bottom-10 left-1/4 w-[36rem] h-[36rem] rounded-full bg-indigo-600/15 blur-[160px] animate-pulse-glow" />
      <div className="absolute top-2/3 right-1/3 w-80 h-80 rounded-full bg-sky-400/10 blur-[100px]" />

      {/* Starry Twinkling Sparkles */}
      {sparkles.map((sp) => (
        <div
          key={sp.id}
          className="absolute animate-sparkle"
          style={
            {
              top: `${sp.top}%`,
              left: `${sp.left}%`,
              width: `${sp.size}px`,
              height: `${sp.size}px`,
              '--sparkle-duration': `${sp.duration}s`,
              '--sparkle-delay': `${sp.delay}s`,
            } as React.CSSProperties
          }
        >
          {/* 4-point diamond star sparkle SVG */}
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-cyan-200">
            <path
              d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z"
              fill="currentColor"
            />
          </svg>
        </div>
      ))}

      {/* Floating Translucent Bubbles */}
      {bubbles.map((b) => (
        <div
          key={b.id}
          onClick={() => handlePop(b.id)}
          className={`absolute pointer-events-auto cursor-pointer transition-transform ${
            b.popped
              ? 'scale-150 opacity-0 duration-300'
              : 'animate-float-bubble hover:scale-125 duration-150'
          }`}
          style={
            {
              left: `${b.left}%`,
              width: `${b.size}px`,
              height: `${b.size}px`,
              '--duration': `${b.duration}s`,
              '--delay': `-${b.delay}s`,
              '--drift-x': `${b.driftX}px`,
              '--drift-end-x': `${b.driftEndX}px`,
              '--bubble-opacity': b.opacity,
            } as React.CSSProperties
          }
          title="Click to pop!"
        >
          <div className="w-full h-full rounded-full bubble-sphere relative">
            {/* Glossy Reflection Highlight */}
            <div className="absolute top-1.5 left-2 w-1/3 h-1/4 rounded-full bg-white/70 blur-[0.5px] rotate-[-25deg]" />
            <div className="absolute bottom-1.5 right-2 w-1.5 h-1.5 rounded-full bg-cyan-200/60 blur-[0.5px]" />
          </div>
        </div>
      ))}
    </div>
  );
};
