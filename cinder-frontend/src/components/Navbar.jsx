import React, { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { NavLink, Link } from 'react-router-dom';
import NetworkDropdown from './NetworkDropdown';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const linkClass = ({ isActive }) => 
    `transition-colors ${isActive ? 'text-flame-gold' : 'hover:text-flame-gold'}`;
    
  const mobileLinkClass = ({ isActive }) =>
    `block py-2 transition-colors ${isActive ? 'text-flame-gold' : 'hover:text-flame-gold'}`;

  return (
    <nav className="w-full py-6 px-4 md:px-12 flex flex-wrap justify-between items-center border-b border-flame-red/20 bg-charcoal/90 backdrop-blur-md sticky top-0 z-50">
      <Link to="/" className="text-3xl font-bold tracking-tight text-flame-gradient">
        cinder
      </Link>
      
      <div className="hidden md:flex gap-6 items-center text-gray-300 font-medium text-sm">
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
        <button 
          className="md:hidden p-2 text-gray-300 hover:text-white focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {isMenuOpen && (
        <div className="w-full md:hidden mt-4 flex flex-col gap-2 text-gray-300 font-medium text-sm border-t border-flame-red/10 pt-4">
          <NavLink to="/" className={mobileLinkClass} onClick={() => setIsMenuOpen(false)} end>home</NavLink>
          <NavLink to="/mechanics" className={mobileLinkClass} onClick={() => setIsMenuOpen(false)}>mechanics</NavLink>
          <NavLink to="/tokenomics" className={mobileLinkClass} onClick={() => setIsMenuOpen(false)}>tokenomics</NavLink>
          <NavLink to="/activity" className={mobileLinkClass} onClick={() => setIsMenuOpen(false)}>activity</NavLink>
          <NavLink to="/about" className={mobileLinkClass} onClick={() => setIsMenuOpen(false)}>about</NavLink>
        </div>
      )}
    </nav>
  );
}
