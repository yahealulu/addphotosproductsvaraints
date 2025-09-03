import { useState, useEffect } from 'react';
import { Product, ProductsResponse } from '../types/Product';
import { apiService } from '../services/api';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response: ProductsResponse = await apiService.getProducts();
      
      if (response.status && response.data) {
        // Validate that data is an array and filter out invalid products
        const validProducts = Array.isArray(response.data) 
          ? response.data.filter(product => 
              product && 
              typeof product.id === 'number' &&
              product.name_translations &&
              product.description_translations
            )
          : [];
        setProducts(validProducts);
      } else {
        throw new Error(response.message || 'Failed to fetch products');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching products');
      console.error('Error fetching products:', err);
      // Set empty array on error to prevent crashes
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const updateProduct = (updatedProduct: Product) => {
    setProducts(prevProducts => 
      prevProducts.map(product => 
        product.id === updatedProduct.id ? updatedProduct : product
      )
    );
  };

  const refetch = () => {
    fetchProducts();
  };

  return {
    products,
    loading,
    error,
    updateProduct,
    refetch
  };
};