import React, { useState, useEffect } from 'react';
import LoginStep from './LoginStep';
import RoleSelectionStep from './RoleSelectionStep';
import { useAuth } from '../../hooks/useAuth';
import Card from '../common/Card';

const AuthFlow: React.FC = () => {
  const [step, setStep] = useState<'login' | 'role'>('login');
  const { user, loginWithPhone } = useAuth();

  const handleLoginSubmit = async (phoneNumber: string) => {
    const { isNewUser } = await loginWithPhone(phoneNumber);
    if (isNewUser) {
      setStep('role');
    }
    // If user is not new, login is complete, and App.tsx will redirect.
  };
  
  // This effect handles the case where a user might have closed the tab
  // during role selection. If they re-open and are in a logged-in but role-less state,
  // we push them back to role selection.
  useEffect(() => {
    if (user && !user.role) {
        setStep('role');
    }
  }, [user]);


  const renderStep = () => {
    switch (step) {
      case 'login':
        return <LoginStep onSubmit={handleLoginSubmit} />;
      case 'role':
        return <RoleSelectionStep />;
      default:
        return <LoginStep onSubmit={handleLoginSubmit} />;
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <Card title="">
        <div className="p-4">
          {renderStep()}
        </div>
      </Card>
    </div>
  );
};

export default AuthFlow;