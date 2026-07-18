import React, { useState, useEffect, useRef } from 'react';
import { useChainId, useReadContract, useAccount } from 'wagmi';
import { Network, Copy, Check, Settings, X, Activity } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { 
  CASHBACK_VAULT_ADDRESS, 
  CashbackVaultABI,
  CINDER_TOKEN_ADDRESS,
  CREATOR_LOCK_ADDRESS,
  BURN_VAULT_ADDRESS 
} from '../config/contracts';

export default function NetworkDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const chainId = useChainId();
  const { address } = useAccount();
  const { manualReducedMotion, setManualReducedMotion } = useSettings();
  const [copiedAddress, setCopiedAddress] = useState(null);

  // Epoch data
  const { data: currentEpoch = 0n } = useReadContract({
    address: CASHBACK_VAULT_ADDRESS,
    abi: CashbackVaultABI,
    functionName: 'currentEpoch',
  });
  
  const { data: genesisTimestamp = 0n } = useReadContract({
    address: CASHBACK_VAULT_ADDRESS,
    abi: CashbackVaultABI,
    functionName: 'genesisTimestamp',
  });

  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    if (genesisTimestamp === 0n) return;
    
    const updateTimer = () => {
      const EPOCH_LENGTH = 604800; // 7 days in seconds
      const nextEpochStart = Number(genesisTimestamp) + (Number(currentEpoch) + 1) * EPOCH_LENGTH;
      const now = Math.floor(Date.now() / 1000);
      const diff = nextEpochStart - now;
      
      if (diff <= 0) {
        setTimeLeft('Epoch ending...');
        return;
      }
      
      const d = Math.floor(diff / 86400);
      const h = Math.floor((diff % 86400) / 3600);
      const m = Math.floor((diff % 3600) / 60);
      const s = diff % 60;
      setTimeLeft(`${d}d ${h}h ${m}m ${s}s`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [currentEpoch, genesisTimestamp]);

  // Handle outside click & escape key
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    const handleEscape = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const copyToClipboard = (addr, label) => {
    navigator.clipboard.writeText(addr);
    setCopiedAddress(label);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const contracts = [
    { label: '$ASH Token', addr: CINDER_TOKEN_ADDRESS },
    { label: 'Cashback Vault', addr: CASHBACK_VAULT_ADDRESS },
    { label: 'Creator Lock', addr: CREATOR_LOCK_ADDRESS },
    { label: 'Burn Vault', addr: BURN_VAULT_ADDRESS },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-flame-gold transition-colors flex items-center gap-2 border border-transparent hover:border-white/10"
        title="Network & Contracts"
      >
        <Network size={20} />
      </button>

      {isOpen && (
        <div className="fixed inset-x-4 max-w-sm mx-auto top-24 max-h-[70vh] overflow-y-auto overflow-x-hidden md:absolute md:inset-x-auto md:right-0 md:top-auto md:mt-3 md:w-80 bg-charcoal-light border border-white/10 rounded-xl shadow-2xl z-50 text-sm">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-white/5 bg-black/20">
            <h3 className="font-bold text-white flex items-center gap-2">
              <Activity size={16} className="text-flame-orange" /> Network Status
            </h3>
            <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white">
              <X size={16} />
            </button>
          </div>

          <div className="p-4 space-y-6">
            {/* Network Info */}
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Connection</div>
              <div className="flex justify-between items-center bg-black/20 p-3 rounded-lg border border-white/5">
                <span className="text-gray-300">Chain ID</span>
                <span className="text-flame-gold font-mono">{chainId} {chainId === 31337 && '(Local)'}</span>
              </div>
            </div>

            {/* Epoch Info */}
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Time</div>
              <div className="bg-black/20 p-3 rounded-lg border border-white/5 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Current Epoch</span>
                  <span className="text-white font-mono">{currentEpoch.toString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Next Epoch In</span>
                  <span className="text-flame-orange font-mono font-bold">{timeLeft}</span>
                </div>
              </div>
            </div>

            {/* Contracts */}
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Contracts</div>
              <div className="space-y-2">
                {contracts.map((c) => (
                  <div key={c.label} className="flex justify-between items-center bg-black/20 p-2 px-3 rounded-lg border border-white/5 group hover:border-white/10 transition-colors">
                    <span className="text-gray-400 text-xs">{c.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-gray-500 text-xs">{c.addr.slice(0,6)}...{c.addr.slice(-4)}</span>
                      <button 
                        onClick={() => copyToClipboard(c.addr, c.label)}
                        className="text-gray-500 hover:text-white transition-colors"
                      >
                        {copiedAddress === c.label ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Settings */}
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                <Settings size={12} /> Settings
              </div>
              <div className="flex justify-between items-center bg-black/20 p-3 rounded-lg border border-white/5">
                <span className="text-gray-300">Reduce Motion</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={manualReducedMotion}
                    onChange={(e) => setManualReducedMotion(e.target.checked)}
                  />
                  <div className="w-9 h-5 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-flame-orange"></div>
                </label>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
