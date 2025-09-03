import React from 'react';
import { Package, Eye } from 'lucide-react';
import { Product } from '../types/Product';
import { apiService } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';

interface ProductCardProps {
  product: Product;
  onImageClick: () => void;
  onVariantsClick: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onImageClick, 
  onVariantsClick 
}) => {
  const { language, isArabic } = useLanguage();
  const imageUrl = apiService.getImageUrl(product.image);
  
  const productName = product.name_translations[language] || product.name_translations.en;
  const productDescription = product.description_translations[language] || product.description_translations.en;
  
  return (
    <div className={`bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden group ${isArabic ? 'text-right' : 'text-left'}`}>
      <div className="relative aspect-square bg-gray-50">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name_translations.en}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIxIDEyQzIxIDEzLjEgMjAuMSAxNCAE9IDE0SDVDMy45IDE0IDMgMTMuMSAzIDEyVjhDMyA2LjkgMy45IDYgNSA2SDE5QzIwLjEgNiAyMSA2LjkgMjEgOFYxMloiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+Cg==';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <Package className="h-12 w-12 text-gray-400" />
          </div>
        )}
        
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <button
            onClick={onImageClick}
            className="bg-white text-gray-800 px-4 py-2 rounded-lg font-medium shadow-lg hover:bg-gray-50 transition-all duration-200 transform translate-y-2 group-hover:translate-y-0"
          >
            Upload Image
          </button>
        </div>

        {product.is_new && (
          <div className="absolute top-3 left-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
            New
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className={`font-semibold text-gray-900 text-lg leading-tight ${isArabic ? 'font-arabic' : ''}`}>
            {productName}
          </h3>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {product.product_code}
          </span>
        </div>
        
        <p className={`text-gray-600 text-sm mb-3 line-clamp-2 ${isArabic ? 'font-arabic' : ''}`}>
          {productDescription}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span className={`w-2 h-2 rounded-full ${product.in_stock ? 'bg-green-400' : 'bg-red-400'}`}></span>
            <span>{product.in_stock ? 'In Stock' : 'Out of Stock'}</span>
          </div>
          
          <button
            onClick={onVariantsClick}
            className={`flex items-center ${isArabic ? 'space-x-reverse space-x-1' : 'space-x-1'} text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200`}
          >
            <Eye className="h-4 w-4" />
            <span>{isArabic ? `المتغيرات (${product.variants.length})` : `Variants (${product.variants.length})`}</span>
          </button>
        </div>
      </div>
    </div>
  );
};