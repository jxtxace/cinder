import React, { useEffect, useState } from 'react';
import { usePublicClient } from 'wagmi';
import { formatUnits } from 'viem';
import { BURN_VAULT_ADDRESS, BurnVaultABI } from '../config/contracts';

export default function BurnReceipts() {
  const publicClient = usePublicClient();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLogs() {
      if (!publicClient) return;
      try {
        const events = await publicClient.getLogs({
          address: BURN_VAULT_ADDRESS,
          event: {
            type: 'event',
            name: 'BurnExecuted',
            inputs: [
              { type: 'address', name: 'user', indexed: true },
              { type: 'uint256', name: 'amount', indexed: false },
              { type: 'uint256', name: 'totalBurned', indexed: false }
            ],
          },
          fromBlock: 0n,
          toBlock: 'latest',
        });
        
        // Fetch block timestamps for each event
        const eventsWithTimestamps = await Promise.all(
          events.map(async (log) => {
            const block = await publicClient.getBlock({ blockHash: log.blockHash });
            return {
              ...log,
              timestamp: Number(block.timestamp) * 1000 // Convert to ms
            };
          })
        );
        
        // Reverse to show newest first
        setLogs(eventsWithTimestamps.reverse());
      } catch (err) {
        console.error("Failed to fetch logs", err);
      } finally {
        setLoading(false);
      }
    }
    fetchLogs();
  }, [publicClient]);

  return (
    <section id="burns" className="w-full py-20 px-4 md:px-12 max-w-5xl mx-auto scroll-mt-20">
      <h2 className="text-4xl font-extrabold text-white text-center mb-16">Burn Receipts</h2>
      
      <div className="bg-charcoal-light border border-white/5 rounded-3xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">Loading receipts...</div>
        ) : logs.length === 0 ? (
          <div className="p-16 text-center">
            <div className="text-flame-red/50 text-6xl mb-4">🔥</div>
            <h3 className="text-xl font-bold text-gray-300 mb-2">Nothing burned yet</h3>
            <p className="text-gray-500 text-sm">this section fills in as it happens</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black/20 border-b border-white/5 text-gray-500 text-sm uppercase tracking-widest">
                  <th className="p-4 font-medium">Date</th>
                  <th className="p-4 font-medium">Burner</th>
                  <th className="p-4 font-medium">Amount Burned</th>
                  <th className="p-4 font-medium">Tx Hash</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, i) => (
                  <tr key={i} className="interactive-card text-gray-300 font-mono text-sm">
                    <td className="p-4 text-gray-400">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="p-4 truncate max-w-[150px]">
                      {log.args.user}
                    </td>
                    <td className="p-4 text-flame-orange font-bold">
                      {log.args.amount ? Number(formatUnits(log.args.amount, 18)).toLocaleString() : '0'} ASH
                    </td>
                    <td className="p-4 truncate max-w-[200px] text-gray-500">
                      {/* Note: In production (Sepolia), this should be wrapped in an <a href={`https://sepolia.etherscan.io/tx/${log.transactionHash}`}> tag */}
                      {log.transactionHash}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
