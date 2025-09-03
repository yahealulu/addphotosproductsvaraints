import React, { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowLeft, Package, Upload, Sparkles, Star } from 'lucide-react';
import { Product, Variant } from '../types/Product';
import { apiService } from '../services/api';
import { ImageUpload } from './ImageUpload';
import FloatingParticles from './FloatingParticles';
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

  // Scroll-based animations
  const { scrollY } = useScroll();
  const headerY = useTransform(scrollY, [0, 300], [0, -100]);
  const contentY = useTransform(scrollY, [0, 300], [0, 50]);
  const opacity = useTransform(scrollY, [0, 200], [1, 0.8]);

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
    <motion.div 
      className={`relative min-h-screen overflow-hidden ${isArabic ? 'text-right' : 'text-left'}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Floating Particles Background */}
      <FloatingParticles />
      
      {/* Dynamic gradient background */}
      <motion.div 
        className="fixed inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50"
        animate={{
          background: [
            "linear-gradient(135deg, rgb(250 245 255) 0%, rgb(239 246 255) 50%, rgb(238 242 255) 100%)",
            "linear-gradient(135deg, rgb(238 242 255) 0%, rgb(250 245 255) 50%, rgb(224 242 254) 100%)",
            "linear-gradient(135deg, rgb(224 242 254) 0%, rgb(238 242 255) 50%, rgb(250 245 255) 100%)"
          ]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Glass overlay */}
      <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px]" />
      
      <div className="relative z-10 max-w-7xl mx-auto p-6">
        {/* Animated back button */}
        <motion.button
          onClick={onBack}
          className={`flex items-center ${isArabic ? 'space-x-reverse space-x-3' : 'space-x-3'} text-white bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 rounded-full font-semibold mb-8 shadow-2xl backdrop-blur-sm`}
          style={{ y: headerY, opacity }}
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          whileHover={{ 
            scale: 1.05, 
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)",
            background: "linear-gradient(45deg, #3B82F6, #8B5CF6, #EC4899)"
          }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            animate={{ x: isArabic ? [0, 5, 0] : [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ArrowLeft className={`h-5 w-5 ${isArabic ? 'rotate-180' : ''}`} />
          </motion.div>
          <span>{isArabic ? 'العودة إلى المنتجات' : 'Back to Products'}</span>
          
          {/* Floating sparkles */}
          {Array.from({ length: 3 }, (_, i) => (
            <motion.div
              key={i}
              className="absolute text-yellow-300"
              style={{
                left: `${30 + i * 20}%`,
                top: `${20 + i * 15}%`,
              }}
              animate={{
                scale: [0, 1, 0],
                rotate: 360,
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3,
                delay: i * 0.5,
                repeat: Infinity,
              }}
            >
              <Sparkles className="h-2 w-2" />
            </motion.div>
          ))}
        </motion.button>

        {/* Main content with 3D perspective */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12"
          style={{ y: contentY }}
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Product Info with glass morphism */}
          <motion.div 
            className="bg-white/30 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-white/20"
            initial={{ opacity: 0, x: -100, rotateY: -30 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            whileHover={{ 
              scale: 1.02, 
              boxShadow: "0 30px 60px rgba(0, 0, 0, 0.15)",
              backgroundColor: "rgba(255, 255, 255, 0.4)"
            }}
          >
            <motion.h1 
              className={`text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 mb-6 ${isArabic ? 'font-arabic' : ''}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              {productName}
              
              {/* Floating rating stars */}
              <motion.div className="flex mt-2 space-x-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.8 + i * 0.1, type: "spring" }}
                  >
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  </motion.div>
                ))}
              </motion.div>
            </motion.h1>
            
            <motion.p 
              className={`text-gray-700 mb-8 leading-relaxed text-lg ${isArabic ? 'font-arabic' : ''}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              {productDescription}
            </motion.p>
            
            {/* Animated info grid */}
            <motion.div 
              className="grid grid-cols-2 gap-6 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              {[
                { label: isArabic ? 'الكود:' : 'Code:', value: product.product_code },
                { label: isArabic ? 'الفئة:' : 'Category:', value: product.product_category },
                { label: isArabic ? 'المنشأ:' : 'Origin:', value: product.country_origin_name },
                { label: isArabic ? 'الحالة:' : 'Status:', value: product.in_stock ? (isArabic ? 'متوفر' : 'In Stock') : (isArabic ? 'غير متوفر' : 'Out of Stock') }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="bg-white/40 backdrop-blur-sm p-4 rounded-xl border border-white/30"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  whileHover={{ 
                    scale: 1.05, 
                    backgroundColor: "rgba(255, 255, 255, 0.6)"
                  }}
                >
                  <span className="font-semibold text-gray-800">{item.label}</span>
                  <motion.span 
                    className={`ml-2 ${index === 3 && product.in_stock ? 'text-emerald-600' : index === 3 ? 'text-red-500' : 'text-gray-600'} font-medium`}
                    animate={index === 3 && product.in_stock ? {
                      textShadow: [
                        "0 0 5px rgba(16, 185, 129, 0.5)",
                        "0 0 10px rgba(16, 185, 129, 0.8)",
                        "0 0 5px rgba(16, 185, 129, 0.5)"
                      ]
                    } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {item.value}
                  </motion.span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Product Image with enhanced 3D effects */}
          <motion.div 
            className="bg-white/30 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-white/20"
            initial={{ opacity: 0, x: 100, rotateY: 30 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            whileHover={{ 
              scale: 1.02, 
              boxShadow: "0 30px 60px rgba(0, 0, 0, 0.15)",
              backgroundColor: "rgba(255, 255, 255, 0.4)"
            }}
          >
            <motion.h2 
              className="text-2xl font-bold text-gray-900 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              {isArabic ? 'صورة المنتج' : 'Product Image'}
            </motion.h2>
            
            <motion.div 
              className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden cursor-pointer group"
              onClick={handleProductImageClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              {productImageUrl ? (
                <motion.img
                  src={productImageUrl}
                  alt={product.name_translations.en}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.4 }}
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
                <motion.div 
                  className="w-full h-full flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-center">
                    <Package className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                    <p className="text-gray-500 text-sm">No image</p>
                  </div>
                </motion.div>
              )}
              
              {/* Premium overlay */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              >
                <motion.div
                  className="bg-white/90 backdrop-blur-sm text-gray-800 px-6 py-3 rounded-full font-semibold shadow-2xl flex items-center space-x-2"
                  initial={{ y: 20, scale: 0.8 }}
                  whileHover={{ y: 0, scale: 1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Upload className="h-5 w-5" />
                  <span>{isArabic ? 'رفع صورة' : 'Upload Image'}</span>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Enhanced Variants Section */}
        <motion.div 
          className="bg-white/30 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-white/20"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <motion.h2 
            className="text-3xl font-black text-gray-900 mb-8 text-center"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, type: "spring" }}
          >
            {isArabic ? 'متغيرات المنتج' : 'Product Variants'}
          </motion.h2>
          
          {product.variants.length === 0 ? (
            <motion.div 
              className="text-center py-12 text-gray-500"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2 }}
            >
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Package className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              </motion.div>
              <p className="text-lg">{isArabic ? 'لا توجد متغيرات متاحة' : 'No variants available'}</p>
            </motion.div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              {product.variants.map((variant, index) => {
                const variantImageUrl = apiService.getImageUrl(variant.image);
                
                return (
                  <motion.div 
                    key={variant.id} 
                    className="bg-white/40 backdrop-blur-sm border border-white/30 rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 group relative overflow-hidden"
                    initial={{ 
                      opacity: 0, 
                      y: 60,
                      rotateY: 45 
                    }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                      rotateY: 0 
                    }}
                    transition={{
                      duration: 0.6,
                      delay: 1.4 + index * 0.1,
                      ease: "easeOut"
                    }}
                    whileHover={{ 
                      scale: 1.05,
                      backgroundColor: "rgba(255, 255, 255, 0.6)",
                      boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15)"
                    }}
                  >
                    {/* Floating sparkles on hover */}
                    <motion.div
                      className="absolute top-2 right-2 text-yellow-400 opacity-0 group-hover:opacity-100"
                      animate={{ 
                        scale: [0, 1, 0],
                        rotate: 360 
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity 
                      }}
                    >
                      <Sparkles className="h-4 w-4" />
                    </motion.div>
                    
                    <motion.div 
                      className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl mb-4 overflow-hidden cursor-pointer relative"
                      onClick={() => handleVariantImageClick(variant)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {variantImageUrl ? (
                        <motion.img
                          src={variantImageUrl}
                          alt={`${product.name_translations.en} - ${variant.size}`}
                          className="w-full h-full object-cover"
                          whileHover={{ scale: 1.2 }}
                          transition={{ duration: 0.3 }}
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
                        <motion.div 
                          className="w-full h-full flex items-center justify-center"
                          whileHover={{ scale: 1.05 }}
                        >
                          <div className="text-center">
                            <Package className="h-10 w-10 mx-auto mb-1 text-gray-400" />
                            <p className="text-gray-500 text-xs">No image</p>
                          </div>
                        </motion.div>
                      )}
                      
                      {/* Upload overlay */}
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                      >
                        <motion.div
                          className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-2 rounded-full text-sm font-medium shadow-lg flex items-center space-x-1"
                          initial={{ y: 10, scale: 0.8 }}
                          whileHover={{ y: 0, scale: 1 }}
                        >
                          <Upload className="h-3 w-3" />
                          <span>{isArabic ? 'رفع' : 'Upload'}</span>
                        </motion.div>
                      </motion.div>
                    </motion.div>
                    
                    <motion.div 
                      className="text-center"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.6 + index * 0.1 }}
                    >
                      <motion.p 
                        className="font-bold text-gray-900 text-lg mb-2"
                        whileHover={{ scale: 1.05 }}
                      >
                        {variant.size}
                      </motion.p>
                      <motion.p 
                        className="text-sm text-gray-600 bg-gray-100/50 backdrop-blur-sm px-3 py-1 rounded-full inline-block"
                        whileHover={{ 
                          backgroundColor: "rgba(59, 130, 246, 0.1)",
                          scale: 1.05 
                        }}
                      >
                        {isArabic ? 'المعرف:' : 'ID:'} {variant.id}
                      </motion.p>
                    </motion.div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </motion.div>

        {/* Premium Image Upload Modal */}
        {showImageUpload && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50"
          >
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
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};