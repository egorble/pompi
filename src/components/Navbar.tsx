import React from 'react';
import { motion } from 'motion/react';
import { Sun, Moon, Globe, User, Bell } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export function Navbar() {
  const { isDark, toggle } = useTheme();

  return (
    <nav className="bg-transparent px-4 lg:px-6 py-4 lg:py-6 flex items-center justify-between z-50 relative lg:absolute lg:top-0 lg:left-0 lg:w-full lg:pointer-events-none shrink-0 w-full">
      <div className="flex items-center gap-4 md:gap-8 shrink-0 lg:pointer-events-auto">
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3, type: "spring" }}
          className="flex items-center gap-2 cursor-pointer lg:hidden"
        >
          <span className="font-extrabold text-xl tracking-tight text-dm-text">Pompi</span>
        </motion.div>
      </div>

    </nav>
  );
}
