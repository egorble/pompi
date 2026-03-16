import React from 'react';
import { useTheme } from '../context/ThemeContext';

export function Background() {
  const { isDark } = useTheme();
  
  // Define stripe colors based on theme
  const stripeColor = isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)';
  const bgColor = isDark ? '#000000' : '#F8FAFC'; // Slightly cooler light background

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1]" style={{ backgroundColor: bgColor }}>
      
      {/* 
        Subtle diagonal stripes pattern
      */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `repeating-linear-gradient(-45deg, transparent, transparent 30px, ${stripeColor} 30px, ${stripeColor} 31px)`,
        }}
      />

      {/* 
        Subtle vignette and top glow to give depth and focus to the center 
      */}
      <div 
        className="absolute inset-0 opacity-100 dark:opacity-90"
        style={{
          background: `
            radial-gradient(ellipse at top, ${isDark ? 'rgba(41, 98, 255, 0.08)' : 'rgba(41, 98, 255, 0.04)'} 0%, transparent 60%),
            radial-gradient(circle at center, transparent 0%, var(--dm-bg) 110%)
          `
        }}
      />
    </div>
  );
}
