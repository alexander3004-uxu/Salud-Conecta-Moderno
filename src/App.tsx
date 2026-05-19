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
import PremiumHealthMap from './components/maps/PremiumHealthMap';
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
import { auth, handleRedirectResult } from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { syncUserProfile } from './lib/authUtils';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [isInitializing, setIsInitializing] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [regType, setRegType] = useState<'doctor' | 'clinic' | 'lab_pharmacy'>('lab_pharmacy');

  const openRegistration = (type: 'doctor' | 'clinic' | 'lab_pharmacy' = 'lab_pharmacy') => {
    setRegType(type);
    setActiveTab('registration');
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  useEffect(() => {
    // Check for redirect result first
    const checkRedirect = async () => {
      try {
        const user = await handleRedirectResult();
        if (user) {
          console.log("Redirect login success:", user.email);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Redirect check error:", error);
      }
    };
    checkRedirect();

    // Listen for auth changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(true);
      setIsInitializing(false);
    });

    // Theme initialization
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    }

    const handleTabChange = (e: any) => {
      setActiveTab(e.detail);
    };
    window.addEventListener('changeTab', handleTabChange);
    return () => {
      unsubscribe();
      window.removeEventListener('changeTab', handleTabChange);
    };
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <Hero 
            onStartAssistant={() => setActiveTab('triage')} 
            onViewMap={() => setActiveTab('map')} 
            onViewAppointments={() => setActiveTab('appointments')}
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
      case 'premium-health':
        return <PremiumHealthMap />;
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
            onViewAppointments={() => setActiveTab('appointments')}
            onOpenRegistration={(type) => openRegistration(type)}
          />
        );
    }
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6 text-center">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <div>
            <h2 className="text-xl font-bold text-on-surface">Cargando Salud Conecta...</h2>
            <p className="text-on-surface-variant mt-2">Verificando sesión segura</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <UserProvider>
      {!isAuthenticated ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Shell activeTab={activeTab} setActiveTab={setActiveTab}>
          {renderContent()}
          <PWAInstallPrompt />
        </Shell>
      )}
    </UserProvider>
  );
}
