import React from 'react'
import { Outlet } from 'react-router-dom';
import { Footer } from './Footer';
import { Header } from './Header'
export const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
        <Header/>
        <main className="flex-1 bg-gray-50">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
