import React, { useState, useEffect } from 'react';
import { Package } from 'lucide-react';
import { Product } from './types/Product';
import { LanguageProvider } from './contexts/LanguageContext';
import { LanguageToggle } from './components/LanguageToggle';
import { useProducts } from './hooks/useProducts';
import { SearchBar } from './components/SearchBar';
import { ProductGrid } from './components/ProductGrid';
import { ProductDetail } from './components/ProductDetail';
import { ImageUpload } from './components/ImageUpload';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import ErrorBoundary from './components/ErrorBoundary';
import { apiService } from './services/api';
import { useLanguage } from './contexts/LanguageContext';

const AppContent: React.FC = () => {
  const { isArabic } = useLanguage();
  const { products, loading, error, updateProduct, refetch } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [uploadingProduct, setUploadingProduct] = useState<Product | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // URL management for navigation persistence
  const getProductIdFromUrl = (): number | null => {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('product');
    return productId ? parseInt(productId, 10) : null;
  };

  const setProductIdInUrl = (productId: number | null) => {
    const url = new URL(window.location.href);
    if (productId) {
      url.searchParams.set('product', productId.toString());
    } else {
      url.searchParams.delete('product');
    }
    window.history.pushState({}, '', url.toString());
  };

  // Initialize selected product from URL on component mount
  useEffect(() => {
    const productIdFromUrl = getProductIdFromUrl();
    if (productIdFromUrl && products.length > 0) {
      const product = products.find(p => p.id === productIdFromUrl);
      if (product) {
        setSelectedProduct(product);
      }
    }
  }, [products]);

  // Update selected product when products list changes (e.g., after image upload)
  useEffect(() => {
    if (selectedProduct && products.length > 0) {
      const updatedProduct = products.find(p => p.id === selectedProduct.id);
      if (updatedProduct) {
        setSelectedProduct(updatedProduct);
      }
    }
  }, [products, selectedProduct]);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const productIdFromUrl = getProductIdFromUrl();
      if (productIdFromUrl && products.length > 0) {
        const product = products.find(p => p.id === productIdFromUrl);
        setSelectedProduct(product || null);
      } else {
        setSelectedProduct(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [products]);

  const handleProductImageClick = (product: Product) => {
    setUploadingProduct(product);
    setShowImageUpload(true);
    setUploadError(null);
    setUploadSuccess(false);
  };

  const handleProductVariantsClick = (product: Product) => {
    setSelectedProduct(product);
    setProductIdInUrl(product.id);
  };

  const handleImageUpload = async (file: File) => {
    if (!uploadingProduct) return;
    
    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(false);

    try {
      const response = await apiService.uploadProductImage(uploadingProduct.id, file);
      
      // Use the actual image path from the server response
      const newImagePath = response.data?.image || response.image || `storage/products/${file.name}`;
      const updatedProduct = { ...uploadingProduct, image: newImagePath };
      updateProduct(updatedProduct);
      
      setUploadSuccess(true);
      setTimeout(() => {
        setShowImageUpload(false);
        setUploadSuccess(false);
        setUploadingProduct(null);
      }, 2000);
    } catch (error) {
      setUploadError('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleBackToProducts = () => {
    setSelectedProduct(null);
    setProductIdInUrl(null);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;

  if (selectedProduct) {
    return (
      <ProductDetail
        product={selectedProduct}
        onBack={handleBackToProducts}
        onProductUpdate={updateProduct}
      />
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 ${isArabic ? 'font-arabic' : ''}`}>
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className={`text-center mb-12 ${isArabic ? 'text-right' : 'text-left'}`}>
          <div className="flex justify-end mb-6">
            <LanguageToggle />
          </div>
          <div className="flex items-center justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-2xl mr-4">
              <Package className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">
              {isArabic ? 'مدير المنتجات' : 'Product Manager'}
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            {isArabic 
              ? 'إدارة كتالوج المنتجات الخاص بك مع رفع الصور الجميلة وتنظيم المتغيرات'
              : 'Manage your product catalog with beautiful image uploads and variant organization'
            }
          </p>
        </div>

        {/* Search Bar */}
        <SearchBar 
          searchTerm={searchTerm} 
          onSearchChange={setSearchTerm} 
        />

        {/* Stats */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-xl px-6 py-3 shadow-sm border border-gray-100">
            <span className="text-gray-600">{isArabic ? 'إجمالي المنتجات: ' : 'Total Products: '}</span>
            <span className="font-bold text-blue-600">{products?.length || 0}</span>
            {searchTerm && (
              <>
                <span className="text-gray-400 mx-2">•</span>
                <span className="text-gray-600">{isArabic ? 'عرض: ' : 'Showing: '}</span>
                <span className="font-bold text-green-600">
                  {products ? products.filter(p => {
                    if (!p || !p.name_translations) return false;
                    const term = searchTerm.toLowerCase();
                    return (
                      (p.name_translations.en && p.name_translations.en.toLowerCase().includes(term)) ||
                      (p.name_translations.ar && p.name_translations.ar.toLowerCase().includes(term)) ||
                      (p.product_code && p.product_code.toLowerCase().includes(term))
                    );
                  }).length : 0}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Product Grid */}
        <ProductGrid
          products={products}
          searchTerm={searchTerm}
          onProductImageClick={handleProductImageClick}
          onProductVariantsClick={handleProductVariantsClick}
        />

        {/* Image Upload Modal */}
        {showImageUpload && uploadingProduct && (
          <ImageUpload
            onImageSelect={handleImageUpload}
            currentImage={apiService.getImageUrl(uploadingProduct.image)}
            isUploading={isUploading}
            uploadError={uploadError}
            uploadSuccess={uploadSuccess}
            onClose={() => {
              setShowImageUpload(false);
              setUploadingProduct(null);
              setUploadError(null);
              setUploadSuccess(false);
            }}
            title={`Upload Image for ${uploadingProduct.name_translations.en}`}
          />
        )}
      </div>
    </div>
  );
};

function App() {
  return (
    <LanguageProvider>
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
    </LanguageProvider>
  );
}

export default App;