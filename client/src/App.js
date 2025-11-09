import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Home from './components/Home';
import ProductsPage from './pages/ProductsPage';
import CartPage from './pages/CartPage';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOrders from './pages/admin/AdminOrders';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmation from './pages/OrderConfirmation';
import Header from './components/layout/Header';
import './App.css';

function App() {
  const [filters, setFilters] = useState({
    category: 'all',
    ageRange: 'all',
    priceRange: 'all',
    sortBy: 'newest'
  });

  const handleFilterChange = (type, value) => {
    setFilters(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const ProtectedLayout = ({ children }) => {
    const location = useLocation();
    const isHomePage = location.pathname === '/';

    return (
      <>
        <Header 
          onFilterChange={handleFilterChange} 
          filters={filters} 
          isHomePage={isHomePage}
        />
        {children}
      </>
    );
  };

  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="App">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <ProtectedLayout>
                      <Home />
                    </ProtectedLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/products"
                element={
                  <ProtectedRoute>
                    <ProtectedLayout>
                      <ProductsPage filters={filters} onFilterChange={handleFilterChange} />
                    </ProtectedLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/cart"
                element={
                  <ProtectedRoute>
                    <ProtectedLayout>
                      <CartPage />
                    </ProtectedLayout>
                  </ProtectedRoute>
                }
              />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <ProtectedLayout>
                      <CheckoutPage />
                    </ProtectedLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/order-confirmation"
                element={
                  <ProtectedRoute>
                    <ProtectedLayout>
                      <OrderConfirmation />
                    </ProtectedLayout>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;