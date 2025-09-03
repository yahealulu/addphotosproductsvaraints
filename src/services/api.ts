const API_BASE = 'https://st.amjadshbib.com/api';
const IMAGE_BASE = 'https://st.amjadshbib.com/api/public';
const TOKEN = '843|OP9EPzngkXRT0sWEzu0irLFkiYrgWKLAScSF3337213ff4ab';

export const apiService = {
  async getProducts() {
    try {
      const response = await fetch(`${API_BASE}/products`, {
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
      
      return await response.json();
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
      
      return await response.json();
    } catch (error) {
      console.error('Error uploading variant image:', error);
      throw error;
    }
  },

  getImageUrl(imagePath: string | null) {
    if (!imagePath) return null;
    return `${IMAGE_BASE}/${imagePath}`;
  }
};