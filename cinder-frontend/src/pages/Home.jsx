import React from 'react';
import Hero from '../components/Hero';
import { Link } from 'react-router-dom';
import { ArrowRight, Flame, Repeat, Layers, Activity, Info } from 'lucide-react';
import { useReadContract } from 'wagmi';
import { formatUnits } from 'viem';
import { 
  CINDER_TOKEN_ADDRESS, CinderTokenABI, 
  CREATOR_LOCK_ADDRESS, 
  BURN_VAULT_ADDRESS, BurnVaultABI,
  CASHBACK_VAULT_ADDRESS, CashbackVaultABI
} from '../config/contracts';

export default function Home() {
  const { data: totalSupply = 0n } = useReadContract({
    address: CINDER_TOKEN_ADDRESS,
    abi: CinderTokenABI,
    functionName: 'totalSupply',
  });

  const { data: totalBurned = 0n } = useReadContract({
    address: BURN_VAULT_ADDRESS,
    abi: BurnVaultABI,
    functionName: 'totalBurned',
  });

  const { data: lockBalance = 0n } = useReadContract({
    address: CINDER_TOKEN_ADDRESS,
    abi: CinderTokenABI,
    functionName: 'balanceOf',
    args: [CREATOR_LOCK_ADDRESS],
  });

  const { data: currentEpoch = 0n } = useReadContract({
    address: CASHBACK_VAULT_ADDRESS,
    abi: CashbackVaultABI,
    functionName: 'currentEpoch',
  });

  const totalStr = Number(formatUnits(totalSupply, 18));
  const burnedStr = Number(formatUnits(totalBurned, 18));
  const lockStr = Number(formatUnits(lockBalance, 18));
  const lockPercent = totalStr > 0 ? ((lockStr / totalStr) * 100).toFixed(1) : '0.0';

  return (
    <>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[80vh] bg-flame-red/10 blur-[120px] rounded-full pointer-events-none animate-pulse-slow z-0"></div>
      <Hero />
      
      {/* A) LIVE STATS STRIP */}
      <section className="w-full px-4 md:px-12 max-w-5xl mx-auto relative z-10 -mt-8 mb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-charcoal-light border border-white/5 p-4 rounded-xl text-center interactive-card">
            <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Total Supply</div>
            <div className="text-xl font-mono text-white font-bold">{totalStr.toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
          </div>
          <div className="bg-charcoal-light border border-white/5 p-4 rounded-xl text-center interactive-card">
            <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Total Burned</div>
            <div className="text-xl font-mono text-flame-orange font-bold">{burnedStr.toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
          </div>
          <div className="bg-charcoal-light border border-white/5 p-4 rounded-xl text-center interactive-card">
            <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Current Epoch</div>
            <div className="text-xl font-mono text-flame-gold font-bold">#{currentEpoch.toString()}</div>
          </div>
          <div className="bg-charcoal-light border border-white/5 p-4 rounded-xl text-center interactive-card">
            <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Creator Locked</div>
            <div className="text-xl font-mono text-white font-bold">{lockPercent}%</div>
          </div>
        </div>
      </section>

      {/* B) "WHY CINDER" MANIFESTO SECTION */}
      <section className="w-full py-16 px-4 md:px-12 max-w-4xl mx-auto relative z-10 text-center">
        <Flame className="text-flame-orange w-16 h-16 mx-auto mb-6 opacity-80" />
        <h2 className="text-3xl font-extrabold text-white mb-6">You Feed the Fire, the Fire Feeds You</h2>
        <div className="space-y-6 text-gray-400 text-lg leading-relaxed">
          <p>
            Cinder was forged in response to an industry plagued by opaque tokenomics and endless team sell pressure. 
            We replaced promises with immutable smart contracts. There are no admin keys, no hidden wallets, and no mutable fee logic. 
          </p>
          <p>
            Every trade generates a 1% fee that is mathematically guaranteed to flow directly back to the active community through the Cashback Vault. 
            Meanwhile, our Burn Vault permanently destroys supply, creating a deflationary feedback loop driven entirely by community activity and external revenue.
          </p>
        </div>
      </section>

      {/* C) EXPLORE THE SYSTEM */}
      <section className="w-full py-16 px-4 md:px-12 max-w-5xl mx-auto relative z-10">
        <h2 className="text-3xl font-extrabold text-white text-center mb-12">Explore the System</h2>
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          <Link to="/mechanics" className="bg-charcoal-light interactive-card p-6 rounded-2xl flex flex-col group">
            <div className="flex items-center gap-4 mb-3">
              <div className="p-3 bg-white/5 rounded-lg group-hover:bg-flame-orange/20 transition-colors"><Repeat className="text-flame-gold w-6 h-6" /></div>
              <h3 className="text-xl font-bold text-white group-hover:text-flame-orange transition-colors">Mechanics</h3>
            </div>
            <p className="text-gray-400 text-sm pl-[60px]">Dive into the 1% fee loop, cashback epochs, and try the interactive burn simulator.</p>
          </Link>

          <Link to="/tokenomics" className="bg-charcoal-light interactive-card p-6 rounded-2xl flex flex-col group">
            <div className="flex items-center gap-4 mb-3">
              <div className="p-3 bg-white/5 rounded-lg group-hover:bg-flame-orange/20 transition-colors"><Layers className="text-flame-gold w-6 h-6" /></div>
              <h3 className="text-xl font-bold text-white group-hover:text-flame-orange transition-colors">Tokenomics</h3>
            </div>
            <p className="text-gray-400 text-sm pl-[60px]">View the full supply breakdown and transparent, hardcoded creator lock countdown.</p>
          </Link>

          <Link to="/activity" className="bg-charcoal-light interactive-card p-6 rounded-2xl flex flex-col group">
            <div className="flex items-center gap-4 mb-3">
              <div className="p-3 bg-white/5 rounded-lg group-hover:bg-flame-orange/20 transition-colors"><Activity className="text-flame-gold w-6 h-6" /></div>
              <h3 className="text-xl font-bold text-white group-hover:text-flame-orange transition-colors">Activity</h3>
            </div>
            <p className="text-gray-400 text-sm pl-[60px]">Track the top traders in the live leaderboard and verify real-time burn receipts.</p>
          </Link>

          <Link to="/about" className="bg-charcoal-light interactive-card p-6 rounded-2xl flex flex-col group">
            <div className="flex items-center gap-4 mb-3">
              <div className="p-3 bg-white/5 rounded-lg group-hover:bg-flame-orange/20 transition-colors"><Info className="text-flame-gold w-6 h-6" /></div>
              <h3 className="text-xl font-bold text-white group-hover:text-flame-orange transition-colors">About</h3>
            </div>
            <p className="text-gray-400 text-sm pl-[60px]">Read the FAQ on audits and contract safety, and see what's next on our roadmap.</p>
          </Link>
        </div>
        
        {/* D) FINAL CTA */}
        <div className="flex justify-center gap-4 border-t border-white/5 pt-12">
          <Link to="/mechanics" className="px-8 py-4 rounded-xl bg-flame-gradient text-charcoal font-bold hover:opacity-90 transition-opacity flex items-center gap-2">
            Enter the Vault <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </>
  );
}
