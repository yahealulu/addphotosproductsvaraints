import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface NotificationProps {
  type: 'success' | 'error';
  message: string;
  onClose: () => void;
}

export const Notification: React.FC<NotificationProps> = ({ type, message, onClose }) => {
  const { isArabic } = useLanguage();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className={`fixed top-4 ${isArabic ? 'left-4' : 'right-4'} z-50 min-w-[300px] max-w-md`}
    >
      <div className={`rounded-lg shadow-lg p-4 flex items-start ${
        type === 'success' 
          ? 'bg-green-100 border border-green-200' 
          : 'bg-red-100 border border-red-200'
      }`}>
        <div className={`flex-shrink-0 mr-3 ${type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
          {type === 'success' ? (
            <CheckCircle className="h-6 w-6" />
          ) : (
            <XCircle className="h-6 w-6" />
          )}
        </div>
        <div className="flex-1">
          <p className={`text-sm font-medium ${
            type === 'success' ? 'text-green-800' : 'text-red-800'
          }`}>
            {message}
          </p>
        </div>
        <button
          onClick={onClose}
          className={`ml-4 flex-shrink-0 ${
            type === 'success' ? 'text-green-500 hover:text-green-700' : 'text-red-500 hover:text-red-700'
          }`}
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </motion.div>
  );
};