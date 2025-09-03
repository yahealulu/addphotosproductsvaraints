import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, onSearchChange }) => {
  const { isArabic } = useLanguage();
  const [isFocused, setIsFocused] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (onSearchChange && typeof onSearchChange === 'function') {
      onSearchChange(value);
    }
  };
  
  return (
    <motion.div 
      className="relative w-full max-w-2xl mx-auto mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={`relative bg-white/80 backdrop-blur-sm rounded-xl border border-white/30 shadow-lg transition-all duration-300 ${
        isFocused ? 'shadow-xl border-blue-300' : 'hover:shadow-lg'
      }`}>
        
        {/* Search icon */}
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className={`h-5 w-5 transition-colors duration-300 ${
            isFocused ? 'text-blue-500' : 'text-gray-400'
          }`} />
        </div>
        
        {/* Input field */}
        <input
          type="text"
          placeholder={isArabic ? 'البحث عن المنتجات...' : 'Search products...'}
          value={searchTerm || ''}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`block w-full pl-12 pr-4 py-4 bg-transparent text-gray-800 placeholder-gray-500 focus:outline-none transition-all duration-300 font-medium ${isArabic ? 'text-right font-arabic' : 'text-left'}`}
        />
        
        {/* Focus underline */}
        <div className={`absolute bottom-0 left-0 h-0.5 bg-blue-500 transition-all duration-300 ${
          isFocused ? 'w-full' : 'w-0'
        }`} />
      </div>
    </motion.div>
  );
};