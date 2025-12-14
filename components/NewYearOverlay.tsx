import React from 'react';

export const NewYearOverlay: React.FC = () => {
  // Significantly reduced number of snowflakes (from 50 to 15)
  const snowflakes = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    animationDuration: `${Math.random() * 5 + 10}s`, // Slower fall
    animationDelay: `${Math.random() * 5}s`,
    opacity: Math.random() * 0.4 + 0.1, // Less obtrusive opacity
    size: Math.random() * 10 + 10, // Larger size because they are symbols now
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-[40] overflow-hidden">
      <style>
        {`
          @keyframes snowfall {
            0% { transform: translateY(-10vh) rotate(0deg); }
            100% { transform: translateY(110vh) rotate(360deg); }
          }
        `}
      </style>

      {/* Snowflakes */}
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="absolute text-white select-none"
          style={{
            left: flake.left,
            top: -30,
            fontSize: `${flake.size}px`,
            opacity: flake.opacity,
            animationName: 'snowfall',
            animationTimingFunction: 'linear',
            animationIterationCount: 'infinite',
            animationDuration: flake.animationDuration,
            animationDelay: flake.animationDelay,
            textShadow: '0 0 5px rgba(255,255,255,0.3)'
          }}
        >
          ❄
        </div>
      ))}
    </div>
  );
};