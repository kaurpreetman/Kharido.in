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
import {BestSellers} from './pages/BestSeller.jsx'
import { ShopContext } from './context/ShopContext.jsx';
import FAQ from './pages/FAQ.jsx'
import { Footer } from './components/layout/Footer.jsx';

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
            path="bestseller"
            element={
              <ProtectedRoute isAllowed={!!user}>
                <BestSellers />
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
              <GoogleOAuthProvider clientId='889165511247-v2r6frdj65fhfabrjh5r71e5ngstmjhl.apps.googleusercontent.com'>
                <LoginPage />
              </GoogleOAuthProvider>
            }
          />
          {/* <Route path="login" element={<LoginPage />} /> */}

          <Route path="signup" element={<RegisterPage />} />
          <Route path="faq" element={<FAQ/>} />
        </Route>
      </Routes>
 
    </div>
  );
}

export default App;
