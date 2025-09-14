import React from 'react';
import { Package, Eye, Upload, EyeOff } from 'lucide-react';
import { Product } from '../types/Product';
import { apiService } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';

interface ProductCardProps {
  product: Product;
  onImageClick: () => void;
  onVariantsClick: () => void;
  onUpdateProduct: (updatedProduct: Product) => void;
  showNotification: (type: 'success' | 'error', message: string) => void; // Added showNotification prop
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onImageClick, 
  onVariantsClick,
  onUpdateProduct,
  showNotification
}) => {
  const { language, isArabic } = useLanguage();
  const imageUrl = apiService.getImageUrl(product.image);
  
  const productName = product.name_translations[language] || product.name_translations.en;
  const productDescription = product.description_translations[language] || product.description_translations.en;
  
  // Function to toggle product hidden status
  const toggleProductHidden = async () => {
    try {
      const newHiddenStatus = !product.is_hidden;
      await apiService.updateProductHiddenStatus(product.id, newHiddenStatus);
      
      // Update the product in the UI
      const updatedProduct = { ...product, is_hidden: newHiddenStatus };
      onUpdateProduct(updatedProduct);
      
      // Show success notification
      showNotification('success', 'Product visibility updated successfully');
    } catch (error) {
      console.error('Error updating product hidden status:', error);
      // Show error notification
      showNotification('error', 'Error updating product visibility');
    }
  };
  
  return (
    <div
      className={`relative group ${isArabic ? 'text-right' : 'text-left'}`}
    >
      <div
        className={`relative bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/30 overflow-hidden transition-all duration-200 hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1 ${product.is_hidden ? 'opacity-70' : ''}`}
      >
        {/* Hidden badge */}
        {product.is_hidden && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-md font-medium z-10">
            Hidden
          </div>
        )}
        
        {/* Image container */}
        <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.name_translations.en}
              className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIxIDEyQzIxIDEzLjEgMjAuMSAxNCAE9IDE0SDVDMy45IDE0IDMgMTMuMSAzIDEyVjhDMyA2LjkzLjkgMyA2IDUgNkgxOWMwLjEgMC45IDAuOSAxIDEgMUg4VjEyabloiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+Cg==';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              <Package className="h-12 w-12 text-gray-400" />
            </div>
          )}
          
          {/* Upload overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
            <button
              onClick={onImageClick}
              className="bg-white/90 backdrop-blur-sm text-gray-800 px-4 py-2 rounded-lg font-medium shadow-lg hover:bg-white transition-all duration-150 flex items-center space-x-2 transform translate-y-2 group-hover:translate-y-0"
            >
              <Upload className="h-4 w-4" />
              <span>Upload</span>
            </button>
          </div>

          {/* Status badge */}
          {product.is_new && (
            <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-md font-medium">
              New
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex justify-between items-start mb-3">
            <h3 className={`font-bold text-gray-900 text-lg leading-tight ${isArabic ? 'font-arabic' : ''}`}>
              {productName}
            </h3>
            <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-md font-medium">
              {product.product_code}
            </span>
          </div>
          
          {/* Weight Unit Dropdown */}
          <div className="mb-3">
            <select
              value={product.weight_unit || ''}
              onChange={async (e) => {
                const newWeightUnit = e.target.value;
                try {
                  await apiService.updateProductWeightUnit(product.id, newWeightUnit);
                  
                  // Update the product in the UI
                  const updatedProduct = { ...product, weight_unit: newWeightUnit };
                  onUpdateProduct(updatedProduct);
                  
                  // Show success notification
                  showNotification('success', 'Product weight unit updated successfully');
                } catch (error) {
                  console.error('Error updating product weight unit:', error);
                  // Show error notification
                  showNotification('error', 'Error updating product weight unit');
                }
              }}
              className="w-full py-1 px-2 rounded-lg bg-white border border-gray-300 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">{isArabic ? 'اختر وحدة الوزن' : 'Weight Unit'}</option>
              <option value="KG">KG</option>
              <option value="G">G</option>
              <option value="mL">mL</option>
              <option value="L">L</option>
              <option value="m">m</option>
              <option value="c.m">c.m</option>
              <option value="libra">libra</option>
            </select>
          </div>
          
          <p className={`text-gray-600 text-sm mb-4 line-clamp-2 ${isArabic ? 'font-arabic' : ''}`}>
            {productDescription}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span className={`w-2 h-2 rounded-full ${product.in_stock ? 'bg-green-400' : 'bg-red-400'}`} />
              <span className="font-medium">{product.in_stock ? 'In Stock' : 'Out of Stock'}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Hidden toggle button */}
              <button
                onClick={toggleProductHidden}
                className={`p-2 rounded-full ${product.is_hidden ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-green-100 text-green-600 hover:bg-green-200'} transition-colors duration-200`}
                title={product.is_hidden ? 'Make visible' : 'Hide product'}
              >
                {product.is_hidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
              
              <button
                onClick={onVariantsClick}
                className={`flex items-center ${isArabic ? 'space-x-reverse space-x-2' : 'space-x-2'} text-blue-600 hover:text-blue-700 text-sm font-semibold transition-all duration-150 bg-blue-50 hover:bg-blue-100 hover:scale-105 px-3 py-2 rounded-lg`}
              >
                <Eye className="h-4 w-4" />
                <span>{isArabic ? `المتغيرات (${product.variants.length})` : `Variants (${product.variants.length})`}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};