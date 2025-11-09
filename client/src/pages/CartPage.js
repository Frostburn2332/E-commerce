import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { convertToINR } from '../utils/currency';
import './CartPage.css';

const CartPage = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    getCartTotal,
  } = useCart();

  return (
    <div className="cart-page">
      <div className="cart-page-header">
        <h1>Shopping Cart</h1>
        <button className="continue-shopping" onClick={() => navigate('/products')}>
          Continue Shopping
        </button>
      </div>

      <div className="cart-content">
        <div className="cart-items-container">
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <h2>Your cart is empty</h2>
              <p>Looks like you haven't added any items to your cart yet.</p>
              <button onClick={() => navigate('/products')}>Start Shopping</button>
            </div>
          ) : (
            <>
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item-card">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="cart-item-image"
                  />
                  <div className="cart-item-details">
                    <h3>{item.name}</h3>
                    <p className="item-price">₹{convertToINR(item.price)}</p>
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
                    <button
                      className="remove-button"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                  <div className="item-total">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-summary">
            <h2>Order Summary</h2>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{getCartTotal().toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="summary-total">
              <span>Total</span>
              <span>₹{getCartTotal().toFixed(2)}</span>
            </div>
            <button 
              className="checkout-button"
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
