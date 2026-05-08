/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Shell from './components/layout/Shell';
import Hero from './components/home/Hero';
import Assistant from './components/chat/Assistant';
import HealthMap from './components/maps/HealthMap';
import Appointments from './components/appointments/Appointments';
import TriageChecker from './components/triage/TriageChecker';
import { Profile } from './components/profile/Profile';
import { Settings } from './components/profile/Settings';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    const handleTabChange = (e: any) => {
      setActiveTab(e.detail);
    };
    window.addEventListener('changeTab', handleTabChange);
    return () => window.removeEventListener('changeTab', handleTabChange);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <Hero 
            onStartAssistant={() => setActiveTab('triage')} 
            onViewMap={() => setActiveTab('map')} 
          />
        );
      case 'triage':
        return <TriageChecker />;
      case 'assistant':
        return <Assistant />;
      case 'map':
        return <HealthMap />;
      case 'appointments':
        return <Appointments />;
      case 'profile':
        return <Profile />;
      case 'settings':
        return <Settings />;
      default:
        return (
          <Hero 
            onStartAssistant={() => setActiveTab('triage')} 
            onViewMap={() => setActiveTab('map')} 
          />
        );
    }
  };

  return (
    <Shell activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Shell>
  );
}

