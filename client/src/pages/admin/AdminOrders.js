import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API_URL from '../../config/api';
import './AdminOrders.css';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
    
    // Set up polling to check for new orders every 10 seconds
    const pollInterval = setInterval(() => {
      fetchOrders(true); // Pass true to indicate this is a polling request
    }, 10000);

    // Cleanup interval on component unmount
    return () => clearInterval(pollInterval);
  }, [selectedStatus]);

  const fetchOrders = async (isPolling = false) => {
    try {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        navigate('/admin/login');
        return;
      }

      const url = selectedStatus === 'all' 
        ? `${API_URL}/admin/orders`
        : `${API_URL}/admin/orders?status=${selectedStatus}`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch orders');
      }

      const data = await response.json();
      const newOrders = data.orders || [];

      // Compare with current orders to check for changes
      const hasChanges = JSON.stringify(orders) !== JSON.stringify(newOrders);
      
      if (hasChanges) {
        setOrders(newOrders);
        if (isPolling) {
          // Optional: Add notification for new orders
          console.log('New orders received!');
        }
      }
    } catch (err) {
      if (!isPolling) {
        // Only show errors for manual fetches, not background polling
        setError('Failed to load orders');
        console.error('Error:', err);
      }
    } finally {
      if (!isPolling) {
        setLoading(false);
      }
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('adminToken');
      
      const response = await fetch(`${API_URL}/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update order status');
      }

      // Refresh orders after status update
      fetchOrders();
    } catch (err) {
      setError('Failed to update order status');
      console.error('Error:', err);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return <div className="admin-loading">Loading orders...</div>;
  if (error) return <div className="admin-error">{error}</div>;

  return (
    <div className="admin-orders">
      <div className="orders-header">
        <h1>Orders Management</h1>
        <div className="filter-section">
          <label htmlFor="status-filter">Filter by Status:</label>
          <select
            id="status-filter"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="orders-table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id}>
                <td>{order.orderNumber}</td>
                <td>{formatDate(order.createdAt)}</td>
                <td>
                  <div>{order.deliveryDetails.fullName}</div>
                  <div className="customer-details">
                    <small>{order.deliveryDetails.email}</small>
                    <small>{order.deliveryDetails.phone}</small>
                  </div>
                </td>
                <td>
                  <div className="order-items">
                    {order.items.map((item, index) => (
                      <div key={index} className="order-item">
                        {item.product.name} x {item.quantity}
                      </div>
                    ))}
                  </div>
                </td>
                <td>₹{order.totalAmount.toFixed(2)}</td>
                <td>
                  <span className={`status-badge ${order.status}`}>
                    {order.status}
                  </span>
                </td>
                <td>
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                    className="status-select"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;
