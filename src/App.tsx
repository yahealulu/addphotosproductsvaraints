import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
import FloatingParticles from './components/FloatingParticles';
import PageTransition from './components/PageTransition';
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
  const [savedScrollPosition, setSavedScrollPosition] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);

  // Remove all heavy scroll-based parallax animations
  // const { scrollY } = useScroll();
  // const headerY = useTransform(scrollY, [0, 300], [0, -150]);
  // const headerOpacity = useTransform(scrollY, [0, 300], [1, 0.3]);
  // const headerScale = useTransform(scrollY, [0, 300], [1, 0.95]);

  // URL management for navigation persistence
  const getProductIdFromUrl = (): number | null => {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('product');
    return productId ? parseInt(productId, 10) : null;
  };

  const getPageFromUrl = (): number => {
    const params = new URLSearchParams(window.location.search);
    const page = params.get('page');
    return page ? parseInt(page, 10) : 1;
  };

  const setProductIdInUrl = (productId: number | null, page?: number) => {
    const url = new URL(window.location.href);
    if (productId) {
      url.searchParams.set('product', productId.toString());
      // Save current page when navigating to product detail
      if (page) {
        url.searchParams.set('page', page.toString());
      }
    } else {
      url.searchParams.delete('product');
      // Keep page parameter when returning to product list
    }
    window.history.pushState({}, '', url.toString());
  };

  const setPageInUrl = (page: number) => {
    const url = new URL(window.location.href);
    if (page > 1) {
      url.searchParams.set('page', page.toString());
    } else {
      url.searchParams.delete('page');
    }
    window.history.pushState({}, '', url.toString());
  };

  // Scroll position management
  const saveScrollPosition = () => {
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    // Only save if there's meaningful scroll (more than 50px to avoid saving small scrolls)
    if (scrollY > 50) {
      setSavedScrollPosition(scrollY);
      // Also save to sessionStorage for browser refresh scenarios
      sessionStorage.setItem('productListScrollPosition', scrollY.toString());
    }
  };

  const restoreScrollPosition = (smooth: boolean = false) => {
    // Try to get from state first, then sessionStorage
    const scrollY = savedScrollPosition || parseInt(sessionStorage.getItem('productListScrollPosition') || '0', 10);
    if (scrollY > 0) {
      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        window.scrollTo({
          top: scrollY,
          behavior: smooth ? 'smooth' : 'auto'
        });
      });
      // Clear the saved position after restoring
      sessionStorage.removeItem('productListScrollPosition');
      setSavedScrollPosition(0);
    }
  };

  // Initialize selected product and page from URL on component mount
  useEffect(() => {
    const productIdFromUrl = getProductIdFromUrl();
    const pageFromUrl = getPageFromUrl();
    
    setCurrentPage(pageFromUrl);
    
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
      const pageFromUrl = getPageFromUrl();
      
      setCurrentPage(pageFromUrl);
      
      if (productIdFromUrl && products.length > 0) {
        const product = products.find(p => p.id === productIdFromUrl);
        setSelectedProduct(product || null);
      } else {
        setSelectedProduct(null);
        // Restore scroll position when navigating back to product list via browser buttons
        setTimeout(() => {
          restoreScrollPosition(true);
        }, 100);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [products]);

  // Restore scroll position when component mounts and we're on the product list
  useEffect(() => {
    if (!selectedProduct && products.length > 0) {
      const productIdFromUrl = getProductIdFromUrl();
      if (!productIdFromUrl) {
        // We're on the main product list, restore scroll position (instant for page load)
        setTimeout(() => {
          restoreScrollPosition(false);
        }, 200); // Slightly longer delay for initial load
      }
    }
  }, [selectedProduct, products]);

  const handleProductImageClick = (product: Product) => {
    setUploadingProduct(product);
    setShowImageUpload(true);
    setUploadError(null);
    setUploadSuccess(false);
  };

  const handleProductVariantsClick = (product: Product) => {
    // Save current scroll position before navigating
    saveScrollPosition();
    setSelectedProduct(product);
    setProductIdInUrl(product.id, currentPage);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setPageInUrl(page);
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
    // Restore scroll position after returning to product list with smooth animation
    setTimeout(() => {
      restoreScrollPosition(true);
    }, 100); // Small delay to ensure DOM is updated
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;

  if (selectedProduct) {
    return (
      <AnimatePresence mode="wait">
        <PageTransition key="product-detail" isVisible={true}>
          <ProductDetail
            product={selectedProduct}
            onBack={handleBackToProducts}
            onProductUpdate={updateProduct}
          />
        </PageTransition>
      </AnimatePresence>
    );
  }

  return (
    <PageTransition key="product-list" isVisible={true}>
      <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <FloatingParticles />
        
        <div className={`relative z-10 ${isArabic ? 'font-arabic' : ''}`}>
          <div className="container mx-auto px-6 py-8">
            {/* Header - simplified */}
            <motion.div 
              className={`text-center mb-12 ${isArabic ? 'text-right' : 'text-left'}`}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex justify-end mb-6">
                <LanguageToggle />
              </div>
              
              <div className="flex items-center justify-center mb-6">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-2xl mr-4 shadow-lg">
                  <Package className="h-10 w-10 text-white" />
                </div>
                
                <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900">
                  {isArabic ? 'مدير المنتجات' : 'Product Manager'}
                </h1>
              </div>
              
              <p className="text-gray-700 text-xl max-w-3xl mx-auto leading-relaxed">
                {isArabic 
                  ? 'إدارة كتالوج المنتجات الخاص بك مع رفع الصور الجميلة وتنظيم المتغيرات'
                  : 'Manage your product catalog with beautiful image uploads and variant organization'
                }
              </p>
            </motion.div>

            {/* Search Bar - simplified */}
            <SearchBar 
              searchTerm={searchTerm} 
              onSearchChange={setSearchTerm} 
            />

            {/* Stats - simplified */}
            <motion.div 
              className="flex justify-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="bg-white/20 backdrop-blur-xl rounded-2xl px-8 py-4 shadow-xl border border-white/30">
                <span className="text-gray-700 font-medium">
                  {isArabic ? 'إجمالي المنتجات: ' : 'Total Products: '}
                </span>
                <span className="font-black text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {products?.length || 0}
                </span>
                {searchTerm && (
                  <>
                    <span className="text-gray-400 mx-3">•</span>
                    <span className="text-gray-700 font-medium">{isArabic ? 'تم العثور على: ' : 'Found: '}</span>
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
            </motion.div>

            {/* Product Grid - simplified */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <ProductGrid
                products={products}
                searchTerm={searchTerm}
                onProductImageClick={handleProductImageClick}
                onProductVariantsClick={handleProductVariantsClick}
                initialPage={currentPage}
                onPageChange={handlePageChange}
              />
            </motion.div>

            {/* Simplified Image Upload Modal */}
            <AnimatePresence>
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
            </AnimatePresence>
          </div>
        </div>
      </div>
    </PageTransition>
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