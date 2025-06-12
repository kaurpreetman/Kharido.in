import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // 🟡 Needed for ProtectedRoute

  useEffect(() => {
    const storedUser = localStorage.getItem('shopstore_user');
    if (storedUser) {
      try {
       setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('shopstore_user');
      }
    }
    setLoading(false); // ✅ Done checking localStorage
  }, []);

  const login = (userData) => {
   setUser(userData);
  localStorage.setItem('shopstore_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('shopstore_user');
  };

  return (
    <UserContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};