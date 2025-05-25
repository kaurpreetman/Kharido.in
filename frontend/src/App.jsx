import React, { useContext } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { ProductsPage as ShopProductsPage } from './pages/ProductsPage';
import { HomePage } from './pages/HomePage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import './App.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ProfilePage } from './pages/ProfilePage';
import { CartPage } from './pages/CartPage';
import { ToastContainer } from 'react-toastify';
import { CheckoutPage } from './pages/CheckoutPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import  ProtectedRoute  from './components/utils/ProtectedRoute';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { ShopContext } from './context/ShopContext.jsx';

function App() {
  const { user } = React.useContext(ShopContext);

  return (
    <div>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />

          {/* Protected Routes */}
          <Route
            path="products"
            element={
              <ProtectedRoute isAllowed={!!user}>
                <ShopProductsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="products/:id"
            element={
              <ProtectedRoute isAllowed={!!user}>
                <ProductDetailsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="cart"
            element={
              <ProtectedRoute isAllowed={!!user}>
                <CartPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="checkout"
            element={
              <ProtectedRoute isAllowed={!!user}>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="profile"
            element={
              <ProtectedRoute isAllowed={!!user}>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          <Route path="order-success" element={<OrderConfirmationPage />} />

          {/* Public Routes */}
          <Route
            path="login"
            element={
              <GoogleOAuthProvider clientId=''>
                <LoginPage />
              </GoogleOAuthProvider>
            }
          />
          <Route path="signup" element={<RegisterPage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
