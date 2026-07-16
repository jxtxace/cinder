import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { NavLink, Link } from 'react-router-dom';
import NetworkDropdown from './NetworkDropdown';

export default function Navbar() {
  const linkClass = ({ isActive }) => 
    `transition-colors ${isActive ? 'text-flame-gold' : 'hover:text-flame-gold'}`;

  return (
    <nav className="w-full py-6 px-4 md:px-12 flex justify-between items-center border-b border-flame-red/20 bg-charcoal/90 backdrop-blur-md sticky top-0 z-50">
      <Link to="/" className="text-3xl font-bold tracking-tight text-flame-gradient">
        cinder
      </Link>
      <div className="hidden lg:flex gap-6 items-center text-gray-300 font-medium text-sm">
        <NavLink to="/" className={linkClass} end>home</NavLink>
        <NavLink to="/mechanics" className={linkClass}>mechanics</NavLink>
        <NavLink to="/tokenomics" className={linkClass}>tokenomics</NavLink>
        <NavLink to="/activity" className={linkClass}>activity</NavLink>
        <NavLink to="/about" className={linkClass}>about</NavLink>
      </div>
      <div className="flex items-center gap-3">
        <NetworkDropdown />
        <ConnectButton 
          chainStatus="none"
          showBalance={false}
        />
      </div>
    </nav>
  );
}
