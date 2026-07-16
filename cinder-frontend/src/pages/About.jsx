import React from 'react';
import FAQ from '../components/FAQ';
import Roadmap from '../components/Roadmap';

export default function About() {
  return (
    <div className="pt-8 pb-20">
      <FAQ />
      <div className="my-12"></div>
      <Roadmap />
    </div>
  );
}
