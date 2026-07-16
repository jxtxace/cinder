import React from 'react';
import { Flame, Zap, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full mt-auto py-12 px-4 border-t border-white/10 bg-charcoal-light">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex gap-4 text-gray-500">
          <a href="#" className="hover:text-flame-gold transition-colors"><Flame size={20} /></a>
          <a href="#" className="hover:text-flame-gold transition-colors"><Zap size={20} /></a>
          <a href="#" className="hover:text-flame-gold transition-colors"><Globe size={20} /></a>
        </div>
        
        <p className="text-gray-500 text-xs text-center md:text-right max-w-xl">
          Cinder ($ASH) is an unaudited demo project built for portfolio purposes. Not financial advice. Testnet only.
        </p>
      </div>
    </footer>
  );
}
