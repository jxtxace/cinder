import React from 'react';
import { CheckCircle2, CircleDashed, Flame } from 'lucide-react';

export default function Roadmap() {
  const phases = [
    {
      title: 'Phase 1 — Ignition',
      desc: 'Contract deployment, initial liquidity, and core token infrastructure.',
      status: 'COMPLETE',
      icon: <CheckCircle2 className="text-flame-gold" size={24} />
    },
    {
      title: 'Phase 2 — The Bellows',
      desc: 'Cashback vault live, front-end dashboard release, and first epoch claims.',
      status: 'COMPLETE',
      icon: <CheckCircle2 className="text-flame-gold" size={24} />
    },
    {
      title: 'Phase 3 — Embers',
      desc: 'Burn vault deployed and live. First merchandise-funded buyback-and-burn pending.',
      status: 'IN PROGRESS',
      icon: <Flame className="text-flame-orange" size={24} />
    },
    {
      title: 'Phase 4 — Wildfire',
      desc: 'Cross-chain expansion, community governance module, and ecosystem partnerships.',
      status: 'UPCOMING',
      icon: <CircleDashed className="text-gray-500" size={24} />
    }
  ];

  return (
    <section id="roadmap" className="w-full py-20 px-4 md:px-12 max-w-5xl mx-auto scroll-mt-20">
      <h2 className="text-4xl font-extrabold text-white text-center mb-16">Roadmap</h2>
      <div className="grid md:grid-cols-4 gap-6">
        {phases.map((phase, idx) => (
          <div key={idx} className="bg-charcoal-light interactive-card p-6 rounded-2xl relative overflow-hidden group">
            <div className="flex items-center justify-between mb-4">
              {phase.icon}
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                phase.status === 'COMPLETE' ? 'bg-flame-orange/20 text-flame-gold' : 
                phase.status === 'IN PROGRESS' ? 'bg-flame-red/20 text-flame-orange border border-flame-red/30' : 
                'bg-white/5 text-gray-500'
              }`}>
                {phase.status}
              </span>
            </div>
            <h3 className="text-xl font-bold text-gray-200 mb-2">{phase.title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{phase.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
