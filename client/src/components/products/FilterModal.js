import React, { useState } from 'react';
import './FilterModal.css';

const ageRanges = [
  'All Ages',
  '0-2 years',
  '3-5 years',
  '6-8 years',
  '9-11 years',
  '12+ years'
];

const FilterModal = ({ isOpen, onClose, filters, onApplyFilters }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  if (!isOpen) return null;

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  return (
    <div className="filter-modal-overlay">
      <div className="filter-modal">
        <div className="filter-modal-header">
          <h2>Filters</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="filter-modal-content">
          <div className="filter-section">
            <h3>Age Range</h3>
            <div className="age-range-options">
              {ageRanges.map(range => (
                <button
                  key={range}
                  className={`age-range-button ${localFilters.ageRange === range ? 'selected' : ''}`}
                  onClick={() => setLocalFilters({...localFilters, ageRange: range})}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h3>Price Range</h3>
            <div className="price-range-inputs">
              <div className="input-group">
                <label>Min Price ($)</label>
                <input
                  type="number"
                  value={localFilters.minPrice || ''}
                  onChange={(e) => setLocalFilters({
                    ...localFilters,
                    minPrice: e.target.value ? Number(e.target.value) : ''
                  })}
                  placeholder="Min"
                  min="0"
                />
              </div>
              <div className="input-group">
                <label>Max Price ($)</label>
                <input
                  type="number"
                  value={localFilters.maxPrice || ''}
                  onChange={(e) => setLocalFilters({
                    ...localFilters,
                    maxPrice: e.target.value ? Number(e.target.value) : ''
                  })}
                  placeholder="Max"
                  min="0"
                />
              </div>
            </div>
          </div>

          <div className="filter-section">
            <h3>Sort By</h3>
            <div className="sort-options">
              <button
                className={`sort-button ${localFilters.sort === 'price_asc' ? 'selected' : ''}`}
                onClick={() => setLocalFilters({...localFilters, sort: 'price_asc'})}
              >
                Price: Low to High
              </button>
              <button
                className={`sort-button ${localFilters.sort === 'price_desc' ? 'selected' : ''}`}
                onClick={() => setLocalFilters({...localFilters, sort: 'price_desc'})}
              >
                Price: High to Low
              </button>
            </div>
          </div>
        </div>

        <div className="filter-modal-footer">
          <button className="reset-button" onClick={() => setLocalFilters({
            ageRange: 'All Ages',
            minPrice: '',
            maxPrice: '',
            sort: ''
          })}>
            Reset All
          </button>
          <button className="apply-button" onClick={handleApply}>
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
