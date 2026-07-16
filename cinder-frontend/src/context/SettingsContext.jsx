import React, { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext({
  manualReducedMotion: false,
  setManualReducedMotion: () => {},
});

export function SettingsProvider({ children }) {
  const [manualReducedMotion, setManualReducedMotion] = useState(false);

  useEffect(() => {
    if (manualReducedMotion) {
      document.documentElement.classList.add('force-reduced-motion');
    } else {
      document.documentElement.classList.remove('force-reduced-motion');
    }
  }, [manualReducedMotion]);

  return (
    <SettingsContext.Provider value={{ manualReducedMotion, setManualReducedMotion }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
