import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Add from './pages/Add';
import List from './pages/List';
import Orders from './pages/Orders';
import Login from './components/Login';
import EditProduct from './pages/EditProduct';
import { ToastContainer } from 'react-toastify';
import { UserProvider, useUser } from './context/UserContext';
import ProtectedRoute from './utils/ProtectedRoute';

import 'react-toastify/dist/ReactToastify.css';

export const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const currency = '$';

const AppRoutes = () => {
  const { user,setUser } = useUser();

  return (
    <>
      <ToastContainer />
      {!user ? (
        <Login />
      ) : (
        <>
          <Navbar setUser={setUser} />


          <hr />
          <div className="flex w-full">
            <Sidebar />
            <div className="w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base">
              <Routes>
                

  <Route path="/edit/:id" element={<ProtectedRoute isAllowed={!!user}><EditProduct /></ProtectedRoute>} />

                <Route path="/" element={
                  <ProtectedRoute isAllowed={!!user}>
                    <Add />
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
                       <Orders/>
                  </ProtectedRoute>
                } />
              </Routes>
            </div>
          </div>
        </>
      )}
    </>
  );
};

const App = () => (
  <UserProvider>
    <AppRoutes />
  </UserProvider>
);

export default App;
