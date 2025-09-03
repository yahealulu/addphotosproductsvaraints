import React, { useMemo } from 'react';
import { motion, useInView } from 'framer-motion';
import { Product } from '../types/Product';
import { ProductCard } from './ProductCard';
import { useLanguage } from '../contexts/LanguageContext';

interface ProductGridProps {
  products: Product[];
  searchTerm: string;
  onProductImageClick: (product: Product) => void;
  onProductVariantsClick: (product: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ 
  products, 
  searchTerm, 
  onProductImageClick, 
  onProductVariantsClick 
}) => {
  const { language, isArabic } = useLanguage();
  
  const filteredProducts = useMemo(() => {
    if (!searchTerm) return products;
    
    const term = searchTerm.toLowerCase();
    return products.filter(product => {
      // Safe property access with fallbacks
      const nameEn = product.name_translations?.en?.toLowerCase() || '';
      const nameAr = product.name_translations?.ar?.toLowerCase() || '';
      const productCode = product.product_code?.toLowerCase() || '';
      const descEn = product.description_translations?.en?.toLowerCase() || '';
      const descAr = product.description_translations?.ar?.toLowerCase() || '';
      const category = product.product_category?.toLowerCase() || '';
      
      return nameEn.includes(term) ||
             nameAr.includes(term) ||
             productCode.includes(term) ||
             descEn.includes(term) ||
             descAr.includes(term) ||
             category.includes(term);
    });
  }, [products, searchTerm]);

  if (filteredProducts.length === 0) {
    return (
      <motion.div 
        className="text-center py-12"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.div 
          className="text-gray-400 mb-4"
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, 5, -5, 0] 
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut" 
          }}
        >
          <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </motion.div>
        <motion.h3 
          className="text-lg font-medium text-gray-900 mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {isArabic ? 'لم يتم العثور على منتجات' : 'No products found'}
        </motion.h3>
        <motion.p 
          className="text-gray-600"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {searchTerm 
            ? (isArabic ? `لا توجد منتجات تطابق "${searchTerm}"` : `No products match "${searchTerm}"`)
            : (isArabic ? 'لا توجد منتجات متاحة' : 'No products available')
          }
        </motion.p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {filteredProducts.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ 
            opacity: 0, 
            y: 60,
            rotateX: 45,
            scale: 0.8
          }}
          animate={{ 
            opacity: 1, 
            y: 0,
            rotateX: 0,
            scale: 1
          }}
          transition={{
            duration: 0.6,
            delay: index * 0.1,
            ease: [0.6, -0.05, 0.01, 0.99],
            type: "spring",
            stiffness: 100
          }}
          whileInView={{
            opacity: 1,
            y: 0,
            transition: {
              duration: 0.6,
              delay: index * 0.05
            }
          }}
          viewport={{ once: true, margin: "-50px" }}
        >
          <ProductCard
            product={product}
            onImageClick={() => onProductImageClick(product)}
            onVariantsClick={() => onProductVariantsClick(product)}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};