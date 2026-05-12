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
import History from './components/history/History';
import TriageChecker from './components/triage/TriageChecker';
import MessagingSimulation from './components/chat/MessagingSimulation';
import { Profile } from './components/profile/Profile';
import { Settings } from './components/profile/Settings';

import Search from './components/search/Search';
import EntityRegistration from './components/registration/EntityRegistration';
import DoctorDashboard from './components/dashboard/DoctorDashboard';
import PharmacyDashboard from './components/dashboard/PharmacyDashboard';
import CenterDashboard from './components/dashboard/CenterDashboard';
import Membership from './components/membership/Membership';
import HealthWallet from './components/membership/HealthWallet';
import HealthChallenges from './components/membership/HealthChallenges';
import PharmacyDiscounts from './components/membership/PharmacyDiscounts';
import ActivityLogs from './components/membership/ActivityLogs';
import PointsConfig from './components/membership/PointsConfig';
import { PWAInstallPrompt } from './components/common/PWAInstallPrompt';
import { LanguageProvider } from './contexts/LanguageContext';
import { UserProvider } from './contexts/UserContext';
import Login from './components/auth/Login';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });
  const [activeTab, setActiveTab] = useState('home');
  const [regType, setRegType] = useState<'doctor' | 'clinic' | 'lab_pharmacy'>('lab_pharmacy');

  const openRegistration = (type: 'doctor' | 'clinic' | 'lab_pharmacy' = 'lab_pharmacy') => {
    setRegType(type);
    setActiveTab('registration');
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('isLoggedIn', 'true');
  };

  useEffect(() => {
    // Theme initialization
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else {
      // Default to dark or follow preference
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    }

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
            onOpenRegistration={(type) => openRegistration(type)}
          />
        );
      case 'triage':
        return <TriageChecker />;
      case 'assistant':
        return <Assistant />;
      case 'search':
        return <Search onOpenRegistration={(type) => openRegistration(type)} />;
      case 'map':
        return <HealthMap />;
      case 'appointments':
        return <Appointments />;
      case 'pharmacy':
        return <PharmacyDiscounts />;
      case 'messages':
        return <MessagingSimulation />;
      case 'history':
        return <History />;
      case 'profile':
        return <Profile />;
      case 'settings':
        return <Settings />;
      case 'points-config':
        return <PointsConfig />;
      case 'membership':
        return <Membership />;
      case 'rewards':
        return <HealthWallet />;
      case 'activity':
        return <ActivityLogs />;
      case 'registration':
        return <EntityRegistration initialType={regType} onBack={() => setActiveTab('home')} onFinish={() => setActiveTab('dashboard')} />;
      case 'dashboard':
        if (regType === 'doctor') return <DoctorDashboard />;
        if (regType === 'lab_pharmacy') return <PharmacyDashboard />;
        return <CenterDashboard />;
      default:
        return (
          <Hero 
            onStartAssistant={() => setActiveTab('triage')} 
            onViewMap={() => setActiveTab('map')} 
            onOpenRegistration={(type) => openRegistration(type)}
          />
        );
    }
  };

  if (!isAuthenticated) {
    return (
      <LanguageProvider>
        <UserProvider>
          <Login onLogin={handleLogin} />
        </UserProvider>
      </LanguageProvider>
    );
  }

  return (
    <LanguageProvider>
      <UserProvider>
        <Shell activeTab={activeTab} setActiveTab={setActiveTab}>
          {renderContent()}
          <PWAInstallPrompt />
        </Shell>
      </UserProvider>
    </LanguageProvider>
  );
}

