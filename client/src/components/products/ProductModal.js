import React from 'react';
import { convertToINR } from '../../utils/currency';
import '../styles/ProductModal.css';

const ProductModal = ({ product, onClose }) => {
  const handleAddToCart = () => {
    // TODO: Implement cart functionality
    alert('Added to cart!');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>&times;</button>
        
        <div className="modal-body">
          <div className="product-image-large">
            <img src={product.image} alt={product.name} />
          </div>
          
          <div className="product-details">
            <h2>{product.name}</h2>
            <p className="price">₹{convertToINR(product.price)}</p>
            <p className="description">{product.description}</p>
            
            <div className="stock-status">
              Status: <span className={product.inStock ? 'in-stock' : 'out-of-stock'}>
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
            
            {product.inStock && (
              <div className="action-buttons">
                <button className="add-to-cart-btn" onClick={handleAddToCart}>
                  Add to Cart
                </button>
                <button className="buy-now-btn">
                  Buy Now
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;

