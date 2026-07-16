import React from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { formatUnits } from 'viem';
import { 
  CINDER_TOKEN_ADDRESS, CinderTokenABI, 
  CASHBACK_VAULT_ADDRESS, CashbackVaultABI,
  BURN_VAULT_ADDRESS, BurnVaultABI
} from '../config/contracts';

import BurnSimulator from './BurnSimulator';

export default function TheLoop() {
  const { address, isConnected } = useAccount();

  // Read CashbackVault Data
  const { data: currentEpoch = 0n } = useReadContract({
    address: CASHBACK_VAULT_ADDRESS,
    abi: CashbackVaultABI,
    functionName: 'currentEpoch',
  });

  const { data: epochVolume = 0n } = useReadContract({
    address: CASHBACK_VAULT_ADDRESS,
    abi: CashbackVaultABI,
    functionName: 'epochVolume',
    args: [currentEpoch],
  });

  const { data: traderVolume = 0n } = useReadContract({
    address: CASHBACK_VAULT_ADDRESS,
    abi: CashbackVaultABI,
    functionName: 'traderVolume',
    args: [currentEpoch, address || '0x0000000000000000000000000000000000000000'],
    query: { enabled: isConnected },
  });

  const { data: claimable = 0n, refetch: refetchClaimable } = useReadContract({
    address: CASHBACK_VAULT_ADDRESS,
    abi: CashbackVaultABI,
    functionName: 'claimable',
    args: [address || '0x0000000000000000000000000000000000000000'],
    query: { enabled: isConnected },
  });

  // Read BurnVault Data
  const { data: totalBurned = 0n } = useReadContract({
    address: BURN_VAULT_ADDRESS,
    abi: BurnVaultABI,
    functionName: 'totalBurned',
  });

  // Write Claim
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const handleClaim = () => {
    writeContract({
      address: CASHBACK_VAULT_ADDRESS,
      abi: CashbackVaultABI,
      functionName: 'claim',
    }, {
      onSuccess: () => refetchClaimable()
    });
  };

  const burnPercent = (Number(formatUnits(totalBurned, 18)) / 1000000000) * 100;

  return (
    <section id="loop" className="w-full py-20 px-4 md:px-12 max-w-7xl mx-auto scroll-mt-20">
      <h2 className="text-4xl font-extrabold text-white text-center mb-16">The Loop</h2>
      
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        
        {/* Cashback Card */}
        <div className="bg-charcoal-light interactive-card p-8 rounded-2xl relative overflow-hidden group hover:border-flame-gold/30">
          <div className="absolute top-0 right-0 p-32 bg-flame-orange/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
          
          <h3 className="text-2xl font-bold text-flame-gradient mb-4">the fire feeds you</h3>
          <p className="text-gray-400 mb-8 h-12">Every transfer routes a 1% fee to the Cashback Vault. Traders claim their proportional share every epoch.</p>
          
          <div className="space-y-6 mb-8">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="text-gray-500 text-sm">Current Epoch</span>
              <span className="text-white font-mono">{currentEpoch.toString()}</span>
            </div>
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="text-gray-500 text-sm">Epoch Volume</span>
              <span className="text-white font-mono">{Number(formatUnits(epochVolume, 18)).toLocaleString()} ASH</span>
            </div>
            
            {isConnected ? (
              <>
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-gray-500 text-sm">Your Epoch Volume</span>
                  <span className="text-flame-gold font-mono">{Number(formatUnits(traderVolume, 18)).toLocaleString()} ASH</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-gray-500 text-sm">Claimable (Past Epochs)</span>
                  <span className="text-flame-orange font-bold font-mono">{Number(formatUnits(claimable, 18)).toLocaleString()} ASH</span>
                </div>
              </>
            ) : (
              <div className="text-center p-4 bg-black/30 rounded border border-white/5 text-gray-500 text-sm">
                Connect wallet to view your volume and claimable fees.
              </div>
            )}
          </div>

          <button 
            onClick={handleClaim}
            disabled={!isConnected || claimable === 0n || isPending || isConfirming}
            className="w-full py-4 rounded-xl font-bold text-charcoal bg-flame-gradient opacity-90 hover:opacity-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            {isPending ? 'Confirming in wallet...' : isConfirming ? 'Transaction pending...' : isConfirmed ? 'Claimed!' : claimable > 0n ? 'Claim Fees' : 'Nothing to claim'}
          </button>
        </div>

        {/* Burn Card */}
        <div className="bg-charcoal-light interactive-card p-8 rounded-2xl relative overflow-hidden group hover:border-flame-red/30">
          <div className="absolute bottom-0 left-0 p-32 bg-flame-red/5 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none"></div>

          <h3 className="text-2xl font-bold text-flame-gradient mb-4">you feed the fire</h3>
          <p className="text-gray-400 mb-8 h-12">Anyone can manually burn $ASH by depositing it into the Burn Vault, permanently reducing the total supply.</p>
          
          <div className="flex flex-col items-center justify-center py-8">
            <div className="text-5xl font-mono font-bold text-white mb-2">
              {Number(formatUnits(totalBurned, 18)).toLocaleString()}
            </div>
            <div className="text-flame-red font-semibold text-sm tracking-widest uppercase mb-8">Total $ASH Burned</div>
            
            <div className="w-full max-w-sm">
              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>0</span>
                <span>{burnPercent.toFixed(4)}% of Supply</span>
                <span>1B</span>
              </div>
              <div className="w-full h-2 bg-charcoal rounded-full overflow-hidden border border-white/5">
                <div 
                  className="h-full bg-flame-gradient relative"
                  style={{ width: `${Math.max(burnPercent, 1)}%` }} // Minimum width just to show it's active
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Interactive Simulator */}
      <BurnSimulator />

    </section>
  );
}
