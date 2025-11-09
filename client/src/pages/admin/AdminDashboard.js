import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API_URL from '../../config/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    processingOrders: 0,
    deliveredOrders: 0,
    totalRevenue: 0,
    todayOrders: 0
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        navigate('/admin/login');
        return;
      }

      const response = await fetch(`${API_URL}/admin/orders/stats/summary`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch statistics');
      }

      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError('Failed to load dashboard statistics');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="admin-loading">Loading dashboard...</div>;
  if (error) return <div className="admin-error">{error}</div>;

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Orders</h3>
          <p className="stat-number">{stats.totalOrders}</p>
        </div>
        
        <div className="stat-card">
          <h3>Today's Orders</h3>
          <p className="stat-number">{stats.todayOrders}</p>
        </div>
        
        <div className="stat-card">
          <h3>Pending Orders</h3>
          <p className="stat-number">{stats.pendingOrders}</p>
        </div>
        
        <div className="stat-card">
          <h3>Processing</h3>
          <p className="stat-number">{stats.processingOrders}</p>
        </div>
        
        <div className="stat-card">
          <h3>Delivered</h3>
          <p className="stat-number">{stats.deliveredOrders}</p>
        </div>
        
        <div className="stat-card">
          <h3>Total Revenue</h3>
          <p className="stat-number">₹{stats.totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      <div className="admin-actions">
        <button 
          className="view-orders-btn"
          onClick={() => navigate('/admin/orders')}
        >
          View All Orders
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
