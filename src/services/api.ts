const API_BASE = 'https://setalkel.com/api';
const IMAGE_BASE = 'https://setalkel.com/api/public';
const TOKEN = '843|OP9EPzngkXRT0sWEzu0irLFkiYrgWKLAScSF3337213ff4ab';

export const apiService = {
  async getProducts() {
    try {
      // Updated to use the new endpoint with q=hidden parameter
      const response = await fetch(`${API_BASE}/products?q=hidden`, {
        headers: {
          'Authorization': `Bearer ${TOKEN}`,
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  async updateProductHiddenStatus(productId: number, isHidden: boolean) {
    try {
      const formData = new FormData();
      formData.append('is_hidden', isHidden ? '1' : '0');
      formData.append('_method', 'PUT');
      
      const response = await fetch(`${API_BASE}/products/${productId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${TOKEN}`,
        },
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating product hidden status:', error);
      throw error;
    }
  },

  async updateVariantHiddenStatus(productId: number, variantId: number, isHidden: boolean) {
    try {
      const formData = new FormData();
      formData.append('is_hidden', isHidden ? '1' : '0');
      formData.append('_method', 'PUT');
      
      const response = await fetch(`${API_BASE}/products/${productId}/variants/${variantId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${TOKEN}`,
        },
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating variant hidden status:', error);
      throw error;
    }
  },

  async updateVariantPackaging(productId: number, variantId: number, packaging: string) {
    try {
      const formData = new FormData();
      formData.append('packaging', packaging);
      formData.append('_method', 'PUT');
      
      const response = await fetch(`${API_BASE}/products/${productId}/variants/${variantId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${TOKEN}`,
        },
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating variant packaging:', error);
      throw error;
    }
  },

  async updateProductWeightUnit(productId: number, weightUnit: string) {
    try {
      const formData = new FormData();
      formData.append('weight_unit', weightUnit);
      formData.append('_method', 'PUT');
      
      const response = await fetch(`${API_BASE}/products/${productId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${TOKEN}`,
        },
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating product weight unit:', error);
      throw error;
    }
  },

  async uploadProductImage(productId: number, imageFile: File) {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('_method', 'PUT');
      
      const response = await fetch(`${API_BASE}/products/${productId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${TOKEN}`,
        },
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error uploading product image:', error);
      throw error;
    }
  },

  async uploadVariantImage(productId: number, variantId: number, imageFile: File) {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('_method', 'PUT');
      
      const response = await fetch(`${API_BASE}/products/${productId}/variants/${variantId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${TOKEN}`,
        },
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error uploading variant image:', error);
      throw error;
    }
  },

  getImageUrl(imagePath: string | null, timestamp?: number) {
    if (!imagePath) return null;
    const baseUrl = `${IMAGE_BASE}/${imagePath}`;
    // Add cache-busting parameter if timestamp is provided
    return timestamp ? `${baseUrl}?t=${timestamp}` : baseUrl;
  }
};