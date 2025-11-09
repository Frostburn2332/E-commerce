import React, { useState, useEffect, useRef } from 'react';
import './NavigationMenu.css';

const NavigationMenu = ({ filters, onFilterChange }) => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isClicked, setIsClicked] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveDropdown(null);
        setIsClicked(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const ageRanges = [
    { value: 'all', label: 'All Ages' },
    { value: '0-2', label: '0-2 years' },
    { value: '3-5', label: '3-5 years' },
    { value: '6-8', label: '6-8 years' },
    { value: '9-11', label: '9-11 years' },
    { value: '12+', label: '12+ years' }
  ];

  const priceRanges = [
    { value: 'all', label: 'All Prices' },
    { value: '0-25', label: 'Under $25' },
    { value: '25-50', label: '$25 - $50' },
    { value: '50-100', label: '$50 - $100' },
    { value: '100+', label: 'Over $100' }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' }
  ];

  const handleButtonClick = (dropdown) => {
    setIsClicked(true);
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const handleMouseEnter = (dropdown) => {
    if (!isClicked) {
      setActiveDropdown(dropdown);
    }
  };

  const handleMouseLeave = () => {
    if (!isClicked) {
      setActiveDropdown(null);
    }
  };

  const handleOptionSelect = (type, value) => {
    onFilterChange(type, value);
    setActiveDropdown(null);
    setIsClicked(false);
  };

  return (
    <nav className="navigation-menu" ref={menuRef}>
      <div 
        className="menu-item"
        onMouseEnter={() => handleMouseEnter('age')}
        onMouseLeave={handleMouseLeave}
      >
        <button 
          className={`menu-button ${activeDropdown === 'age' ? 'active' : ''}`}
          onClick={() => handleButtonClick('age')}
        >
          Age Range
          <span className="arrow"></span>
        </button>
        {activeDropdown === 'age' && (
          <div className="dropdown-menu">
            {ageRanges.map((range) => (
              <button
                key={range.value}
                onClick={() => handleOptionSelect('ageRange', range.value)}
                className={filters.ageRange === range.value ? 'selected' : ''}
              >
                {range.label}
                {filters.ageRange === range.value && <span className="checkmark">✓</span>}
              </button>
            ))}
          </div>
        )}
      </div>

      <div 
        className="menu-item"
        onMouseEnter={() => handleMouseEnter('price')}
        onMouseLeave={handleMouseLeave}
      >
        <button 
          className={`menu-button ${activeDropdown === 'price' ? 'active' : ''}`}
          onClick={() => handleButtonClick('price')}
        >
          Price Range
          <span className="arrow"></span>
        </button>
        {activeDropdown === 'price' && (
          <div className="dropdown-menu">
            {priceRanges.map((range) => (
              <button
                key={range.value}
                onClick={() => handleOptionSelect('priceRange', range.value)}
                className={filters.priceRange === range.value ? 'selected' : ''}
              >
                {range.label}
                {filters.priceRange === range.value && <span className="checkmark">✓</span>}
              </button>
            ))}
          </div>
        )}
      </div>

      <div 
        className="menu-item"
        onMouseEnter={() => handleMouseEnter('sort')}
        onMouseLeave={handleMouseLeave}
      >
        <button 
          className={`menu-button ${activeDropdown === 'sort' ? 'active' : ''}`}
          onClick={() => handleButtonClick('sort')}
        >
          Sort By
          <span className="arrow"></span>
        </button>
        {activeDropdown === 'sort' && (
          <div className="dropdown-menu">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleOptionSelect('sortBy', option.value)}
                className={filters.sortBy === option.value ? 'selected' : ''}
              >
                {option.label}
                {filters.sortBy === option.value && <span className="checkmark">✓</span>}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavigationMenu;