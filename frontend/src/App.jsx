import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { GoogleOAuthProvider } from '@react-oauth/google';

import { Layout } from './components/layout/Layout';
import { ProtectedRoute } from './components/utils/ProtectedRoute';

import { fetchUser } from './context/userSlice';
import './App.css';
import { HomePage } from './pages/HomePage';
import { ProductsPage as ShopProductsPage } from './pages/ProductsPage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { ProfilePage } from './pages/ProfilePage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { BestSellers } from './pages/BestSeller';
import FAQ from './pages/FAQ';

function App() {
  const dispatch = useDispatch();
  const { user, authLoading } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  if (authLoading) return <div>Loading...</div>;

  const isLoggedIn = !!user;

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
              <ProtectedRoute isAllowed={isLoggedIn}>
                <ShopProductsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="products/:id"
            element={
              <ProtectedRoute isAllowed={isLoggedIn}>
                <ProductDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="bestseller"
            element={
              <ProtectedRoute isAllowed={isLoggedIn}>
                <BestSellers />
              </ProtectedRoute>
            }
          />
          <Route
            path="cart"
            element={
              <ProtectedRoute isAllowed={isLoggedIn}>
                <CartPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="checkout"
            element={
              <ProtectedRoute isAllowed={isLoggedIn}>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="profile"
            element={
              <ProtectedRoute isAllowed={isLoggedIn}>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

         <Route path="/order-success/:userId/:orderId" element={<OrderConfirmationPage />} />


          {/* Public Routes */}
          <Route
            path="login"
            element={
              <GoogleOAuthProvider clientId='889165511247-v2r6frdj65fhfabrjh5r71e5ngstmjhl.apps.googleusercontent.com'>
                <LoginPage />
              </GoogleOAuthProvider>
            }
          />
          <Route path="signup" element={<RegisterPage />} />
          <Route path="faq" element={<FAQ />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
