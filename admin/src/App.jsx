import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Add from './pages/Add';
import List from './pages/List';
import Orders from './pages/Orders';
import Users from './pages/Users';
import EditProduct from './pages/EditProduct';
import Login from './components/Login';
import { ToastContainer } from 'react-toastify';
import { UserProvider, useUser } from './context/UserContext';
import ProtectedRoute from './utils/ProtectedRoute';

import 'react-toastify/dist/ReactToastify.css';

export const backendUrl = 'http://localhost:5000';
export const currency = '₹';

const AppRoutes = () => {
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <ToastContainer />
      {!user ? (
        <Login />
      ) : (
        <>
          <Navbar />
          <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 p-8 ml-64">
              <Routes>
                <Route path="/" element={
                  <ProtectedRoute isAllowed={!!user}>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/add" element={
                  <ProtectedRoute isAllowed={!!user}>
                    <Add />
                  </ProtectedRoute>
                } />
                <Route path="/list" element={
                  <ProtectedRoute isAllowed={!!user}>
                    <List />
                  </ProtectedRoute>
                } />
                <Route path="/orders" element={
                  <ProtectedRoute isAllowed={!!user}>
                    <Orders />
                  </ProtectedRoute>
                } />
                <Route path="/users" element={
                  <ProtectedRoute isAllowed={!!user}>
                    <Users />
                  </ProtectedRoute>
                } />
                <Route path="/edit/:id" element={
                  <ProtectedRoute isAllowed={!!user}>
                    <EditProduct />
                  </ProtectedRoute>
                } />
              </Routes>
            </div>
          </div>
        </>
      )}
    </div> 
  );
};

const App = () => (
  <UserProvider>
  
      <AppRoutes />

  </UserProvider>
);

export default App;