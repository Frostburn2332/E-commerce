import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './OrderConfirmation.css';

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderId = location.state?.orderId;

  if (!orderId) {
    return (
      <div className="order-confirmation">
        <h2>No order information found</h2>
        <button onClick={() => navigate('/products')} className="continue-shopping">
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="order-confirmation">
      <div className="confirmation-content">
        <h2>Order Confirmed!</h2>
        <div className="success-icon">✓</div>
        <p>Thank you for your order.</p>
        <p>Your order ID is: <strong>{orderId}</strong></p>
        <p>We'll send you an email with your order details and tracking information.</p>
        <button onClick={() => navigate('/products')} className="continue-shopping">
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmation;
