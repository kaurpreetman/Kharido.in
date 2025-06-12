import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { GoogleOAuthProvider } from '@react-oauth/google';

import { Layout } from './components/layout/Layout';
import { ProtectedRoute } from './components/utils/ProtectedRoute';

import { fetchUser } from './context/userSlice';
import { setTheme } from './context/themeSlice';
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
const clientId = import.meta.env.VITE_CLIENT_ID;

function App() {
  const dispatch = useDispatch();
  const { user, authLoading } = useSelector((state) => state.user);
  const theme = useSelector((state) => state.theme.mode);

  useEffect(() => {
    dispatch(fetchUser());
    
    // Initialize theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      dispatch(setTheme(savedTheme));
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      dispatch(setTheme(prefersDark ? 'dark' : 'light'));
    }
  }, [dispatch]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    // Apply theme to body as well
    document.body.className = theme === 'dark' 
      ? 'bg-dark-900 text-gray-100 theme-transition' 
      : 'bg-gray-50 text-gray-900 theme-transition';
  }, [theme]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-900 theme-transition">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-primary-200 dark:border-primary-800 border-t-primary-600 dark:border-t-primary-400 rounded-full animate-spin mx-auto mb-6"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-secondary-600 dark:border-t-secondary-400 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400 font-medium">Loading your experience...</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">Please wait while we prepare everything for you</p>
        </div>
      </div>
    );
  }

  const isLoggedIn = !!user;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 theme-transition">
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme}
        toastClassName="backdrop-blur-sm"
        className="mt-16"
      />
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
              <GoogleOAuthProvider clientId={clientId}>
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