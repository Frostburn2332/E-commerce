import React, { useState, useEffect } from 'react';
import ProductCard from '../components/products/ProductCard';
import API_URL from '../config/api';
import './ProductsPage.css';

const ProductsPage = ({ filters, onFilterChange }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/products`);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = (products) => {
    if (!Array.isArray(products)) return [];

    return products.filter(product => {
      if (!product) return false;

      // Category filter
      if (filters?.category && filters.category !== 'all') {
        if (!product.category) return false;
        if (product.category.toLowerCase() !== filters.category.toLowerCase()) {
          return false;
        }
      }

      // Age range filter
      if (filters?.ageRange && filters.ageRange !== 'all') {
        if (!product.ageRange) return false;
        const [minAge] = product.ageRange.split('-').map(s => parseInt(s.replace('+', '')));
        
        if (filters.ageRange === '0-2' && minAge > 2) return false;
        if (filters.ageRange === '3-5' && (minAge < 3 || minAge > 5)) return false;
        if (filters.ageRange === '6-8' && (minAge < 6 || minAge > 8)) return false;
        if (filters.ageRange === '9-11' && (minAge < 9 || minAge > 11)) return false;
        if (filters.ageRange === '12+' && minAge < 12) return false;
      }

      // Price range filter
      if (filters?.priceRange && filters.priceRange !== 'all') {
        if (typeof product.price !== 'number') return false;
        
        if (filters.priceRange === '0-25' && product.price > 25) return false;
        if (filters.priceRange === '25-50' && (product.price <= 25 || product.price > 50)) return false;
        if (filters.priceRange === '50-100' && (product.price <= 50 || product.price > 100)) return false;
        if (filters.priceRange === '100+' && product.price <= 100) return false;
      }

      return true;
    }).sort((a, b) => {
      if (!filters?.sortBy) return 0;
      
      switch (filters.sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        default:
          return 0;
      }
    });
  };

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  const filteredProducts = filterProducts(products);

  return (
    <div className="products-page">
      <div className="products-grid">
        {filteredProducts.map(product => (
          <ProductCard 
            key={product._id}
            product={product}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;