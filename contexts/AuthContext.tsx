import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  loginWithPhone: (phone: string) => Promise<{ isNewUser: boolean }>;
  selectRole: (role: UserRole) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// --- MOCK USER DATABASE ---
const MOCK_USER_DB: { [phone: string]: User } = {
  '+923001111111': { id: 'user_admin', phone: '+923001111111', role: 'admin', status: 'active', registeredAt: '2023-09-28T08:00:00Z' },
  '+923339876543': { id: 'user_driver_1', phone: '+923339876543', role: 'driver', status: 'active', registeredAt: '2023-10-02T11:30:00Z' },
  '+923001234567': { id: 'user_shipper_1', phone: '+923001234567', role: 'shipper', status: 'active', registeredAt: '2023-10-01T10:00:00Z' },
};
// --- END MOCK DB ---


export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser: User = JSON.parse(storedUser);
        // Ensure user exists in our mock DB
        if(MOCK_USER_DB[parsedUser.phone]){
            setUser(parsedUser);
        }
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('user');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginWithPhone = async (phone: string) => {
    setIsLoading(true);
    console.log(`Attempting to log in with phone: ${phone}`);
    // Simulate network delay
    await new Promise(res => setTimeout(res, 1000));
    
    const existingUser = MOCK_USER_DB[phone];
    if (existingUser) {
      // User exists, log them in
      setUser(existingUser);
      localStorage.setItem('user', JSON.stringify(existingUser));
      setIsLoading(false);
      return { isNewUser: false };
    } else {
      // New user, prepare for role selection
      const newUserShell: User = { 
        id: `user_${Date.now()}`, 
        phone, 
        role: null, 
        status: 'active',
        registeredAt: new Date().toISOString()
      };
      setUser(newUserShell);
      // Don't save to localStorage until role is selected
      setIsLoading(false);
      return { isNewUser: true };
    }
  };
  
  const selectRole = async (role: UserRole) => {
    if (!user || user.role) return; // Can't set role if no user or role already exists
    setIsLoading(true);
    console.log(`Registering user ${user.phone} with role ${role}`);
    await new Promise(res => setTimeout(res, 500));
    
    const finalUser = { ...user, role };
    
    // Add to mock DB and localStorage
    MOCK_USER_DB[finalUser.phone] = finalUser;
    setUser(finalUser);
    localStorage.setItem('user', JSON.stringify(finalUser));
    
    setIsLoading(false);
  };
  
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };
  
  const value = { user, isLoading, loginWithPhone, selectRole, logout };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};