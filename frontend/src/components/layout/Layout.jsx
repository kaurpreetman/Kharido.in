import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Footer } from './Footer';
import { Header } from './Header';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser } from '../../context/userSlice';

export const Layout = () => {
  const dispatch = useDispatch();
  const authLoading = useSelector((state) => state.user.authLoading);

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  if (authLoading) {
    return (
      <div className="h-screen flex justify-center items-center text-lg bg-gray-50 dark:bg-dark-900 text-gray-900 dark:text-gray-100 theme-transition">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-dark-900 theme-transition">
      <Header />
      <main className="flex-1 bg-gray-50 dark:bg-dark-900 theme-transition">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};