import React from 'react';
import { Sun, Moon, Palette } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../../context/themeSlice';

export const ThemeToggle = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.mode);

  return (
    <button
      onClick={() => dispatch(toggleTheme())}
      className="relative p-3 rounded-2xl bg-gradient-to-r from-primary-500/10 to-secondary-500/10 hover:from-primary-500/20 hover:to-secondary-500/20 border border-primary-200/20 dark:border-primary-700/20 backdrop-blur-sm transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl group"
      aria-label="Toggle theme"
    >
      <div className="relative w-6 h-6">
        <Sun 
          className={`absolute inset-0 w-6 h-6 text-amber-500 transition-all duration-500 ${
            theme === 'light' ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-0 opacity-0'
          }`}
        />
        <Moon 
          className={`absolute inset-0 w-6 h-6 text-blue-400 transition-all duration-500 ${
            theme === 'dark' ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
          }`}
        />
      </div>
      
      {/* Animated background */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-500 to-secondary-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
      
      {/* Glow effect */}
      <div className={`absolute inset-0 rounded-2xl transition-all duration-300 ${
        theme === 'light' 
          ? 'shadow-amber-500/20 group-hover:shadow-amber-500/40' 
          : 'shadow-blue-500/20 group-hover:shadow-blue-500/40'
      } group-hover:shadow-lg`}></div>
    </button>
  );
};