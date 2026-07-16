import React, { useState, useEffect } from 'react';
import { usePublicClient, useReadContract, useAccount } from 'wagmi';
import { formatUnits } from 'viem';
import { RefreshCw, Flame, Trophy } from 'lucide-react';
import { 
  CINDER_TOKEN_ADDRESS, 
  CASHBACK_VAULT_ADDRESS, CashbackVaultABI 
} from '../config/contracts';

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const publicClient = usePublicClient();
  const { address } = useAccount();

  const { data: currentEpoch } = useReadContract({
    address: CASHBACK_VAULT_ADDRESS,
    abi: CashbackVaultABI,
    functionName: 'currentEpoch',
  });

  const fetchLeaderboard = async () => {
    if (!publicClient || currentEpoch === undefined) return;
    
    setIsLoading(true);
    try {
      // 1. Fetch TransferFeeRouted events
      const events = await publicClient.getLogs({
        address: CINDER_TOKEN_ADDRESS,
        event: {
          type: 'event',
          name: 'TransferFeeRouted',
          inputs: [
            { type: 'address', name: 'from', indexed: true },
            { type: 'address', name: 'to', indexed: true },
            { type: 'uint256', name: 'amount', indexed: false },
            { type: 'uint256', name: 'feeAmount', indexed: false }
          ],
        },
        fromBlock: 0n,
        toBlock: 'latest',
      });

      // 2. Extract unique traders
      const uniqueTraders = new Set(events.map(e => e.args.from));

      // 3. Read epochVolume and epochFees to calculate share
      const totalEpochVol = await publicClient.readContract({
        address: CASHBACK_VAULT_ADDRESS,
        abi: CashbackVaultABI,
        functionName: 'epochVolume',
        args: [currentEpoch]
      });

      const totalEpochFees = await publicClient.readContract({
        address: CASHBACK_VAULT_ADDRESS,
        abi: CashbackVaultABI,
        functionName: 'epochFees',
        args: [currentEpoch]
      });

      // 4. For each trader, read their traderVolume and getClaimableAmount
      const tradersData = await Promise.all(
        Array.from(uniqueTraders).map(async (traderAddr) => {
          const vol = await publicClient.readContract({
            address: CASHBACK_VAULT_ADDRESS,
            abi: CashbackVaultABI,
            functionName: 'traderVolume',
            args: [currentEpoch, traderAddr]
          });

          // Estimate current epoch share: (fees * volume) / totalVolume
          const estimatedShare = (totalEpochVol > 0n) 
            ? (totalEpochFees * vol) / totalEpochVol 
            : 0n;

          // Also fetch actual claimable amount from past epochs
          const claimable = await publicClient.readContract({
            address: CASHBACK_VAULT_ADDRESS,
            abi: CashbackVaultABI,
            functionName: 'claimable',
            args: [traderAddr]
          });

          return { 
            address: traderAddr, 
            volume: vol,
            estimatedShare: estimatedShare + claimable
          };
        })
      );

      // 5. Sort descending and take top 10
      const sorted = tradersData
        .filter(t => t.volume > 0n)
        .sort((a, b) => (a.volume < b.volume ? 1 : -1))
        .slice(0, 10);

      setLeaders(sorted);
      setHasLoaded(true);
    } catch (error) {
      console.error("Failed to fetch leaderboard", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!hasLoaded && currentEpoch !== undefined) {
      fetchLeaderboard();
    }
  }, [currentEpoch, hasLoaded]);

  const truncateAddress = (addr) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <section id="leaderboard" className="w-full py-20 px-4 md:px-12 max-w-5xl mx-auto scroll-mt-20">
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
        <div>
          <h2 className="text-4xl font-extrabold text-white flex items-center gap-3">
            <Trophy className="text-flame-gold" size={36} />
            Top Traders
          </h2>
          <p className="text-gray-400 mt-2">Highest volume traders in the current epoch.</p>
        </div>
        <button 
          onClick={fetchLeaderboard}
          disabled={isLoading || currentEpoch === undefined}
          className="flex items-center gap-2 px-4 py-2 bg-charcoal-light border border-white/10 rounded-lg text-gray-300 hover:text-white hover:border-white/20 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={16} className={isLoading ? 'animate-spin text-flame-orange' : ''} />
          {isLoading ? 'Updating...' : 'Refresh'}
        </button>
      </div>

      <div className="bg-charcoal-light border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
        {leaders.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center">
            <Flame size={48} className="text-gray-600 mb-4 opacity-50" />
            <h3 className="text-xl font-bold text-gray-400">no traders yet</h3>
            <p className="text-gray-500 mt-2 text-sm">this fills in as activity happens</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-black/20">
                  <th className="p-6 text-gray-500 font-bold uppercase tracking-wider text-sm">Rank</th>
                  <th className="p-6 text-gray-500 font-bold uppercase tracking-wider text-sm">Trader</th>
                  <th className="p-6 text-gray-500 font-bold uppercase tracking-wider text-sm text-right">Epoch Volume</th>
                  <th className="p-6 text-gray-500 font-bold uppercase tracking-wider text-sm text-right">Est. Claimable</th>
                </tr>
              </thead>
              <tbody>
                {leaders.map((trader, idx) => {
                  const isMe = address && trader.address.toLowerCase() === address.toLowerCase();
                  return (
                    <tr 
                      key={trader.address} 
                      className={`interactive-card transition-colors
                        ${isMe ? 'bg-flame-orange/5 border-l-4 border-l-flame-orange' : 'hover:bg-white/5 border-l-4 border-l-transparent'}`
                      }
                    >
                      <td className="p-6">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                          ${idx === 0 ? 'bg-flame-gold text-charcoal' : 
                            idx === 1 ? 'bg-gray-300 text-charcoal' : 
                            idx === 2 ? 'bg-flame-orange text-white' : 'bg-white/5 text-gray-400'}`}>
                          {idx + 1}
                        </div>
                      </td>
                      <td className="p-6">
                        <span className={`font-mono ${isMe ? 'text-flame-orange font-bold' : 'text-gray-300'}`}>
                          {truncateAddress(trader.address)}
                          {isMe && <span className="ml-3 text-xs bg-flame-orange/20 text-flame-orange px-2 py-1 rounded-full uppercase tracking-wider">You</span>}
                        </span>
                      </td>
                      <td className="p-6 text-right font-bold text-gray-200">
                        {Number(formatUnits(trader.volume, 18)).toLocaleString(undefined, { maximumFractionDigits: 0 })} ASH
                      </td>
                      <td className="p-6 text-right font-bold text-flame-gold">
                        {Number(formatUnits(trader.estimatedShare, 18)).toLocaleString(undefined, { maximumFractionDigits: 2 })} ASH
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
