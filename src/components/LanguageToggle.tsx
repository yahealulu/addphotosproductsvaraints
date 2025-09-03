import React from 'react';
import { Languages } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const LanguageToggle: React.FC = () => {
  const { language, setLanguage, isArabic } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  return (
    <div className="flex items-center space-x-3 bg-white rounded-xl px-4 py-2 shadow-sm border border-gray-100">
      <Languages className="h-5 w-5 text-gray-600" />
      <div className="flex items-center space-x-2">
        <span className={`text-sm font-medium transition-colors duration-200 ${!isArabic ? 'text-blue-600' : 'text-gray-500'}`}>
          EN
        </span>
        <button
          onClick={toggleLanguage}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            isArabic ? 'bg-blue-600' : 'bg-gray-300'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
              isArabic ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
        <span className={`text-sm font-medium transition-colors duration-200 ${isArabic ? 'text-blue-600' : 'text-gray-500'}`}>
          عربي
        </span>
      </div>
    </div>
  );
};