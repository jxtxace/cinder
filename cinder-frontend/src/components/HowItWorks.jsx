import React from 'react';

export default function HowItWorks() {
  const steps = [
    { num: 1, title: 'Trade $ASH', desc: 'Every trade includes a 1% fee.' },
    { num: 2, title: 'Fee to Vault', desc: 'No team wallet touches it. Contract-enforced.' },
    { num: 3, title: 'Claim Share', desc: 'Proportional to your volume that epoch.' },
    { num: 4, title: 'Buyback & Burn', desc: 'Merch profit buys back and burns. Supply shrinks forever.' }
  ];

  return (
    <section id="how-it-works" className="w-full py-20 px-4 md:px-12 max-w-7xl mx-auto scroll-mt-20">
      <h2 className="text-4xl font-extrabold text-white text-center mb-16">How It Works</h2>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-stretch gap-6 relative">
        <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-white/10 -z-10 -translate-y-1/2"></div>
        {steps.map((step, idx) => (
          <div key={idx} className="flex-1 bg-charcoal-light border border-white/5 p-6 rounded-2xl flex flex-col items-center text-center group hover:border-flame-orange/50 transition-colors w-full md:w-auto relative">
            <div className="w-12 h-12 rounded-full bg-flame-gradient flex items-center justify-center text-charcoal font-bold text-xl mb-4 shadow-[0_0_15px_rgba(255,107,26,0.3)]">
              {step.num}
            </div>
            <h3 className="text-xl font-bold text-gray-200 mb-2">{step.title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
