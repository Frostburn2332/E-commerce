import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { convertToINR } from '../../utils/currency';
import '../styles/ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart, updateQuantity, cartItems, removeFromCart } = useCart();
  const [isInCart, setIsInCart] = useState(false);
  const [itemQuantity, setItemQuantity] = useState(0);

  useEffect(() => {
    // Check if item is in cart and get its quantity
    console.log('Checking product:', product);
    const cartItem = cartItems.find(item => item._id === product._id);
    console.log('Found cart item:', cartItem);
    setIsInCart(!!cartItem);
    setItemQuantity(cartItem ? cartItem.quantity : 0);
  }, [cartItems, product]);

  if (!product) {
    return null;
  }

  const handleAddToCart = (e) => {
    e.stopPropagation();
    // Check if product has quantity available instead of inStock
    if (product.quantity > 0) {
      addToCart({
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1
      });

      // Add animation to button
      const button = e.target.closest('.add-to-cart-btn');
      if (button) {
        button.classList.add('clicked');
        setTimeout(() => button.classList.remove('clicked'), 1000);
      }
    }
  };

  const handleQuantityChange = (change) => {
    const newQuantity = itemQuantity + change;
    if (newQuantity === 0) {
      removeFromCart(product._id);
      setIsInCart(false);
      setItemQuantity(0);
    } else if (newQuantity > 0 && newQuantity <= product.quantity) { // Check against available quantity
      updateQuantity(product._id, newQuantity);
      setItemQuantity(newQuantity);
    }
  };

  return (
    <div className="product-card">
      <div className="product-image">
        <img 
          src={product.image || 'https://via.placeholder.com/300?text=No+Image'} 
          alt={product.name || 'Product'} 
        />
      </div>

      <div className="product-info">
        <div className="product-category">
          <span className="category-icon">🎯</span>
          {product.category || 'Uncategorized'}
        </div>
        
        <h3>{product.name || 'Unnamed Product'}</h3>
        
        <div className="price-container">
          <span className="price-label">Price:</span>
          <span className="price">₹{convertToINR(product.price || 0)}</span>
          <div className="price-stars">
            ⭐⭐⭐
          </div>
        </div>

        {!isInCart ? (
          <button 
            className={`add-to-cart-btn ${product.quantity <= 0 ? 'disabled' : ''}`}
            onClick={handleAddToCart}
            disabled={product.quantity <= 0}
          >
            <span className="button-text">
              {product.quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
            </span>
            <span className="button-icon">
              {product.quantity > 0 ? '🛒' : '😢'}
            </span>
          </button>
        ) : (
          <div className="quantity-control">
            <button 
              className="quantity-btn"
              onClick={() => handleQuantityChange(-1)}
            >
              -
            </button>
            <span className="quantity">{itemQuantity}</span>
            <button 
              className="quantity-btn"
              onClick={() => handleQuantityChange(1)}
              disabled={itemQuantity >= product.quantity} // Disable if trying to add more than available
            >
              +
            </button>
          </div>
        )}
        
        {/* Show available quantity */}
        <div className="stock-info">
          Stock: {product.quantity} available
        </div>
      </div>
    </div>
  );
};

export default ProductCard;