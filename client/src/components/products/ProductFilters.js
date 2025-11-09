import React from 'react';
import './ProductFilters.css';

const categories = [
  'All',
  'Action Figures',
  'Building Blocks',
  'Dolls',
  'Educational',
  'Electronic',
  'Games',
  'Outdoor',
  'Plush Toys',
  'Vehicles'
];

const ageRanges = [
  'All',
  '0-2 years',
  '3-5 years',
  '6-8 years',
  '9-11 years',
  '12+ years'
];

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' }
];

const ProductFilters = ({ filters, onFilterChange }) => {
  const handleChange = (type, value) => {
    onFilterChange({ ...filters, [type]: value });
  };

  return (
    <div className="product-filters">
      <div className="filter-section">
        <h3>Categories</h3>
        <select 
          value={filters.category || 'All'} 
          onChange={(e) => handleChange('category', e.target.value)}
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-section">
        <h3>Age Range</h3>
        <select 
          value={filters.ageRange || 'All'} 
          onChange={(e) => handleChange('ageRange', e.target.value)}
        >
          {ageRanges.map(range => (
            <option key={range} value={range}>
              {range}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-section">
        <h3>Price Range</h3>
        <div className="price-inputs">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice || ''}
            onChange={(e) => handleChange('minPrice', e.target.value)}
          />
          <span>to</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice || ''}
            onChange={(e) => handleChange('maxPrice', e.target.value)}
          />
        </div>
      </div>

      <div className="filter-section">
        <h3>Sort By</h3>
        <select 
          value={filters.sort || 'newest'} 
          onChange={(e) => handleChange('sort', e.target.value)}
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ProductFilters;
