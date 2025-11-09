import API_URL from '../config/api';

export const getProducts = async (filters = {}) => {
  try {
    const queryString = new URLSearchParams(filters).toString();
    const response = await fetch(`${API_URL}/products${queryString ? `?${queryString}` : ''}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const getProduct = async (id) => {
  try {
    const response = await fetch(`${API_URL}/products/${id}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};
