import React, { useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { formatUnits } from 'viem';
import { 
  CINDER_TOKEN_ADDRESS, CinderTokenABI, 
  CASHBACK_VAULT_ADDRESS, CashbackVaultABI 
} from '../config/contracts';

export default function DashboardStrip() {
  const { address, isConnected } = useAccount();

  // Balance
  const { data: balanceData } = useReadContract({
    address: CINDER_TOKEN_ADDRESS,
    abi: CinderTokenABI,
    functionName: 'balanceOf',
    args: [address || '0x0000000000000000000000000000000000000000'],
    query: { enabled: isConnected }
  });

  // Current Epoch
  const { data: currentEpoch } = useReadContract({
    address: CASHBACK_VAULT_ADDRESS,
    abi: CashbackVaultABI,
    functionName: 'currentEpoch',
  });

  // Volume this epoch
  const { data: volumeData } = useReadContract({
    address: CASHBACK_VAULT_ADDRESS,
    abi: CashbackVaultABI,
    functionName: 'traderVolume',
    args: [currentEpoch || 0n, address || '0x0000000000000000000000000000000000000000'],
    query: { enabled: isConnected && currentEpoch !== undefined }
  });

  // Claimable
  const { data: claimable = 0n, refetch: refetchClaimable } = useReadContract({
    address: CASHBACK_VAULT_ADDRESS,
    abi: CashbackVaultABI,
    functionName: 'claimable',
    args: [address || '0x0000000000000000000000000000000000000000'],
    query: { enabled: isConnected }
  });

  const canClaim = claimable > 0n;

  const { writeContract, data: hash, isPending } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (isSuccess) {
      refetchClaimable();
    }
  }, [isSuccess, refetchClaimable]);

  if (!isConnected) return null;

  const balanceFormat = balanceData ? Number(formatUnits(balanceData, 18)).toLocaleString(undefined, { maximumFractionDigits: 0 }) : '0';
  const volumeFormat = volumeData ? Number(formatUnits(volumeData, 18)).toLocaleString(undefined, { maximumFractionDigits: 0 }) : '0';
  const claimableFormat = Number(formatUnits(claimable, 18)).toLocaleString(undefined, { maximumFractionDigits: 2 });

  const handleClaim = () => {
    writeContract({
      address: CASHBACK_VAULT_ADDRESS,
      abi: CashbackVaultABI,
      functionName: 'claim',
    });
  };

  return (
    <div className="w-full bg-charcoal-light border-b border-white/5 sticky top-0 md:top-[72px] z-30 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
      <div className="max-w-7xl mx-auto px-4 md:px-12 py-3 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-8 gap-y-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-gray-500 font-medium uppercase tracking-wider text-[10px] md:text-xs">Your Balance</span>
            <span className="text-gray-200 font-bold">{balanceFormat} ASH</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500 font-medium uppercase tracking-wider text-[10px] md:text-xs">Epoch Volume</span>
            <span className="text-gray-200 font-bold">{volumeFormat} ASH</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500 font-medium uppercase tracking-wider text-[10px] md:text-xs">Claimable</span>
            <span className="text-flame-gold font-bold">{claimableFormat} ASH</span>
          </div>
        </div>

        <button
          onClick={handleClaim}
          disabled={!canClaim || isPending || isConfirming}
          className={`px-6 py-1.5 rounded-full font-bold text-sm transition-all shadow-lg whitespace-nowrap
            ${canClaim 
              ? 'bg-flame-gradient text-charcoal hover:opacity-90 hover:shadow-[0_0_15px_rgba(255,107,26,0.4)] cursor-pointer' 
              : 'bg-white/5 text-gray-500 cursor-not-allowed opacity-50 shadow-none'
            }
          `}
        >
          {isPending ? 'Confirming...' : isConfirming ? 'Pending...' : canClaim ? 'Claim ASH' : 'Nothing to claim'}
        </button>

      </div>
    </div>
  );
}
