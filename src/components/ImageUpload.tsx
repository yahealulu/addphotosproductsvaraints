import React, { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Check, AlertCircle, Sparkles } from 'lucide-react';

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  currentImage?: string | null;
  isUploading?: boolean;
  uploadError?: string | null;
  uploadSuccess?: boolean;
  onClose: () => void;
  title: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageSelect,
  currentImage,
  isUploading = false,
  uploadError,
  uploadSuccess,
  onClose,
  title
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        setPreviewImage(URL.createObjectURL(file));
        onImageSelect(file);
      }
    }
  }, [onImageSelect]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setPreviewImage(URL.createObjectURL(file));
      onImageSelect(file);
    }
  }, [onImageSelect]);

  return (
    <motion.div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Floating particles background */}
      {Array.from({ length: 20 }, (_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-white/30 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
      
      <motion.div 
        className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 w-full max-w-md shadow-2xl border border-white/30 relative overflow-hidden"
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 50 }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 30,
          duration: 0.5
        }}
      >
        {/* Header with sparkle effects */}
        <div className="flex justify-between items-center mb-6 relative">
          <motion.h3 
            className="text-xl font-bold text-gray-900"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {title}
          </motion.h3>
          
          {/* Floating sparkles */}
          {Array.from({ length: 3 }, (_, i) => (
            <motion.div
              key={i}
              className="absolute text-blue-400"
              style={{
                right: `${60 + i * 15}px`,
                top: `${5 + i * 10}px`,
              }}
              animate={{
                scale: [0, 1, 0],
                rotate: 360,
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3,
                delay: i * 0.5 + 0.5,
                repeat: Infinity,
              }}
            >
              <Sparkles className="h-3 w-3" />
            </motion.div>
          ))}
          
          <motion.button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 relative z-10"
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="h-5 w-5 text-gray-500" />
          </motion.button>
        </div>

        {/* Current/Preview Image */}
        <AnimatePresence>
          {(currentImage && !previewImage) && (
            <motion.div 
              className="mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-sm text-gray-600 mb-3 font-medium">Current Image:</p>
              <motion.img
                src={currentImage}
                alt="Current"
                className="w-full h-32 object-cover rounded-xl border shadow-lg"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {previewImage && (
            <motion.div 
              className="mb-6"
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <p className="text-sm text-gray-600 mb-3 font-medium">New Image Preview:</p>
              <motion.img
                src={previewImage}
                alt="Preview"
                className="w-full h-32 object-cover rounded-xl border shadow-lg"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Premium Upload Area */}
        <motion.div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 overflow-hidden ${
            isDragOver
              ? 'border-blue-500 bg-blue-50/50 backdrop-blur-sm'
              : 'border-gray-300 hover:border-gray-400 bg-gray-50/30 backdrop-blur-sm'
          } ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
          whileHover={{ scale: 1.02 }}
          animate={{
            borderColor: isDragOver ? "#3B82F6" : "#D1D5DB",
            backgroundColor: isDragOver ? "rgba(59, 130, 246, 0.1)" : "rgba(249, 250, 251, 0.3)"
          }}
        >
          {/* Animated background pattern */}
          <motion.div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: "radial-gradient(circle at 25% 25%, #3B82F6 2px, transparent 2px), radial-gradient(circle at 75% 75%, #8B5CF6 2px, transparent 2px)",
              backgroundSize: "30px 30px"
            }}
            animate={{
              x: isDragOver ? [0, 30, 0] : 0,
              y: isDragOver ? [0, 30, 0] : 0,
            }}
            transition={{ duration: 2, repeat: isDragOver ? Infinity : 0 }}
          />
          
          <div className="relative z-10 flex flex-col items-center">
            <motion.div
              animate={{
                scale: isDragOver ? [1, 1.2, 1] : 1,
                rotate: isDragOver ? [0, 10, -10, 0] : 0,
              }}
              transition={{ duration: 0.5, repeat: isDragOver ? Infinity : 0 }}
            >
              <Upload className={`h-12 w-12 mb-4 ${isDragOver ? 'text-blue-500' : 'text-gray-400'}`} />
            </motion.div>
            
            <motion.p 
              className="text-gray-600 mb-3 font-medium"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Drag and drop an image here, or{' '}
              <motion.label 
                className="text-blue-600 hover:text-blue-700 cursor-pointer font-bold underline"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                browse
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  disabled={isUploading}
                />
              </motion.label>
            </motion.p>
            
            <motion.p 
              className="text-xs text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              PNG, JPG, GIF up to 10MB
            </motion.p>
          </div>
        </motion.div>

        {/* Status Messages */}
        <AnimatePresence>
          {isUploading && (
            <motion.div 
              className="mt-6 flex items-center justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <motion.div 
                className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <motion.span 
                className="ml-3 text-sm text-gray-600 font-medium"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                Uploading...
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {uploadError && (
            <motion.div 
              className="mt-6 flex items-center text-red-600 bg-red-50 p-4 rounded-xl border border-red-200"
              initial={{ opacity: 0, scale: 0.8, x: -20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: -20 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              >
                <AlertCircle className="h-5 w-5 mr-2" />
              </motion.div>
              <span className="text-sm font-medium">{uploadError}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {uploadSuccess && (
            <motion.div 
              className="mt-6 flex items-center text-green-600 bg-green-50 p-4 rounded-xl border border-green-200"
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
              >
                <Check className="h-5 w-5 mr-2" />
              </motion.div>
              <span className="text-sm font-medium">Image uploaded successfully!</span>
              
              {/* Success sparkles */}
              {Array.from({ length: 5 }, (_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-green-400"
                  style={{
                    left: `${30 + i * 15}%`,
                    top: `${-10 + i * 5}px`,
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: [0, 1.5, 0],
                    opacity: [0, 1, 0],
                    y: [-10, -30]
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.1,
                  }}
                >
                  <Sparkles className="h-3 w-3" />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};