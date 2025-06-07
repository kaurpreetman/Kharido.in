import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // Initialize user from localStorage if exists
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Sync user state changes to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/auth/adlogin`,
        { email, password },
        { withCredentials: true }
      );

      if (response.data.success) {
        setUser(response.data.user); // store user info in state and localStorage
        toast.success('Logged in successfully');
        return { success: true };
      } else {
        toast.error(response.data.message);
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return { success: false, message };
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${backendUrl}/api/auth/logout`, {}, { withCredentials: true });
      setUser(null); // clears state and triggers removal from localStorage via useEffect
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
