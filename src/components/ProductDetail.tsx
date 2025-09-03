import React, { useState } from 'react';
import { ArrowLeft, Package, Upload } from 'lucide-react';
import { Product, Variant } from '../types/Product';
import { apiService } from '../services/api';
import { ImageUpload } from './ImageUpload';
import { useLanguage } from '../contexts/LanguageContext';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  onProductUpdate: (updatedProduct: Product) => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ 
  product, 
  onBack, 
  onProductUpdate 
}) => {
  const { language, isArabic } = useLanguage();
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [uploadType, setUploadType] = useState<'product' | 'variant'>('product');
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleProductImageClick = () => {
    setUploadType('product');
    setSelectedVariant(null);
    setShowImageUpload(true);
    setUploadError(null);
    setUploadSuccess(false);
  };

  const handleVariantImageClick = (variant: Variant) => {
    setUploadType('variant');
    setSelectedVariant(variant);
    setShowImageUpload(true);
    setUploadError(null);
    setUploadSuccess(false);
  };

  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(false);

    try {
      if (uploadType === 'product') {
        const response = await apiService.uploadProductImage(product.id, file);
        // Use the actual image path from the server response
        const newImagePath = response.data?.image || response.image || `storage/products/${file.name}`;
        const updatedProduct = { ...product, image: newImagePath };
        onProductUpdate(updatedProduct);
      } else if (uploadType === 'variant' && selectedVariant) {
        const response = await apiService.uploadVariantImage(product.id, selectedVariant.id, file);
        // Use the actual image path from the server response
        const newImagePath = response.data?.image || response.image || `storage/variants/${file.name}`;
        const updatedVariants = product.variants.map(v => 
          v.id === selectedVariant.id 
            ? { ...v, image: newImagePath }
            : v
        );
        const updatedProduct = { ...product, variants: updatedVariants };
        onProductUpdate(updatedProduct);
      }
      
      setUploadSuccess(true);
      setTimeout(() => {
        setShowImageUpload(false);
        setUploadSuccess(false);
      }, 2000);
    } catch (error) {
      setUploadError('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const productImageUrl = apiService.getImageUrl(product.image);
  const productName = product.name_translations[language] || product.name_translations.en;
  const productDescription = product.description_translations[language] || product.description_translations.en;

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 ${isArabic ? 'text-right' : 'text-left'}`}>
      <div className="max-w-6xl mx-auto">
        <button
          onClick={onBack}
          className={`flex items-center ${isArabic ? 'space-x-reverse space-x-2' : 'space-x-2'} text-blue-600 hover:text-blue-700 mb-6 transition-colors duration-200`}
        >
          <ArrowLeft className={`h-5 w-5 ${isArabic ? 'rotate-180' : ''}`} />
          <span className="font-medium">{isArabic ? 'العودة إلى المنتجات' : 'Back to Products'}</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Product Info */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h1 className={`text-3xl font-bold text-gray-900 mb-4 ${isArabic ? 'font-arabic' : ''}`}>
              {productName}
            </h1>
            <p className={`text-gray-600 mb-6 leading-relaxed ${isArabic ? 'font-arabic' : ''}`}>
              {productDescription}
            </p>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">{isArabic ? 'الكود:' : 'Code:'}</span>
                <span className="ml-2 text-gray-600">{product.product_code}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">{isArabic ? 'الفئة:' : 'Category:'}</span>
                <span className="ml-2 text-gray-600">{product.product_category}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">{isArabic ? 'المنشأ:' : 'Origin:'}</span>
                <span className="ml-2 text-gray-600">{product.country_origin_name}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">{isArabic ? 'الحالة:' : 'Status:'}</span>
                <span className={`ml-2 ${product.in_stock ? 'text-green-600' : 'text-red-600'}`}>
                  {product.in_stock ? (isArabic ? 'متوفر' : 'In Stock') : (isArabic ? 'غير متوفر' : 'Out of Stock')}
                </span>
              </div>
            </div>
          </div>

          {/* Product Image */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">{isArabic ? 'صورة المنتج' : 'Product Image'}</h2>
            <div 
              className="relative aspect-square bg-gray-50 rounded-xl overflow-hidden cursor-pointer group"
              onClick={handleProductImageClick}
            >
              {productImageUrl ? (
                <img
                  src={productImageUrl}
                  alt={product.name_translations.en}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = `
                        <div class="w-full h-full flex items-center justify-center bg-gray-100">
                          <div class="text-center">
                            <div class="h-12 w-12 mx-auto mb-2 text-gray-400">
                              <svg fill="currentColor" viewBox="0 0 24 24">
                                <path d="M21 12C21 13.1 20.1 14 19 14H5C3.9 14 3 13.1 3 12V8C3 6.9 3.9 6 5 6H19C20.1 6 21 6.9 21 8V12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                              </svg>
                            </div>
                            <p class="text-gray-500 text-sm">Image not found</p>
                          </div>
                        </div>
                      `;
                    }
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <Package className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                    <p className="text-gray-500 text-sm">No image</p>
                  </div>
                </div>
              )}
              
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="bg-white text-gray-800 px-4 py-2 rounded-lg font-medium shadow-lg flex items-center space-x-2">
                  <Upload className="h-4 w-4" />
                  <span>{isArabic ? 'رفع صورة' : 'Upload Image'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Variants */}
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{isArabic ? 'متغيرات المنتج' : 'Product Variants'}</h2>
          
          {product.variants.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>{isArabic ? 'لا توجد متغيرات متاحة' : 'No variants available'}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {product.variants.map((variant) => {
                const variantImageUrl = apiService.getImageUrl(variant.image);
                
                return (
                  <div key={variant.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200 group">
                    <div 
                      className="aspect-square bg-gray-50 rounded-lg mb-3 overflow-hidden cursor-pointer relative group"
                      onClick={() => handleVariantImageClick(variant)}
                    >
                      {variantImageUrl ? (
                        <img
                          src={variantImageUrl}
                          alt={`${product.name_translations.en} - ${variant.size}`}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                              parent.innerHTML = `
                                <div class="w-full h-full flex items-center justify-center bg-gray-100">
                                  <div class="text-center">
                                    <div class="h-8 w-8 mx-auto mb-1 text-gray-400">
                                      <svg fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M21 12C21 13.1 20.1 14 19 14H5C3.9 14 3 13.1 3 12V8C3 6.9 3.9 6 5 6H19C20.1 6 21 6.9 21 8V12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                      </svg>
                                    </div>
                                    <p class="text-gray-500 text-xs">No image</p>
                                  </div>
                                </div>
                              `;
                            }
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-center">
                            <Package className="h-8 w-8 mx-auto mb-1 text-gray-400" />
                            <p className="text-gray-500 text-xs">No image</p>
                          </div>
                        </div>
                      )}
                      
                      <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
                        <div className="bg-white text-gray-800 px-3 py-1 rounded-lg text-sm font-medium shadow-lg flex items-center space-x-1">
                          <Upload className="h-3 w-3" />
                          <span>{isArabic ? 'رفع' : 'Upload'}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <p className="font-medium text-gray-900">{variant.size}</p>
                      <p className="text-sm text-gray-500">
                        {isArabic ? 'المعرف:' : 'ID:'} {variant.id}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {showImageUpload && (
          <ImageUpload
            onImageSelect={handleImageUpload}
            currentImage={
              uploadType === 'product' 
                ? productImageUrl 
                : selectedVariant 
                  ? apiService.getImageUrl(selectedVariant.image)
                  : null
            }
            isUploading={isUploading}
            uploadError={uploadError}
            uploadSuccess={uploadSuccess}
            onClose={() => setShowImageUpload(false)}
            title={
              uploadType === 'product' 
                ? `${isArabic ? 'رفع صورة لـ' : 'Upload Image for'} ${productName}`
                : `${isArabic ? 'رفع صورة للمتغير' : 'Upload Image for Variant'} ${selectedVariant?.size}`
            }
          />
        )}
      </div>
    </div>
  );
};