import React, { useState, useEffect } from 'react';
import MainLayout from './layouts/MainLayout';
import Catalogue from './pages/Catalogue';
import RiderApp from './components/rider/RiderApp';

// Data imports that were previously top-level
import { scriptSeance1 } from './data/seance_scripts';

export default function App() {
  const [isRiderMode, setIsRiderMode] = useState(false);

  // Script storage logic preserved from original App.jsx
  const [savedScripts, setSavedScripts] = useState({});

  useEffect(() => {
    const stored = localStorage.getItem('equicoach_scripts');
    if (stored) {
      try {
        setSavedScripts(JSON.parse(stored));
      } catch (e) {
        console.error('Error loading scripts:', e);
      }
    }
  }, []);

  if (isRiderMode) {
    // RiderApp handles its own layout for full immersion
    return <RiderApp onExit={() => setIsRiderMode(false)} />;
  }

  return (
    <MainLayout
      onSwitchMode={() => setIsRiderMode(true)}
      currentMode="catalogue"
    >
      <Catalogue
        onStartRiderMode={() => setIsRiderMode(true)}
        savedScripts={savedScripts}
      />
    </MainLayout>
  );
}