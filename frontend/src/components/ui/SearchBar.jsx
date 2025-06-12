import React from 'react';
import { Search, X } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { setSearch } from '../../context/uiSlice';

export const SearchBar = () => {
  const dispatch = useDispatch();
  const search = useSelector((state) => state.ui.search);

  const clearSearch = () => {
    dispatch(setSearch(''));
  };

  return (
    <div className="relative group">
      <div className="relative">
        <input
          type="text"
          placeholder="Search for amazing products..."
          value={search}
          onChange={(e) => dispatch(setSearch(e.target.value))}
          className="w-full pl-12 pr-12 py-4 rounded-2xl border-2 border-gray-200/50 dark:border-dark-700/50 bg-white/80 dark:bg-dark-800/80 backdrop-blur-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-primary-500 dark:focus:border-primary-400 focus:ring-4 focus:ring-primary-500/20 transition-all duration-300 hover:border-primary-300 dark:hover:border-primary-600 shadow-lg hover:shadow-xl"
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-6 w-6 group-focus-within:text-primary-500 dark:group-focus-within:text-primary-400 transition-colors duration-300" />
        
        {search && (
          <button
            onClick={clearSearch}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors duration-300 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-dark-700"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
      
      {/* Glow effect on focus */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-500/10 to-secondary-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none blur-xl"></div>
    </div>
  );
};