import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState(null);

  const faqs = [
    {
      q: 'Is this audited?',
      a: 'No, this is an unaudited demo/portfolio project, testnet only, not financial software. Interact at your own risk in a test environment.'
    },
    {
      q: 'Can the team change the fee or rug the vault?',
      a: 'No. The initializeVaults() function is called exactly once during deployment. There is no setter function afterward, meaning fees and vault addresses are permanently locked.'
    },
    {
      q: 'What happens when CreatorLock unlocks?',
      a: 'The unlock is tied to a fixed timestamp. It is not cancelable or extendable. Once the timestamp passes, absolutely anyone can call release() to trigger the unlock.'
    },
    {
      q: 'How is my cashback calculated?',
      a: 'Your cashback is strictly proportional to your trading volume within an epoch. If you account for 10% of the total trading volume in a 7-day epoch, you claim 10% of the fees collected during that epoch.'
    },
    {
      q: 'Why does supply keep shrinking?',
      a: 'The BurnVault allows anyone to permanently destroy $ASH. As real-world or secondary value (like merch profits) buys back tokens and deposits them into the BurnVault, the total supply perpetually decreases.'
    }
  ];

  return (
    <section id="faq" className="w-full py-20 px-4 md:px-12 max-w-3xl mx-auto scroll-mt-20">
      <h2 className="text-4xl font-extrabold text-white text-center mb-16">FAQ</h2>
      <div className="space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div key={idx} className="bg-charcoal-light interactive-card rounded-xl overflow-hidden">
              <button 
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full px-6 py-4 flex justify-between items-center text-left focus:outline-none focus:ring-2 focus:ring-flame-orange focus:ring-inset"
                aria-expanded={isOpen}
              >
                <span className="font-bold text-gray-200">{faq.q}</span>
                <ChevronDown className={`text-flame-orange transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} size={20} />
              </button>
              {isOpen && (
                <div className="px-6 pb-4 text-gray-400 text-sm leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
