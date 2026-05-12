import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type MembershipTier = 'free' | 'premium';

interface UserContextType {
  membership: MembershipTier;
  setMembership: (tier: MembershipTier) => void;
  isPremium: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [membership, setMembershipState] = useState<MembershipTier>(() => {
    const saved = localStorage.getItem('userMembership');
    return (saved as MembershipTier) || 'free';
  });

  const setMembership = (tier: MembershipTier) => {
    setMembershipState(tier);
    localStorage.setItem('userMembership', tier);
  };

  const isPremium = membership === 'premium';

  return (
    <UserContext.Provider value={{ membership, setMembership, isPremium }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
