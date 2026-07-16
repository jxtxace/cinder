import React from 'react';
import Leaderboard from '../components/Leaderboard';
import BurnReceipts from '../components/BurnReceipts';

export default function Activity() {
  return (
    <div className="pt-8 pb-20">
      <Leaderboard />
      <div className="my-12"></div>
      <BurnReceipts />
    </div>
  );
}
