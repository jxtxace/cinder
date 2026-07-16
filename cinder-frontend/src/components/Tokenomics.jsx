import React, { useState, useEffect } from 'react';
import { useReadContract } from 'wagmi';
import { formatUnits } from 'viem';
import { 
  CINDER_TOKEN_ADDRESS, CinderTokenABI, 
  CREATOR_LOCK_ADDRESS, CreatorLockABI
} from '../config/contracts';

export default function Tokenomics() {
  const { data: totalSupply = 0n } = useReadContract({
    address: CINDER_TOKEN_ADDRESS,
    abi: CinderTokenABI,
    functionName: 'totalSupply',
  });

  const { data: lockBalance = 0n } = useReadContract({
    address: CINDER_TOKEN_ADDRESS,
    abi: CinderTokenABI,
    functionName: 'balanceOf',
    args: [CREATOR_LOCK_ADDRESS],
  });

  const { data: unlockTime = 0n } = useReadContract({
    address: CREATOR_LOCK_ADDRESS,
    abi: CreatorLockABI,
    functionName: 'unlockTime',
  });

  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    if (unlockTime === 0n) return;
    
    const interval = setInterval(() => {
      const now = Math.floor(Date.now() / 1000);
      const target = Number(unlockTime);
      const diff = target - now;
      
      if (diff <= 0) {
        setTimeLeft('Unlocked');
        clearInterval(interval);
      } else {
        const d = Math.floor(diff / (24 * 3600));
        const h = Math.floor((diff % (24 * 3600)) / 3600);
        const m = Math.floor((diff % 3600) / 60);
        const s = diff % 60;
        setTimeLeft(`${d}d ${h}h ${m}m ${s}s`);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [unlockTime]);

  const totalStr = Number(formatUnits(totalSupply, 18));
  const lockStr = Number(formatUnits(lockBalance, 18));
  const holdersStr = totalStr - lockStr; // Simplification for demo (Pool + Holders)

  const lockPercent = totalStr > 0 ? (lockStr / totalStr) * 100 : 0;
  const holdersPercent = totalStr > 0 ? (holdersStr / totalStr) * 100 : 100;

  return (
    <section id="tokenomics" className="w-full py-20 px-4 md:px-12 max-w-5xl mx-auto scroll-mt-20">
      <h2 className="text-4xl font-extrabold text-white text-center mb-16">Tokenomics</h2>
      
      <div className="bg-charcoal-light border border-white/5 p-8 md:p-12 rounded-3xl interactive-card">
        <div className="flex flex-col md:flex-row justify-between mb-8">
          <div>
            <div className="text-gray-400 uppercase tracking-widest text-sm mb-1">Total Supply</div>
            <div className="text-3xl font-mono text-white">{totalStr.toLocaleString()} ASH</div>
          </div>
          <div className="mt-6 md:mt-0 md:text-right">
            <div className="text-gray-400 uppercase tracking-widest text-sm mb-1">Circulating / LP</div>
            <div className="text-3xl font-mono text-flame-orange">{holdersStr.toLocaleString()} ASH</div>
          </div>
        </div>

        {/* Stacked Bar */}
        <div className="w-full h-4 flex rounded-full overflow-hidden mb-6 bg-charcoal border border-white/5">
          <div className="h-full bg-flame-gradient" style={{ width: `${holdersPercent}%` }} title="Holders & Pool"></div>
          <div className="h-full bg-charcoal-light border-l border-white/10" style={{ width: `${lockPercent}%` }} title="Creator Lock"></div>
        </div>

        <div className="flex justify-between text-sm text-gray-400 mb-12">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-flame-orange"></div>
            <span>Holders & Pool ({holdersPercent.toFixed(1)}%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-charcoal-light border border-gray-600"></div>
            <span>Creator Lock ({lockPercent.toFixed(1)}%)</span>
          </div>
        </div>

        {/* Creator Lock Details */}
        <div className="border-t border-white/5 pt-8">
          <h3 className="text-xl font-bold text-white mb-4">Creator Lock Transparency</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-charcoal rounded-xl p-6 border border-white/5 interactive-card">
              <div className="text-gray-500 text-sm mb-2">Locked Balance</div>
              <div className="text-2xl font-mono text-white">{lockStr.toLocaleString()} ASH</div>
              <div className="text-gray-500 text-sm mt-4 mb-2">Time Until Unlock</div>
              <div className="text-2xl font-mono text-flame-gold">{timeLeft || 'Loading...'}</div>
            </div>
            <div className="flex flex-col justify-center">
              <div className="text-flame-red font-bold uppercase tracking-widest text-sm mb-2">Not Cancelable. Not Transferable.</div>
              <p className="text-gray-400 text-sm leading-relaxed">
                The Creator Lock contract contains no admin functions. The locked $ASH cannot be withdrawn, transferred, or accessed by anyone until the exact block timestamp is reached. It is hardcoded trust.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
