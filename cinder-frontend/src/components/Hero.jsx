import React, { useState } from 'react';
import { CINDER_TOKEN_ADDRESS, CASHBACK_VAULT_ADDRESS, CREATOR_LOCK_ADDRESS, BURN_VAULT_ADDRESS } from '../config/contracts';

export default function Hero() {
  const [copied, setCopied] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(CINDER_TOKEN_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="w-full flex flex-col items-center justify-center py-24 px-4 text-center">
      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-flame-gradient mb-6">
        you feed the fire.<br/>the fire feeds you.
      </h1>
      
      <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mb-12">
        A self-sustaining token loop where every transfer burns a portion of the supply and rewards active traders.
      </p>

      <div className="flex flex-col md:flex-row gap-4 mb-12">
        <a href="#loop" className="bg-flame-orange hover:bg-flame-gold text-charcoal font-bold py-3 px-8 rounded-full transition-all text-lg shadow-[0_0_15px_rgba(255,107,26,0.3)]">
          enter the loop
        </a>
        <button onClick={() => setShowModal(true)} className="border border-flame-red/50 hover:border-flame-gold text-flame-gold bg-transparent font-semibold py-3 px-8 rounded-full transition-all text-lg">
          view contracts
        </button>
      </div>

      <div className="bg-charcoal-light border border-white/10 rounded-xl p-4 flex flex-col sm:flex-row items-center gap-4 text-sm font-mono text-gray-400">
        <span>$ASH CA: {CINDER_TOKEN_ADDRESS}</span>
        <button onClick={handleCopy} className="text-flame-orange hover:text-flame-gold transition-colors">
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-charcoal border border-flame-red/30 p-8 rounded-2xl max-w-lg w-full relative">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
              ✕
            </button>
            <h3 className="text-2xl font-bold text-flame-gradient mb-6">Contract Addresses</h3>
            <div className="flex flex-col gap-4 font-mono text-sm">
              <div>
                <div className="text-gray-400 mb-1">CinderToken ($ASH)</div>
                <div className="bg-charcoal-light p-3 rounded text-gray-200 break-all">{CINDER_TOKEN_ADDRESS}</div>
              </div>
              <div>
                <div className="text-gray-400 mb-1">CashbackVault</div>
                <div className="bg-charcoal-light p-3 rounded text-gray-200 break-all">{CASHBACK_VAULT_ADDRESS}</div>
              </div>
              <div>
                <div className="text-gray-400 mb-1">CreatorLock</div>
                <div className="bg-charcoal-light p-3 rounded text-gray-200 break-all">{CREATOR_LOCK_ADDRESS}</div>
              </div>
              <div>
                <div className="text-gray-400 mb-1">BurnVault</div>
                <div className="bg-charcoal-light p-3 rounded text-gray-200 break-all">{BURN_VAULT_ADDRESS}</div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-6 text-center">Deployments on Hardhat Localhost (Chain ID: 31337)</p>
          </div>
        </div>
      )}
    </section>
  );
}
