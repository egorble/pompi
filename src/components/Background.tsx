import React from 'react';
import { motion } from 'motion/react';
import { useTheme } from '../context/ThemeContext';

export function Background() {
  const { isDark } = useTheme();
  
  // Define grid colors based on theme
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)';
  const gridDotColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
  // Using pure black for dark theme background to match our CSS variables in index.css
  const bgColor = isDark ? '#000000' : '#F4F6F8';

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1]" style={{ backgroundColor: bgColor }}>
      {/* 
        Vibrant Animated Gradient Orbs behind the grid 
      */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ mixBlendMode: isDark ? 'screen' : 'normal' }}>
        {/* Blue Orb - Top Left */}
        <motion.div
          animate={{
            x: [0, 60, 0],
            y: [0, 40, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full opacity-60 dark:opacity-40"
          style={{
            background: 'radial-gradient(circle, rgba(41, 98, 255, 0.8) 0%, transparent 60%)',
            filter: 'blur(90px)'
          }}
        />
        
        {/* Green Orb - Bottom Right */}
        <motion.div
          animate={{
            x: [0, -50, 0],
            y: [0, 60, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[-15%] right-[-10%] w-[60%] h-[60%] rounded-full opacity-50 dark:opacity-30"
          style={{
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.6) 0%, transparent 65%)',
            filter: 'blur(100px)'
          }}
        />
        
        {/* Purple/Pink Orb - Center Right/Top */}
        <motion.div
          animate={{
            x: [0, 40, 0],
            y: [0, -50, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 5 }}
          className="absolute top-[10%] right-[5%] w-[50%] h-[50%] rounded-full opacity-40 dark:opacity-25"
          style={{
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.6) 0%, transparent 60%)',
            filter: 'blur(80px)'
          }}
        />
      </div>

      {/* 
        Grid pattern 1: Standard squares 
      */}
      <div 
        className="absolute inset-0" 
        style={{
          backgroundImage: `
            linear-gradient(to right, ${gridColor} 1px, transparent 1px),
            linear-gradient(to bottom, ${gridColor} 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />
      
      {/* 
        Grid pattern 2: Dots at intersections for a more premium look 
      */}
      <div 
        className="absolute inset-0" 
        style={{
          backgroundImage: `radial-gradient(${gridDotColor} 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          backgroundPosition: '-0.5px -0.5px' // Align with the grid lines
        }}
      />

      {/* 
        Subtle vignette gradient overlay to darken the edges and give focus to the center 
      */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,var(--dm-bg)_100%)] opacity-80" />
    </div>
  );
}
