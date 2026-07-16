import React, { useState } from 'react';
import { useReadContract } from 'wagmi';
import { formatUnits } from 'viem';
import { Flame } from 'lucide-react';
import { CINDER_TOKEN_ADDRESS, CinderTokenABI, BURN_VAULT_ADDRESS, BurnVaultABI } from '../config/contracts';

export default function BurnSimulator() {
  const [burnAmount, setBurnAmount] = useState(0); 

  // Read LIVE supply and burned amounts. NO writes!
  const { data: totalSupplyData } = useReadContract({
    address: CINDER_TOKEN_ADDRESS,
    abi: CinderTokenABI,
    functionName: 'totalSupply',
  });

  const { data: totalBurnedData } = useReadContract({
    address: BURN_VAULT_ADDRESS,
    abi: BurnVaultABI,
    functionName: 'totalBurned',
  });

  const totalSupply = totalSupplyData ? Number(formatUnits(totalSupplyData, 18)) : 1000000000;
  const alreadyBurned = totalBurnedData ? Number(formatUnits(totalBurnedData, 18)) : 0;
  
  // Cap at 10% of total supply for the slider maximum
  const MAX_SIMULATION = 100000000;

  const handleSlider = (e) => {
    setBurnAmount(Number(e.target.value));
  };

  const currentSupply = totalSupply;
  const newSupply = currentSupply - burnAmount;
  const totalBurnedCombined = alreadyBurned + burnAmount;
  
  // Prevent division by zero if something goes weird
  const percentBurnedOfCurrent = currentSupply > 0 ? (burnAmount / currentSupply) * 100 : 0;
  
  // Calculate width for the visual bar (never goes below 0 or above 100)
  const remainingPercent = Math.max(0, Math.min(100, (newSupply / currentSupply) * 100));

  return (
    <div className="bg-charcoal-light border border-flame-red/20 rounded-2xl p-6 md:p-8 shadow-[0_0_30px_rgba(255,107,26,0.05)] relative overflow-hidden group">
      {/* Decorative pulse for non-reduced motion */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-flame-red/10 blur-[80px] rounded-full pointer-events-none animate-pulse-slow"></div>
      
      <div className="relative z-10">
        <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <Flame className="text-flame-orange w-6 h-6" />
          Burn Simulator
        </h3>
        <p className="text-gray-400 text-sm mb-8">
          Purely illustrative. Adjust the slider to project the deflationary math of a hypothetical burn on the live supply.
        </p>

        <div className="mb-8">
          <div className="flex justify-between text-sm font-medium mb-2">
            <span className="text-gray-300">Hypothetical Burn</span>
            <span className="text-flame-orange font-bold font-mono">{burnAmount.toLocaleString()} ASH</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max={MAX_SIMULATION} 
            step="10000" 
            value={burnAmount} 
            onChange={handleSlider}
            className="w-full h-2 bg-charcoal rounded-lg appearance-none cursor-pointer accent-flame-orange"
          />
        </div>

        {/* Visual Bar that shrinks */}
        <div className="mb-8">
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-2 flex justify-between">
            <span>Visual Supply (Simulated)</span>
            <span>{remainingPercent.toFixed(1)}% remaining</span>
          </div>
          <div className="w-full h-4 bg-charcoal rounded-full overflow-hidden border border-white/5">
            <div 
              className="h-full bg-flame-gradient transition-all duration-300 ease-out"
              style={{ width: `${remainingPercent}%` }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-black/30 rounded-lg p-4 border border-white/5 transition-colors group-hover:border-flame-red/10">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">New Total Supply</div>
            <div className="text-xl font-bold font-mono text-gray-200">{newSupply.toLocaleString()}</div>
          </div>
          <div className="bg-black/30 rounded-lg p-4 border border-white/5 transition-colors group-hover:border-flame-orange/20">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">% of Supply Burned</div>
            <div className="text-xl font-bold font-mono text-flame-gold">{percentBurnedOfCurrent.toFixed(3)}%</div>
          </div>
          <div className="bg-black/30 rounded-lg p-4 border border-white/5 transition-colors group-hover:border-flame-red/20">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Cumulative Burned</div>
            <div className="text-xl font-bold font-mono text-flame-red">{totalBurnedCombined.toLocaleString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
