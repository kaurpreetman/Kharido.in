import React from 'react';
import { Route, Routes } from 'react-router-dom'
import {Layout} from './components/layout/Layout'
import  {ProductsPage as ShopProductsPage} from './pages/ProductsPage'  
import { HomePage } from './pages/HomePage'
import { ProductDetailsPage } from './pages/ProductDetailsPage'
import './App.css'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ProfilePage } from './pages/ProfilePage'

import { CartPage } from './pages/CartPage'
import { ToastContainer } from 'react-toastify';
import { CheckoutPage } from './pages/CheckoutPage';
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { OrderConfirmationPage } from './pages/OrderConfirmationPage'
function App() {


  return (
    <div>
   <ToastContainer/>
   <Routes>
    <Route path="/" element={<Layout/>}>
     <Route index element={<HomePage/>}/>
   <Route path="products" element={<ShopProductsPage/>}/>
     <Route path="products/:id" element={<ProductDetailsPage/>}/>
   <Route path="cart" element={<CartPage />} />
      <Route path="checkout" element={<CheckoutPage />} />
         <Route path="order-success" element={<OrderConfirmationPage />} />
        <Route path="login" element={
           <GoogleOAuthProvider clientId='916638693347-2u7ib0mbs1li9v64bi7d72v4p1dfjfar.apps.googleusercontent.com'>
             <LoginPage />
           </GoogleOAuthProvider>
         
          } />
         <Route path="signup" element={<RegisterPage />} />
        <Route
          path="profile"
          element={<ProfilePage />  }
        />
      </Route>
    {/* <Route path="/admin" element={<AdminLayout/>}>
      <Route index element={<AdminDashboardPage />} />
      <Route path="products" element={<AdminProductsPage />} />
      <Route path="products/create" element={<CreateProductPage />} />
      <Route path="products/:id" element={<UpdateProductPage />} />
      <Route path="orders" element={<AdminOrdersPage />} />
      <Route path="users" element={<AdminUsersPage />} /> 

    </Route> */}
   </Routes>
   
   </div>
  );
}

export default App
