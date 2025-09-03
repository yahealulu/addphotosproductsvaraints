import React, { useCallback, useState } from 'react';
import { Upload, X, Check, AlertCircle } from 'lucide-react';

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {currentImage && !previewImage && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Current Image:</p>
            <img
              src={currentImage}
              alt="Current"
              className="w-full h-32 object-cover rounded-lg border"
            />
          </div>
        )}

        {previewImage && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">New Image Preview:</p>
            <img
              src={previewImage}
              alt="Preview"
              className="w-full h-32 object-cover rounded-lg border"
            />
          </div>
        )}

        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
            isDragOver
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          } ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
        >
          <div className="flex flex-col items-center">
            <Upload className={`h-8 w-8 mb-4 ${isDragOver ? 'text-blue-500' : 'text-gray-400'}`} />
            <p className="text-sm text-gray-600 mb-2">
              Drag and drop an image here, or{' '}
              <label className="text-blue-600 hover:text-blue-700 cursor-pointer font-medium">
                browse
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  disabled={isUploading}
                />
              </label>
            </p>
            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
          </div>
        </div>

        {isUploading && (
          <div className="mt-4 flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-sm text-gray-600">Uploading...</span>
          </div>
        )}

        {uploadError && (
          <div className="mt-4 flex items-center text-red-600 bg-red-50 p-3 rounded-lg">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span className="text-sm">{uploadError}</span>
          </div>
        )}

        {uploadSuccess && (
          <div className="mt-4 flex items-center text-green-600 bg-green-50 p-3 rounded-lg">
            <Check className="h-5 w-5 mr-2" />
            <span className="text-sm">Image uploaded successfully!</span>
          </div>
        )}
      </div>
    </div>
  );
};