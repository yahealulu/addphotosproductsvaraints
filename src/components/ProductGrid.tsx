import React, { useMemo } from 'react';
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
    return products.filter(product => 
      product.name_translations.en.toLowerCase().includes(term) ||
      product.name_translations.ar.toLowerCase().includes(term) ||
      product.product_code.toLowerCase().includes(term) ||
      product.description_translations.en.toLowerCase().includes(term) ||
      product.description_translations.ar.toLowerCase().includes(term) ||
      product.product_category.toLowerCase().includes(term)
    );
  }, [products, searchTerm, language]);

  if (filteredProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">{isArabic ? 'لم يتم العثور على منتجات' : 'No products found'}</h3>
        <p className="text-gray-600">
          {searchTerm 
            ? (isArabic ? `لا توجد منتجات تطابق "${searchTerm}"` : `No products match "${searchTerm}"`)
            : (isArabic ? 'لا توجد منتجات متاحة' : 'No products available')
          }
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredProducts.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onImageClick={() => onProductImageClick(product)}
          onVariantsClick={() => onProductVariantsClick(product)}
        />
      ))}
    </div>
  );
};