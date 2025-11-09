import React from 'react';
import { useCart } from '../../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { convertToINR } from '../../utils/currency';
import './CartModal.css';

const CartModal = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    isCartOpen,
    toggleCart,
    removeFromCart,
    updateQuantity,
    getCartTotal,
  } = useCart();

  const handleContinueShopping = () => {
    toggleCart();
    navigate('/products');
  };

  const handleCheckout = () => {
    console.log('Proceeding to checkout...');
    toggleCart();
    navigate('/checkout');
  };

  if (!isCartOpen) return null;

  return (
    <div className="cart-modal-overlay">
      <div className="cart-modal">
        <div className="cart-modal-header">
          <h2>Your Cart</h2>
          <button className="close-button" onClick={toggleCart}>×</button>
        </div>
        
        <div className="cart-items">
          {cartItems.length === 0 ? (
            <p className="empty-cart-message">Your cart is empty</p>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="cart-item-image"
                />
                <div className="cart-item-details">
                  <h3>{item.name}</h3>
                  <p>₹{convertToINR(item.price)}</p>
                  <div className="quantity-controls">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  className="remove-button"
                  onClick={() => removeFromCart(item.id)}
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>
        
        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>Total:</span>
              <span>₹{getCartTotal().toFixed(2)}</span>
            </div>
            <div className="cart-buttons">
              <button className="continue-shopping-button" onClick={handleContinueShopping}>
                Continue Shopping
              </button>
              <button 
                className="checkout-button"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;
