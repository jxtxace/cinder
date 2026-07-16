import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import DashboardStrip from './DashboardStrip';
import Footer from './Footer';

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen relative">
      <Navbar />
      <DashboardStrip />
      <main className="flex-1 w-full relative z-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
