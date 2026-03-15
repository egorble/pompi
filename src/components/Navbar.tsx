import React from 'react';
import { motion } from 'motion/react';
import { Sun, Moon } from 'lucide-react';
import { formatCurrency } from '../utils';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  activeTab: 'Trade' | 'Positions' | 'Points';
  setActiveTab: (tab: 'Trade' | 'Positions' | 'Points') => void;
  balance: number;
  onAddCash: () => void;
}

export function Navbar({ activeTab, setActiveTab, balance, onAddCash }: NavbarProps) {
  const { isDark, toggle } = useTheme();

  return (
    <nav className="bg-dm-surface border-b border-dm-border px-4 md:px-6 py-3 md:py-4 flex items-center justify-between sticky top-0 z-50 overflow-x-auto no-scrollbar">
      <div className="flex items-center gap-4 md:gap-8 shrink-0">
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3, type: "spring" }}
          className="flex items-center gap-2 cursor-pointer"
        >
          <span className="font-extrabold text-xl md:text-2xl tracking-tight text-dream-blue">Pompi</span>
        </motion.div>

        <div className="hidden lg:flex items-center gap-1 bg-dm-surface-raised p-1 rounded-full relative shrink-0">
          {(['Trade', 'Positions', 'Points'] as const).map((tab) => (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative px-4 md:px-5 py-1.5 md:py-2 rounded-full font-semibold text-sm md:text-base transition-colors z-10 ${
                activeTab === tab
                  ? 'text-dream-blue'
                  : 'hover:text-dm-text text-dm-text3'
              }`}
            >
              {activeTab === tab && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute inset-0 bg-dm-surface shadow-sm rounded-full -z-10"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              {tab}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-4 shrink-0 ml-4">
        <div className="hidden lg:flex flex-col items-end mr-2">
          <span className="text-[10px] uppercase font-bold text-dm-text3">Total Balance</span>
          <span className="font-bold text-lg leading-none text-dm-text">{formatCurrency(balance)}</span>
        </div>
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
          whileTap={{ scale: 0.95 }}
          onClick={onAddCash}
          className="bg-dm-inverse text-dm-surface px-4 md:px-8 py-2 md:py-3.5 rounded-full font-extrabold text-xs md:text-base whitespace-nowrap"
        >
          Add Cash
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggle}
          className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-dm-surface-raised flex items-center justify-center border border-dm-border2 cursor-pointer text-dm-text2 hover:text-dm-text transition-colors"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </motion.button>
      </div>
    </nav>
  );
}
