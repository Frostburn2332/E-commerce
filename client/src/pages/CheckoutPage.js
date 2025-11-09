import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import API_URL from '../config/api';
import { 
  indianStates, 
  citiesByState, 
  validateIndianPostalCode, 
  validateIndianPhoneNumber 
} from '../utils/indianStates';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [deliveryDetails, setDeliveryDetails] = useState({
    fullName: '',
    email: user?.email || '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'India'
    }
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [availableCities, setAvailableCities] = useState([]);

  useEffect(() => {
    if (deliveryDetails.address.state) {
      setAvailableCities(citiesByState[deliveryDetails.address.state] || []);
      // Reset city if not available in new state
      if (!citiesByState[deliveryDetails.address.state]?.includes(deliveryDetails.address.city)) {
        setDeliveryDetails(prev => ({
          ...prev,
          address: {
            ...prev.address,
            city: ''
          }
        }));
      }
    }
  }, [deliveryDetails.address.state]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for phone number
    if (name === 'phone') {
      // Only allow numbers and limit to 10 digits
      const numbersOnly = value.replace(/[^0-9]/g, '').slice(0, 10);
      setDeliveryDetails(prev => ({
        ...prev,
        [name]: numbersOnly
      }));
      return;
    }

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setDeliveryDetails(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setDeliveryDetails(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    // Validate phone number (must be 10 digits and start with 6-9)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(deliveryDetails.phone)) {
      errors.phone = 'Please enter a valid 10-digit Indian mobile number starting with 6-9';
    }

    if (!validateIndianPostalCode(deliveryDetails.address.zipCode)) {
      errors.zipCode = 'Please enter a valid 6-digit Indian postal code';
    }

    if (!deliveryDetails.address.state) {
      errors.state = 'Please select a state';
    }

    if (!deliveryDetails.address.city) {
      errors.city = 'Please select a city';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please log in to place an order');
      }

      // Log the cart items and token before submission
      console.log('Cart Items:', cartItems);
      console.log('Using token:', token);
      
      // Validate cart items
      if (!cartItems || cartItems.length === 0) {
        throw new Error('Cart is empty');
      }

      // Log cart items for debugging
      console.log('Cart items before mapping:', cartItems);

      // Create order payload
      const orderPayload = {
        items: cartItems.map(item => {
          console.log('Processing item:', item);
          return {
            product: item._id,
            quantity: parseInt(item.quantity),
            price: parseFloat(item.price)
          };
        }),
        deliveryDetails: {
          fullName: deliveryDetails.fullName,
          email: deliveryDetails.email || user.email,
          phone: deliveryDetails.phone,
          address: {
            street: deliveryDetails.address.street,
            city: deliveryDetails.address.city,
            state: deliveryDetails.address.state,
            zipCode: deliveryDetails.address.zipCode,
            country: 'India'
          }
        },
        totalAmount: parseFloat(getCartTotal())
      };

      console.log('Submitting order with payload:', orderPayload);

      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderPayload)
      });

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error('Failed to parse response:', jsonError);
        throw new Error('Server error. Please check if the server is running.');
      }

      if (!response.ok) {
        console.error('Order creation failed:', data);
        throw new Error(data.details || data.message || 'Failed to create order');
      }

      // Clear the cart after successful order
      clearCart();
      
      // Navigate to order confirmation page
      navigate('/order-confirmation', { state: { orderId: data.orderId } });

    } catch (err) {
      console.error('Order creation failed:', err);
      setError(err.message || 'Failed to create order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="checkout-empty">
        <h2>Your cart is empty</h2>
        <button onClick={() => navigate('/products')} className="continue-shopping">
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-form-container">
          <h2>Delivery Details</h2>
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit} className="checkout-form">
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={deliveryDetails.fullName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={deliveryDetails.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={deliveryDetails.phone}
                onChange={handleInputChange}
                placeholder="Enter 10-digit mobile number"
                pattern="[6-9][0-9]{9}"
                title="Please enter a valid 10-digit Indian mobile number starting with 6-9"
                maxLength="10"
                required
                className={validationErrors.phone ? 'error' : ''}
              />
              {validationErrors.phone && (
                <div className="error-message">{validationErrors.phone}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="street">Street Address</label>
              <input
                type="text"
                id="street"
                name="address.street"
                value={deliveryDetails.address.street}
                onChange={handleInputChange}
                required
              />
            </div>

              <div className="form-row">
              <div className="form-group">
                <label htmlFor="state">State</label>
                <select
                  id="state"
                  name="address.state"
                  value={deliveryDetails.address.state}
                  onChange={handleInputChange}
                  required
                  className={validationErrors.state ? 'error' : ''}
                >
                  <option value="">Select State</option>
                  {indianStates.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
                {validationErrors.state && (
                  <div className="error-message">{validationErrors.state}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="city">City</label>
                <select
                  id="city"
                  name="address.city"
                  value={deliveryDetails.address.city}
                  onChange={handleInputChange}
                  required
                  disabled={!deliveryDetails.address.state}
                  className={validationErrors.city ? 'error' : ''}
                >
                  <option value="">Select City</option>
                  {availableCities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
                {validationErrors.city && (
                  <div className="error-message">{validationErrors.city}</div>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="zipCode">Postal Code</label>
                <input
                  type="text"
                  id="zipCode"
                  name="address.zipCode"
                  value={deliveryDetails.address.zipCode}
                  onChange={handleInputChange}
                  placeholder="Enter 6-digit postal code"
                  maxLength="6"
                  required
                  className={validationErrors.zipCode ? 'error' : ''}
                />
                {validationErrors.zipCode && (
                  <div className="error-message">{validationErrors.zipCode}</div>
                )}
              </div>

            </div>

            <input
              type="hidden"
              name="address.country"
              value="India"
            />

            <button 
              type="submit" 
              className="place-order-button"
              disabled={loading}
            >
              {loading ? 'Processing...' : `Place Order - ₹${getCartTotal().toFixed(2)}`}
            </button>
          </form>
        </div>

        <div className="order-summary">
          <h3>Order Summary</h3>
          <div className="cart-items">
            {cartItems.map(item => (
              <div key={item._id} className="summary-item">
                <img src={item.image} alt={item.name} />
                <div className="item-details">
                  <h4>{item.name}</h4>
                  <p>Quantity: {item.quantity}</p>
                  <p>₹{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="total">
            <span>Total:</span>
            <span>₹{getCartTotal().toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
