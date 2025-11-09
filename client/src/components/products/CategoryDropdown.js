import React, { useState, useRef, useEffect } from 'react';
import './CategoryDropdown.css';

const categories = [
  'All Categories',
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

const CategoryDropdown = ({ onSelectCategory }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setIsOpen(false);
    onSelectCategory(category === 'All Categories' ? 'All' : category);
  };

  return (
    <div className="category-dropdown" ref={dropdownRef}>
      <button 
        className="category-button" 
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedCategory}
        <svg 
          className={`dropdown-arrow ${isOpen ? 'open' : ''}`}
          width="12" 
          height="8" 
          viewBox="0 0 12 8" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M1 1L6 6L11 1" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="category-list">
          {categories.map((category) => (
            <button
              key={category}
              className={`category-item ${selectedCategory === category ? 'selected' : ''}`}
              onClick={() => handleCategorySelect(category)}
            >
              {category}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryDropdown;
