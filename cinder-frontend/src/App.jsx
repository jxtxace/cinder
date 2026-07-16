import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { config } from './config/wagmi';
import { SettingsProvider } from './context/SettingsContext';

import Layout from './components/Layout';
import Home from './pages/Home';
import Mechanics from './pages/Mechanics';
import Tokenomics from './pages/Tokenomics';
import Activity from './pages/Activity';
import About from './pages/About';
import EmberParticles from './components/EmberParticles';

const queryClient = new QueryClient();

export default function App() {
  return (
    <SettingsProvider>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider theme={darkTheme({
            accentColor: '#FF6B1A',
            accentColorForeground: '#0d0806',
            fontStack: 'system',
          })}>
            <HashRouter>
              <EmberParticles />
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/mechanics" element={<Mechanics />} />
                  <Route path="/tokenomics" element={<Tokenomics />} />
                  <Route path="/activity" element={<Activity />} />
                  <Route path="/about" element={<About />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
              </Routes>
            </HashRouter>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </SettingsProvider>
  );
}
